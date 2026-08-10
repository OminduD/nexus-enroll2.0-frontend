# NexusEnroll 2.0 — Frontend

React + TypeScript + Vite frontend for NexusEnroll, served by nginx in production. This is a
sibling repo to the backend (`nexus-enroll2.0`) and is meant to be checked out next to it -
the backend's `docker-compose.yml` builds this frontend from `../nexus-enroll2.0-frontend`.

## Running the whole system (recommended)

You don't build or run this repo standalone for a normal demo. From the **backend** repo:

```powershell
cd ../nexus-enroll2.0
docker compose down -v
docker compose up --build -d
```

This builds the frontend image too and serves it at **http://localhost:8085**, proxied to the
API gateway through nginx (no CORS setup needed). See `../nexus-enroll2.0/DOCKER.md` for the
full startup guide, demo credentials, and troubleshooting.

## Local dev mode (frontend only, against a running backend)

Useful for hot-reload while working on UI code:

```powershell
npm install
npm run dev
```

This starts Vite's dev server (default `http://localhost:5173`) and talks directly to the API
gateway at `http://localhost:8080` (see `VITE_API_BASE_URL` in `src/services/api.ts` — it
defaults to `localhost:8080` when unset, which is what dev mode needs since there's no nginx
proxy in front of it here). The backend must already be running (`docker compose up -d` from
the backend repo) and `http://localhost:5173` must be in the gateway's allowed CORS origins
(`api-gateway/src/main/java/.../CorsConfig.java`) - it is, by default.

## Demo login

All seeded accounts share the password **`Password123`**: `admin`, `faculty1`, `faculty2`,
`student1`–`student4`. The login screen's "Quick Test Logins" buttons fill these in for you.

## Mock data fallback

Every `src/services/*Service.ts` file falls back to mock data on a failed API call, but only
when `VITE_USE_MOCK_FALLBACK=true` is set at build time. The Docker build sets it to `false`
so a dead backend shows a visible error instead of a UI that silently looks fine. It's useful
to flip on for local dev if you want to work on UI without a backend running at all:

```powershell
VITE_USE_MOCK_FALLBACK=true npm run dev
```

## Build

```powershell
npm run build   # tsc -b && vite build, outputs to dist/
```

---

## Vite template notes

This project was scaffolded from the React + TypeScript + Vite template (HMR, Oxlint). Two
official plugins are available if you're touching the Vite config:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) (Oxc)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) (SWC)

For type-aware lint rules, install `oxlint-tsgolint` and edit `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full rule list.
