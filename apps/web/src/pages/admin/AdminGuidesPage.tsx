import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';

import { SEO } from '@/components/common';
import { ErrorState } from '@/components/feedback';
import { Container } from '@/components/ui/Container';
import { Spinner } from '@/components/ui/Spinner';
import { AdminPageHeader, AdminRecordTable } from '@/features/admin';
import { adminService, createGuideRecord, queryKeys, type PaginatedResult } from '@/services';
import { type Guide } from '@/types/content';

export function AdminGuidesPage() {
  const queryClient = useQueryClient();
  const guidesKey = queryKeys.guides({ limit: 50, sort: 'latest' });
  const guidesQuery = useQuery({
    queryKey: guidesKey,
    queryFn: adminService.listGuides,
  });

  const deleteGuideMutation = useMutation({
    mutationFn: adminService.deleteGuide,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: guidesKey });
      const previousGuides = queryClient.getQueryData<PaginatedResult<Guide>>(guidesKey);

      queryClient.setQueryData<PaginatedResult<Guide>>(guidesKey, (current) =>
        current
          ? {
              ...current,
              items: current.items.filter((guide) => guide.id !== id),
              meta: current.meta ? { ...current.meta, total: Math.max(current.meta.total - 1, 0) } : current.meta,
            }
          : current,
      );

      return { previousGuides };
    },
    onError: (_error, _id, context) => {
      if (context?.previousGuides) {
        queryClient.setQueryData(guidesKey, context.previousGuides);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: guidesKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminOverview });
    },
  });

  const records = (guidesQuery.data?.items ?? []).map(createGuideRecord);

  return (
    <>
      <SEO title="Admin Guides" description="Manage GTA VI guide content." />
      <main id="main-content" className="py-10 sm:py-12">
        <Container>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <AdminPageHeader
              eyebrow="Guide management"
              title="Guides"
              description="Review, update, publish, and monitor editorial guide content through backend CRUD APIs."
            />
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black shadow-[0_0_32px_rgba(255,60,172,0.22)] transition hover:bg-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Plus aria-hidden className="mr-2 size-4" />
              New guide
            </button>
          </div>

          <div className="mt-8">
            {guidesQuery.isLoading ? (
              <div className="rounded-panel border border-white/10 bg-white/[0.04] p-8">
                <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
                  <Spinner />
                  Loading guide records…
                </div>
              </div>
            ) : null}

            {guidesQuery.isError ? (
              <ErrorState
                title="Could not load guides"
                description="The guide CRUD API did not return records successfully."
              />
            ) : null}

            {!guidesQuery.isLoading && !guidesQuery.isError ? (
              <AdminRecordTable
                title="Guide records"
                records={records}
                actions={(record) => (
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-full border border-danger/20 bg-danger/10 px-3 text-xs font-semibold text-danger transition hover:bg-danger/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    onClick={() => {
                      deleteGuideMutation.mutate(record.id);
                    }}
                    disabled={deleteGuideMutation.isPending}
                  >
                    <Trash2 aria-hidden className="mr-2 size-4" />
                    Delete
                  </button>
                )}
              />
            ) : null}
          </div>
        </Container>
      </main>
    </>
  );
}
