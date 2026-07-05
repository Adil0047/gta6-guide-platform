import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

import { AdminLayout } from '@/app/layouts/AdminLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { UserLayout } from '@/app/layouts/UserLayout';
import { ROUTES } from '@/constants/routes';
import { ADMIN_ROLES, AUTHENTICATED_ROLES, ProtectedRoute } from '@/features/auth';
import { NotFoundPage } from '@/pages/errors/NotFoundPage';

const AdminAnalyticsPage = lazy(() =>
  import('@/pages/admin/AdminAnalyticsPage').then((module) => ({ default: module.AdminAnalyticsPage })),
);
const AdminCategoriesPage = lazy(() =>
  import('@/pages/admin/AdminCategoriesPage').then((module) => ({ default: module.AdminCategoriesPage })),
);
const AdminCommentsPage = lazy(() =>
  import('@/pages/admin/AdminCommentsPage').then((module) => ({ default: module.AdminCommentsPage })),
);
const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })),
);
const AdminGuidesPage = lazy(() =>
  import('@/pages/admin/AdminGuidesPage').then((module) => ({ default: module.AdminGuidesPage })),
);
const AdminSettingsPage = lazy(() =>
  import('@/pages/admin/AdminSettingsPage').then((module) => ({ default: module.AdminSettingsPage })),
);
const AdminUsersPage = lazy(() =>
  import('@/pages/admin/AdminUsersPage').then((module) => ({ default: module.AdminUsersPage })),
);
const CategoriesPage = lazy(() =>
  import('@/pages/public/CategoriesPage').then((module) => ({ default: module.CategoriesPage })),
);
const CategoryDetailPage = lazy(() =>
  import('@/pages/public/CategoryDetailPage').then((module) => ({ default: module.CategoryDetailPage })),
);
const GuideDetailPage = lazy(() =>
  import('@/pages/public/GuideDetailPage').then((module) => ({ default: module.GuideDetailPage })),
);
const GuidesPage = lazy(() =>
  import('@/pages/public/GuidesPage').then((module) => ({ default: module.GuidesPage })),
);
const HomePage = lazy(() =>
  import('@/pages/public/HomePage').then((module) => ({ default: module.HomePage })),
);
const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((module) => ({ default: module.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('@/pages/auth/RegisterPage').then((module) => ({ default: module.RegisterPage })),
);
const MapPage = lazy(() =>
  import('@/pages/public/MapPage').then((module) => ({ default: module.MapPage })),
);
const SearchPage = lazy(() =>
  import('@/pages/public/SearchPage').then((module) => ({ default: module.SearchPage })),
);
const UserBookmarksPage = lazy(() =>
  import('@/pages/user/UserBookmarksPage').then((module) => ({ default: module.UserBookmarksPage })),
);
const UserCommentsPage = lazy(() =>
  import('@/pages/user/UserCommentsPage').then((module) => ({ default: module.UserCommentsPage })),
);
const UserDashboardPage = lazy(() =>
  import('@/pages/user/UserDashboardPage').then((module) => ({ default: module.UserDashboardPage })),
);
const UserSettingsPage = lazy(() =>
  import('@/pages/user/UserSettingsPage').then((module) => ({ default: module.UserSettingsPage })),
);

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
