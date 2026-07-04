import { useQuery } from '@tanstack/react-query';
import { BookOpen, SearchX } from 'lucide-react';
import { useState } from 'react';

import { GuideCard } from '@/components/cards';
import { SectionHeader } from '@/components/common';
import { EmptyState, ErrorState } from '@/components/feedback';
import { SearchForm } from '@/components/forms';
import { Spinner } from '@/components/ui/Spinner';
import { contentService, queryKeys } from '@/services';

import { GuideFilterPanel, type GuideFilterState } from './GuideFilterPanel';

export function GuideListing() {
  const [filters, setFilters] = useState<GuideFilterState>({
    category: '',
    difficulty: '',
    type: '',
  });

  const guideParams = {
    categorySlug: filters.category || undefined,
    difficulty: filters.difficulty || undefined,
    type: filters.type || undefined,
    limit: 24,
  };

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories({ isActive: 'true', limit: 50 }),
    queryFn: () => contentService.listCategories({ isActive: 'true', limit: 50 }),
  });

  const guidesQuery = useQuery({
    queryKey: queryKeys.guides(guideParams),
    queryFn: () => contentService.listGuides(guideParams),
  });

  const guides = guidesQuery.data?.items ?? [];
  const categories = categoriesQuery.data?.items ?? [];
  const totalGuides = guidesQuery.data?.meta?.total ?? guides.length;

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <GuideFilterPanel categories={categories} value={filters} onChange={setFilters} />

      <div>
        <div className="rounded-panel border border-white/10 bg-white/[0.04] p-4 shadow-panel backdrop-blur-xl">
          <SearchForm />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-text-secondary">
            Showing <span className="font-bold text-white">{guides.length}</span> of{' '}
            <span className="font-bold text-white">{totalGuides}</span> live guides
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            <BookOpen aria-hidden className="size-4 text-neon-cyan" />
            Backend library
          </span>
        </div>

        {guidesQuery.isLoading || categoriesQuery.isLoading ? (
          <div className="mt-6 rounded-panel border border-white/10 bg-white/[0.04] p-8">
            <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
              <Spinner />
              Loading live guide records…
            </div>
          </div>
        ) : null}

        {guidesQuery.isError || categoriesQuery.isError ? (
          <div className="mt-6">
            <ErrorState
              title="Could not load guides"
              description="The guide library API did not respond successfully. Check the backend server and try again."
            />
          </div>
        ) : null}

        {!guidesQuery.isLoading && !guidesQuery.isError && guides.length > 0 ? (
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
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

        {!guidesQuery.isLoading && !guidesQuery.isError && guides.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<SearchX aria-hidden className="size-8" />}
              title="No guides match your filters"
              description="Adjust your category, difficulty, or guide type to discover more GTA VI content."
            />
          </div>
        ) : null}

        {!categoriesQuery.isLoading && !categoriesQuery.isError && categories.length === 0 ? (
          <div className="mt-6">
            <SectionHeader
              eyebrow="Taxonomy"
              title="No live categories yet"
              description="Create categories from the admin area to enable category filtering."
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
