import { useQuery } from '@tanstack/react-query';

import { SEO } from '@/components/common';
import { ErrorState } from '@/components/feedback';
import { Container } from '@/components/ui/Container';
import { Spinner } from '@/components/ui/Spinner';
import {
  AdminPageHeader,
  AdminRecordTable,
  AdminStatGrid,
} from '@/features/admin';
import { adminService, createAdminStats, createGuideRecord, queryKeys } from '@/services';

export function AdminDashboardPage() {
  const overviewQuery = useQuery({
    queryKey: queryKeys.adminOverview,
    queryFn: adminService.getOverview,
  });
  const guidesQuery = useQuery({
    queryKey: queryKeys.guides({ limit: 5, sort: 'latest' }),
    queryFn: adminService.listGuides,
  });

  const stats = overviewQuery.data ? createAdminStats(overviewQuery.data.stats) : [];
  const records = (guidesQuery.data?.items ?? []).map(createGuideRecord);

  return (
    <>
      <SEO title="Admin Dashboard" description="Admin overview for GTA VI Guide Platform." />
      <main id="main-content" className="py-10 sm:py-12">
        <Container>
          <AdminPageHeader
            eyebrow="Admin dashboard"
            title="Editorial control center"
            description="Manage live backend content quality, publishing readiness, users, comments, and platform configuration."
          />

          {overviewQuery.isLoading ? (
            <div className="mt-8 rounded-panel border border-white/10 bg-white/[0.04] p-8">
              <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
                <Spinner />
                Loading admin overview…
              </div>
            </div>
          ) : null}

          {overviewQuery.isError ? (
            <div className="mt-8">
              <ErrorState
                title="Could not load admin overview"
                description="The admin overview API did not respond successfully. Check your admin session and backend server."
              />
            </div>
          ) : null}

          {stats.length > 0 ? (
            <div className="mt-8">
              <AdminStatGrid stats={stats} />
            </div>
          ) : null}

          <div className="mt-8">
            {guidesQuery.isLoading ? (
              <div className="rounded-panel border border-white/10 bg-white/[0.04] p-8">
                <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
                  <Spinner />
                  Loading recent guide records…
                </div>
              </div>
            ) : null}
            {guidesQuery.isError ? (
              <ErrorState
                title="Could not load recent guides"
                description="The guides API did not return recent records successfully."
              />
            ) : null}
            {!guidesQuery.isLoading && !guidesQuery.isError ? (
              <AdminRecordTable title="Recent guide activity" records={records} />
            ) : null}
          </div>
        </Container>
      </main>
    </>
  );
}
