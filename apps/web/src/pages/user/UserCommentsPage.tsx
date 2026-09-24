import { SEO } from '@/components/common';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { UserCommentList } from '@/features/profile';

export function UserCommentsPage() {
  return (
    <>
      <SEO
        title="Your Comments"
        description="View your GTA VI Guide Platform comments and discussion activity."
        noIndex
      />
      <VisuallyHidden as="h1">Your comments</VisuallyHidden>
      <UserCommentList />
    </>
  );
}
