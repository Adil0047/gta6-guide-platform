import { z } from 'zod';

import { paginationSchema } from '../pagination.js';

export const mongoIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const mongoIdParamSchema = z.object({
  id: mongoIdSchema,
});

export const slugSchema = z.string().min(1).max(160);

export const slugParamSchema = z.object({
  slug: slugSchema,
});

export { paginationSchema };
