import { createServer } from 'node:http';

import { connectDatabase, disconnectDatabase } from '@/config/database.js';
import { env } from '@/config/env.js';
import { logger } from '@/config/logger.js';

import { app } from './app.js';

const server = createServer(app);

async function startServer() {
  await connectDatabase();

  server.listen(env.PORT, () => {
    logger.info(`API server running on http://localhost:${env.PORT}${env.API_BASE_URL}`);
  });
}

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutdown signal received');

  server.close(async () => {
    await disconnectDatabase();
    logger.info('Server closed');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Uncaught exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'Unhandled rejection');
  process.exit(1);
});

startServer().catch((error) => {
  logger.fatal({ err: error }, 'API server failed to start');
  process.exit(1);
});
