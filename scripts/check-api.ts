// Offline checks for api/song-of-the-week.ts and api/sports.ts.
// Run: node scripts/check-api.ts
// No network, no dependencies. Fetch is mocked; console output is captured per test.

import songHandler, { pickSongOfWeek, sanitizeTrack } from "../api/song-of-the-week.ts";
import sportsHandler, { summarizeMlb, summarizeEspn } from "../api/sports.ts";

const CID = "cid-TEST";
const SECRET = "SECRET-xyz-123";
const REFRESH = "REFRESH-abc-456";
const ACCESS = "ACCESS-def-789";
const SECRETS = [SECRET, REFRESH, ACCESS, "invalid_grant"];
const TOKEN_PREFIX = "https://accounts.spotify.com/api/token";
const RECENT_PREFIX = "https://api.spotify.com/v1/me/player/recently-played";
const TOP_PREFIX = "https://api.spotify.com/v1/me/top/tracks";
const HOUR = 3600 * 1000;
const DAY = 24 * HOUR;
const ALLOWED_SONG_HOSTS = ["accounts.spotify.com", "api.spotify.com"];
const ALLOWED_SPORTS_HOSTS = ["statsapi.mlb.com", "site.api.espn.com"];

type Call = { url: string; init: RequestInit | undefined };
type Route = {
  match: (url: string) => boolean;
  respond: (url: string, init: RequestInit | undefined) => Response | Promise<Response>;
};
type MockRes = {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
  status: (code: number) => MockRes;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => MockRes;
  end: () => MockRes;
};

let calls: Call[] = [];
const realFetch = globalThis.fetch;

function expect(cond: boolean, why: string): void {
  if (!cond) throw new Error(why);
}

function safeStr(v: unknown): string {
  try {
    return typeof v === "string" ? v : JSON.stringify(v) ?? String(v);
  } catch {
    return "[unprintable]";
  }
}

function setEnv(on: boolean): void {
  if (on) {
    process.env.SPOTIFY_CLIENT_ID = CID;
    process.env.SPOTIFY_CLIENT_SECRET = SECRET;
    process.env.SPOTIFY_REFRESH_TOKEN = REFRESH;
  } else {
    delete process.env.SPOTIFY_CLIENT_ID;
    delete process.env.SPOTIFY_CLIENT_SECRET;
    delete process.env.SPOTIFY_REFRESH_TOKEN;
  }
}

function mockFetch(routes: Route[]): void {
  calls = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    calls.push({ url, init });
    const route = routes.find((r) => r.match(url));
    if (!route) return new Response("no route", { status: 404 });
    return route.respond(url, init);
  }) as typeof fetch;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function text(body: string, status: number): Response {
  return new Response(body, { status });
}

function makeRes(): MockRes {
  const r: MockRes = {
    statusCode: 0,
    headers: {},
    body: undefined,
    status(code) {
      r.statusCode = code;
      return r;
    },
    setHeader(name, value) {
      r.headers[name.toLowerCase()] = String(value);
    },
    json(body) {
      r.body = body;
      return r;
    },
    end() {
      return r;
    },
  };
  return r;
}

async function run(
  handler: (req: any, res: any) => Promise<unknown>,
  req: Record<string, unknown>,
): Promise<MockRes> {
  const res = makeRes();
  await handler({ query: {}, headers: {}, ...req }, res);
  return res;
}

function tokenRoute(): Route {
  return {
    match: (u) => u.startsWith(TOKEN_PREFIX),
    respond: () =>
      json({ access_token: ACCESS, token_type: "Bearer", expires_in: 3600, refresh_token: "ROTATED-ignored" }),
  };
}

function trackObj(id: string, name: string) {
  return {
    id,
    name,
    artists: [{ name: "Artist One" }],
    album: {
      name: "Album One",
      images: [
        { url: "https://i.scdn.co/image/big", width: 640, height: 640 },
        { url: "https://i.scdn.co/image/mid", width: 300, height: 300 },
        { url: "https://i.scdn.co/image/small", width: 64, height: 64 },
      ],
    },
    external_urls: { spotify: `https://open.spotify.com/track/${id}` },
  };
}

function play(track: unknown, agoMs: number) {
  return { played_at: new Date(Date.now() - agoMs).toISOString(), track };
}

