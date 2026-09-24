import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, Cookie, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cookieConsentStore, type CookieConsent } from '@/store';
import { useBodyScrollLock, useEscapeKey } from '@/hooks';
import { cn } from '@/utils/cn';

type CookiePreferencesDialogProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * A modal dialog for reviewing + changing the cookie/privacy consent choice.
 * Re-mounts the consent banner's accept/reject affordances inside a focused
 * dialog so users can revoke or re-grant consent after the initial banner
 * dismissal. Dispatches the `gta6-cookie-consent-change` window event on
 * change so the GoogleAnalytics loader reacts live.
 */
export function CookiePreferencesDialog({ open, onClose }: CookiePreferencesDialogProps) {
  const [consent, setConsent] = useState<CookieConsent>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (open) {
      setConsent(cookieConsentStore.get());
    }
  }, [open]);

  useBodyScrollLock(open);
  useEscapeKey({ enabled: open, onEscape: onClose });

  function record(choice: Exclude<CookieConsent, null>) {
    cookieConsentStore.set(choice);
    setConsent(choice);
    window.dispatchEvent(new CustomEvent('gta6-cookie-consent-change'));
    // Close after a short delay so the user sees the confirmation state.
    window.setTimeout(onClose, 350);
  }

  const currentLabel =
    consent === 'accepted'
      ? 'Optional cookies accepted — analytics scripts run.'
      : consent === 'rejected'
        ? 'Essential cookies only — no analytics scripts run.'
        : 'No choice recorded yet.';

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="cookie-prefs-overlay"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Cookie preferences"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -12, scale: 0.98 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-shell border border-white/10 bg-surface/95 shadow-panel backdrop-blur-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan">
                  <Cookie aria-hidden className="size-5" />
                </span>
                <div>
                  <h2 className="text-base font-black text-white">Cookie preferences</h2>
                  <p className="mt-0.5 text-xs text-text-muted">{currentLabel}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cookie preferences"
                className="grid size-8 shrink-0 place-items-center rounded-full text-text-muted transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>

            <div className="space-y-3 px-5 py-5">
              <button
                type="button"
                onClick={() => record('accepted')}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  consent === 'accepted'
                    ? 'border-neon-cyan/40 bg-neon-cyan/[0.08]'
                    : 'border-white/10 bg-white/[0.03] hover:border-neon-cyan/30 hover:bg-white/[0.06]',
                )}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan">
                  <ShieldCheck aria-hidden className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-white">Accept all cookies</span>
                  <span className="mt-0.5 block text-xs text-text-muted">
                    Essential + analytics. Analytics scripts run.
                  </span>
                </span>
                {consent === 'accepted' ? (
                  <CheckCircle2 aria-hidden className="size-5 shrink-0 text-neon-cyan" />
                ) : null}
              </button>

              <button
                type="button"
                onClick={() => record('rejected')}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  consent === 'rejected'
                    ? 'border-neon-pink/40 bg-neon-pink/[0.08]'
                    : 'border-white/10 bg-white/[0.03] hover:border-neon-pink/30 hover:bg-white/[0.06]',
                )}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-neon-pink/20 bg-neon-pink/10 text-neon-pink">
                  <Cookie aria-hidden className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-white">Essential only</span>
                  <span className="mt-0.5 block text-xs text-text-muted">
                    No analytics scripts. Revoke optional cookies.
                  </span>
                </span>
                {consent === 'rejected' ? (
                  <CheckCircle2 aria-hidden className="size-5 shrink-0 text-neon-pink" />
                ) : null}
              </button>
            </div>

            <div className="border-t border-white/10 px-5 py-3 text-[11px] leading-5 text-text-muted">
              You can change this any time. Choice persists across sessions on this device.
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
