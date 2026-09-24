import { SEO } from '@/components/common';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { UserOverview } from '@/features/profile';

export function UserDashboardPage() {
  return (
    <>
      <SEO
        title="User Dashboard"
        description="Manage your GTA VI guide bookmarks, comments, map saves, and profile activity."
        noIndex
      />
      <VisuallyHidden as="h1">User dashboard</VisuallyHidden>
      <UserOverview />
    </>
  );
}
