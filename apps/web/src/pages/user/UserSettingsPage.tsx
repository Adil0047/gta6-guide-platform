import { SEO } from '@/components/common';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { UserSettingsForm } from '@/features/profile';

export function UserSettingsPage() {
  return (
    <>
      <SEO
        title="Profile Settings"
        description="Manage GTA VI Guide Platform profile settings."
        noIndex
      />
      <VisuallyHidden as="h1">Profile settings</VisuallyHidden>
      <UserSettingsForm />
    </>
  );
}
