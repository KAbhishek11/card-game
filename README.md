# Gupt Sabha
An Indian-inspired, browser-based hidden-role game for 5–10 friends. React, Node, and Socket.IO; private rooms, original artwork, three themes, beginner guidance, optional characters, reconnects, and complete round rules.

## Run
Requires Node 22.12+ (tested on Node 26).

```sh
npm ci
npm run build
PORT=3017 npm start
```
Open http://localhost:3017. For development use `PORT=3017 npm run dev`.

On the same Wi-Fi, friends can use `http://YOUR_COMPUTER_LAN_IP:3017` on their phones. The host should also open that LAN address before copying invitations; a localhost invitation only works on the host computer. Keep the server running and allow local network access if your OS asks. Use distinct browsers or devices for separate people; tabs have their own saved seats. Normal reloads restore a seat.

## Play
1. Create a room with your name and one of the three art themes.
2. Share the room URL or six-character code. Gather 5–10 players.
3. Everyone marks ready; the host begins. Reveal and read private roles.
4. Propose teams, vote, play secret expedition cards, and resolve the final accusation.
5. Use in-person conversation or a separate voice call. Voice/chat is not built in.

## Verify
```sh
npm test
npm run build
# With a local server running:
TEST_URL=http://localhost:3017 node tests/multiplayer.mjs
# Optional full browser test (requires Playwright Chromium):
node tests/browser.mjs
# Or set CHROME_PATH to an installed Chrome executable.
# Isolated production restart/storage check:
node tests/recovery.mjs
```
The engine tests cover legal counts, role knowledge, duplicate/illegal actions, mission thresholds, rejection loss, both final outcomes, and host recovery. The live integration check uses five independent Socket.IO clients and verifies reconnect, three expeditions, final accusation, rematch, and leaving.

## Public hosting
The game runs as one Node service that serves the built client and the Socket.IO server together. It needs a host that keeps a process running, forwards WebSocket connections, and mounts a persistent writable disk. Static hosts such as Vercel or Netlify only serve the frontend, so the client sits on "Connecting to the council" forever.

### Render (recommended)
`render.yaml` in the repo root is a Render Blueprint. In the Render dashboard choose New → Blueprint, pick this repository, and accept the defaults. It creates a single always-on web service with the build and start commands, a 1 GB disk mounted at `/var/data` for room data, the health check, and `TRUST_PROXY_HOPS=1`. Render sets `RENDER_EXTERNAL_URL`, which the server uses as its public origin. Persistent disks require a paid instance; the free plan works for a quick test but forgets rooms on restart and sleeps when idle, which drops live games.

### Any other host
- Build: `npm ci && npm run build`
- Start: `npm start`
- `PORT`: provider's assigned HTTP port (default 3000).
- `DATA_DIR`: private persistent disk path (default `.data`). Do not put it in `public` or `dist`.
- `PUBLIC_ORIGIN`: the public HTTPS URL, used to validate WebSocket origins.
- `TRUST_PROXY_HOPS`: number of reverse proxies in front of the app, usually `1`.
- Health endpoint: `/api/health`.
- Run exactly one process/replica. The JSON room store is not a distributed database.
- A Dockerfile and compose configuration are included for self-hosting; terminate HTTPS at your reverse proxy.

Same-Wi-Fi play is the confirmed initial scope. No paid hosting account or public deployment was created. A provider/account choice would be needed later for friends outside your Wi-Fi.

## Persistence and privacy
Rooms expire after 24 hours of inactivity. State is saved atomically to a private JSON file after each command. Server restarts preserve room state and mark seats disconnected until their saved tokens reconnect. Role/session secrets are never included in another player's state. Quest results expose only aggregate sabotage counts; team votes become public only after everyone votes.

Treat `.data` as private server data: it contains session credentials and roles. The host cannot read other players' roles through the app; the server operator has access to the storage. Socket messages are size-limited and rate-limited. The app expects honest friends, not a tournament anti-cheat environment.

## Design and rules
See [game flow](docs/GAME-FLOW.md). Product explanations and character names are newly written. The Figma references informed visual direction; their third-party images are not shipped. The three atlases in `public/art/` each contain eight original character illustrations and a common card back. They were created with the built-in image-generation tool using the latest user attachments as style references. Exact prompts and research sources are in `docs/redesign/`; prompts are also embedded in the images. Themes change the interface palette and artwork, never rules. Fonts are self-hosted in `public/fonts/` with their OFL license notices.

The redesign adds a large deck selection screen, deck previews, council seating, a round-phase guide, animated private-card reveals, and a mobile private-card sheet. To check these screens run `node tests/design-check.mjs` with Playwright installed, or set `CHROME_PATH` as described above.
