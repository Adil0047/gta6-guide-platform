import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bookmark, Home, LogOut, MessageCircle, Settings, UserRound } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';

import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { authService, queryKeys, userService } from '@/services';
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

function getInitials(name = '', username = '') {
  const source = name || username;
  const initials = source
    .split(' ')
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');

  return initials.toUpperCase() || 'P';
}

export function DashboardNav() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: userService.getMe,
  });
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      navigate(ROUTES.login, { replace: true });
    },
  });
  const user = userQuery.data;

  return (
    <aside className="rounded-panel border border-white/10 bg-white/[0.04] p-4 shadow-panel backdrop-blur-xl">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        {user?.avatar ? (
          <img src={user.avatar} alt="" className="size-11 rounded-2xl object-cover" />
        ) : (
          <div className="grid size-11 place-items-center rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 text-sm font-black text-neon-cyan">
            {user ? getInitials(user.name, user.username) : <UserRound aria-hidden className="size-5" />}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{user?.name ?? 'Player profile'}</p>
          <p className="truncate text-xs text-text-muted">
            {user ? `@${user.username} · ${user.role}` : 'Signed-in account'}
          </p>
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
                    ? 'border border-neon-cyan/30 bg-neon-cyan/10 text-white shadow-[0_0_24px_rgba(0,245,255,0.08)]'
                    : 'border border-transparent text-text-secondary hover:border-white/10 hover:bg-white/[0.07] hover:text-white',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon aria-hidden className={cn('size-5', isActive ? 'text-neon-cyan' : 'text-text-muted')} />
                  <span>{link.label}</span>
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
