import { CategoryModel } from '@/models/Category.model.js';
import { GuideModel } from '@/models/Guide.model.js';
import { createPaginationMeta, getPagination } from '@gta6-guide/shared/pagination';

export async function searchGuides(query: unknown) {
  const { page, limit, skip } = getPagination(query);
  const parsedQuery = query as Record<string, unknown>;
  const searchTerm = typeof parsedQuery.q === 'string' ? parsedQuery.q.trim() : '';

  if (!searchTerm) {
    return {
      items: [],
      meta: createPaginationMeta(0, page, limit),
    };
  }

  const filter: Record<string, unknown> = {
    status: 'published',
    visibility: 'public',
    $text: { $search: searchTerm },
  };

  if (typeof parsedQuery.categoryId === 'string') {
    const category = await CategoryModel.findOne({ _id: parsedQuery.categoryId, isActive: true })
      .select('_id')
      .lean();

    if (!category) {
      return {
        items: [],
        meta: createPaginationMeta(0, page, limit),
      };
    }

    filter.categoryId = parsedQuery.categoryId;
  }

  if (typeof parsedQuery.difficulty === 'string') {
    filter.difficulty = parsedQuery.difficulty;
  }

  if (typeof parsedQuery.type === 'string') {
    filter.type = parsedQuery.type;
  }

  const [items, total] = await Promise.all([
    GuideModel.find(
      filter,
      { score: { $meta: 'textScore' } },
    )
      .populate('categoryId', 'title slug')
      .populate('authorId', 'name username avatar role')
      .sort({ score: { $meta: 'textScore' } })
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
