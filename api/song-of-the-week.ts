// Vercel serverless function: Alex's "Song of the Week" from Spotify.
//
// Read-only. Nothing from the request (method aside) is read or forwarded, and
// every upstream URL is a constant. Secrets (SPOTIFY_CLIENT_ID,
// SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN) and access tokens never appear
// in responses, headers or logs. Upstream bodies are never echoed. Logs carry
// only a short label and an HTTP status.
//
// Self-contained on purpose (no local imports) and erasable-only TypeScript, so
// scripts/check-api.ts can import this file under Node type stripping.

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const UPSTREAM_TIMEOUT_MS = 8000;
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const RECENT_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=50";
const TOP_URL = "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1";
const CACHE_OK = "public, s-maxage=3600, stale-while-revalidate=86400";
const CACHE_NONE = "no-store";

export type SongSource = "recent-7-days" | "top-4-weeks";

export type SongTrack = {
  title: string;
  artists: string[];
  album: string;
  imageUrl: string | null;
  spotifyUrl: string | null;
};

type Obj = Record<string, unknown>;

function isObj(v: unknown): v is Obj {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Non-strings become "". Strings are trimmed and capped at 200 characters.
function cleanText(v: unknown): string {
  return typeof v === "string" ? v.trim().slice(0, 200) : "";
}

// Returns the URL only if it is https with exactly the expected hostname.
function allowedUrl(v: unknown, hostname: string): string | null {
  if (typeof v !== "string" || v.length > 2048) return null;
  try {
    const u = new URL(v);
    if (u.protocol !== "https:" || u.hostname !== hostname) return null;
    if (u.username !== "" || u.password !== "" || u.port !== "") return null;
    const out = u.toString();
    return out.length > 2048 ? null : out;
  } catch {
    return null;
  }
}

// Album image whose width is closest to 300 (first one if widths are unknown).
function pickImageUrl(images: unknown): string | null {
  if (!Array.isArray(images)) return null;
  let best: { url: string; dist: number } | null = null;
  for (const img of images) {
    if (!isObj(img)) continue;
    const url = allowedUrl(img.url, "i.scdn.co");
    if (url === null) continue;
    const w = img.width;
    const dist = typeof w === "number" && Number.isFinite(w) ? Math.abs(w - 300) : Infinity;
    if (best === null || dist < best.dist) best = { url, dist };
  }
  return best === null ? null : best.url;
}

// Pure. Never throws; returns null for anything unusable.
export function pickSongOfWeek(
  items: unknown,
  nowMs: number,
): { track: unknown; plays: number } | null {
  try {
    if (!Array.isArray(items) || !Number.isFinite(nowMs)) return null;
    const cutoff = nowMs - WEEK_MS;
    const byId = new Map<string, { track: unknown; plays: number; lastPlayed: number }>();
    for (const item of items) {
      if (!isObj(item) || typeof item.played_at !== "string") continue;
      const playedAt = Date.parse(item.played_at);
      if (!Number.isFinite(playedAt) || playedAt < cutoff || playedAt > nowMs) continue;
      const track = item.track;
      if (!isObj(track) || typeof track.id !== "string" || track.id === "") continue;
      const hit = byId.get(track.id);
      if (hit) {
        hit.plays += 1;
        if (playedAt > hit.lastPlayed) {
          hit.lastPlayed = playedAt;
          hit.track = track;
        }
      } else {
        byId.set(track.id, { track, plays: 1, lastPlayed: playedAt });
      }
    }
    let best: { track: unknown; plays: number; lastPlayed: number } | null = null;
    for (const hit of byId.values()) {
      if (
        best === null ||
        hit.plays > best.plays ||
        (hit.plays === best.plays && hit.lastPlayed > best.lastPlayed)
      ) {
        best = hit;
      }
    }
    return best === null ? null : { track: best.track, plays: best.plays };
  } catch {
    return null;
  }
}

// Pure. Never throws. Returns null if there is no non-empty title.
export function sanitizeTrack(track: unknown): SongTrack | null {
  try {
    if (!isObj(track)) return null;
    const title = cleanText(track.name);
    if (title === "") return null;

    const artists: string[] = [];
    if (Array.isArray(track.artists)) {
      for (const a of track.artists) {
        if (artists.length >= 4) break;
        const name = isObj(a) ? cleanText(a.name) : "";
        if (name !== "") artists.push(name);
      }
    }

    const album = isObj(track.album) ? cleanText(track.album.name) : "";
    const imageUrl = isObj(track.album) ? pickImageUrl(track.album.images) : null;
    const external = isObj(track.external_urls) ? track.external_urls.spotify : undefined;

    return {
      title,
      artists,
      album,
      imageUrl,
      spotifyUrl: allowedUrl(external, "open.spotify.com"),
    };
  } catch {
    return null;
  }
}

// Logs a label and status only. Returns null on any failure.
async function getAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
): Promise<string | null> {
  try {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error("spotify token refresh failed", res.status);
      return null;
    }
    // A refresh_token in the response is deliberately ignored (no persistence).
    const json: unknown = await res.json();
    const token = isObj(json) ? json.access_token : undefined;
    if (typeof token !== "string" || token === "") {
      console.error("spotify token refresh failed", res.status);
      return null;
    }
    return token;
  } catch {
    console.error("spotify token refresh failed");
    return null;
  }
}

