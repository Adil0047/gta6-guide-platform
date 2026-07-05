import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bookmark, Home, LogOut, MessageCircle, Settings, UserRound } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';

import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { authService } from '@/services';
import { cn } from '@/utils/cn';

const userDashboardLinks = [
  {
    label: 'Overview',
    href: ROUTES.dashboard,
    icon: Home,
  },
  {
    label: 'Bookmarks',
    href: ROUTES.dashboardBookmarks,
    icon: Bookmark,
  },
  {
    label: 'Comments',
    href: ROUTES.dashboardComments,
    icon: MessageCircle,
  },
  {
    label: 'Settings',
    href: ROUTES.dashboardSettings,
    icon: Settings,
  },
];

export function DashboardNav() {
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
    <aside className="rounded-panel border border-white/10 bg-white/[0.04] p-4 shadow-panel backdrop-blur-xl">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="grid size-11 place-items-center rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan">
          <UserRound aria-hidden className="size-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Player profile</p>
          <p className="text-xs text-text-muted">Mock user workspace</p>
        </div>
      </div>

      <nav aria-label="User dashboard navigation" className="mt-4 space-y-2">
        {userDashboardLinks.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === ROUTES.dashboard}
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
                  <Icon
                    aria-hidden
                    className={cn('size-5', isActive ? 'text-black' : 'text-neon-cyan')}
                  />
                  <span className={isActive ? 'text-black' : ''}>{link.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      <Button
        type="button"
        variant="ghost"
        className="mt-4 w-full justify-start"
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
