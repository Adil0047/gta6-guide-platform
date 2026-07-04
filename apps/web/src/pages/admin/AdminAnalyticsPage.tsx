import { useQuery } from '@tanstack/react-query';

import { SEO } from '@/components/common';
import { ErrorState } from '@/components/feedback';
import { Container } from '@/components/ui/Container';
import { Spinner } from '@/components/ui/Spinner';
import { AdminAnalyticsPanel, AdminPageHeader, AdminStatGrid } from '@/features/admin';
import { adminService, createAnalyticsStats, queryKeys } from '@/services';

export function AdminAnalyticsPage() {
  const overviewQuery = useQuery({
    queryKey: queryKeys.adminOverview,
    queryFn: adminService.getOverview,
  });

  const stats = overviewQuery.data ? createAnalyticsStats(overviewQuery.data.stats) : [];

  return (
    <>
      <SEO title="Admin Analytics" description="View GTA VI Guide Platform analytics." />
      <main id="main-content" className="py-10 sm:py-12">
        <Container>
          <AdminPageHeader
            eyebrow="Analytics"
            title="Content performance"
            description="Track live guide, category, and user signals available from the current backend overview API."
          />

          {overviewQuery.isLoading ? (
            <div className="mt-8 rounded-panel border border-white/10 bg-white/[0.04] p-8">
              <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
                <Spinner />
                Loading analytics overview…
              </div>
            </div>
          ) : null}

          {overviewQuery.isError ? (
            <div className="mt-8">
              <ErrorState
                title="Could not load analytics"
                description="The admin overview API did not return analytics-ready records successfully."
              />
            </div>
          ) : null}

          {stats.length > 0 ? (
            <div className="mt-8">
              <AdminStatGrid stats={stats} />
            </div>
          ) : null}

          {overviewQuery.data ? (
            <div className="mt-8">
              <AdminAnalyticsPanel stats={overviewQuery.data.stats} />
            </div>
          ) : null}
        </Container>
      </main>
    </>
  );
}
