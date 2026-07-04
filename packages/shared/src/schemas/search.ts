import { z } from 'zod';

import { GUIDE_DIFFICULTY_VALUES, GUIDE_TYPE_VALUES } from '../constants/content.js';
import { mongoIdSchema, paginationSchema } from './common.js';

export const searchSchema = z.object({
  query: paginationSchema.extend({
    q: z.string().trim().max(120).optional(),
    categoryId: mongoIdSchema.regex(/^[a-f\d]{24}$/i, 'Invalid categoryId').optional(),
    difficulty: z.enum(GUIDE_DIFFICULTY_VALUES).optional(),
    type: z.enum(GUIDE_TYPE_VALUES).optional(),
  }),
});