// Track A x3 (within 7d), B x2 (within 7d), C x5 (10 days ago, outside window).
function happyItems() {
  const A = trackObj("A", "Song A");
  const B = trackObj("B", "Song B");
  const C = trackObj("C", "Song C");
  return [
    play(A, 1 * HOUR),
    play(A, 2 * HOUR),
    play(A, 3 * HOUR),
    play(B, 4 * HOUR),
    play(B, 5 * HOUR),
    play(C, 10 * DAY),
    play(C, 10 * DAY + HOUR),
    play(C, 10 * DAY + 2 * HOUR),
    play(C, 10 * DAY + 3 * HOUR),
    play(C, 10 * DAY + 4 * HOUR),
  ];
}

function recentRoute(items: unknown[]): Route {
  return {
    match: (u) => u.startsWith(RECENT_PREFIX),
    respond: () => json({ items }),
  };
}

function topRoute(items: unknown[]): Route {
  return {
    match: (u) => u.startsWith(TOP_PREFIX),
    respond: () => json({ items }),
  };
}

// ----- sports fixtures -----

const MLB_LAST = {
  dates: [
    {
      games: [
        {
          gameDate: "2026-09-20T23:07:00Z",
          gameType: "R",
          status: { abstractGameState: "Final" },
          teams: {
            home: { team: { id: 147, name: "New York Yankees" }, score: 3 },
            away: { team: { id: 141, name: "Toronto Blue Jays" }, score: 2 },
          },
        },
        {
          gameDate: "2026-09-27T23:07:00Z",
          gameType: "R",
          status: { abstractGameState: "Final" },
          teams: {
            home: { team: { id: 141, name: "Toronto Blue Jays" }, score: 5 },
            away: { team: { id: 113, name: "Cincinnati Reds" }, score: 1 },
          },
        },
      ],
    },
  ],
};

const MLB_NEXT = {
  dates: [
    {
      games: [
        {
          gameDate: "2027-02-19T19:05:00Z",
          gameType: "S",
          status: { abstractGameState: "Preview" },
          teams: {
            home: { team: { id: 134, name: "Pittsburgh Pirates" } },
            away: { team: { id: 141, name: "Toronto Blue Jays" } },
          },
        },
      ],
    },
  ],
};

const ESPN_SCHEDULE = {
  events: [
    {
      date: "2026-11-09T18:00Z",
      competitions: [
        {
          status: { type: { completed: true } },
          competitors: [
            { homeAway: "away", team: { id: "23", displayName: "Pittsburgh Steelers" }, score: { value: 18, displayValue: "18" }, winner: false },
            { homeAway: "home", team: { id: "4", displayName: "Cincinnati Bengals" }, score: { value: 38, displayValue: "38" }, winner: true },
          ],
        },
      ],
    },
    {
      date: "2026-11-22T18:00Z",
      competitions: [
        {
          status: { type: { completed: false } },
          competitors: [
            { homeAway: "away", team: { id: "23", displayName: "Pittsburgh Steelers" } },
            { homeAway: "home", team: { id: "21", displayName: "Philadelphia Eagles" } },
          ],
        },
      ],
    },
  ],
};

const ESPN_TEAM = { team: { id: "23", displayName: "Pittsburgh Steelers", recordSummary: "6-3" } };

function sportsRoutes(espnScheduleFail = false, mlbFail = false): Route[] {
  return [
    {
      match: (u) => u.startsWith("https://statsapi.mlb.com/api/v1/schedule?"),
      respond: (u) => {
        if (mlbFail) return text("upstream error", 500);
        const p = new URL(u).searchParams;
        const span = (Date.parse(p.get("endDate") ?? "") - Date.parse(p.get("startDate") ?? "")) / DAY;
        return json(span > 300 ? MLB_LAST : MLB_NEXT);
      },
    },
    {
      match: (u) => u === ESPN_STEELERS_SCHEDULE,
      respond: () => (espnScheduleFail ? text("upstream error", 500) : json(ESPN_SCHEDULE)),
    },
    {
      match: (u) => u === ESPN_STEELERS_TEAM,
      respond: () => json(ESPN_TEAM),
    },
  ];
}

const ESPN_STEELERS_TEAM = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/pit";
const ESPN_STEELERS_SCHEDULE = `${ESPN_STEELERS_TEAM}/schedule`;

function hostOf(url: string): string {
  return new URL(url).hostname;
}

// ----- tests -----

type Logs = string[];

