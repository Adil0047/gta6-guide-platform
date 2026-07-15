// Vercel serverless function entrypoint for the Express API.
//
// This file intentionally lives outside the pnpm workspace (it is not
// listed in pnpm-workspace.yaml) because it is not a package of its own —
// it is a thin adapter that lets Vercel's Node.js runtime invoke the
// existing, unmodified Express application defined in apps/api.
//
// It imports the already-compiled output of `apps/api` (produced by
// `pnpm build`, which runs before Vercel bundles this function) rather than
// re-implementing or duplicating any server/routing/auth logic. All
// business logic, routes, middleware, security headers, CSRF protection,
// and rate limiting continue to live in apps/api/src and are unchanged.
//
// Unlike apps/api/src/server/index.ts (used for local dev and traditional
// long-running Node hosting), this file never calls `server.listen()`.
// Vercel's runtime invokes the exported handler directly per request.

import { connectDatabase } from '../apps/api/dist/config/database.js';
import { logger } from '../apps/api/dist/config/logger.js';
import { app } from '../apps/api/dist/server/app.js';

export default async function handler(req, res) {
  try {
    // Cached across warm invocations — see connectDatabase() in
    // apps/api/src/config/database.ts for the caching implementation.
    await connectDatabase();
  } catch (error) {
    logger.error({ err: error }, 'Failed to establish MongoDB connection for serverless invocation');

    res.statusCode = 503;
    res.setHeader('content-type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        message: 'Service temporarily unavailable. Please try again shortly.',
      }),
    );
    return;
  }

  app(req, res);
}
