export {
  mongoIdParamSchema,
  mongoIdSchema,
  paginationSchema,
  slugParamSchema,
  slugSchema,
} from './common.js';

export {
  changePasswordBodySchema,
  changePasswordSchema,
  loginBodySchema,
  loginSchema,
  registerBodySchema,
  registerSchema,
} from './auth.js';

export {
  categorySeoSchema,
  createCategoryBodySchema,
  createCategorySchema,
  getCategoryByIdSchema,
  getCategoryBySlugSchema,
  listCategoriesSchema,
  updateCategorySchema,
} from './category.js';

export {
  createGuideBodySchema,
  createGuideSchema,
  getGuideByIdSchema,
  getGuideBySlugSchema,
  guideFaqSchema,
  guideGameMetaSchema,
  guideSectionSchema,
  guideSeoSchema,
  listGuidesSchema,
  updateGuideSchema,
} from './guide.js';

export { searchSchema } from './search.js';

export {
  bookmarkGuideParamSchema,
  bookmarkGuideSchema,
  createBookmarkBodySchema,
  createBookmarkSchema,
  deleteBookmarkSchema,
  listBookmarksSchema,
} from './bookmark.js';

export {
  createCommentBodySchema,
  createCommentSchema,
  deleteCommentSchema,
  guideCommentsSchema,
  listCommentsSchema,
  updateCommentBodySchema,
  updateCommentSchema,
  updateCommentStatusBodySchema,
  updateCommentStatusSchema,
} from './comment.js';

export {
  listUsersSchema,
  updateProfileBodySchema,
  updateProfileSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  userPreferencesSchema,
} from './user.js';
