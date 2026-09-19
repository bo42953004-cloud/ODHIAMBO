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
