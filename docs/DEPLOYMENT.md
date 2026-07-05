# Deployment Guide

This project is configured for:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user with read/write access.
3. Allow Render outbound access in Atlas Network Access. For a quick start, allow `0.0.0.0/0`, then tighten it when a stable egress strategy is available.
4. Copy the connection string and set it as `MONGODB_URI` in Render.

## Backend on Render

`render.yaml` defines a web service named `gta6-guide-api`.

Render settings:

- Runtime: Node
- Build command: `pnpm install --frozen-lockfile && pnpm build:api`
- Start command: `pnpm --filter @gta6-guide/api start`
- Health check path: `/api/v1/health`

Required Render environment variables:

- `NODE_ENV=production`
- `CLIENT_URL=https://your-vercel-domain.vercel.app`
- `CLIENT_URLS=https://your-production-domain.com,https://your-vercel-domain.vercel.app`
- `MONGODB_URI=<MongoDB Atlas URI>`
- `JWT_ACCESS_SECRET=<unique 64+ character secret>`
- `JWT_REFRESH_SECRET=<different unique 64+ character secret>`
- `COOKIE_SECRET=<unique 64+ character secret>`

Render can generate secret values for the JWT and cookie secrets when using the blueprint.

## Frontend on Vercel

`vercel.json` configures the monorepo build:

- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build:web`
- Output directory: `apps/web/dist`

Required Vercel environment variables:

- `VITE_APP_NAME=GTA VI Guide Platform`
- `VITE_APP_ENV=production`
- `VITE_API_BASE_URL=https://your-render-api.onrender.com/api/v1`
- `VITE_SITE_URL=https://your-production-domain.com`

## Production cookies and CORS

The API uses signed HTTP-only refresh-token cookies. In production cookies are `secure: true` and `sameSite: none`, which is appropriate when the frontend and API are on different domains.

Set `CLIENT_URL` and `CLIENT_URLS` so the API only accepts browser requests from trusted frontend origins.

## Seeding production

After deployment, run the seed script only when you intentionally want demo content in the target database:

```bash
pnpm --filter @gta6-guide/api seed
```

For real production launch, replace demo seed data with curated content or run it against a staging database only.
