import { z } from 'zod';

import { CATEGORY_ACCENT_VALUES } from '../constants/content.js';
import { mongoIdParamSchema, paginationSchema, slugParamSchema } from './common.js';

export const categorySeoSchema = z.object({
  metaTitle: z.string().trim().max(70).default(''),
  metaDescription: z.string().trim().max(170).default(''),
});

export const createCategoryBodySchema = z.object({
  title: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(120).optional(),
  description: z.string().trim().min(10).max(320),
  accent: z.enum(CATEGORY_ACCENT_VALUES).default('cyan'),
  isActive: z.boolean().default(true),
  order: z.number().int().default(0),
  seo: categorySeoSchema.default({}),
});

export const createCategorySchema = z.object({
  body: createCategoryBodySchema,
});

export const updateCategorySchema = z.object({
  params: mongoIdParamSchema,
  body: createCategoryBodySchema.partial(),
});

export const getCategoryByIdSchema = z.object({
  params: mongoIdParamSchema,
});

export const getCategoryBySlugSchema = z.object({
  params: slugParamSchema,
});

export const listCategoriesSchema = z.object({
  query: paginationSchema.extend({
    isActive: z.enum(['true', 'false']).optional(),
    q: z.string().trim().max(80).optional(),
  }),
});
