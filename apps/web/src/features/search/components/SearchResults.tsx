import { useQuery } from '@tanstack/react-query';
import { SearchX } from 'lucide-react';
import { useSearchParams } from 'react-router';

import { GuideCard } from '@/components/cards';
import { EmptyState, ErrorState } from '@/components/feedback';
import { SearchForm } from '@/components/forms';
import { Spinner } from '@/components/ui/Spinner';
import { contentService, queryKeys } from '@/services';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const trimmedQuery = query.trim();
  const hasSearchTerm = trimmedQuery.length > 0;

  const searchQuery = useQuery({
    queryKey: queryKeys.search({ q: trimmedQuery, limit: 24 }),
    queryFn: () => contentService.searchGuides({ q: trimmedQuery, limit: 24 }),
    enabled: hasSearchTerm,
  });

  const results = searchQuery.data?.items ?? [];
  const totalResults = searchQuery.data?.meta?.total ?? results.length;

  return (
    <div>
      <div className="rounded-panel border border-white/10 bg-white/[0.04] p-4 shadow-panel backdrop-blur-xl">
        <SearchForm initialValue={query} />
      </div>

      <div className="mt-8">
        <p className="text-sm text-text-secondary">
          {hasSearchTerm ? (
            <>
              Showing <span className="font-bold text-white">{totalResults}</span> result
              {totalResults === 1 ? '' : 's'} for{' '}
              <span className="font-bold text-white">“{trimmedQuery}”</span>
            </>
          ) : (
            <>Search the live guide index by title, tags, content, difficulty, and type.</>
          )}
        </p>
      </div>

      {hasSearchTerm && searchQuery.isLoading ? (
        <div className="mt-6 rounded-panel border border-white/10 bg-white/[0.04] p-8">
          <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
            <Spinner />
            Searching live guide records…
          </div>
        </div>
      ) : null}

      {hasSearchTerm && searchQuery.isError ? (
        <div className="mt-6">
          <ErrorState
            title="Search failed"
            description="The search API did not respond successfully. Check the backend server and try again."
          />
        </div>
      ) : null}

      {hasSearchTerm && !searchQuery.isLoading && !searchQuery.isError && results.length > 0 ? (
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {results.map((guide) => (
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

      {hasSearchTerm && !searchQuery.isLoading && !searchQuery.isError && results.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<SearchX aria-hidden className="size-8" />}
            title="No results found"
            description="Try searching for missions, vehicles, map, money, beginner, weapons, secrets, or exploration."
          />
        </div>
      ) : null}
    </div>
  );
}
