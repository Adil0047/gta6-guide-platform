import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FolderTree, Trash2 } from 'lucide-react';

import { SEO } from '@/components/common';
import { ErrorState } from '@/components/feedback';
import { Container } from '@/components/ui/Container';
import { Spinner } from '@/components/ui/Spinner';
import { AdminPageHeader } from '@/features/admin';
import { adminService, queryKeys, type PaginatedResult } from '@/services';
import { type Category } from '@/types/content';

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const categoriesKey = queryKeys.categories({ limit: 50 });
  const categoriesQuery = useQuery({
    queryKey: categoriesKey,
    queryFn: adminService.listCategories,
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: adminService.deleteCategory,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: categoriesKey });
      const previousCategories = queryClient.getQueryData<PaginatedResult<Category>>(categoriesKey);

      queryClient.setQueryData<PaginatedResult<Category>>(categoriesKey, (current) =>
        current
          ? {
              ...current,
              items: current.items.filter((category) => category.id !== id),
              meta: current.meta ? { ...current.meta, total: Math.max(current.meta.total - 1, 0) } : current.meta,
            }
          : current,
      );

      return { previousCategories };
    },
    onError: (_error, _id, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(categoriesKey, context.previousCategories);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: categoriesKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminOverview });
    },
  });

  const categories = categoriesQuery.data?.items ?? [];

  return (
    <>
      <SEO title="Admin Categories" description="Manage GTA VI guide categories." />
      <main id="main-content" className="py-10 sm:py-12">
        <Container>
          <AdminPageHeader
            eyebrow="Taxonomy"
            title="Categories"
            description="Manage live guide categories, content grouping, guide counts, SEO descriptions, and category publishing settings."
          />

          {categoriesQuery.isLoading ? (
            <div className="mt-8 rounded-panel border border-white/10 bg-white/[0.04] p-8">
              <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
                <Spinner />
                Loading category records…
              </div>
            </div>
          ) : null}

          {categoriesQuery.isError ? (
            <div className="mt-8">
              <ErrorState
                title="Could not load categories"
                description="The category CRUD API did not return records successfully."
              />
            </div>
          ) : null}

          {!categoriesQuery.isLoading && !categoriesQuery.isError ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <article
                    key={category.id}
                    className="rounded-card border border-white/10 bg-white/[0.04] p-6 shadow-panel backdrop-blur-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid size-11 place-items-center rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan">
                        <Icon aria-hidden className="size-5" />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-text-muted">
                        {category.guideCount} guides
                      </span>
                    </div>
                    <h2 className="mt-5 text-xl font-black text-white">{category.title}</h2>
                    <p className="mt-3 text-sm leading-7 text-text-secondary">{category.description}</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full text-sm font-semibold text-neon-cyan transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        <FolderTree aria-hidden className="size-4" />
                        Edit category
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full text-sm font-semibold text-danger transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        onClick={() => {
                          deleteCategoryMutation.mutate(category.id);
                        }}
                        disabled={deleteCategoryMutation.isPending}
                      >
                        <Trash2 aria-hidden className="size-4" />
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </Container>
      </main>
    </>
  );
}
