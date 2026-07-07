import { type ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { LoadingScreen } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { type AuthRole, AUTHENTICATED_ROLES } from '@/features/auth/authSession';
import { useAuth } from '@/features/auth/AuthProvider';

type ProtectedRouteProps = {
  children?: ReactNode;
  allowedRoles?: AuthRole[];
};

export function ProtectedRoute({
  children,
  allowedRoles = AUTHENTICATED_ROLES,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { user, isRestoring } = useAuth();

  if (isRestoring) {
    return <LoadingScreen />;
  }

  if (!user) {
    const redirectTo = encodeURIComponent(`${location.pathname}${location.search}`);

    return <Navigate to={`${ROUTES.login}?redirectTo=${redirectTo}`} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return children ?? <Outlet />;
}
