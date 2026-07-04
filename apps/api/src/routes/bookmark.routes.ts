import { Router } from 'express';

import {
  createBookmarkController,
  deleteBookmarkController,
  getBookmarkStatusController,
  listBookmarksController,
} from '@/controllers/bookmark.controller.js';
import { requireAuth } from '@/middlewares/auth.middleware.js';
import { validate } from '@/middlewares/validate.middleware.js';
import {
  bookmarkGuideSchema,
  createBookmarkSchema,
  deleteBookmarkSchema,
  listBookmarksSchema,
} from '@/validators/bookmark.validators.js';

export const bookmarkRouter = Router();

bookmarkRouter.use(requireAuth);

bookmarkRouter.get('/', validate(listBookmarksSchema), listBookmarksController);
bookmarkRouter.get('/guide/:guideId', validate(bookmarkGuideSchema), getBookmarkStatusController);
bookmarkRouter.post('/', validate(createBookmarkSchema), createBookmarkController);
bookmarkRouter.delete('/:guideId', validate(deleteBookmarkSchema), deleteBookmarkController);
