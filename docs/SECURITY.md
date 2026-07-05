# Security Review

## CORS

The API allows only `CLIENT_URL` plus comma-separated `CLIENT_URLS`. Credentials are enabled for refresh-token cookies. Unknown origins are rejected by omission of CORS headers.

## Helmet

Helmet is enabled globally. Production enables HSTS. CSP is disabled at the API layer because this backend serves JSON rather than browser-rendered HTML.

## Cookies

Refresh-token cookies are:

- signed
- HTTP-only
- `secure: true` in production
- `sameSite: none` in production for cross-domain Vercel/Render deployments
- scoped to `/api/v1/auth`

## JWT

Access and refresh JWT secrets must be unique. Production validation requires 64+ character secrets and rejects placeholder values.

## Rate limiting

Global rate limiting protects API routes. Auth routes have stricter limits and skip successful requests so normal sign-ins do not consume the failed-attempt budget.

## Input validation

Zod schemas validate route params, query strings, and bodies before controllers run. Mongo operator injection is sanitized through the local Express 5-compatible sanitizer middleware.

## Passwords

Passwords are hashed with bcrypt. The configured salt rounds must be between 10 and 15.

## Production checklist

- Use unique secrets for each environment.
- Keep `MONGODB_URI` out of source control.
- Restrict Atlas network access where possible.
- Set `CLIENT_URL` and `CLIENT_URLS` to real frontend origins only.
- Run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build` before release.
