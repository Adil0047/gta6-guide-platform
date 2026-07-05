import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { config } from 'dotenv';
import { z } from 'zod';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

config({ path: resolve(packageRoot, '.env') });

const mongoUriSchema = z
  .string({ required_error: 'MONGODB_URI is required. Add it to apps/api/.env or the runtime environment.' })
  .trim()
  .min(1, 'MONGODB_URI is required. Add it to apps/api/.env or the runtime environment.')
  .refine(
    (value) => value.startsWith('mongodb://') || value.startsWith('mongodb+srv://'),
    'MONGODB_URI must start with mongodb:// or mongodb+srv://',
  );

const secretSchema = z
  .string()
  .trim()
  .min(32, 'Secrets must be at least 32 characters long. Use 64+ random characters in production.');

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(5000),

    CLIENT_URL: z.string().url(),
    CLIENT_URLS: z.string().default(''),
    API_BASE_URL: z.string().default('/api/v1'),

    MONGODB_URI: mongoUriSchema,

    JWT_ACCESS_SECRET: secretSchema,
    JWT_REFRESH_SECRET: secretSchema,
    JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

    COOKIE_SECRET: secretSchema,
    REFRESH_TOKEN_COOKIE_NAME: z.string().default('gta6_refresh_token'),
    CSRF_COOKIE_NAME: z.string().default('gta6_csrf_token'),

    BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),

    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
    AUTH_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
    AUTH_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(20),

    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  })
  .superRefine((value, context) => {
    if (value.JWT_ACCESS_SECRET === value.JWT_REFRESH_SECRET) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['JWT_REFRESH_SECRET'],
        message: 'JWT_REFRESH_SECRET must be different from JWT_ACCESS_SECRET',
      });
    }

    if (value.NODE_ENV === 'production') {
      const productionSecrets = [
        ['JWT_ACCESS_SECRET', value.JWT_ACCESS_SECRET],
        ['JWT_REFRESH_SECRET', value.JWT_REFRESH_SECRET],
        ['COOKIE_SECRET', value.COOKIE_SECRET],
      ] as const;

      productionSecrets.forEach(([key, secret]) => {
        if (secret.length < 64 || secret.startsWith('replace-with')) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            path: [key],
            message: `${key} must be a unique 64+ character production secret`,
          });
        }
      });
    }
  });

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment configuration:', parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;

export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
