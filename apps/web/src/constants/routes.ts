export const ROUTES = {
  home: '/',
  guides: '/guides',
  categories: '/categories',
  map: '/map',
  search: '/search',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  dashboard: '/dashboard',
  dashboardBookmarks: '/dashboard/bookmarks',
  dashboardComments: '/dashboard/comments',
  dashboardSettings: '/dashboard/settings',
  admin: '/admin',
  adminGuides: '/admin/guides',
  adminCategories: '/admin/categories',
  adminUsers: '/admin/users',
  adminComments: '/admin/comments',
  adminAnalytics: '/admin/analytics',
  adminSettings: '/admin/settings',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
