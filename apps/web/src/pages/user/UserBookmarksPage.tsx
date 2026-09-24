import { SEO } from '@/components/common';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { UserBookmarkList } from '@/features/profile';

export function UserBookmarksPage() {
  return (
    <>
      <SEO
        title="Saved Guides"
        description="View saved GTA VI guides in your user dashboard."
        noIndex
      />
      <VisuallyHidden as="h1">Saved guides</VisuallyHidden>
      <UserBookmarkList />
    </>
  );
}
