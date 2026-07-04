# PROJECT MEMORY

## Project Vision

The project is a production-style GTA VI Guide Platform built as a scalable MERN startup product, not a simple gaming blog. It is intended to support long-form guides, mission walkthroughs, categories, search, user accounts, bookmarks, comments, admin publishing workflows, analytics, and a future interactive GTA VI map with premium expansion potential.

The product direction is a premium, dark, cinematic, GTA VI-inspired guide hub with strong SEO, modern UX, and modular architecture that can grow into a real content platform.

## Architecture

The project uses a monorepo architecture with separate applications and future shared packages.

Primary structure:

- `apps/web` — React frontend
- `apps/api` — Express backend
- `packages/shared` — planned shared contracts, types, constants, and validation helpers
- `docs` — planned documentation
- `.github/workflows` — CI workflow

The frontend and backend are intentionally separated but designed to connect through stable REST API contracts.

## Folder Structure

Current intended structure:

- Root config files:
  - `package.json`
  - `pnpm-workspace.yaml`
  - `tsconfig.base.json`
  - `eslint.config.js`
  - `.prettierrc`
  - `.prettierignore`
  - `.editorconfig`
  - `.gitignore`
  - `.env.example`
  - `README.md`
  - `PROJECT_STATUS.md`
  - `PROJECT_MEMORY.md`

- Frontend:
  - `apps/web/src/app`
  - `apps/web/src/assets`
  - `apps/web/src/components`
  - `apps/web/src/constants`
  - `apps/web/src/data`
  - `apps/web/src/features`
  - `apps/web/src/hooks`
  - `apps/web/src/lib`
  - `apps/web/src/pages`
  - `apps/web/src/services`
  - `apps/web/src/store`
  - `apps/web/src/styles`
  - `apps/web/src/types`
  - `apps/web/src/utils`

- Backend:
  - `apps/api/src/config`
  - `apps/api/src/constants`
  - `apps/api/src/controllers`
  - `apps/api/src/emails`
  - `apps/api/src/jobs`
  - `apps/api/src/middlewares`
  - `apps/api/src/models`
  - `apps/api/src/routes`
  - `apps/api/src/server`
  - `apps/api/src/services`
  - `apps/api/src/types`
  - `apps/api/src/utils`
  - `apps/api/src/validators`

Important note: many frontend and backend files were generated in the conversation, but the downloadable workspace may not yet contain every generated source file. Before future development, materialize all generated files into the workspace and run checks.

## Tech Stack

Frontend:

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Motion / Framer-style animation via `motion/react`
- Lucide React
- clsx
- tailwind-merge

Backend:

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Zod
- JWT
- bcryptjs
- cookie-parser
- cors
- helmet
- compression
- express-rate-limit
- express-mongo-sanitize
- pino
- pino-http
- morgan dependency included but not essential to current implementation

Tooling:

- pnpm workspaces
- ESLint flat config
- Prettier
- GitHub Actions CI

Deployment target:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Design System

Visual direction:

- Premium dark UI
- Black background
- White typography
- Neon pink, cyan, purple, and electric blue accents
- GTA VI-inspired cinematic glow
- Glassmorphism panels
- Rounded cards and shells
- Large spacing
- Strong hero sections
- Smooth but accessible animations

Core colors used:

- Background: black / near-black
- Surface: dark gray-black
- Text primary: white
- Text secondary: soft gray
- Muted text: gray
- Neon pink: `#ff3cac`
- Neon cyan: `#00e5ff`
- Neon purple: `#7c3aed`
- Electric blue: `#2563eb`

UI principles:

- Reusable components first
- Mobile-first responsive layout
- Accessible focus rings
- Reduced-motion support
- Strong contrast
- SEO-friendly page structure

## Coding Conventions

General:

- TypeScript everywhere
- ESM modules
- Strict typing where practical
- Feature-based organization
- Reusable components before page-specific code
- Absolute imports using `@/`
- No unnecessary default exports
- Keep controllers thin and services responsible for business logic
- Keep validation in dedicated schemas
- Keep route definitions separate from controllers

Frontend:

- Components use PascalCase
- Hooks use `useX` naming
- Utilities use camelCase
- Route constants live in `constants/routes.ts`
- Mock data lives in `data/`
- Page components live in `pages/`
- Feature-specific components live in `features/<feature>/components`

Backend:

- Model files use `*.model.ts`
- Controller files use `*.controller.ts`
- Service files use `*.service.ts`
- Route files use `*.routes.ts`
- Middleware files use `*.middleware.ts`
- Validator files use `*.validators.ts`
- Shared barrel exports exist in many folders

## Naming Conventions

Frontend examples:

- `HomePage`
- `GuideDetailPage`
- `GuideListing`
- `GuideFilterPanel`
- `HeroSection`
- `DashboardNav`
- `AdminSidebar`
- `useBodyScrollLock`
- `searchGuides`

Backend examples:

- `UserModel`
- `GuideModel`
- `CategoryModel`
- `authRouter`
- `guideRouter`
- `registerUser`
- `listGuides`
- `createGuideController`
- `validate`
- `requireAuth`

