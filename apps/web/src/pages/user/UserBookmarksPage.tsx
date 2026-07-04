import { SEO } from '@/components/common';
import { UserBookmarkList } from '@/features/profile';

export function UserBookmarksPage() {
  return (
    <>
      <SEO title="Saved Guides" description="View saved GTA VI guides in your user dashboard." />
      <UserBookmarkList />
    </>
  );
}
