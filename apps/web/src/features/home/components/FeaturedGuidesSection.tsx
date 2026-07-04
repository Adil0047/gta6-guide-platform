import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

import { StaggerGroup, StaggerItem } from '@/components/animations';
import { GuideCard } from '@/components/cards';
import { ErrorState } from '@/components/feedback';
import { Container } from '@/components/ui/Container';
import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/constants/routes';
import { contentService, queryKeys } from '@/services';

export function FeaturedGuidesSection() {
  const guidesQuery = useQuery({
    queryKey: queryKeys.guides({ featured: 'true', limit: 6, sort: 'popular' }),
    queryFn: () => contentService.listGuides({ featured: 'true', limit: 6, sort: 'popular' }),
  });

  const featuredGuides = guidesQuery.data?.items ?? [];

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-cyan">
              Featured guides
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Start with the highest-impact guides.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary">
              Curated walkthroughs and systems loaded from the backend for fast learning, clean
              progression, and confident exploration.
            </p>
          </div>

          <Link
            to={ROUTES.guides}
            className="inline-flex items-center gap-2 rounded-full text-sm font-semibold text-neon-cyan transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View all guides
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>

        {guidesQuery.isLoading ? (
          <div className="mt-10 rounded-panel border border-white/10 bg-white/[0.04] p-8">
            <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
              <Spinner />
              Loading featured guides…
            </div>
          </div>
        ) : null}

        {guidesQuery.isError ? (
          <div className="mt-10">
            <ErrorState
              title="Could not load featured guides"
              description="The guides API did not return featured content successfully."
            />
          </div>
        ) : null}

        {!guidesQuery.isLoading && !guidesQuery.isError && featuredGuides.length > 0 ? (
          <StaggerGroup className="mt-10 grid gap-5 lg:grid-cols-3">
            {featuredGuides.map((guide) => (
              <StaggerItem key={guide.id}>
                <GuideCard
                  title={guide.title}
                  slug={guide.slug}
                  excerpt={guide.excerpt}
                  category={guide.categoryLabel}
                  readTime={guide.readTime}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : null}
      </Container>
    </section>
  );
}
