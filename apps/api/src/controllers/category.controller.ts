import { isAdminRole } from '@gta6-guide/shared/roles';
import { StatusCodes } from 'http-status-codes';

import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategoryBySlug,
  listCategories,
  updateCategory,
} from '@/services/category.service.js';
import { createAuditLog } from '@/services/audit.service.js';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { sendResponse } from '@/utils/apiResponse.js';
import { getRouteParam } from '@/utils/routeParams.js';

function canSeeInactiveCategories(request: { user?: { role: Parameters<typeof isAdminRole>[0] } }) {
  return Boolean(request.user && isAdminRole(request.user.role));
}

export const listCategoriesController = asyncHandler(async (request, response) => {
  const result = await listCategories(request.query, canSeeInactiveCategories(request));

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Categories retrieved successfully',
    data: result.items,
    meta: result.meta,
  });
});

export const getCategoryByIdController = asyncHandler(async (request, response) => {
  const category = await getCategoryById(getRouteParam(request.params, 'id'), canSeeInactiveCategories(request));

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Category retrieved successfully',
    data: category,
  });
});

export const getCategoryBySlugController = asyncHandler(async (request, response) => {
  const category = await getCategoryBySlug(getRouteParam(request.params, 'slug'), canSeeInactiveCategories(request));

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Category retrieved successfully',
    data: category,
  });
});

export const createCategoryController = asyncHandler(async (request, response) => {
  const category = await createCategory(request.body);

  await createAuditLog({
    actorId: request.user!.id,
    action: 'category.create',
    resourceType: 'category',
    resourceId: String(category._id),
    metadata: { slug: category.slug, isActive: category.isActive },
    ip: request.ip,
    userAgent: request.get('user-agent') ?? '',
  });

  sendResponse({
    response,
    statusCode: StatusCodes.CREATED,
    message: 'Category created successfully',
    data: category,
  });
});

export const updateCategoryController = asyncHandler(async (request, response) => {
  const category = await updateCategory(getRouteParam(request.params, 'id'), request.body);

  await createAuditLog({
    actorId: request.user!.id,
    action: 'category.update',
    resourceType: 'category',
    resourceId: String(category._id),
    metadata: { updatedFields: Object.keys(request.body as Record<string, unknown>) },
    ip: request.ip,
    userAgent: request.get('user-agent') ?? '',
  });

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Category updated successfully',
    data: category,
  });
});

export const deleteCategoryController = asyncHandler(async (request, response) => {
  const category = await deleteCategory(getRouteParam(request.params, 'id'));

  await createAuditLog({
    actorId: request.user!.id,
    action: 'category.delete',
    resourceType: 'category',
    resourceId: String(category._id),
    metadata: { slug: category.slug },
    ip: request.ip,
    userAgent: request.get('user-agent') ?? '',
  });

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Category deleted successfully',
    data: category,
  });
});
