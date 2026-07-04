import { createBrowserRouter } from 'react-router';

import { AdminLayout } from '@/app/layouts/AdminLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { UserLayout } from '@/app/layouts/UserLayout';
import { ROUTES } from '@/constants/routes';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';
import { AdminCommentsPage } from '@/pages/admin/AdminCommentsPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminGuidesPage } from '@/pages/admin/AdminGuidesPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { ADMIN_ROLES, AUTHENTICATED_ROLES, ProtectedRoute } from '@/features/auth';
import { NotFoundPage } from '@/pages/errors/NotFoundPage';
import { CategoriesPage } from '@/pages/public/CategoriesPage';
import { CategoryDetailPage } from '@/pages/public/CategoryDetailPage';
import { GuideDetailPage } from '@/pages/public/GuideDetailPage';
import { GuidesPage } from '@/pages/public/GuidesPage';
import { HomePage } from '@/pages/public/HomePage';
import { MapPage } from '@/pages/public/MapPage';
import { SearchPage } from '@/pages/public/SearchPage';
import { UserBookmarksPage } from '@/pages/user/UserBookmarksPage';
import { UserCommentsPage } from '@/pages/user/UserCommentsPage';
import { UserDashboardPage } from '@/pages/user/UserDashboardPage';
import { UserSettingsPage } from '@/pages/user/UserSettingsPage';

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <PublicLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTES.guides.replace('/', ''),
        element: <GuidesPage />,
      },
      {
        path: 'guides/:slug',
        element: <GuideDetailPage />,
      },
      {
        path: ROUTES.categories.replace('/', ''),
        element: <CategoriesPage />,
      },
      {
        path: 'categories/:slug',
        element: <CategoryDetailPage />,
      },
      {
        path: ROUTES.map.replace('/', ''),
        element: <MapPage />,
      },
      {
        path: ROUTES.search.replace('/', ''),
        element: <SearchPage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: ROUTES.login,
        element: <LoginPage />,
      },
      {
        path: ROUTES.register,
        element: <RegisterPage />,
      },
      {
        path: ROUTES.forgotPassword,
        element: <ForgotPasswordPage />,
      },
      {
        path: ROUTES.resetPassword,
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    path: ROUTES.dashboard,
    element: (
      <ProtectedRoute allowedRoles={AUTHENTICATED_ROLES}>
        <UserLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <UserDashboardPage />,
      },
      {
        path: 'bookmarks',
        element: <UserBookmarksPage />,
      },
      {
        path: 'comments',
        element: <UserCommentsPage />,
      },
      {
        path: 'settings',
        element: <UserSettingsPage />,
      },
    ],
  },
  {
    path: ROUTES.admin,
    element: (
      <ProtectedRoute allowedRoles={ADMIN_ROLES}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: 'guides',
        element: <AdminGuidesPage />,
      },
      {
        path: 'categories',
        element: <AdminCategoriesPage />,
      },
      {
        path: 'users',
        element: <AdminUsersPage />,
      },
      {
        path: 'comments',
        element: <AdminCommentsPage />,
      },
      {
        path: 'analytics',
        element: <AdminAnalyticsPage />,
      },
      {
        path: 'settings',
        element: <AdminSettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
