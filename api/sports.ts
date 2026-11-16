// Vercel serverless function: live Toronto Blue Jays (MLB) and Pittsburgh
// Steelers (NFL) summaries. Keyless.
//
// Read-only. Nothing from the request (method aside) is read or forwarded, and
// every upstream URL is a constant. Each team is isolated: a failed or
// unparseable source yields null for that team only. Upstream bodies are never
// echoed. Logs carry only a short label and an HTTP status.
//
// Self-contained on purpose (no local imports) and erasable-only TypeScript.
//
// Response shape, identical for both teams:
//
//   TeamSummary = {
//     team: string;            // "Toronto Blue Jays" | "Pittsburgh Steelers"
//     record: string | null;   // e.g. "6-3". Always null for MLB (offseason).
//     last: {
//       date: string;          // ISO start time
//       opponent: string;
//       home: boolean;
//       teamScore: number;
//       oppScore: number;
//       result: "W" | "L" | "T";
//     } | null;
//     next: {
//       date: string;          // ISO start time
//       opponent: string;
//       home: boolean;
//       label: string | null;  // MLB only: "Spring training" | "Postseason" | null
//     } | null;
//   }
//
// Upstream strings are trimmed and capped at 120 characters. Scores must be
// finite numbers, otherwise that game is treated as missing.

const DAY_MS = 24 * 60 * 60 * 1000;
const UPSTREAM_TIMEOUT_MS = 8000;
const JAYS_ID = 141;
const STEELERS_ID = "23";
const ESPN_STEELERS_TEAM_URL = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/pit";
const ESPN_STEELERS_SCHEDULE_URL = `${ESPN_STEELERS_TEAM_URL}/schedule`;
const CACHE_OK = "public, s-maxage=900, stale-while-revalidate=3600";
const CACHE_PARTIAL = "public, s-maxage=60";
const CACHE_NONE = "no-store";

export type TeamSummary = {
  team: string;
  record: string | null;
  last: {
    date: string;
    opponent: string;
    home: boolean;
    teamScore: number;
    oppScore: number;
    result: "W" | "L" | "T";
  } | null;
  next: {
    date: string;
    opponent: string;
    home: boolean;
    label: string | null;
  } | null;
};

type Obj = Record<string, unknown>;

