import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { SEO } from '@/components/common';
import { CategoryDetail } from '@/features/categories';
import { ROUTES } from '@/constants/routes';
import { SITE_CONFIG } from '@/constants/site';
import { contentService, queryKeys } from '@/services';

export function CategoryDetailPage() {
  const { slug } = useParams();
  const categoryQuery = useQuery({
    queryKey: queryKeys.category(slug),
    queryFn: () => contentService.getCategoryBySlug(slug ?? ''),
    enabled: Boolean(slug),
  });
  const category = categoryQuery.data;

  const canonicalPath = category ? `${ROUTES.categories}/${category.slug}` : ROUTES.categories;
  // BreadcrumbList JSON-LD is emitted by the <Breadcrumbs /> component in
  // CategoryDetail, so we only emit CollectionPage here.
  const structuredData = category
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${category.title} Guides`,
          description: category.description,
          inLanguage: 'en-US',
          url: `${SITE_CONFIG.url}${canonicalPath}`,
          isPartOf: {
            '@type': 'WebSite',
            name: SITE_CONFIG.name,
            url: SITE_CONFIG.url,
          },
        },
      ]
    : undefined;

  return (
    <>
      <SEO
        title={category ? `${category.title} Guides` : 'Category'}
        description={category?.description}
        canonicalUrl={canonicalPath}
        structuredData={structuredData}
      />
      <CategoryDetail slug={slug} />
    </>
  );
}
