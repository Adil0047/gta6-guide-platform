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

export async function connectDatabase() {
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
  } catch (error) {
    logger.fatal({ err: error }, 'MongoDB connection failed. Check MONGODB_URI and database availability.');
    throw error;
  }
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}
