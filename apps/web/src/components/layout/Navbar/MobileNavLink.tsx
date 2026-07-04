import { NavLink } from 'react-router';

import { type NavigationItem } from '@/types/navigation';
import { cn } from '@/utils/cn';

type MobileNavLinkProps = NavigationItem & {
  onClick: () => void;
};

export function MobileNavLink({ label, href, icon: Icon, onClick }: MobileNavLinkProps) {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'group flex min-h-14 items-center justify-between rounded-2xl border px-4 text-base font-medium transition duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          isActive
            ? 'border-white/20 bg-white text-black'
            : 'border-white/10 bg-white/[0.04] text-text-secondary hover:border-white/20 hover:bg-white/[0.08] hover:text-white',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span className="flex items-center gap-3">
            <Icon
              aria-hidden
              className={cn('size-5', isActive ? 'text-black' : 'text-neon-cyan')}
            />
            {label}
          </span>

          <span
            aria-hidden
            className={cn(
              'size-2 rounded-full transition',
              isActive ? 'bg-black' : 'bg-text-muted group-hover:bg-neon-pink',
            )}
          />
        </>
      )}
    </NavLink>
  );
}
