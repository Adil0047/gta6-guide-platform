import { SEO } from '@/components/common';
import { UserCommentList } from '@/features/profile';

export function UserCommentsPage() {
  return (
    <>
      <SEO title="Your Comments" description="View your GTA VI Guide Platform comments and discussion activity." />
      <UserCommentList />
    </>
  );
}
