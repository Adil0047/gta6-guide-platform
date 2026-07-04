import { Link } from 'react-router';

import { SEO } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { AuthCard, ResetPasswordForm } from '@/features/auth';

export function ResetPasswordPage() {
  return (
    <>
      <SEO title="Reset Password" description="Reset your GTA VI Guide Platform password." />
      <AuthCard
        eyebrow="Secure reset"
        title="Choose a new password"
        description="Set a new password for your account. This interface is ready for backend reset token validation."
        footer={
          <>
            Back to{' '}
            <Link
              to={ROUTES.login}
              className="font-semibold text-neon-cyan transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              sign in
            </Link>
          </>
        }
      >
        <ResetPasswordForm />
      </AuthCard>
    </>
  );
}
