import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, Search, X } from 'lucide-react';
import { useCallback, useId, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/AuthProvider';
import { isAdminRole } from '@/features/auth/authSession';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { authService } from '@/services';
import { cn } from '@/utils/cn';

import { DesktopNavLink } from './DesktopNavLink';
import { MobileNavLink } from './MobileNavLink';
import { NAVBAR_LINKS } from './navbar.constants';
import { NavbarLogo } from './NavbarLogo';
import { type NavbarProps } from './navbar.types';

const desktopAuthLinkClass =
  'inline-flex h-11 items-center justify-center rounded-full bg-white/[0.05] px-4 text-sm font-semibold text-text-secondary ring-1 ring-white/10 transition hover:bg-white/[0.09] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const desktopPrimaryAuthLinkClass =
  'inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black shadow-[0_0_32px_rgba(255,60,172,0.22)] transition hover:bg-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const mobileAuthLinkClass =
  'inline-flex min-h-12 items-center justify-center rounded-2xl bg-white/[0.05] px-5 text-base font-semibold text-text-secondary ring-1 ring-white/10 transition hover:bg-white/[0.09] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const mobilePrimaryAuthLinkClass =
  'mt-2 inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-5 text-base font-semibold text-black shadow-[0_0_32px_rgba(255,60,172,0.22)] transition hover:bg-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export function Navbar({ className }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hasScrolled = useScrollPosition(8);
  const mobileMenuId = useId();
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isRestoring } = useAuth();
  const isAdmin = user ? isAdminRole(user.role) : false;

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      navigate(ROUTES.login, { replace: true });
    },
  });

  const handleLogout = useCallback(() => {
    closeMenu();
    logoutMutation.mutate();
  }, [closeMenu, logoutMutation]);

  useBodyScrollLock(isMenuOpen);
  useEscapeKey({ enabled: isMenuOpen, onEscape: closeMenu });

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition duration-300',
        hasScrolled
          ? 'border-white/10 bg-background/80 shadow-[0_18px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl'
          : 'border-transparent bg-background/60 backdrop-blur-md',
        className,
      )}
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <NavbarLogo />

        <div className="hidden items-center rounded-full border border-white/10 bg-white/[0.035] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:flex">
          {NAVBAR_LINKS.map((link) => (
            <DesktopNavLink key={link.href} {...link} />
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to={ROUTES.search}
            aria-label="Open search"
            className="inline-flex size-11 items-center justify-center rounded-full bg-white/[0.05] text-text-secondary ring-1 ring-white/10 transition hover:bg-white/[0.09] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Search aria-hidden className="size-4" />
          </Link>

          {isRestoring ? (
            <span className="inline-flex h-11 w-28 items-center justify-center rounded-full bg-white/[0.05] text-sm font-semibold text-text-muted ring-1 ring-white/10">
              Checking…
            </span>
          ) : user ? (
            <>
              {isAdmin ? (
                <Link to={ROUTES.admin} className={desktopAuthLinkClass}>
                  Admin Dashboard
                </Link>
              ) : null}
              <Link to={ROUTES.dashboard} className={desktopAuthLinkClass}>
                Dashboard
              </Link>
              <Link to={ROUTES.dashboardSettings} className={desktopAuthLinkClass}>
                Profile
              </Link>
              <button
                type="button"
                className={desktopPrimaryAuthLinkClass}
                disabled={logoutMutation.isPending}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to={ROUTES.login} className={desktopPrimaryAuthLinkClass}>
              <span className='text-black'>Sign In</span>
            </Link>
          )}
        </div>

        <Button
          variant="icon"
          className="lg:hidden"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls={mobileMenuId}
          onClick={() => {
            setIsMenuOpen((current) => !current);
          }}
        >
          {isMenuOpen ? (
            <X aria-hidden className="size-5" />
          ) : (
            <Menu aria-hidden className="size-5" />
          )}
        </Button>
      </nav>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            id={mobileMenuId}
            key="mobile-navigation"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="border-t border-white/10 bg-background/95 px-4 pb-6 pt-3 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
              {NAVBAR_LINKS.map((link) => (
                <MobileNavLink key={link.href} {...link} onClick={closeMenu} />
              ))}

              {isRestoring ? (
                <span className="mt-2 inline-flex min-h-14 items-center justify-center rounded-2xl bg-white/[0.05] px-5 text-base font-semibold text-text-muted ring-1 ring-white/10">
                  Checking session…
                </span>
              ) : user ? (
                <>
                  {isAdmin ? (
                    <Link to={ROUTES.admin} onClick={closeMenu} className={mobileAuthLinkClass}>
                      Admin Dashboard
                    </Link>
                  ) : null}
                  <Link to={ROUTES.dashboard} onClick={closeMenu} className={mobileAuthLinkClass}>
                    Dashboard
                  </Link>
                  <Link to={ROUTES.dashboardSettings} onClick={closeMenu} className={mobileAuthLinkClass}>
                    Profile
                  </Link>
                  <button
                    type="button"
                    className={mobilePrimaryAuthLinkClass}
                    disabled={logoutMutation.isPending}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to={ROUTES.login} onClick={closeMenu} className={mobilePrimaryAuthLinkClass}>
                  <span className='text-black'>Sign In</span>
                </Link>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