const tests: Array<[string, (logs: Logs) => Promise<void>]> = [
  [
    "1. song: missing env -> 503 unavailable, no-store, no fetch",
    async () => {
      setEnv(false);
      mockFetch([tokenRoute()]);
      const res = await run(songHandler, { method: "GET" });
      expect(res.statusCode === 503, `status ${res.statusCode}`);
      expect(JSON.stringify(res.body) === '{"error":"unavailable"}', `body ${JSON.stringify(res.body)}`);
      expect(res.headers["cache-control"] === "no-store", `cache-control ${res.headers["cache-control"]}`);
      expect(calls.length === 0, `fetch calls made: ${calls.length}`);
    },
  ],
  [
    "2. song: POST and PUT -> 405",
    async () => {
      mockFetch([tokenRoute()]);
      for (const method of ["POST", "PUT"]) {
        const res = await run(songHandler, { method });
        expect(res.statusCode === 405, `${method} status ${res.statusCode}`);
        expect(JSON.stringify(res.body) === '{"error":"method not allowed"}', `${method} body`);
        expect(res.headers["allow"] === "GET, HEAD", `${method} allow ${res.headers["allow"]}`);
      }
      expect(calls.length === 0, `fetch calls made: ${calls.length}`);
    },
  ],
  [
    "3. song: happy path returns most-played track in 7 days with auth + cache headers",
    async () => {
      mockFetch([tokenRoute(), recentRoute(happyItems())]);
      const res = await run(songHandler, { method: "GET" });
      expect(res.statusCode === 200, `status ${res.statusCode}`);
      expect(res.body.song?.title === "Song A", `title ${res.body.song?.title}`);
      expect(res.body.song?.plays === 3, `plays ${res.body.song?.plays}`);
      expect(res.body.song?.source === "recent-7-days", `source ${res.body.song?.source}`);
      expect((res.headers["cache-control"] ?? "").includes("s-maxage=3600"), `cache-control ${res.headers["cache-control"]}`);
      const tokenCall = calls.find((c) => c.url.startsWith(TOKEN_PREFIX));
      expect(tokenCall !== undefined, "no token call");
      const auth = (tokenCall?.init?.headers as Record<string, string>).Authorization;
      const expected = "Basic " + Buffer.from(`${CID}:${SECRET}`).toString("base64");
      expect(auth === expected, "token Basic auth header mismatch");
      expect(String(tokenCall?.init?.body).includes("grant_type=refresh_token"), "token body lacks grant_type");
    },
  ],
  [
    "4. song: tie on plays -> most recently played wins",
    async () => {
      const A = trackObj("A", "Song A");
      const B = trackObj("B", "Song B");
      mockFetch([
        tokenRoute(),
        recentRoute([play(A, 5 * HOUR), play(A, 6 * HOUR), play(B, 1 * HOUR), play(B, 2 * HOUR)]),
      ]);
      const res = await run(songHandler, { method: "GET" });
      expect(res.body.song?.title === "Song B", `title ${res.body.song?.title}`);
      expect(res.body.song?.plays === 2, `plays ${res.body.song?.plays}`);
    },
  ],
  [
    "5. song: no plays in 7 days -> top tracks fallback with plays null",
    async () => {
      mockFetch([
        tokenRoute(),
        recentRoute([play(trackObj("A", "Song A"), 10 * DAY)]),
        topRoute([trackObj("T", "Top Song")]),
      ]);
      const res = await run(songHandler, { method: "GET" });
      expect(res.statusCode === 200, `status ${res.statusCode}`);
      expect(res.body.song?.title === "Top Song", `title ${res.body.song?.title}`);
      expect(res.body.song?.plays === null, `plays ${res.body.song?.plays}`);
      expect(res.body.song?.source === "top-4-weeks", `source ${res.body.song?.source}`);
      expect(calls.some((c) => c.url.startsWith(TOP_PREFIX) && c.url.includes("time_range=short_term")), "top/tracks call missing time_range=short_term");
    },
  ],
  [
    "6. song: token 400 with secret-bearing body -> 502 unavailable, no leaks",
    async (logs) => {
      mockFetch([
        {
          match: (u) => u.startsWith(TOKEN_PREFIX),
          respond: () => text("invalid_grant REFRESH-abc-456", 400),
        },
      ]);
      const res = await run(songHandler, { method: "GET" });
      expect(res.statusCode === 502, `status ${res.statusCode}`);
      expect(JSON.stringify(res.body) === '{"error":"unavailable"}', `body ${JSON.stringify(res.body)}`);
      expect(res.headers["cache-control"] === "no-store", `cache-control ${res.headers["cache-control"]}`);
      const everything = JSON.stringify(res.body) + JSON.stringify(res.headers) + logs.join("\n");
      for (const s of SECRETS) {
        expect(!everything.includes(s), `secret-like value "${s}" leaked to body, headers or logs`);
      }
      expect(logs.length > 0, "expected a log line for the failed refresh");
    },
  ],
  [
    "7. song: recently-played 500 -> 502 unavailable, no token in logs",
    async () => {
      mockFetch([
        tokenRoute(),
        { match: (u) => u.startsWith(RECENT_PREFIX), respond: () => text("boom ACCESS-def-789", 500) },
      ]);
      const res = await run(songHandler, { method: "GET" });
      expect(res.statusCode === 502, `status ${res.statusCode}`);
      expect(JSON.stringify(res.body) === '{"error":"unavailable"}', `body ${JSON.stringify(res.body)}`);
      expect(res.headers["cache-control"] === "no-store", "missing no-store");
      expect(!JSON.stringify(res.body).includes(ACCESS), "access token in body");
      expect(!JSON.stringify(res.headers).includes(ACCESS), "access token in headers");
    },
  ],
  [
    "8. song: network error on fetch -> 502 unavailable",
    async () => {
      mockFetch([
        tokenRoute(),
        {
          match: (u) => u.startsWith(RECENT_PREFIX),
          respond: () => {
            throw new TypeError("network down");
          },
        },
      ]);
      const res = await run(songHandler, { method: "GET" });
      expect(res.statusCode === 502, `status ${res.statusCode}`);
      expect(JSON.stringify(res.body) === '{"error":"unavailable"}', `body ${JSON.stringify(res.body)}`);
    },
  ],
  [
    "9. sanitize: image/spotify URL allowlists, title cap, artist cap",
    async () => {
      const withImg = (url: string) => ({ name: "x", album: { name: "a", images: [{ url, width: 300 }] } });
      const imgOf = (url: string): string | null | "NO-TRACK" => {
        const s = sanitizeTrack(withImg(url));
        return s === null ? "NO-TRACK" : s.imageUrl;
      };
      expect(imgOf("javascript:alert(1)") === null, `javascript: image kept: ${imgOf("javascript:alert(1)")}`);
      expect(imgOf("http://i.scdn.co/x") === null, `http image kept: ${imgOf("http://i.scdn.co/x")}`);
      expect(imgOf("https://i.scdn.co.evil.com/x") === null, `lookalike host image kept: ${imgOf("https://i.scdn.co.evil.com/x")}`);
      expect(imgOf("https://i.scdn.co/image/abc") === "https://i.scdn.co/image/abc", `valid image dropped: ${imgOf("https://i.scdn.co/image/abc")}`);
      const spot = (url: string): string | null | "NO-TRACK" => {
        const s = sanitizeTrack({ name: "x", external_urls: { spotify: url } });
        return s === null ? "NO-TRACK" : s.spotifyUrl;
      };
      expect(spot("https://evil.com/track/1") === null, `evil spotify url kept: ${spot("https://evil.com/track/1")}`);
      expect(spot("https://open.spotify.com/track/1") === "https://open.spotify.com/track/1", "valid spotify url dropped");
      const longTitle = sanitizeTrack({ name: "t".repeat(1000) });
      expect(longTitle !== null && longTitle.title.length === 200, `title length ${longTitle?.title.length}`);
      const many = sanitizeTrack({ name: "x", artists: ["1", "2", "3", "4", "5", "6", "7"].map((n) => ({ name: n })) });
      expect(many !== null && many.artists.length === 4, `artist count ${many?.artists.length}`);
    },
  ],
  [
    "10. SSRF: query/headers cannot change upstream URLs",
    async () => {
      mockFetch([tokenRoute(), recentRoute(happyItems())]);
      const res = await run(songHandler, {
        method: "GET",
        query: { url: "https://evil.example", limit: "9999" },
        headers: { host: "evil.example" },
      });
      expect(res.statusCode === 200, `status ${res.statusCode}`);
      for (const c of calls) {
        expect(ALLOWED_SONG_HOSTS.includes(hostOf(c.url)), `unexpected host ${hostOf(c.url)}`);
      }
      expect(
        calls.some((c) => c.url === "https://api.spotify.com/v1/me/player/recently-played?limit=50"),
        "recently-played URL not exact",
      );
    },
  ],
  [
    "11. pickSongOfWeek: garbage input -> null, no throw",
    async () => {
      const cases: unknown[] = [null, {}, [null, { played_at: "nope" }, { track: {} }]];
      for (const c of cases) {
        expect(pickSongOfWeek(c, Date.now()) === null, `non-null for ${safeStr(c)}`);
      }
    },
  ],
  [
    "12. sports: happy path (MLB + ESPN fixtures)",
    async () => {
      mockFetch(sportsRoutes());
      const res = await run(sportsHandler, { method: "GET" });
      expect(res.statusCode === 200, `status ${res.statusCode}`);
      const L = res.body.jays?.last;
      expect(
        L?.opponent === "Cincinnati Reds" && L?.home === true && L?.teamScore === 5 && L?.oppScore === 1 && L?.result === "W",
        `jays.last ${safeStr(L)}`,
      );
      expect(res.body.jays?.next?.label === "Spring training", `jays.next.label ${res.body.jays?.next?.label}`);
      expect(res.body.jays?.next?.home === false, `jays.next.home ${res.body.jays?.next?.home}`);
      const SL = res.body.steelers?.last;
      expect(
        SL?.result === "L" && SL?.teamScore === 18 && SL?.oppScore === 38 && SL?.home === false,
        `steelers.last ${safeStr(SL)}`,
      );
      expect(res.body.steelers?.next?.opponent === "Philadelphia Eagles", `steelers.next ${safeStr(res.body.steelers?.next)}`);
      expect(res.body.steelers?.record === "6-3", `steelers.record ${res.body.steelers?.record}`);
      expect((res.headers["cache-control"] ?? "").includes("s-maxage=900"), `cache-control ${res.headers["cache-control"]}`);
    },
  ],
  [
    "13. sports isolation: ESPN schedule 500 -> 200, steelers null, jays populated",
    async () => {
      mockFetch(sportsRoutes(true, false));
      const res = await run(sportsHandler, { method: "GET" });
      expect(res.statusCode === 200, `status ${res.statusCode}`);
      expect(res.body.steelers === null, `steelers ${safeStr(res.body.steelers)}`);
      expect(res.body.jays?.last?.opponent === "Cincinnati Reds", `jays.last ${safeStr(res.body.jays?.last)}`);
    },
  ],
  [
    "14. sports: both sources 500 -> 502 unavailable, no-store",
    async () => {
      mockFetch(sportsRoutes(true, true));
      const res = await run(sportsHandler, { method: "GET" });
      expect(res.statusCode === 502, `status ${res.statusCode}`);
      expect(JSON.stringify(res.body) === '{"error":"unavailable"}', `body ${JSON.stringify(res.body)}`);
      expect(res.headers["cache-control"] === "no-store", `cache-control ${res.headers["cache-control"]}`);
    },
  ],
  [
    "15. summarizeMlb/summarizeEspn: garbage -> null, bad score dropped",
    async () => {
      expect(summarizeMlb(null, null, 141) === null, "mlb null");
      expect(summarizeMlb({ dates: "x" }, { dates: "x" }, 141) === null, "mlb {dates:'x'}");
      expect(summarizeEspn(null, null, "23") === null, "espn null");
      expect(summarizeEspn({ events: [{}] }, { events: [{}] }, "23") === null, "espn {events:[{}]}");
      const badMlb = {
        dates: [
          {
            games: [
              {
                gameDate: "2026-09-27T23:07:00Z",
                gameType: "R",
                status: { abstractGameState: "Final" },
                teams: {
                  home: { team: { id: 141, name: "Toronto Blue Jays" }, score: "abc" },
                  away: { team: { id: 113, name: "Cincinnati Reds" }, score: 1 },
                },
              },
            ],
          },
        ],
      };
      expect(summarizeMlb(badMlb, { dates: [] }, 141) === null, "mlb game with score 'abc' not dropped");
      const badEspn = {
        events: [
          {
            date: "2026-11-09T18:00Z",
            competitions: [
              {
                status: { type: { completed: true } },
                competitors: [
                  { homeAway: "away", team: { id: "23", displayName: "Pittsburgh Steelers" }, score: { value: "abc" } },
                  { homeAway: "home", team: { id: "4", displayName: "Cincinnati Bengals" }, score: { value: 38 } },
                ],
              },
            ],
          },
        ],
      };
      expect(summarizeEspn(badEspn, null, "23") === null, "espn game with score 'abc' not dropped");
    },
  ],
  [
    "16. sports SSRF: query cannot change upstream hosts or teamId",
    async () => {
      mockFetch(sportsRoutes());
      const res = await run(sportsHandler, {
        method: "GET",
        query: { teamId: "999", url: "https://evil.example" },
      });
      expect(res.statusCode === 200, `status ${res.statusCode}`);
      for (const c of calls) {
        expect(ALLOWED_SPORTS_HOSTS.includes(hostOf(c.url)), `unexpected host ${hostOf(c.url)}`);
      }
      const mlbCalls = calls.filter((c) => hostOf(c.url) === "statsapi.mlb.com");
      expect(mlbCalls.length === 2, `mlb call count ${mlbCalls.length}`);
      expect(mlbCalls.every((c) => c.url.includes("teamId=141")), "mlb url without teamId=141");
    },
  ],
  [
    "17. HEAD responses are never cacheable (song and sports)",
    async () => {
      mockFetch([tokenRoute(), recentRoute(happyItems())]);
      const song = await run(songHandler, { method: "HEAD" });
      expect(song.statusCode === 200, `song status ${song.statusCode}`);
      expect(song.headers["cache-control"] === "no-store", `song cache-control ${song.headers["cache-control"]}`);
      expect(song.body === undefined, "song HEAD sent a body");
      mockFetch(sportsRoutes());
      const sports = await run(sportsHandler, { method: "HEAD" });
      expect(sports.headers["cache-control"] === "no-store", `sports cache-control ${sports.headers["cache-control"]}`);
      expect(sports.body === undefined, "sports HEAD sent a body");
    },
  ],
  [
    "18. sanitize: image filtered by host before width; port and userinfo rejected",
    async () => {
      const s = sanitizeTrack({
        name: "x",
        album: { images: [{ url: "https://evil.com/a", width: 300 }, { url: "https://i.scdn.co/image/b", width: 640 }] },
        external_urls: { spotify: "https://open.spotify.com:8443/track/1" },
      });
      expect(s?.imageUrl === "https://i.scdn.co/image/b", `imageUrl ${s?.imageUrl}`);
      expect(s?.spotifyUrl === null, `port url kept ${s?.spotifyUrl}`);
      const u = sanitizeTrack({ name: "x", external_urls: { spotify: "https://open.spotify.com@evil.com/x" } });
      expect(u?.spotifyUrl === null, `userinfo url kept ${u?.spotifyUrl}`);
    },
  ],
  [
    "19. sports: one team missing -> short cache only",
    async () => {
      mockFetch(sportsRoutes(true, false));
      const res = await run(sportsHandler, { method: "GET" });
      expect(res.statusCode === 200, `status ${res.statusCode}`);
      expect(res.headers["cache-control"] === "public, s-maxage=60", `cache-control ${res.headers["cache-control"]}`);
    },
  ],
];

let failed = 0;

async function runTest(name: string, fn: (logs: Logs) => Promise<void>): Promise<void> {
  const logs: Logs = [];
  const saved = { log: console.log, error: console.error, warn: console.warn };
  const grab = (...args: unknown[]) => {
    logs.push(args.map(safeStr).join(" "));
  };
  console.log = grab;
  console.error = grab;
  console.warn = grab;
  let failure: string | null = null;
  try {
    setEnv(true);
    await fn(logs);
  } catch (e) {
    failure = e instanceof Error ? e.message : String(e);
  } finally {
    console.log = saved.log;
    console.error = saved.error;
    console.warn = saved.warn;
  }
  if (failure === null) {
    console.log(`ok - ${name}`);
  } else {
    console.log(`FAIL - ${name}: ${failure}`);
    failed++;
  }
}

for (const [name, fn] of tests) {
  await runTest(name, fn);
}

globalThis.fetch = realFetch;
setEnv(false);

if (failed > 0) {
  console.log(`${failed} FAILED`);
  process.exitCode = 1;
} else {
  console.log("ALL PASS");
}
