import { Link } from 'react-router';

import { SEO } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { AuthCard, ForgotPasswordForm } from '@/features/auth';

export function ForgotPasswordPage() {
  return (
    <>
      <SEO title="Forgot Password" description="Request a GTA VI Guide Platform password reset." />
      <AuthCard
        eyebrow="Password reset"
        title="Recover access"
        description="Enter your account email and the backend will later send a secure password reset link."
        footer={
          <>
            Remember your password?{' '}
            <Link
              to={ROUTES.login}
              className="font-semibold text-neon-cyan transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Sign in
            </Link>
          </>
        }
      >
        <ForgotPasswordForm />
      </AuthCard>
    </>
  );
}
