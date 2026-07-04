import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { SEO } from '@/components/common';
import { CategoryDetail } from '@/features/categories';
import { contentService, queryKeys } from '@/services';

export function CategoryDetailPage() {
  const { slug } = useParams();
  const categoryQuery = useQuery({
    queryKey: queryKeys.category(slug),
    queryFn: () => contentService.getCategoryBySlug(slug ?? ''),
    enabled: Boolean(slug),
  });
  const category = categoryQuery.data;

  return (
    <>
      <SEO
        title={category ? `${category.title} Guides` : 'Category'}
        description={category?.description}
      />
      <CategoryDetail slug={slug} />
    </>
  );
}
