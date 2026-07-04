import { StatusCodes } from 'http-status-codes';

import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategoryBySlug,
  listCategories,
  updateCategory,
} from '@/services/category.service.js';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { sendResponse } from '@/utils/apiResponse.js';
import { getRouteParam } from '@/utils/routeParams.js';

export const listCategoriesController = asyncHandler(async (request, response) => {
  const result = await listCategories(request.query);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Categories retrieved successfully',
    data: result.items,
    meta: result.meta,
  });
});

export const getCategoryByIdController = asyncHandler(async (request, response) => {
  const category = await getCategoryById(getRouteParam(request.params, 'id'));

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Category retrieved successfully',
    data: category,
  });
});

export const getCategoryBySlugController = asyncHandler(async (request, response) => {
  const category = await getCategoryBySlug(getRouteParam(request.params, 'slug'));

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Category retrieved successfully',
    data: category,
  });
});

export const createCategoryController = asyncHandler(async (request, response) => {
  const category = await createCategory(request.body);

  sendResponse({
    response,
    statusCode: StatusCodes.CREATED,
    message: 'Category created successfully',
    data: category,
  });
});

export const updateCategoryController = asyncHandler(async (request, response) => {
  const category = await updateCategory(getRouteParam(request.params, 'id'), request.body);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Category updated successfully',
    data: category,
  });
});

export const deleteCategoryController = asyncHandler(async (request, response) => {
  const category = await deleteCategory(getRouteParam(request.params, 'id'));

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Category deleted successfully',
    data: category,
  });
});
