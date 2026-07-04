import { type CreateGuideDto, type UpdateGuideDto } from '@gta6-guide/shared/dto';
import { createPaginationMeta, getPagination } from '@gta6-guide/shared/pagination';
import { createSlug } from '@gta6-guide/shared/slug';
import { StatusCodes } from 'http-status-codes';
import { type SortOrder } from 'mongoose';

import { CategoryModel } from '@/models/Category.model.js';
import { GuideModel } from '@/models/Guide.model.js';
import { AppError } from '@/utils/appError.js';
type CreateGuideInput = CreateGuideDto;

type UpdateGuideInput = UpdateGuideDto;

function createGuideFilter(query: Record<string, unknown>, includeDrafts = false) {
  const filter: Record<string, unknown> = {};

  if (!includeDrafts) {
    filter.status = 'published';
  }

  if (typeof query.status === 'string') {
    filter.status = query.status;
  }

  if (typeof query.categoryId === 'string') {
    filter.categoryId = query.categoryId;
  }

  if (typeof query.difficulty === 'string') {
    filter.difficulty = query.difficulty;
  }

  if (typeof query.type === 'string') {
    filter.type = query.type;
  }

  if (query.featured === 'true') {
    filter.isFeatured = true;
  }

  if (query.featured === 'false') {
    filter.isFeatured = false;
  }

  if (typeof query.q === 'string' && query.q.trim()) {
    filter.$text = { $search: query.q.trim() };
  }

  return filter;
}

function createSort(sort: unknown): Record<string, SortOrder> {
  if (sort === 'oldest') {
    return { publishedAt: 1, createdAt: 1 };
  }

  if (sort === 'popular') {
    return { 'metrics.viewCount': -1, publishedAt: -1 };
  }

  return { publishedAt: -1, createdAt: -1 };
}

export async function listGuides(query: unknown, includeDrafts = false) {
  const { page, limit, skip } = getPagination(query);
  const parsedQuery = query as Record<string, unknown>;

  const filter = createGuideFilter(parsedQuery, includeDrafts);

  if (typeof parsedQuery.categorySlug === 'string') {
    const category = await CategoryModel.findOne({ slug: parsedQuery.categorySlug })
      .select('_id')
      .lean();

    if (!category) {
      return {
        items: [],
        meta: createPaginationMeta(0, page, limit),
      };
    }

    filter.categoryId = category._id;
  }

  const [items, total] = await Promise.all([
    GuideModel.find(filter)
      .populate('categoryId', 'title slug')
      .populate('authorId', 'name username avatar role')
      .sort(createSort(parsedQuery.sort))
      .skip(skip)
      .limit(limit)
      .lean(),
    GuideModel.countDocuments(filter),
  ]);

  return {
    items,
    meta: createPaginationMeta(total, page, limit),
  };
}

export async function getGuideById(id: string, includeDrafts = false) {
  const filter: Record<string, unknown> = { _id: id };

  if (!includeDrafts) {
    filter.status = 'published';
  }

  const guide = await GuideModel.findOne(filter)
    .populate('categoryId', 'title slug')
    .populate('authorId', 'name username avatar role')
    .lean();

  if (!guide) {
    throw new AppError('Guide not found', StatusCodes.NOT_FOUND);
  }

  return guide;
}

export async function getGuideBySlug(slug: string, includeDrafts = false) {
  const filter: Record<string, unknown> = { slug };

  if (!includeDrafts) {
    filter.status = 'published';
  }

  const guide = await GuideModel.findOne(filter)
    .populate('categoryId', 'title slug')
    .populate('authorId', 'name username avatar role')
    .lean();

  if (!guide) {
    throw new AppError('Guide not found', StatusCodes.NOT_FOUND);
  }

  return guide;
}

export async function createGuide(input: CreateGuideInput, authorId: string) {
  const category = await CategoryModel.findById(input.categoryId).lean();

  if (!category) {
    throw new AppError('Category not found', StatusCodes.BAD_REQUEST);
  }

  const slug = input.slug ? createSlug(input.slug) : createSlug(input.title);

  const existingGuide = await GuideModel.findOne({ slug }).lean();

  if (existingGuide) {
    throw new AppError('Guide slug already exists', StatusCodes.CONFLICT);
  }

  return GuideModel.create({
    ...input,
    slug,
    authorId,
    publishedAt: input.status === 'published' ? new Date() : undefined,
  });
}

export async function updateGuide(id: string, input: UpdateGuideInput) {
  const currentGuide = await GuideModel.findById(id);

  if (!currentGuide) {
    throw new AppError('Guide not found', StatusCodes.NOT_FOUND);
  }

  const payload = {
    ...input,
    ...(input.slug ? { slug: createSlug(input.slug) } : {}),
    ...(input.status === 'published' && !currentGuide.publishedAt
      ? { publishedAt: new Date() }
      : {}),
  };

  const guide = await GuideModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!guide) {
    throw new AppError('Guide not found', StatusCodes.NOT_FOUND);
  }

  return guide;
}

export async function deleteGuide(id: string) {
  const guide = await GuideModel.findByIdAndDelete(id);

  if (!guide) {
    throw new AppError('Guide not found', StatusCodes.NOT_FOUND);
  }

  return guide;
}

export async function incrementGuideView(slug: string) {
  await GuideModel.findOneAndUpdate(
    { slug, status: 'published' },
    {
      $inc: {
        'metrics.viewCount': 1,
      },
    },
  );
}
