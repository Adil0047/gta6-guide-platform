import { Router } from 'express';

import { searchController } from '@/controllers/search.controller.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { searchSchema } from '@/validators/search.validators.js';

export const searchRouter = Router();

searchRouter.get('/', validate(searchSchema), searchController);
