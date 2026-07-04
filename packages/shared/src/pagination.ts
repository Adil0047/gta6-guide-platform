import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;

export type PaginationParams = PaginationQuery & {
  skip: number;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedResult<TItem> = {
  items: TItem[];
  meta: PaginationMeta;
};

export function getPagination(query: unknown): PaginationParams {
  const { page, limit } = paginationSchema.parse(query);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export function createPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
