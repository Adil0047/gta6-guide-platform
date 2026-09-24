import {
  BarChart3,
  Bookmark,
  FileText,
  FolderTree,
  LayoutDashboard,
  MessageSquare,
  Settings,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { type ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { type CommandGroup } from '@/components/common/CommandPalette';
import { ROUTES } from '@/constants/routes';

// Shape mirrors Command (without `action`, which is bound here via navigate).
type CommandSpec = {
  id: string;
  label: string;
  hint?: string;
  group: CommandGroup;
  icon: ReactNode;
  href: string;
};

const DASHBOARD_COMMANDS: CommandSpec[] = [
  {
    id: 'dash-overview',
    label: 'Dashboard overview',
    hint: 'Your activity, bookmarks, comments at a glance',
    group: 'Dashboard',
    icon: <LayoutDashboard aria-hidden className="size-4" />,
    href: ROUTES.dashboard,
  },
  {
    id: 'dash-bookmarks',
    label: 'Saved guides',
    hint: 'Your bookmarked guides',
    group: 'Dashboard',
    icon: <Bookmark aria-hidden className="size-4" />,
    href: ROUTES.dashboardBookmarks,
  },
  {
    id: 'dash-comments',
    label: 'Your comments',
    hint: 'Comments you have posted',
    group: 'Dashboard',
    icon: <MessageSquare aria-hidden className="size-4" />,
    href: ROUTES.dashboardComments,
  },
  {
    id: 'dash-settings',
    label: 'Profile settings',
    hint: 'Manage your profile and preferences',
    group: 'Dashboard',
    icon: <Settings aria-hidden className="size-4" />,
    href: ROUTES.dashboardSettings,
  },
];

const ADMIN_COMMANDS: CommandSpec[] = [
  {
    id: 'admin-overview',
    label: 'Admin overview',
    hint: 'Editorial control center',
    group: 'Admin',
    icon: <LayoutDashboard aria-hidden className="size-4" />,
    href: ROUTES.admin,
  },
  {
    id: 'admin-guides',
    label: 'Manage guides',
    hint: 'Create, edit, publish guide content',
    group: 'Admin',
    icon: <FileText aria-hidden className="size-4" />,
    href: ROUTES.adminGuides,
  },
  {
    id: 'admin-categories',
    label: 'Manage categories',
    hint: 'Taxonomy and category records',
    group: 'Admin',
    icon: <FolderTree aria-hidden className="size-4" />,
    href: ROUTES.adminCategories,
  },
  {
    id: 'admin-users',
    label: 'Manage users',
    hint: 'User accounts, roles, moderation',
    group: 'Admin',
    icon: <Users aria-hidden className="size-4" />,
    href: ROUTES.adminUsers,
  },
  {
    id: 'admin-comments',
    label: 'Moderate comments',
    hint: 'Review and approve comments',
    group: 'Admin',
    icon: <MessageSquare aria-hidden className="size-4" />,
    href: ROUTES.adminComments,
  },
  {
    id: 'admin-analytics',
    label: 'Analytics',
    hint: 'Content performance signals',
    group: 'Admin',
    icon: <BarChart3 aria-hidden className="size-4" />,
    href: ROUTES.adminAnalytics,
  },
  {
    id: 'admin-settings',
    label: 'Admin settings',
    hint: 'Platform configuration + SEO health',
    group: 'Admin',
    icon: <ShieldCheck aria-hidden className="size-4" />,
    href: ROUTES.adminSettings,
  },
];

/**
 * Builds the context-specific command list for the command palette. Pass
 * `context: 'dashboard'` for authenticated-user pages or `'admin'` for
 * admin pages. Returns Command objects (with a bound `action` that navigates
 * + calls onClose) ready to pass to <CommandPalette extraCommands={...} />.
 */
export function useContextCommands(
  context: 'dashboard' | 'admin',
  onClose: () => void,
) {
  const navigate = useNavigate();
  const specs = context === 'admin' ? ADMIN_COMMANDS : DASHBOARD_COMMANDS;

  return specs.map((spec) => ({
    id: spec.id,
    label: spec.label,
    hint: spec.hint,
    group: spec.group,
    icon: spec.icon,
    action: () => {
      navigate(spec.href);
      onClose();
    },
  }));
}
