import { z } from 'zod';

import {
  GUIDE_DIFFICULTY_VALUES,
  GUIDE_SORT_VALUES,
  GUIDE_STATUS_VALUES,
  GUIDE_TYPE_VALUES,
  GUIDE_VISIBILITY_VALUES,
} from '../constants/content.js';
import { mongoIdParamSchema, mongoIdSchema, paginationSchema, slugParamSchema } from './common.js';

export const guideSectionSchema = z.object({
  heading: z.string().trim().min(2).max(140),
  body: z.array(z.string().trim().min(1)).default([]),
});

export const guideFaqSchema = z.object({
  question: z.string().trim().min(5).max(180),
  answer: z.string().trim().min(5).max(800),
});

export const guideSeoSchema = z.object({
  metaTitle: z.string().trim().max(70).default(''),
  metaDescription: z.string().trim().max(170).default(''),
  canonicalUrl: z.string().url().or(z.literal('')).default(''),
  keywords: z.array(z.string().trim().min(1).max(40)).default([]),
  ogImage: z.string().url().or(z.literal('')).default(''),
});

export const guideGameMetaSchema = z.object({
  missionName: z.string().trim().max(120).default(''),
  characterNames: z.array(z.string().trim().min(1).max(80)).default([]),
  locationNames: z.array(z.string().trim().min(1).max(80)).default([]),
  vehicleNames: z.array(z.string().trim().min(1).max(80)).default([]),
  weaponNames: z.array(z.string().trim().min(1).max(80)).default([]),
  platform: z.string().trim().max(80).default(''),
  gameVersion: z.string().trim().max(80).default(''),
});

export const createGuideBodySchema = z.object({
  title: z.string().trim().min(5).max(140),
  slug: z.string().trim().min(5).max(160).optional(),
  excerpt: z.string().trim().min(20).max(320),
  content: z.string().trim().min(20),
  sections: z.array(guideSectionSchema).default([]),
  faqs: z.array(guideFaqSchema).default([]),
  categoryId: mongoIdSchema.regex(/^[a-f\d]{24}$/i, 'Invalid categoryId'),
  tags: z.array(z.string().trim().min(1).max(40)).default([]),
  tagIds: z.array(z.string().trim().min(1).max(60)).default([]),
  type: z.enum(GUIDE_TYPE_VALUES),
  difficulty: z.enum(GUIDE_DIFFICULTY_VALUES),
  status: z.enum(GUIDE_STATUS_VALUES).default('draft'),
  visibility: z.enum(GUIDE_VISIBILITY_VALUES).default('public'),
  coverImage: z.string().url().or(z.literal('')).default(''),
  readTime: z.number().int().positive().default(1),
  isFeatured: z.boolean().default(false),
  seo: guideSeoSchema.default({}),
  gameMeta: guideGameMetaSchema.default({}),
});

export const createGuideSchema = z.object({
  body: createGuideBodySchema,
});

export const updateGuideSchema = z.object({
  params: mongoIdParamSchema,
  body: createGuideBodySchema.partial(),
});

export const getGuideByIdSchema = z.object({
  params: mongoIdParamSchema,
});

export const getGuideBySlugSchema = z.object({
  params: slugParamSchema,
});

export const listGuidesSchema = z.object({
  query: paginationSchema.extend({
    q: z.string().trim().max(120).optional(),
    categoryId: mongoIdSchema.regex(/^[a-f\d]{24}$/i, 'Invalid categoryId').optional(),
    categorySlug: z.string().trim().max(120).optional(),
    difficulty: z.enum(GUIDE_DIFFICULTY_VALUES).optional(),
    type: z.enum(GUIDE_TYPE_VALUES).optional(),
    status: z.enum(GUIDE_STATUS_VALUES).optional(),
    featured: z.enum(['true', 'false']).optional(),
    sort: z.enum(GUIDE_SORT_VALUES).default('latest'),
  }),
});
