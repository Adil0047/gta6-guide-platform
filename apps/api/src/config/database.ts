import mongoose from 'mongoose';

import { env } from './env.js';
import { logger } from './logger.js';

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
