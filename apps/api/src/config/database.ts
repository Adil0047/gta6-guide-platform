import mongoose from 'mongoose';

import { AuditLogModel } from '@/models/AuditLog.model.js';
import { BookmarkModel } from '@/models/Bookmark.model.js';
import { CategoryModel } from '@/models/Category.model.js';
import { CommentModel } from '@/models/Comment.model.js';
import { GuideModel } from '@/models/Guide.model.js';
import { RefreshTokenModel } from '@/models/RefreshToken.model.js';
import { UserModel } from '@/models/User.model.js';

import { env } from './env.js';
import { logger } from './logger.js';

async function ensureDatabaseIndexes() {
  await Promise.all([
    AuditLogModel.createIndexes(),
    BookmarkModel.createIndexes(),
    CategoryModel.createIndexes(),
    CommentModel.createIndexes(),
    GuideModel.createIndexes(),
    RefreshTokenModel.createIndexes(),
    UserModel.createIndexes(),
  ]);

  logger.info('MongoDB indexes ensured');
}

// In serverless environments (e.g. Vercel) this module can be evaluated once
// and then reused across many warm invocations of the same function
// instance, but it can also be re-evaluated on cold starts. Caching the
// connection promise on `globalThis` avoids opening a new MongoDB connection
// (and re-running index creation) on every request while still working
// correctly for the long-running server entrypoint used in local/dev and
// traditional Node hosting.
type DatabaseConnectionCache = {
  promise: Promise<typeof mongoose> | null;
};

const globalForDatabase = globalThis as typeof globalThis & {
  __gta6DatabaseConnection?: DatabaseConnectionCache;
};

const connectionCache: DatabaseConnectionCache = (globalForDatabase.__gta6DatabaseConnection ??= {
  promise: null,
});

async function establishConnection() {
  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false);

  try {
    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== 'production',
    });

    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection did not reach the connected state.');
    }

    await ensureDatabaseIndexes();

    logger.info(
      {
        database: mongoose.connection.name,
        host: mongoose.connection.host,
      },
      'MongoDB connected',
    );

    return mongoose;
  } catch (error) {
    logger.fatal({ err: error }, 'MongoDB connection failed. Check MONGODB_URI and database availability.');
    throw error;
  }
}

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  connectionCache.promise ??= establishConnection().catch((error: unknown) => {
    // Allow the next invocation to retry instead of caching a permanent failure.
    connectionCache.promise = null;
    throw error;
  });

  return connectionCache.promise;
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}
