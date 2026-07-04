import { SEO } from '@/components/common';
import { UserSettingsForm } from '@/features/profile';

export function UserSettingsPage() {
  return (
    <>
      <SEO title="Profile Settings" description="Manage GTA VI Guide Platform profile settings." />
      <UserSettingsForm />
    </>
  );
}
