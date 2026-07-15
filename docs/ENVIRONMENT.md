# Environment Variable Guide

## Root

| Variable | Description |
| --- | --- |
| `PROJECT_NAME` | Optional project display name for local tooling. |

## API (`apps/api/.env` locally, or Vercel Project Settings in production)

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | Yes | `development`, `test`, or `production`. |
| `PORT` | Yes locally | API port used by `server.listen()` in local dev / traditional Node hosting. Not used by the Vercel serverless function (`api/index.js`), which has no listening port. |
| `CLIENT_URL` | Yes | Primary frontend origin allowed by CORS. |
| `CLIENT_URLS` | No | Comma-separated extra frontend origins. Use for preview and custom domains. |
| `API_BASE_URL` | Yes | API mount path, normally `/api/v1`. |
| `MONGODB_URI` | Yes | MongoDB Atlas or local MongoDB URI. |
| `JWT_ACCESS_SECRET` | Yes | Access-token signing secret. Use 64+ random chars in production. |
| `JWT_REFRESH_SECRET` | Yes | Refresh-token signing secret. Must differ from access secret. |
| `JWT_ACCESS_EXPIRES_IN` | Yes | Access token TTL, default `15m`. |
| `JWT_REFRESH_EXPIRES_IN` | Yes | Refresh token TTL, default `7d`. |
| `COOKIE_SECRET` | Yes | Signed cookie secret. Use 64+ random chars in production. |
| `REFRESH_TOKEN_COOKIE_NAME` | Yes | Refresh cookie name. |
| `CSRF_COOKIE_NAME` | Yes | CSRF cookie name. Keep this aligned with the frontend API client default unless you also update the client. |
| `BCRYPT_SALT_ROUNDS` | Yes | Password hashing rounds, 10-15. |
| `RATE_LIMIT_WINDOW_MS` | Yes | Global rate-limit window. |
| `RATE_LIMIT_MAX_REQUESTS` | Yes | Global max requests per window. |
| `AUTH_RATE_LIMIT_WINDOW_MS` | Yes | Auth-specific rate-limit window. |
| `AUTH_RATE_LIMIT_MAX_REQUESTS` | Yes | Auth max attempts per window. |
| `LOG_LEVEL` | Yes | Pino log level. |

## Web (`apps/web/.env` or Vercel)

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_APP_NAME` | Recommended | App display name. Defaults to `GTA VI Guide Platform` if omitted. |
| `VITE_APP_ENV` | Recommended | `development`, `staging`, or `production`. Defaults to the Vite mode-derived value if omitted. |
| `VITE_API_BASE_URL` | Recommended | Full API base URL, including `/api/v1`. Defaults to `/api/v1` so the frontend still builds without a Vercel variable. |
| `VITE_SITE_URL` | Recommended | Canonical public site URL for SEO. Defaults to the browser origin at runtime if omitted. |

## Secret generation

Use a password manager or CLI generator for production secrets. Example:

```bash
openssl rand -hex 48
```
