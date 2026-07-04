import { SEO } from '@/components/common';
import { UserOverview } from '@/features/profile';

export function UserDashboardPage() {
  return (
    <>
      <SEO title="User Dashboard" description="Manage your GTA VI guide bookmarks, comments, map saves, and profile activity." />
      <UserOverview />
    </>
  );
}
