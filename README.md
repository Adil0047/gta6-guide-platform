# GTA VI Guide Platform

A production-grade GTA VI Guide Platform built as a scalable MERN monorepo.

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Motion
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- MongoDB and Mongoose planned for future milestone

### Tooling

- pnpm workspaces
- ESLint
- Prettier
- GitHub Actions

## Project Structure

apps/web          React + Vite frontend
apps/api          Express backend
packages/shared  Shared types, constants, validation, utilities
docs              Architecture and product documentation

## Development

Install dependencies:

    pnpm install

Start frontend and backend:

    pnpm dev

Start frontend only:

    pnpm dev:web

Start backend only:

    pnpm dev:api

Run linting:

    pnpm lint

Run type checking:

    pnpm typecheck

Format files:

    pnpm format

Build all apps:

    pnpm build

## Production documentation

- [API documentation](docs/API.md)
- [Local setup guide](docs/LOCAL_SETUP.md)
- [Deployment guide](docs/DEPLOYMENT.md)
- [Environment variable guide](docs/ENVIRONMENT.md)
- [Database schema documentation](docs/DATABASE_SCHEMA.md)
- [Project architecture documentation](docs/ARCHITECTURE.md)
- [Security review](docs/SECURITY.md)

