import { SEO } from '@/components/common';
import { Container } from '@/components/ui/Container';
import { AdminPageHeader, AdminSettingsPanel } from '@/features/admin';

export function AdminSettingsPage() {
  return (
    <>
      <SEO title="Admin Settings" description="Configure GTA VI Guide Platform admin settings." />
      <main id="main-content" className="py-10 sm:py-12">
        <Container>
          <AdminPageHeader
            eyebrow="Settings"
            title="Platform configuration"
            description="Configure editorial defaults, moderation preferences, SEO indexing, and future admin-level controls."
          />

          <div className="mt-8">
            <AdminSettingsPanel />
          </div>
        </Container>
      </main>
    </>
  );
}