## State Management

Current frontend state strategy:

- React local state for UI interactions
- React Router for navigation and query-state behavior
- Mock data for content until backend connection
- `themeStore` wrapper around localStorage for theme preference
- No global state library currently used

Planned state direction:

- Keep local state for simple UI state
- Add API-driven server state once backend is connected
- Add auth session state after JWT integration
- Consider TanStack Query later for caching, pagination, mutations, and invalidation

## API Architecture

The backend is REST-based under `/api/v1`.

Current route groups:

- `/api/v1/health`
- `/api/v1/auth`
- `/api/v1/users`
- `/api/v1/guides`
- `/api/v1/categories`
- `/api/v1/search`
- `/api/v1/admin`

Response format:

- `success`
- `message`
- `data`
- `meta` when applicable

Pagination format:

- `total`
- `page`
- `limit`
- `totalPages`
- `hasNextPage`
- `hasPreviousPage`

Frontend API client:

- `apiClient.get`
- `apiClient.post`
- `apiClient.put`
- `apiClient.delete`
- Uses `VITE_API_BASE_URL`
- Supports bearer auth token injection

## Database Architecture

Database: MongoDB with Mongoose.

Existing backend models generated:

- `UserModel`
- `GuideModel`
- `CategoryModel`
- `RefreshTokenModel`
- `AuditLogModel`

User model supports:

- Name
- Username
- Email
- Password hash
- Avatar
- Bio
- Role
- Status
- Email verification flag
- Refresh token version
- Last login time
- Preferences

Guide model supports:

- Title
- Slug
- Excerpt
- Content
- Sections
- FAQs
- Category reference
- Tags
- Type
- Difficulty
- Status
- Visibility
- Cover image
- Read time
- Author reference
- Reviewer reference
- Published date
- Featured flag
- Metrics
- SEO metadata
- Game metadata
- Text indexes for search

Category model supports:

- Title
- Slug
- Description
- Accent color
- Active state
- Order
- SEO metadata

Refresh token model supports:

- User reference
- Token hash
- Expiry
- Revocation tracking
- IP and user-agent metadata

Audit log model supports:

- Actor
- Action
- Resource type
- Resource ID
- Metadata
- IP
- User agent

## Existing Pages

Public pages generated:

- Home
- Guides listing
- Guide detail
- Categories listing
- Category detail
- Search
- GTA VI map
- 404 page

Authentication pages generated:

- Login
- Register
- Forgot password
- Reset password

User dashboard pages generated:

- User dashboard overview
- Bookmarks
- Comments
- Settings

Admin pages generated:

- Admin dashboard overview
- Admin guides
- Admin categories
- Admin users
- Admin comments
- Admin analytics
- Admin settings

## Existing Components

Core layout components:

- `Navbar`
- `Footer`
- `DashboardNav`
- `AdminSidebar`
- `AdminMobileNav`
- `SkipLink`
- `Breadcrumbs`

UI components:

- `Button`
- `Badge`
- `Card`
- `Container`
- `Input`
- `Textarea`
- `Select`
- `Skeleton`
- `Spinner`
- `Divider`
- `VisuallyHidden`

Common components:

- `SEO`
- `PageShell`
- `SectionHeader`
- `MetricPill`
- `LoadingScreen`

Animation components:

- `FadeIn`
- `ScaleIn`
- `StaggerGroup`
- `StaggerItem`

Cards and content components:

- `GuideCard`
- `CategoryCard`
- `StatCard`
- `StatusCard`
- `EmptyState`
- `ErrorState`

Feature components:

- `HeroSection`
- `FeaturedGuidesSection`
- `CategoryPreviewSection`
- `LatestUpdatesSection`
- `MapPreviewSection`
- `FaqSection`
- `NewsletterSection`
- `GuideListing`
- `GuideFilterPanel`
- `GuideDetailHero`
- `GuideArticle`
- `GuideTableOfContents`
- `CategoryHeroGrid`
- `CategoryDetail`
- `SearchResults`
- `MapExperience`
- `MapCanvas`
- `MapMarkerCard`
- Auth form components
- User profile/dashboard components
- Admin dashboard components

## Existing Layouts

Generated layouts:

- `PublicLayout`
- `AuthLayout`
- `UserLayout`
- `AdminLayout`

Layout behavior:

- Public layout includes skip link, navbar, route outlet, and footer
- Auth layout is centered and minimal
- User layout includes navbar, dashboard navigation, outlet, and footer
- Admin layout includes desktop sidebar, mobile admin nav, and outlet

## Existing Hooks

Generated hooks:

- `useBodyScrollLock`
- `useEscapeKey`
- `useScrollPosition`

Hook decisions:

- Keep small hooks in `src/hooks`
- Use hooks for UI behavior only until broader state/API management is added

## Existing Utilities

Generated utilities:

- `cn`
- `formatDate`
- `createPageTitle`
- `guideFilters`
- `apiResponse`
- `appError`
- `asyncHandler`
- `cookies`
- `pagination`
- `password`
- `slug`
- `tokens`

