import { SEO } from '@/components/common';
import { Container } from '@/components/ui/Container';
import { AdminPageHeader, AdminSeoPanel, AdminSettingsPanel } from '@/features/admin';

export function AdminSettingsPage() {
  return (
    <>
      <SEO title="Admin Settings" description="Configure GTA VI Guide Platform admin settings." noIndex />
      <main id="main-content" className="py-10 sm:py-12">
        <Container>
          <AdminPageHeader
            eyebrow="Settings"
            title="Platform configuration"
            description="Configure editorial defaults, moderation preferences, and review the live SEO configuration."
          />

          <div className="mt-8 space-y-8">
            <AdminSettingsPanel />
            <AdminSeoPanel />
          </div>
        </Container>
      </main>
    </>
  );
}
