# Local Setup Guide

## Requirements

- Node.js 22+
- pnpm 9+
- MongoDB Atlas connection string or a local MongoDB server

## Install

```bash
pnpm install --frozen-lockfile
```

The root `postinstall` script builds `@gta6-guide/shared` so workspace imports such as `@gta6-guide/shared/slug` resolve correctly.

## Environment files

Create local env files from the examples:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Update `apps/api/.env` with a real MongoDB URI and unique secrets.

## Seed the database

```bash
pnpm seed
```

The seed script creates an admin user, demo user, categories, guides, bookmarks, and comments.

## Run locally

```bash
pnpm dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000/api/v1`

## Quality checks

```bash
pnpm typecheck
pnpm lint
# Optional but recommended for full backend integration coverage:
# TEST_MONGODB_URI must point to a disposable database whose name includes 'test'.
TEST_MONGODB_URI="mongodb://127.0.0.1:27017/gta6-guide-test" pnpm test
pnpm build
```

## Useful scripts

```bash
pnpm dev:web
pnpm dev:api
pnpm build:web
pnpm build:api
pnpm test:web
pnpm test:api
```
