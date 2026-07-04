import { useQuery } from '@tanstack/react-query';
import { FolderTree } from 'lucide-react';

import { StaggerGroup, StaggerItem } from '@/components/animations';
import { CategoryCard } from '@/components/cards';
import { EmptyState, ErrorState } from '@/components/feedback';
import { Spinner } from '@/components/ui/Spinner';
import { contentService, queryKeys } from '@/services';

export function CategoryHeroGrid() {
  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories({ isActive: 'true', limit: 50 }),
    queryFn: () => contentService.listCategories({ isActive: 'true', limit: 50 }),
  });

  const categories = categoriesQuery.data?.items ?? [];

  if (categoriesQuery.isLoading) {
    return (
      <div className="rounded-panel border border-white/10 bg-white/[0.04] p-8">
        <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
          <Spinner />
          Loading live category records…
        </div>
      </div>
    );
  }

  if (categoriesQuery.isError) {
    return (
      <ErrorState
        title="Could not load categories"
        description="The categories API did not respond successfully. Check the backend server and try again."
      />
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={<FolderTree aria-hidden className="size-8" />}
        title="No categories published yet"
        description="Create live categories from the admin area to populate this taxonomy grid."
      />
    );
  }

  return (
    <StaggerGroup className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
  );
}
