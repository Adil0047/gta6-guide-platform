import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BarChart3,
  BookOpen,
  FolderTree,
  Home,
  LogOut,
  MessageCircle,
  Settings,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router';

import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { authService } from '@/services';
import { cn } from '@/utils/cn';

const adminLinks = [
  {
    label: 'Overview',
    href: ROUTES.admin,
    icon: Home,
  },
  {
    label: 'Guides',
    href: ROUTES.adminGuides,
    icon: BookOpen,
  },
  {
    label: 'Categories',
    href: ROUTES.adminCategories,
    icon: FolderTree,
  },
  {
    label: 'Users',
    href: ROUTES.adminUsers,
    icon: UsersRound,
  },
  {
    label: 'Comments',
    href: ROUTES.adminComments,
    icon: MessageCircle,
  },
  {
    label: 'Analytics',
    href: ROUTES.adminAnalytics,
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: ROUTES.adminSettings,
    icon: Settings,
  },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      navigate(ROUTES.login, { replace: true });
    },
  });

  return (
    <aside className="sticky top-0 hidden h-screen border-r border-white/10 bg-background/95 p-4 backdrop-blur-xl lg:block">
      <Link
        to={ROUTES.home}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="grid size-11 place-items-center rounded-2xl border border-neon-pink/30 bg-neon-pink/10 text-neon-pink">
          <ShieldCheck aria-hidden className="size-5" />
        </div>
        <div>
          <p className="text-sm font-black tracking-tight text-white">Admin OS</p>
          <p className="text-xs text-text-muted">GTA VI Guide Platform</p>
        </div>
      </Link>

      <nav aria-label="Admin navigation" className="mt-6 space-y-2">
        {adminLinks.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === ROUTES.admin}
              className={({ isActive }) =>
                cn(
                  'flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-semibold transition',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  isActive
                    ? 'bg-white text-black'
                    : 'text-text-secondary hover:bg-white/[0.07] hover:text-white',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon aria-hidden className={cn('size-5', isActive ? 'text-black' : 'text-neon-cyan')} />
                  {link.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      <Button
        type="button"
        variant="ghost"
        className="mt-6 w-full justify-start"
        disabled={logoutMutation.isPending}
        onClick={() => {
          logoutMutation.mutate();
        }}
      >
        <LogOut aria-hidden className="mr-2 size-4" />
        Sign out
      </Button>
    </aside>
  );
}
