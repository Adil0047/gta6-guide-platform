import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router';

import { GuideCard } from '@/components/cards';
import { EmptyState, ErrorState } from '@/components/feedback';
import { Breadcrumbs } from '@/components/navigation';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/constants/routes';
import { contentService, queryKeys } from '@/services';

import { type Category } from '@/types/content';

type CategoryDetailProps = {
  slug: string | undefined;
};

function CategoryHero({ category }: { category: Category }) {
  const Icon = category.icon;

  return (
    <Card className="mt-8 overflow-hidden p-6 sm:p-8 lg:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl">
          <Badge variant={category.accent}>{category.title}</Badge>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            {category.title} guides
          </h1>
          <p className="mt-5 text-base leading-8 text-text-secondary">{category.description}</p>
        </div>

        <div className="grid size-16 shrink-0 place-items-center rounded-3xl border border-white/10 bg-white/[0.06] text-neon-cyan">
          <Icon aria-hidden className="size-8" />
        </div>
      </div>
    </Card>
  );
}

export function CategoryDetail({ slug }: CategoryDetailProps) {
  const categoryQuery = useQuery({
    queryKey: queryKeys.category(slug),
    queryFn: () => contentService.getCategoryBySlug(slug ?? ''),
    enabled: Boolean(slug),
  });

  const guidesQuery = useQuery({
    queryKey: queryKeys.guides({ categorySlug: slug, limit: 24 }),
    queryFn: () => contentService.listGuides({ categorySlug: slug, limit: 24 }),
    enabled: Boolean(slug),
  });

  if (!slug) {
    return <Navigate to={ROUTES.categories} replace />;
  }

  if (categoryQuery.isLoading || guidesQuery.isLoading) {
    return (
      <main id="main-content" className="py-14 sm:py-20">
        <Container>
          <div className="rounded-panel border border-white/10 bg-white/[0.04] p-8">
            <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
              <Spinner />
              Loading live category data…
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (categoryQuery.isError) {
    return (
      <main id="main-content" className="py-14 sm:py-20">
        <Container>
          <ErrorState
            title="Category not found"
            description="The category API did not return this slug. Return to categories and select another topic."
          />
        </Container>
      </main>
    );
  }

  const category = categoryQuery.data;
  const guides = guidesQuery.data?.items ?? [];

  if (!category) {
    return <Navigate to={ROUTES.categories} replace />;
  }

  return (
    <main id="main-content" className="py-14 sm:py-20">
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: ROUTES.home },
            { label: 'Categories', href: ROUTES.categories },
            { label: category.title },
          ]}
        />

        <CategoryHero category={category} />

        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-black tracking-tight text-white">Guides in this category</h2>
            <p className="text-sm text-text-secondary">
              <span className="font-bold text-white">{guides.length}</span> live guides available
            </p>
          </div>

          {guidesQuery.isError ? (
            <div className="mt-6">
              <ErrorState
                title="Could not load guides"
                description="The guides API did not respond successfully for this category."
              />
            </div>
          ) : null}

          {!guidesQuery.isError && guides.length > 0 ? (
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {guides.map((guide) => (
                <GuideCard
                  key={guide.id}
                  title={guide.title}
                  slug={guide.slug}
                  excerpt={guide.excerpt}
                  category={guide.categoryLabel}
                  readTime={guide.readTime}
                />
              ))}
            </div>
          ) : null}

          {!guidesQuery.isError && guides.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No guides in this category yet"
                description="Publish guide records in this category to populate this live listing."
              />
            </div>
          ) : null}
        </div>
      </Container>
    </main>
  );
}
