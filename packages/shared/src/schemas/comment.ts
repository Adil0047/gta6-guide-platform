import { z } from 'zod';

import { COMMENT_STATUS_VALUES } from '../constants/community.js';
import { mongoIdParamSchema, mongoIdSchema, paginationSchema } from './common.js';

export const createCommentBodySchema = z.object({
  guideId: mongoIdSchema,
  body: z.string().trim().min(2).max(1200),
  parentId: mongoIdSchema.optional(),
});

export const createCommentSchema = z.object({
  body: createCommentBodySchema,
});

export const updateCommentBodySchema = z.object({
  body: z.string().trim().min(2).max(1200),
});

export const updateCommentSchema = z.object({
  params: mongoIdParamSchema,
  body: updateCommentBodySchema,
});

export const updateCommentStatusBodySchema = z.object({
  status: z.enum(COMMENT_STATUS_VALUES),
});

export const updateCommentStatusSchema = z.object({
  params: mongoIdParamSchema,
  body: updateCommentStatusBodySchema,
});

export const listCommentsSchema = z.object({
  query: paginationSchema.extend({
    guideId: mongoIdSchema.optional(),
    status: z.enum(COMMENT_STATUS_VALUES).optional(),
  }),
});

export const guideCommentsSchema = z.object({
  params: z.object({
    guideId: mongoIdSchema,
  }),
  query: paginationSchema,
});

export const deleteCommentSchema = z.object({
  params: mongoIdParamSchema,
});
