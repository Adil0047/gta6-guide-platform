import { z } from 'zod';

import { mongoIdSchema, paginationSchema } from './common.js';

export const createBookmarkBodySchema = z.object({
  guideId: mongoIdSchema,
});

export const createBookmarkSchema = z.object({
  body: createBookmarkBodySchema,
});

export const bookmarkGuideParamSchema = z.object({
  guideId: mongoIdSchema,
});

export const bookmarkGuideSchema = z.object({
  params: bookmarkGuideParamSchema,
});

export const listBookmarksSchema = z.object({
  query: paginationSchema,
});

export const deleteBookmarkSchema = z.object({
  params: bookmarkGuideParamSchema,
});
