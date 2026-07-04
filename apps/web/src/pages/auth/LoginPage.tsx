import { Link } from 'react-router';

import { SEO } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { AuthCard, LoginForm } from '@/features/auth';

export function LoginPage() {
  return (
    <>
      <SEO title="Sign In" description="Sign in to your GTA VI Guide Platform account." />
      <AuthCard
        eyebrow="Account"
        title="Sign in"
        description="Access your saved guides, map locations, comments, profile settings, and future premium features."
        footer={
          <>
            New to the platform?{' '}
            <Link
              to={ROUTES.register}
              className="font-semibold text-neon-cyan transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Create an account
            </Link>
          </>
        }
      >
        <LoginForm />
      </AuthCard>
    </>
  );
}
