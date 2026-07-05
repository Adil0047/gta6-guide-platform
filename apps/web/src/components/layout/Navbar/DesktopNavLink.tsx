import { NavLink } from 'react-router';

import { type NavigationItem } from '@/types/navigation';
import { cn } from '@/utils/cn';

export function DesktopNavLink({ label, href, icon: Icon }: NavigationItem) {
  return (
    <NavLink to={href}>
      {({ isActive }) => (
        <div
          className={cn(
            'group relative inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition duration-200',
            isActive ? 'bg-white shadow-[0_0_32px_rgba(0,229,255,0.18)]' : 'hover:bg-white/[0.07]',
          )}
        >
          <Icon
            className={isActive ? 'text-black' : 'text-text-muted group-hover:text-neon-cyan'}
          />
          <span className={isActive ? 'text-black' : 'text-text-secondary group-hover:text-white'}>
            {label}
          </span>
        </div>
      )}
    </NavLink>
    // <NavLink
    //   to={href}
    //   className={({ isActive }) =>
    //     cn(
    //       'group relative inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition duration-200',
    //       'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    //       isActive
    //         ? 'bg-white text-black shadow-[0_0_32px_rgba(0,229,255,0.18)]'
    //         : 'text-text-secondary hover:bg-white/[0.07] hover:text-white',
    //     )
    //   }
    // >
    //   {({ isActive }) => (
    //     <>
    //       <Icon
    //         aria-hidden
    //         className={cn(
    //           'size-4 transition duration-200',
    //           isActive ? 'text-black' : 'text-text-muted group-hover:text-neon-cyan',
    //         )}
    //       />
    //       <span>{label}</span>
    //     </>
    //   )}
    // </NavLink>
  );
}
