import { Router } from 'express';

import { adminRouter } from './admin.routes.js';
import { authRouter } from './auth.routes.js';
import { bookmarkRouter } from './bookmark.routes.js';
import { commentRouter } from './comment.routes.js';
import { categoryRouter } from './category.routes.js';
import { guideRouter } from './guide.routes.js';
import { healthRouter } from './health.routes.js';
import { searchRouter } from './search.routes.js';
import { userRouter } from './user.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/bookmarks', bookmarkRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/guides', guideRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/search', searchRouter);
apiRouter.use('/admin', adminRouter);
