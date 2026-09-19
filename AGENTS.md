# Base44 Dev Environment

## Project Overview
Deriv trading bot — a Rsbuild + React + TypeScript SPA for building visual trading bots on the Deriv WebSocket API. Frontend-only (no backend server); connects directly to Deriv's WebSocket API from the browser.

## Setup
- **Source location**: `brian-the-trader/` (extracted from `ReplitExport-otundobrian.tar.gz`)
- **Runtime**: Node 20 (via `node:20-slim` in `docker-compose.base44.yml`)
- **Dev server**: Rsbuild dev on port 3000 (mapped to host 3000)
- **Dependencies**: Installed inside the container at startup (`npm install`); `node_modules` lives in a named volume

## Running
```bash
docker compose -f docker-compose.base44.yml up -d
```
Logs: `docker compose -f docker-compose.base44.yml logs -f web`

## Key Notes
- The `package-lock.json` was patched to replace Replit-internal registry URLs (`http://package-firewall.replit.local/npm/`) with `https://registry.npmjs.org/` so npm install works outside Replit.
- Environment variables (Deriv app ID, env, referral link) are in `brian-the-trader/.env.production` and loaded at build time via Rsbuild's `loadEnv({ mode: 'production' })`. These are public client-side values (NEXT_PUBLIC_ prefix), not secrets.
- `rsbuild.config.ts` was modified: server port changed from 5000 → 3000, `dev.client` hardcoded host/port removed (auto-detects from browser), and `server.allowedHosts: true` added for the preview proxy.
- Google Drive integration (GD_CLIENT_ID, GD_APP_ID, GD_API_KEY) is optional and left blank.
- HMR uses polling (`CHOKIDAR_USEPOLLING=true`, `WATCHPACK_POLLING=true`) since bind mounts need it.

## Verification
- `curl http://localhost:3000/` returns 200 with the app HTML
- `curl http://localhost:3000/src/main.tsx` returns 200 (confirms dev server, not prebuilt)

## UI theme (reference "DigitTools" redesign)
The app UI was restyled to match a supplied reference design (deep-navy `#020829`,
glowing cyan/indigo accents, animated nav tabs, bot-market cards).
- `brian-the-trader/src/styles/reference-theme.scss` — reference palette, global
  theme-variable overrides, header, scrollbar and shared keyframes. Imported from
  `src/styles/index.scss`.
- `brian-the-trader/src/pages/main/main.scss` — nav tab bar restyle (per-tab accent
  colours via `--tab-color`, glowing frame + bottom beam).
- Reference artwork lives in `brian-the-trader/src/assets/` (e.g. `digittools-hero.jpg`)
  and must be referenced with a RELATIVE url from SCSS (`url("../assets/...")`):
  root-absolute URLs like `url("/foo.jpg")` are not resolved by Rsbuild's css-loader
  and break the dev build.
- `brian-the-trader/src/pages/free-bots/index.tsx` + `free-bots.scss` — Free Bots
  cards rebuilt as the reference `.bot-market-card` (tier badge, card number, art
  ring, meta grid, feature tags, load button). Accent colour comes from each bot's
  `color` field via `--bot-color`.
