import { Link } from 'react-router';

import { SEO } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { AuthCard, RegisterForm } from '@/features/auth';

export function RegisterPage() {
  return (
    <>
      <SEO title="Create Account" description="Create a GTA VI Guide Platform account." />
      <AuthCard
        eyebrow="Create account"
        title="Join the platform"
        description="Create a profile prepared for bookmarks, comments, notifications, saved locations, and future premium features."
        footer={
          <>
            Already have an account?{' '}
            <Link
              to={ROUTES.login}
              className="font-semibold text-neon-cyan transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Sign in
            </Link>
          </>
        }
      >
        <RegisterForm />
      </AuthCard>
    </>
  );
}
