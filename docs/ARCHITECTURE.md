# Project Architecture Documentation

The repository is a pnpm monorepo.

```text
apps/
  api/        Express 5 + Mongoose backend
  web/        Vite + React frontend
packages/
  shared/     Shared DTOs, schemas, constants, pagination, slug utilities
```

## Shared package

`@gta6-guide/shared` owns cross-app contracts:

- DTO types
- Zod schemas
- role/status constants
- guide/category constants
- pagination helpers
- slug utilities

The root `postinstall`, `predev`, `predev:web`, and `predev:api` scripts build this package before the API or frontend imports its `dist` exports.

## Backend architecture

Backend source is in `apps/api/src`.

Main layers:

- `server`: Express app and process entry
- `config`: env, CORS, database, logger
- `middlewares`: auth, validation, request ids, errors, rate limiting, sanitization
- `models`: Mongoose schemas/indexes
- `routes`: route mounting and auth/role guards
- `controllers`: request/response orchestration
- `services`: business logic and database access
- `validators`: API request schemas
- `utils`: response envelope, tokens, cookies, pagination helpers
- `scripts`: database seeding

Request flow:

```text
Express route -> auth/role guard -> validate middleware -> controller -> service -> model -> response envelope
```

## Frontend architecture

Frontend source is in `apps/web/src`.

Main layers:

- `app`: providers, layouts, router
- `pages`: route-level page components
- `features`: domain feature components
- `components`: reusable UI, cards, forms, feedback, navigation
- `services`: API clients and TanStack Query keys
- `types`: frontend view models
- `utils`: formatting and presentation helpers

Route pages are lazy-loaded to reduce initial bundle size. TanStack Query handles server state caching, retries, and invalidation after mutations.

## Authentication design

- API issues short-lived JWT access tokens.
- Refresh tokens are signed JWTs stored as hashed records in MongoDB.
- Refresh token cookie is signed, HTTP-only, secure in production, and scoped to `/api/v1/auth`.
- Frontend stores the access token and user session in local storage.
- Protected frontend routes check local session role before rendering user/admin sections.
- Backend protected routes always enforce JWT and role checks independently.

## Deployment architecture

```text
Browser -> Vercel static frontend -> Render API -> MongoDB Atlas
```

CORS allows only configured frontend origins. The web app uses `VITE_API_BASE_URL` to call the Render API.
