import { type ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

import { ROUTES } from '@/constants/routes';
import { type AuthRole, AUTHENTICATED_ROLES, getAuthSession } from '@/features/auth/authSession';

type ProtectedRouteProps = {
  children?: ReactNode;
  allowedRoles?: AuthRole[];
};

export function ProtectedRoute({
  children,
  allowedRoles = AUTHENTICATED_ROLES,
}: ProtectedRouteProps) {
  const location = useLocation();
  const session = getAuthSession();

  if (!session) {
    const redirectTo = encodeURIComponent(`${location.pathname}${location.search}`);

    return <Navigate to={`${ROUTES.login}?redirectTo=${redirectTo}`} replace />;
  }

  if (!allowedRoles.includes(session.user.role)) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return children ?? <Outlet />;
}
