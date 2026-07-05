import { type CreateCategoryDto, type UpdateCategoryDto } from '@gta6-guide/shared/dto';
import { createPaginationMeta, getPagination } from '@gta6-guide/shared/pagination';
import { createSlug } from '@gta6-guide/shared/slug';
import { StatusCodes } from 'http-status-codes';

import { CategoryModel } from '@/models/Category.model.js';
import { GuideModel } from '@/models/Guide.model.js';
import { AppError } from '@/utils/appError.js';
type CreateCategoryInput = CreateCategoryDto;

type UpdateCategoryInput = UpdateCategoryDto;


async function addGuideCounts<TCategory extends { _id?: unknown }>(categories: TCategory[], includeInactive = false) {
  const categoryIds = categories.map((category) => category._id).filter(Boolean);

  if (categoryIds.length === 0) {
    return categories.map((category) => ({ ...category, guideCount: 0 }));
  }

  const counts = await GuideModel.aggregate<{ _id: unknown; count: number }>([
    {
      $match: {
        categoryId: { $in: categoryIds },
        ...(includeInactive ? {} : { status: 'published', visibility: 'public' }),
      },
    },
    {
      $group: {
        _id: '$categoryId',
        count: { $sum: 1 },
      },
    },
  ]);

  const countByCategoryId = new Map(counts.map((item) => [String(item._id), item.count]));

  return categories.map((category) => ({
    ...category,
    guideCount: countByCategoryId.get(String(category._id)) ?? 0,
  }));
}

async function addGuideCount<TCategory extends { _id?: unknown }>(category: TCategory, includeInactive = false) {
  const [categoryWithCount] = await addGuideCounts([category], includeInactive);

  return categoryWithCount;
}
export async function listCategories(query: unknown, includeInactive = false) {
  const { page, limit, skip } = getPagination(query);
  const parsedQuery = query as {
    isActive?: string;
    q?: string;
  };

  const filter: Record<string, unknown> = {};

  if (!includeInactive) {
    filter.isActive = true;
  } else if (parsedQuery.isActive === 'true') {
    filter.isActive = true;
  } else if (parsedQuery.isActive === 'false') {
    filter.isActive = false;
  }

  if (parsedQuery.q) {
    filter.$text = { $search: parsedQuery.q };
  }

  const [items, total] = await Promise.all([
    CategoryModel.find(filter).sort({ order: 1, title: 1 }).skip(skip).limit(limit).lean(),
    CategoryModel.countDocuments(filter),
  ]);

  return {
    items: await addGuideCounts(items, includeInactive),
    meta: createPaginationMeta(total, page, limit),
  };
}

export async function getCategoryById(id: string, includeInactive = false) {
  const filter: Record<string, unknown> = { _id: id };

  if (!includeInactive) {
    filter.isActive = true;
  }

  const category = await CategoryModel.findOne(filter).lean();

  if (!category) {
    throw new AppError('Category not found', StatusCodes.NOT_FOUND);
  }

  return addGuideCount(category, includeInactive);
}

export async function getCategoryBySlug(slug: string, includeInactive = false) {
  const filter: Record<string, unknown> = { slug };

  if (!includeInactive) {
    filter.isActive = true;
  }

  const category = await CategoryModel.findOne(filter).lean();

  if (!category) {
    throw new AppError('Category not found', StatusCodes.NOT_FOUND);
  }

  return addGuideCount(category, includeInactive);
}

export async function createCategory(input: CreateCategoryInput) {
  const slug = input.slug ? createSlug(input.slug) : createSlug(input.title);

  const existingCategory = await CategoryModel.findOne({ slug }).lean();

  if (existingCategory) {
    throw new AppError('Category slug already exists', StatusCodes.CONFLICT);
  }

  const category = await CategoryModel.create({
    ...input,
    slug,
  });

  return addGuideCount(category.toObject());
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const payload = {
    ...input,
    ...(input.slug ? { slug: createSlug(input.slug) } : {}),
  };

  const category = await CategoryModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new AppError('Category not found', StatusCodes.NOT_FOUND);
  }

  return addGuideCount(category.toObject());
}

export async function deleteCategory(id: string) {
  const guideCount = await GuideModel.countDocuments({ categoryId: id });

  if (guideCount > 0) {
    throw new AppError('Cannot delete a category that has guides', StatusCodes.CONFLICT);
  }

  const category = await CategoryModel.findByIdAndDelete(id);

  if (!category) {
    throw new AppError('Category not found', StatusCodes.NOT_FOUND);
  }

  return addGuideCount(category.toObject(), true);
}
