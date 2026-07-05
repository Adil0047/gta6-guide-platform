import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LogOut, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useId, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';

import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { authService } from '@/services';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { cn } from '@/utils/cn';

const mobileLinks = [
  { label: 'Overview', href: ROUTES.admin },
  { label: 'Guides', href: ROUTES.adminGuides },
  { label: 'Categories', href: ROUTES.adminCategories },
  { label: 'Users', href: ROUTES.adminUsers },
  { label: 'Comments', href: ROUTES.adminComments },
  { label: 'Analytics', href: ROUTES.adminAnalytics },
  { label: 'Settings', href: ROUTES.adminSettings },
];

export function AdminMobileNav() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const shouldReduceMotion = useReducedMotion();

  const close = useCallback(() => {
    setOpen(false);
  }, []);
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      navigate(ROUTES.login, { replace: true });
    },
  });

  useBodyScrollLock(open);
  useEscapeKey({ enabled: open, onEscape: close });

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/90 p-4 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black tracking-tight text-white">Admin OS</p>
          <p className="text-xs text-text-muted">GTA VI Guide Platform</p>
        </div>

        <Button
          variant="icon"
          aria-label={open ? 'Close admin menu' : 'Open admin menu'}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => {
            setOpen((value) => !value);
          }}
        >
          {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id={menuId}
            aria-label="Admin mobile navigation"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mt-4 grid gap-2"
          >
            {mobileLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === ROUTES.admin}
                onClick={close}
                className={({ isActive }) =>
                  cn(
                    'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                    isActive
                      ? 'bg-white text-black'
                      : 'bg-white/[0.04] text-text-secondary hover:bg-white/[0.08] hover:text-white',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Button
              type="button"
              variant="ghost"
              className="justify-start"
              disabled={logoutMutation.isPending}
              onClick={() => {
                close();
                logoutMutation.mutate();
              }}
            >
              <LogOut aria-hidden className="mr-2 size-4" />
              Sign out
            </Button>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
