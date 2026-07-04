import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

import { StaggerGroup, StaggerItem } from '@/components/animations';
import { CategoryCard } from '@/components/cards';
import { ErrorState } from '@/components/feedback';
import { Container } from '@/components/ui/Container';
import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/constants/routes';
import { contentService, queryKeys } from '@/services';

export function CategoryPreviewSection() {
  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories({ isActive: 'true', limit: 4 }),
    queryFn: () => contentService.listCategories({ isActive: 'true', limit: 4 }),
  });

  const categories = categoriesQuery.data?.items ?? [];

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-pink">
              Browse by category
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Every system organized for fast discovery.
            </h2>
          </div>

          <Link
            to={ROUTES.categories}
            className="inline-flex items-center gap-2 rounded-full text-sm font-semibold text-neon-pink transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            All categories
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        {categoriesQuery.isLoading ? (
          <div className="mt-10 rounded-panel border border-white/10 bg-white/[0.04] p-8">
            <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
              <Spinner />
              Loading category preview…
            </div>
          </div>
        ) : null}

        {categoriesQuery.isError ? (
          <div className="mt-10">
            <ErrorState
              title="Could not load categories"
              description="The category API did not return preview content successfully."
            />
          </div>
        ) : null}

        {!categoriesQuery.isLoading && !categoriesQuery.isError && categories.length > 0 ? (
          <StaggerGroup className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <StaggerItem key={category.id}>
                <CategoryCard
                  title={category.title}
                  slug={category.slug}
                  description={category.description}
                  count={category.guideCount}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : null}
      </Container>
    </section>
  );
}
