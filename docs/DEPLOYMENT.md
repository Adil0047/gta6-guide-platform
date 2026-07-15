# Deployment Guide

This project is configured to deploy entirely on **Vercel**, as a single project:

- Frontend: Vercel static build (Vite) served from `apps/web/dist`
- Backend: Vercel serverless function (Express, unchanged) at `/api`
- Database: MongoDB Atlas

Frontend and backend are served from the **same Vercel deployment and the
same domain**. There is no separate backend host to configure.

## How the backend runs on Vercel

`api/index.js` (at the repository root) is the serverless function
entrypoint. It is a thin adapter, not a rewrite of the API:

- It imports the compiled, unmodified Express app from
  `apps/api/dist/server/app.js` (built from `apps/api/src`).
- Before handling a request it awaits `connectDatabase()`, which caches the
  MongoDB connection (and index creation) across warm invocations of the
  same function instance so a new connection is not opened on every
  request.
- It never calls `server.listen()`. Vercel's Node.js runtime invokes the
  exported handler directly per request.
- `vercel.json` rewrites every `/api/*` request to this function while
  preserving the original request path, so the existing Express routes
  (mounted under `API_BASE_URL`, `/api/v1` by default) continue to match
  exactly as before.

`apps/api/src/server/index.ts` (the traditional `server.listen()` entry
used by `pnpm dev:api` / `pnpm start`) is unchanged and still works for
local development or, if ever needed, traditional Node hosting.

## MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user with read/write access.
3. Allow Vercel outbound access in Atlas Network Access. Vercel serverless
   functions use non-static IPs, so allow `0.0.0.0/0` (Atlas's IP access
   list), and rely on your database user credentials plus TLS for security.
4. Copy the connection string; you'll set it as `MONGODB_URI` in Vercel.

## Vercel project settings

`vercel.json` configures the whole build:

- Install command: `corepack enable && pnpm install --frozen-lockfile --prod=false`
- Build command: `pnpm vercel-build` → runs `pnpm build`, which builds
  `packages/shared`, then `apps/api` (produces `apps/api/dist`, consumed by
  `api/index.js`), then `apps/web` (produces `apps/web/dist`), in that
  order.
- Output directory: `apps/web/dist`
- Function config for `api/index.js`: 1024 MB memory, 15s max duration
  (adjust in `vercel.json` if your workload needs more).
- Rewrites: `/api/*` → the serverless function, everything else → the SPA's
  `index.html`.

## Required environment variables (Vercel Project Settings → Environment Variables)

Backend (consumed by `apps/api/src/config/env.ts` inside the serverless
function):

- `NODE_ENV=production`
- `CLIENT_URL=https://your-project.vercel.app` (or your custom domain —
  same domain the frontend is served from)
- `CLIENT_URLS=https://your-project.vercel.app,https://your-custom-domain.com`
  (comma-separated list, include every domain/preview URL that should be
  allowed to call the API)
- `MONGODB_URI=<MongoDB Atlas connection string>`
- `JWT_ACCESS_SECRET=<unique 64+ character secret>`
- `JWT_REFRESH_SECRET=<different unique 64+ character secret>`
- `COOKIE_SECRET=<unique 64+ character secret>`

`API_BASE_URL`, cookie names, rate limit windows, and `LOG_LEVEL` all have
sane defaults (see `apps/api/src/config/env.ts`) and only need to be set if
you want to override them.

Frontend (consumed at build time by Vite, `apps/web/src/app/config/env.ts`):

- `VITE_APP_NAME=GTA VI Guide Platform`
- `VITE_APP_ENV=production`
- `VITE_API_BASE_URL=/api/v1` (relative — same-origin, no CORS needed;
  this is also the built-in default, so it's safe to leave unset)
- `VITE_SITE_URL=https://your-project.vercel.app`

Because the frontend calls the API with a relative URL on the same origin,
most requests won't even trigger a cross-origin CORS check in the browser.
`CLIENT_URL` / `CLIENT_URLS` should still be set correctly, since the
Express CORS middleware validates the `Origin` header when the browser
does send one.

## Production cookies and CORS

The API uses signed HTTP-only refresh-token cookies. In production, cookies
are `secure: true` and `sameSite: none`. `sameSite: none` still works
correctly for same-origin requests (it's a superset of `lax`/`strict`), so
no code change was needed for the single-domain deployment — this also
means the same configuration keeps working if you ever point a separate
frontend domain at this API in the future.

## Seeding production

After deployment, run the seed script only when you intentionally want demo
content in the target database, from a machine with `MONGODB_URI` pointed
at that database:

```bash
pnpm --filter @gta6-guide/api seed
```

For a real production launch, replace demo seed data with curated content
or run it against a staging database only.

## Testing locally with the Vercel CLI

`vercel dev` is a reasonable way to sanity-check `vercel.json` locally, but
be aware some Express+rewrite setups have shown routing quirks specifically
under `vercel dev` (not in real deployments) — e.g. every request briefly
resolving to the same sub-route regardless of path. If you see anything
like that locally, verify against a real Preview Deployment (`vercel`,
without `dev`) before treating it as a bug — the two documented, official
patterns this project follows (single `/api` rewrite target, filesystem
precedence for static assets over rewrites) are Vercel's standard
recommended setup for Express and are what actually run in production.

## Known limitations of the serverless deployment

- **Rate limiting** (`express-rate-limit`) uses an in-memory store. This is
  preserved from the original implementation and works per warm function
  instance; it is not a strict global limit across every concurrent
  serverless instance. This is the same trade-off most Express-on-serverless
  deployments make; for strict global rate limiting, back the limiter with
  Redis (e.g. Upstash) in the future.
- **Cold starts** incur one MongoDB connection setup; subsequent requests
  to the same warm instance reuse the cached connection via
  `connectDatabase()`.
