import { NavLink } from 'react-router';

import { type NavigationItem } from '@/types/navigation';
import { cn } from '@/utils/cn';

type MobileNavLinkProps = NavigationItem & {
  onClick: () => void;
};

export function MobileNavLink({
  label,
  href,
  icon: Icon,
  onClick,
}: MobileNavLinkProps) {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'group flex min-h-14 items-center justify-between rounded-2xl border px-4 text-base font-medium transition duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          isActive
            ? 'border-white/20 bg-white'
            : 'border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              'flex items-center gap-3',
              isActive ? 'text-black' : 'text-text-secondary group-hover:text-white',
            )}
          >
            <Icon
              aria-hidden
              className={cn(
                'size-5',
                isActive ? 'text-black' : 'text-neon-cyan',
              )}
            />
            <span className={isActive ? 'text-black' : ''}>{label}</span>
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