Frontend utilities:

- Class merge helper with `clsx` and `tailwind-merge`
- Date formatting helper
- SEO title helper
- Guide filtering helpers for mock data

Backend utilities:

- Standard API responses
- Operational error class
- Async controller wrapper
- Refresh token cookie helpers
- Pagination helpers
- Password hashing and verification
- Slug creation
- JWT signing and verification

## Existing Backend Modules

Backend config:

- `env`
- `logger`
- `database`
- `cors`

Backend middleware:

- `requestIdMiddleware`
- `globalRateLimiter`
- `authRateLimiter`
- `requireAuth`
- `requireRoles`
- `validate`
- `notFoundMiddleware`
- `errorMiddleware`

Backend controllers:

- Auth controller
- User controller
- Guide controller
- Category controller
- Search controller
- Admin controller

Backend services:

- Auth service
- User service
- Guide service
- Category service
- Search service
- Audit service

Backend routes:

- Health routes
- Auth routes
- User routes
- Guide routes
- Category routes
- Search routes
- Admin routes

Supporting modules:

- Email stub module
- Job queue stub module

## Authentication Flow

Current backend auth flow:

1. User registers with name, username, email, and password.
2. Password is hashed using bcryptjs.
3. User logs in with email and password.
4. Backend returns an access token and sets a signed HTTP-only refresh-token cookie.
5. Access token is intended for bearer authorization.
6. Refresh endpoint reads the signed refresh-token cookie.
7. Refresh tokens are hashed before storage in MongoDB.
8. Refresh token rotation is implemented.
9. Logout revokes refresh token and clears cookie.
10. Password change revokes all refresh tokens by incrementing token version and clearing cookie.

Frontend auth state has UI pages and forms, but full token/session integration is still pending.

## Security Decisions

Backend security decisions:

- Helmet enabled
- CORS restricted to configured client URL
- Global rate limiting
- Stricter auth rate limiting
- JSON body size limit
- URL-encoded body size limit
- Mongo sanitization
- Password hashing with bcryptjs
- JWT access and refresh token separation
- Refresh token stored in signed HTTP-only cookie
- Refresh token hash stored in database
- Refresh token rotation
- Role-based authorization
- Zod validation for request body, params, and query
- Centralized error handling
- Request ID middleware
- Sensitive logger redaction

Frontend security decisions:

- Auth forms prepared but not wired to persistent tokens yet
- API client supports bearer auth token
- No unsafe HTML rendering in generated frontend
- Focus visible states and accessible labels used where possible

## Performance Decisions

Frontend performance decisions:

- Vite for fast builds and dev server
- Modular feature-based structure
- Lightweight local components
- CSS via Tailwind utilities
- Reduced-motion support
- Mock data kept local until backend integration
- Responsive grids and simple animation wrappers

Backend performance decisions:

- Pagination for list endpoints
- MongoDB indexes on common query fields
- Text indexes for guide search
- Compression middleware
- Lean queries where mutation is not needed
- Rate limiting
- Async controller wrapper
- Graceful shutdown handling

## Important Assumptions

- The frontend is considered functionally complete by project decision, but should still be locally tested.
- The backend is considered foundation-complete, but should still be locally tested.
- Current mock data is acceptable until API integration.
- A future shared package will stabilize frontend/backend contracts.
- Bookmarks, comments, analytics, notifications, and AI assistant are represented in frontend architecture but not fully persisted in backend yet.
- Admin dashboard currently includes strong UI and overview API foundation, but not all persistence workflows.
- The workspace zip may not include every source file generated in the conversation until full materialization is completed.
- The backend package should include `pino-pretty` as a dev dependency because `logger.ts` uses it in development.
- MongoDB Atlas is the intended production database.
- Vercel is the intended frontend host.
- Render is the intended backend host.

## Remaining Roadmap

Immediate priorities:

1. Materialize all generated frontend source files into `apps/web/src`.
2. Materialize all generated backend source files into `apps/api/src`.
3. Add missing `pino-pretty` dev dependency to backend package.
4. Create `packages/shared`.
5. Run `pnpm install`.
6. Run `pnpm typecheck`.
7. Run `pnpm lint`.
8. Run `pnpm build`.
9. Fix TypeScript, import, dependency, and runtime issues.
10. Connect frontend auth to backend auth endpoints.
11. Connect frontend guides/categories/search pages to backend API.
12. Add protected routes on frontend.
13. Add seed script for development data.
14. Add bookmark model and endpoints.
15. Add comment model and endpoints.
16. Add analytics persistence or event logging.
17. Add API documentation.
18. Add deployment configuration.
19. Add tests.
20. Deploy frontend, backend, and database.

Recommended next AI handoff instruction:

Continue from this project memory. First inspect the current workspace file tree, then materialize any generated files missing from the workspace exactly as previously created. After materialization, create `packages/shared`, run/fix type checks logically, and then proceed with frontend-backend integration.
