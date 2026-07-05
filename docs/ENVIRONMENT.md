# Environment Variable Guide

## Root

| Variable | Description |
| --- | --- |
| `PROJECT_NAME` | Optional project display name for local tooling. |

## API (`apps/api/.env` or Render)

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | Yes | `development`, `test`, or `production`. |
| `PORT` | Yes | API port. Render injects a port, but `10000` is fine for blueprint config. |
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
| `VITE_APP_NAME` | Yes | App display name. |
| `VITE_APP_ENV` | Yes | `development`, `staging`, or `production`. |
| `VITE_API_BASE_URL` | Yes | Full API base URL, including `/api/v1`. |
| `VITE_SITE_URL` | Yes | Canonical public site URL for SEO. |

## Secret generation

Use a password manager or CLI generator for production secrets. Example:

```bash
openssl rand -hex 48
```