// Logs a label and status only. Returns null on any failure.
async function spotifyGet(url: string, accessToken: string, label: string): Promise<unknown> {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(label, res.status);
      return null;
    }
    return await res.json();
  } catch {
    console.error(label);
    return null;
  }
}

function reply(req: any, res: any, status: number, body: unknown, cacheControl: string): void {
  // HEAD is never cached, so a cached empty body can't be served to GETs.
  if (req.method === "HEAD") {
    res.setHeader("Cache-Control", "no-store");
    res.status(status).end();
    return;
  }
  res.setHeader("Cache-Control", cacheControl);
  res.status(status).json(body);
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.setHeader("Allow", "GET, HEAD");
      return reply(req, res, 405, { error: "method not allowed" }, CACHE_NONE);
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
    if (!clientId || !clientSecret || !refreshToken) {
      console.error("spotify env missing");
      return reply(req, res, 503, { error: "unavailable" }, CACHE_NONE);
    }

    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);
    if (accessToken === null) {
      return reply(req, res, 502, { error: "unavailable" }, CACHE_NONE);
    }

    const nowMs = Date.now();
    const recent = await spotifyGet(RECENT_URL, accessToken, "spotify recently-played failed");
    if (recent === null) {
      return reply(req, res, 502, { error: "unavailable" }, CACHE_NONE);
    }

    let song: SongTrack | null = null;
    let plays: number | null = null;
    let source: SongSource = "recent-7-days";

    const picked = pickSongOfWeek(isObj(recent) ? recent.items : undefined, nowMs);
    if (picked !== null) {
      song = sanitizeTrack(picked.track);
      if (song !== null) plays = picked.plays;
    }

    if (song === null) {
      const top = await spotifyGet(TOP_URL, accessToken, "spotify top-tracks failed");
      if (top === null) {
        return reply(req, res, 502, { error: "unavailable" }, CACHE_NONE);
      }
      const topItems = isObj(top) ? top.items : undefined;
      const first = Array.isArray(topItems) ? topItems[0] : undefined;
      song = sanitizeTrack(first);
      source = "top-4-weeks";
      plays = null;
    }

    const body = {
      song: song === null ? null : { ...song, plays, source },
      updatedAt: new Date(nowMs).toISOString(),
    };
    return reply(req, res, 200, body, CACHE_OK);
  } catch {
    console.error("song-of-the-week handler failed");
    return reply(req, res, 502, { error: "unavailable" }, CACHE_NONE);
  }
}
