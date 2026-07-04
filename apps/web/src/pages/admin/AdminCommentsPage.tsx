import { SEO } from '@/components/common';
import { Container } from '@/components/ui/Container';
import { AdminCommentModeration, AdminPageHeader } from '@/features/admin';

export function AdminCommentsPage() {
  return (
    <>
      <SEO title="Admin Comments" description="Moderate GTA VI Guide Platform comments." />
      <main id="main-content" className="py-10 sm:py-12">
        <Container>
          <AdminPageHeader
            eyebrow="Moderation"
            title="Comments"
            description="Review comments, approve helpful discussions, and keep guide pages high quality."
          />

          <div className="mt-8">
            <AdminCommentModeration />
          </div>
        </Container>
      </main>
    </>
  );
}
