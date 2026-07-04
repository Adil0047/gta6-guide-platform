import { z } from 'zod';

import { USER_ROLE_VALUES } from '../constants/roles.js';
import { THEME_VALUES, USER_STATUS_VALUES } from '../constants/users.js';
import { mongoIdParamSchema, paginationSchema } from './common.js';

export const userPreferencesSchema = z.object({
  theme: z.enum(THEME_VALUES).optional(),
  notifications: z
    .object({
      editorial: z.boolean().optional(),
      product: z.boolean().optional(),
      comments: z.boolean().optional(),
    })
    .optional(),
});

export const updateProfileBodySchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  username: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[a-zA-Z0-9_]+$/)
    .transform((value) => value.toLowerCase())
    .optional(),
  bio: z.string().trim().max(240).optional(),
  avatar: z.string().url().or(z.literal('')).optional(),
  preferences: userPreferencesSchema.optional(),
});

export const updateProfileSchema = z.object({
  body: updateProfileBodySchema,
});

export const listUsersSchema = z.object({
  query: paginationSchema.extend({
    q: z.string().trim().max(120).optional(),
    role: z.enum(USER_ROLE_VALUES).optional(),
    status: z.enum(USER_STATUS_VALUES).optional(),
  }),
});

export const updateUserRoleSchema = z.object({
  params: mongoIdParamSchema,
  body: z.object({
    role: z.enum(USER_ROLE_VALUES),
  }),
});

export const updateUserStatusSchema = z.object({
  params: mongoIdParamSchema,
  body: z.object({
    status: z.enum(USER_STATUS_VALUES),
  }),
});
