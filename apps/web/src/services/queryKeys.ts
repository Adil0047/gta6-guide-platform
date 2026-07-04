export const queryKeys = {
  adminOverview: ['admin', 'overview'] as const,
  categories: (params?: Record<string, unknown>) => ['categories', params ?? {}] as const,
  category: (slug: string | undefined) => ['categories', 'slug', slug ?? ''] as const,
  guides: (params?: Record<string, unknown>) => ['guides', params ?? {}] as const,
  guide: (slug: string | undefined) => ['guides', 'slug', slug ?? ''] as const,
  search: (params?: Record<string, unknown>) => ['search', params ?? {}] as const,
  users: (params?: Record<string, unknown>) => ['users', params ?? {}] as const,
  me: ['users', 'me'] as const,
};