function isObj(v: unknown): v is Obj {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function cleanText(v: unknown): string {
  return typeof v === "string" ? v.trim().slice(0, 120) : "";
}

function isoDate(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const ms = Date.parse(v);
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}

function finiteScore(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function idString(v: unknown): string {
  if (typeof v === "string") return v;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return "";
}

function resultOf(teamScore: number, oppScore: number): "W" | "L" | "T" {
  if (teamScore > oppScore) return "W";
  if (teamScore < oppScore) return "L";
  return "T";
}

function ymd(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

// Logs a label and status only. Returns null on any failure.
async function fetchJson(url: string, label: string): Promise<unknown> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
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

// ---------- MLB ----------

function mlbGames(json: unknown): Obj[] {
  const out: Obj[] = [];
  if (!isObj(json) || !Array.isArray(json.dates)) return out;
  for (const day of json.dates) {
    if (!isObj(day) || !Array.isArray(day.games)) continue;
    for (const game of day.games) {
      if (isObj(game)) out.push(game);
    }
  }
  return out;
}

function mlbState(game: Obj): unknown {
  return isObj(game.status) ? game.status.abstractGameState : undefined;
}

function mlbLabel(gameType: unknown): string | null {
  if (gameType === "S") return "Spring training";
  if (gameType === "F" || gameType === "D" || gameType === "L" || gameType === "W") {
    return "Postseason";
  }
  return null;
}

type MlbMatchup = {
  date: string;
  opponent: string;
  home: boolean;
  mine: number | null;
  theirs: number | null;
  gameType: unknown;
};

function mlbMatchup(game: Obj, teamId: number): MlbMatchup | null {
  if (!isObj(game.teams)) return null;
  const homeSide = game.teams.home;
  const awaySide = game.teams.away;
  if (!isObj(homeSide) || !isObj(awaySide)) return null;

  const isHome = isObj(homeSide.team) && homeSide.team.id === teamId;
  const isAway = isObj(awaySide.team) && awaySide.team.id === teamId;
  if (isHome === isAway) return null;

  const me = isHome ? homeSide : awaySide;
  const other = isHome ? awaySide : homeSide;
  const opponent = isObj(other.team) ? cleanText(other.team.name) : "";
  const date = isoDate(game.gameDate);
  if (date === null || opponent === "") return null;

  return {
    date,
    opponent,
    home: isHome,
    mine: finiteScore(me.score),
    theirs: finiteScore(other.score),
    gameType: game.gameType,
  };
}

// Pure. Never throws. Returns null only if both last and next are null.
export function summarizeMlb(lastJson: unknown, nextJson: unknown, teamId: number): TeamSummary | null {
  try {
    const finals = mlbGames(lastJson).filter((g) => mlbState(g) === "Final");
    let last: TeamSummary["last"] = null;
    for (let i = finals.length - 1; i >= 0 && last === null; i--) {
      const m = mlbMatchup(finals[i], teamId);
      if (m === null || m.mine === null || m.theirs === null) continue;
      last = {
        date: m.date,
        opponent: m.opponent,
        home: m.home,
        teamScore: m.mine,
        oppScore: m.theirs,
        result: resultOf(m.mine, m.theirs),
      };
    }

    let next: TeamSummary["next"] = null;
    for (const game of mlbGames(nextJson)) {
      if (next !== null) break;
      if (mlbState(game) === "Final") continue;
      const m = mlbMatchup(game, teamId);
      if (m === null) continue;
      next = { date: m.date, opponent: m.opponent, home: m.home, label: mlbLabel(m.gameType) };
    }

    if (last === null && next === null) return null;
    return { team: "Toronto Blue Jays", record: null, last, next };
  } catch {
    return null;
  }
}

// ---------- ESPN (NFL) ----------

function espnCompetition(event: Obj): Obj | null {
  const comps = event.competitions;
  const first = Array.isArray(comps) ? comps[0] : undefined;
  return isObj(first) ? first : null;
}

// Tolerates score as {value, displayValue}, a plain number, or a numeric string.
function espnScore(v: unknown): number | null {
  return finiteScore(isObj(v) ? v.value : v);
}

// Returns the completed flag only when it is a real boolean.
function espnCompleted(event: Obj): boolean | undefined {
  const comp = espnCompetition(event);
  const status = comp !== null && isObj(comp.status) ? comp.status : undefined;
  const type = status !== undefined && isObj(status.type) ? status.type : undefined;
  return type !== undefined && typeof type.completed === "boolean" ? type.completed : undefined;
}

function espnSides(comp: Obj, teamId: string): { me: Obj; other: Obj } | null {
  if (!Array.isArray(comp.competitors)) return null;
  let me: Obj | null = null;
  let other: Obj | null = null;
  for (const c of comp.competitors) {
    if (!isObj(c) || !isObj(c.team)) continue;
    if (idString(c.team.id) === teamId) {
      if (me === null) me = c;
    } else if (other === null) {
      other = c;
    }
  }
  return me !== null && other !== null ? { me, other } : null;
}

type EspnMatchup = {
  date: string;
  opponent: string;
  home: boolean;
  mine: number | null;
  theirs: number | null;
};

function espnMatchup(event: Obj, teamId: string): EspnMatchup | null {
  const comp = espnCompetition(event);
  if (comp === null) return null;
  const sides = espnSides(comp, teamId);
  if (sides === null) return null;
  const date = isoDate(event.date) ?? isoDate(comp.date);
  const opponent = isObj(sides.other.team) ? cleanText(sides.other.team.displayName) : "";
  if (date === null || opponent === "") return null;
  return {
    date,
    opponent,
    home: sides.me.homeAway === "home",
    mine: espnScore(sides.me.score),
    theirs: espnScore(sides.other.score),
  };
}

// Pure. Never throws. Returns null only if both last and next are null.
export function summarizeEspn(scheduleJson: unknown, teamJson: unknown, teamId: string): TeamSummary | null {
  try {
    const events = isObj(scheduleJson) && Array.isArray(scheduleJson.events) ? scheduleJson.events : [];

    let last: TeamSummary["last"] = null;
    for (let i = events.length - 1; i >= 0 && last === null; i--) {
      const ev = events[i];
      if (!isObj(ev) || espnCompleted(ev) !== true) continue;
      const m = espnMatchup(ev, teamId);
      if (m === null || m.mine === null || m.theirs === null) continue;
      last = {
        date: m.date,
        opponent: m.opponent,
        home: m.home,
        teamScore: m.mine,
        oppScore: m.theirs,
        result: resultOf(m.mine, m.theirs),
      };
    }

    // The team endpoint's nextEvent is stale, so the first incomplete event is used.
    let next: TeamSummary["next"] = null;
    for (const ev of events) {
      if (next !== null) break;
      if (!isObj(ev) || espnCompleted(ev) !== false) continue;
      const m = espnMatchup(ev, teamId);
      if (m === null) continue;
      next = { date: m.date, opponent: m.opponent, home: m.home, label: null };
    }

    if (last === null && next === null) return null;
    // The live team endpoint puts the record at team.record.items[0].summary
    // ("6-3"); team.recordSummary is kept as a fallback.
    let record = "";
    if (isObj(teamJson) && isObj(teamJson.team)) {
      const rec = teamJson.team.record;
      const first = isObj(rec) && Array.isArray(rec.items) ? rec.items[0] : null;
      record = isObj(first) ? cleanText(first.summary) : "";
      if (record === "") record = cleanText(teamJson.team.recordSummary);
    }
    return {
      team: "Pittsburgh Steelers",
      record: record === "" ? null : record,
      last,
      next,
    };
  } catch {
    return null;
  }
}

// ---------- Handler ----------

async function loadJays(nowMs: number): Promise<TeamSummary | null> {
  const today = ymd(nowMs);
  const lastUrl =
    `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=${JAYS_ID}` +
    `&startDate=${ymd(nowMs - 400 * DAY_MS)}&endDate=${today}`;
  const nextUrl =
    `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=${JAYS_ID}` +
    // Start a day early: MLB dates are US-local, so late-evening ET "today"
    // is already tomorrow in UTC. Finished games are skipped below anyway.
    `&startDate=${ymd(nowMs - DAY_MS)}&endDate=${ymd(nowMs + 240 * DAY_MS)}`;
  const [lastJson, nextJson] = await Promise.all([
    fetchJson(lastUrl, "mlb last-games failed"),
    fetchJson(nextUrl, "mlb next-games failed"),
  ]);
  return summarizeMlb(lastJson, nextJson, JAYS_ID);
}

async function loadSteelers(): Promise<TeamSummary | null> {
  const [scheduleJson, teamJson] = await Promise.all([
    fetchJson(ESPN_STEELERS_SCHEDULE_URL, "espn steelers schedule failed"),
    fetchJson(ESPN_STEELERS_TEAM_URL, "espn steelers team failed"),
  ]);
  return summarizeEspn(scheduleJson, teamJson, STEELERS_ID);
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

    const nowMs = Date.now();
    const settled = await Promise.allSettled([loadJays(nowMs), loadSteelers()]);
    const jaysResult = settled[0];
    const steelersResult = settled[1];
    const jays = jaysResult.status === "fulfilled" ? jaysResult.value : null;
    const steelers = steelersResult.status === "fulfilled" ? steelersResult.value : null;

    if (jays === null && steelers === null) {
      return reply(req, res, 502, { error: "unavailable" }, CACHE_NONE);
    }

    return reply(
      req,
      res,
      200,
      { jays, steelers, updatedAt: new Date(nowMs).toISOString() },
      // A missing team may be an upstream blip; cache that only briefly.
      jays === null || steelers === null ? CACHE_PARTIAL : CACHE_OK,
    );
  } catch {
    console.error("sports handler failed");
    return reply(req, res, 502, { error: "unavailable" }, CACHE_NONE);
  }
}
