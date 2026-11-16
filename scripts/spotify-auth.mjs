// One-time helper: get a Spotify refresh token for /api/song-of-the-week.
//
// 1. In the Spotify developer dashboard, add this redirect URI to your app:
//      http://127.0.0.1:8888/callback
// 2. Run (PowerShell):
//      $env:SPOTIFY_CLIENT_ID="..."; $env:SPOTIFY_CLIENT_SECRET="..."; node scripts/spotify-auth.mjs
// 3. Open the printed URL, approve, and copy the refresh token it prints into
//    Vercel as SPOTIFY_REFRESH_TOKEN. Nothing is written to disk.
//
// Spotify refresh tokens expire 6 months after you approve; re-run this then.

import { createServer } from "node:http";
import { randomBytes } from "node:crypto";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.");
  process.exit(1);
}

const redirectUri = "http://127.0.0.1:8888/callback";
const state = randomBytes(16).toString("hex");
const authorize = new URL("https://accounts.spotify.com/authorize");
authorize.search = new URLSearchParams({
  client_id: clientId,
  response_type: "code",
  redirect_uri: redirectUri,
  scope: "user-read-recently-played user-top-read",
  state,
  show_dialog: "true",
}).toString();

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1:8888");
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  if (url.searchParams.get("state") !== state || !url.searchParams.get("code")) {
    res.writeHead(400).end("State mismatch or missing code. Start again.");
    return;
  }
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: url.searchParams.get("code"),
      redirect_uri: redirectUri,
    }),
  });
  const body = await tokenRes.json().catch(() => ({}));
  if (!tokenRes.ok || typeof body.refresh_token !== "string") {
    res.writeHead(500).end("Token exchange failed. Check the terminal.");
    console.error("Token exchange failed with status", tokenRes.status);
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" }).end("Done. You can close this tab.");
    console.log("\nSPOTIFY_REFRESH_TOKEN (add this to Vercel, then clear your terminal):\n");
    console.log(body.refresh_token + "\n");
  }
  server.close();
});

server.listen(8888, "127.0.0.1", () => {
  console.log("Open this URL in your browser and approve access:\n");
  console.log(authorize.toString() + "\n");
});
