// Live data for the About exhibits. Fetches once on mount from the API routes
// and validates the response loosely. Dev-only fixtures keep the layout
// usable on the Vite dev server (which has no /api). They are guarded by
// import.meta.env.DEV so production builds tree-shake them out.

import { useEffect, useState } from "react";

export type Song = {
  title: string;
  artists: string[];
  album: string;
  imageUrl: string | null;
  spotifyUrl: string | null;
  plays: number | null;
  source: "recent-7-days" | "top-4-weeks";
};

export type SongResponse = { song: Song | null; updatedAt: string };

export type LastGame = {
  date: string;
  opponent: string;
  home: boolean;
  teamScore: number;
  oppScore: number;
  result: "W" | "L" | "T";
};

export type NextGame = {
  date: string;
  opponent: string;
  home: boolean;
  label: string | null;
};

export type TeamSummary = {
  team: string;
  record: string | null;
  last: LastGame | null;
  next: NextGame | null;
};

export type SportsResponse = {
  jays: TeamSummary | null;
  steelers: TeamSummary | null;
  updatedAt: string;
};

export type LiveState<T> = { status: "loading" | "ready" | "error"; data: T | null };

// ---- Runtime validation (loose; treats anything malformed as an error) ----

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Links and images must be https on the exact expected host, so a bad payload
// can't inject a javascript: scheme or a lookalike host into an href or src.
function isHttpsUrlOrNull(value: unknown, hostname: string): value is string | null {
  if (value === null) return true;
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:" && u.hostname === hostname && u.port === "" && u.username === "";
  } catch {
    return false;
  }
}

function isSong(value: unknown): value is Song {
  if (!isRecord(value)) return false;
  return (
    typeof value.title === "string" &&
    Array.isArray(value.artists) &&
    value.artists.every((artist) => typeof artist === "string") &&
    typeof value.album === "string" &&
    isHttpsUrlOrNull(value.imageUrl, "i.scdn.co") &&
    isHttpsUrlOrNull(value.spotifyUrl, "open.spotify.com") &&
    (value.plays === null || typeof value.plays === "number") &&
    (value.source === "recent-7-days" || value.source === "top-4-weeks")
  );
}

function isSongResponse(value: unknown): value is SongResponse {
  return (
    isRecord(value) &&
    typeof value.updatedAt === "string" &&
    (value.song === null || isSong(value.song))
  );
}

function isLastGame(value: unknown): value is LastGame {
  return (
    isRecord(value) &&
    typeof value.date === "string" &&
    typeof value.opponent === "string" &&
    typeof value.home === "boolean" &&
    typeof value.teamScore === "number" &&
    typeof value.oppScore === "number" &&
    (value.result === "W" || value.result === "L" || value.result === "T")
  );
}

function isNextGame(value: unknown): value is NextGame {
  return (
    isRecord(value) &&
    typeof value.date === "string" &&
    typeof value.opponent === "string" &&
    typeof value.home === "boolean" &&
    (value.label === null || typeof value.label === "string")
  );
}

function isTeamSummary(value: unknown): value is TeamSummary {
  return (
    isRecord(value) &&
    typeof value.team === "string" &&
    (value.record === null || typeof value.record === "string") &&
    (value.last === null || isLastGame(value.last)) &&
    (value.next === null || isNextGame(value.next))
  );
}

function isSportsResponse(value: unknown): value is SportsResponse {
  return (
    isRecord(value) &&
    typeof value.updatedAt === "string" &&
    (value.jays === null || isTeamSummary(value.jays)) &&
    (value.steelers === null || isTeamSummary(value.steelers))
  );
}

// ---- Dev fixtures (referenced only behind import.meta.env.DEV) ----

const SONG_FIXTURE: SongResponse = {
  song: {
    title: "Nights",
    artists: ["Frank Ocean"],
    album: "Blonde",
    imageUrl: null,
    spotifyUrl: "https://open.spotify.com/",
    plays: 6,
    source: "recent-7-days",
  },
  updatedAt: "2026-11-16T00:00:00Z",
};

const SPORTS_FIXTURE: SportsResponse = {
  jays: {
    team: "Blue Jays",
    record: null,
    last: {
      date: "2026-09-27T19:07:00Z",
      opponent: "Cincinnati Reds",
      home: true,
      teamScore: 5,
      oppScore: 1,
      result: "W",
    },
    next: {
      date: "2027-02-19T18:05:00Z",
      opponent: "Pittsburgh Pirates",
      home: false,
      label: "Spring training",
    },
  },
  steelers: {
    team: "Steelers",
    record: "6-3",
    last: {
      date: "2026-11-16T01:20:00Z",
      opponent: "Cincinnati Bengals",
      home: false,
      teamScore: 18,
      oppScore: 38,
      result: "L",
    },
    next: {
      date: "2026-11-22T18:00:00Z",
      opponent: "Philadelphia Eagles",
      home: false,
      label: null,
    },
  },
  updatedAt: "2026-11-16T00:00:00Z",
};

// ---- Fetch hook ----

// Fetches once on mount. Aborts on unmount. In DEV only, a failed request or a
// non-200 response falls back to `devFallback`; malformed data is always an error.
function useLiveFetch<T>(
  url: string,
  isValid: (value: unknown) => value is T,
  devFallback: T | null,
): LiveState<T> {
  const [state, setState] = useState<LiveState<T>>({ status: "loading", data: null });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      let body: unknown;
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        body = await response.json();
      } catch {
        if (controller.signal.aborted) return;
        setState(devFallback ? { status: "ready", data: devFallback } : { status: "error", data: null });
        return;
      }
      if (controller.signal.aborted) return;
      if (!isValid(body)) {
        setState({ status: "error", data: null });
        return;
      }
      setState({ status: "ready", data: body });
    }

    void load();
    return () => controller.abort();
  }, [url, isValid, devFallback]);

  return state;
}

export function useSongOfTheWeek(): LiveState<SongResponse> {
  return useLiveFetch<SongResponse>(
    "/api/song-of-the-week",
    isSongResponse,
    import.meta.env.DEV ? SONG_FIXTURE : null,
  );
}

export function useSports(): LiveState<SportsResponse> {
  return useLiveFetch<SportsResponse>(
    "/api/sports",
    isSportsResponse,
    import.meta.env.DEV ? SPORTS_FIXTURE : null,
  );
}

// ---- Formatting ----

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

// e.g. "W 5–1 vs Cincinnati Reds · Sep 27"
export function formatLast(game: LastGame): string {
  const venue = game.home ? "vs" : "at";
  return `${game.result} ${game.teamScore}–${game.oppScore} ${venue} ${game.opponent} · ${shortDate(game.date)}`;
}

// e.g. "Next: Feb 19 at Pittsburgh Pirates · Spring training"
export function formatNext(game: NextGame): string {
  const venue = game.home ? "vs" : "at";
  const label = game.label ? ` · ${game.label}` : "";
  return `Next: ${shortDate(game.date)} ${venue} ${game.opponent}${label}`;
}
