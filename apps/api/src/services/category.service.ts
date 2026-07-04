import { type CreateCategoryDto, type UpdateCategoryDto } from '@gta6-guide/shared/dto';
import { createPaginationMeta, getPagination } from '@gta6-guide/shared/pagination';
import { createSlug } from '@gta6-guide/shared/slug';
import { StatusCodes } from 'http-status-codes';

import { CategoryModel } from '@/models/Category.model.js';
import { GuideModel } from '@/models/Guide.model.js';
import { AppError } from '@/utils/appError.js';
type CreateCategoryInput = CreateCategoryDto;

type UpdateCategoryInput = UpdateCategoryDto;


async function addGuideCounts<TCategory extends { _id?: unknown }>(categories: TCategory[]) {
  const categoryIds = categories.map((category) => category._id).filter(Boolean);

  if (categoryIds.length === 0) {
    return categories.map((category) => ({ ...category, guideCount: 0 }));
  }

  const counts = await GuideModel.aggregate<{ _id: unknown; count: number }>([
    {
      $match: {
        categoryId: { $in: categoryIds },
        status: 'published',
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

async function addGuideCount<TCategory extends { _id?: unknown }>(category: TCategory) {
  const [categoryWithCount] = await addGuideCounts([category]);

  return categoryWithCount;
}
export async function listCategories(query: unknown) {
  const { page, limit, skip } = getPagination(query);
  const parsedQuery = query as {
    isActive?: string;
    q?: string;
  };

  const filter: Record<string, unknown> = {};

  if (parsedQuery.isActive === 'true') {
    filter.isActive = true;
  }

  if (parsedQuery.isActive === 'false') {
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
    items: await addGuideCounts(items),
    meta: createPaginationMeta(total, page, limit),
  };
}

export async function getCategoryById(id: string) {
  const category = await CategoryModel.findById(id).lean();

  if (!category) {
    throw new AppError('Category not found', StatusCodes.NOT_FOUND);
  }

  return addGuideCount(category);
}

export async function getCategoryBySlug(slug: string) {
  const category = await CategoryModel.findOne({ slug }).lean();

  if (!category) {
    throw new AppError('Category not found', StatusCodes.NOT_FOUND);
  }

  return addGuideCount(category);
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
  const category = await CategoryModel.findByIdAndDelete(id);

  if (!category) {
    throw new AppError('Category not found', StatusCodes.NOT_FOUND);
  }

  return addGuideCount(category.toObject());
}
