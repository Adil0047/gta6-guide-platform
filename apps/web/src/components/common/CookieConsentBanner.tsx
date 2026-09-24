import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Cookie, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cookieConsentStore, type CookieConsent } from '@/store';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

/**
 * A GDPR-style cookie/privacy consent banner. Shows on first visit (when no
 * consent is recorded) and persists the user's choice (accept/reject) to
 * localStorage via the cookieConsentStore. Non-blocking: content renders
 * normally behind the banner. No backend required.
 *
 * The banner intentionally does NOT block analytics scripts — it records the
 * choice so a future analytics loader can check `cookieConsentStore.get()`
 * before initializing. Respects prefers-reduced-motion.
 */
export function CookieConsentBanner() {
  const [consent, setConsent] = useState<CookieConsent>(null);
  const [dismissed, setDismissed] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Read on mount (client-only) to avoid SSR/hydration mismatch.
    setConsent(cookieConsentStore.get());
  }, []);

  function record(choice: Exclude<CookieConsent, null>) {
    cookieConsentStore.set(choice);
    setConsent(choice);
    setDismissed(true);
    // Notify the GoogleAnalytics loader (and any future consent-aware
    // services) so it can inject gtag without a page reload.
    window.dispatchEvent(new CustomEvent('gta6-cookie-consent-change'));
  }

  const visible = consent === null && !dismissed;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="cookie-consent-banner"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-2xl"
        >
          <div className="rounded-shell border border-white/10 bg-surface/95 p-4 shadow-panel backdrop-blur-2xl sm:p-5">
            <div className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan">
                <Cookie aria-hidden className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-black text-white">Cookie &amp; privacy preferences</h2>
                <p className="mt-1.5 text-xs leading-5 text-text-secondary">
                  We use essential cookies for auth and core functionality. Optional analytics
                  cookies help us improve the platform. You can change this any time in your
                  settings. See our{' '}
                  <a
                    href={ROUTES.home}
                    className="font-semibold text-neon-cyan underline-offset-2 hover:underline"
                  >
                    privacy approach
                  </a>
                  .
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => record('accepted')}
                    className={cn(
                      'inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-black transition',
                      'hover:bg-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    )}
                  >
                    <ShieldCheck aria-hidden className="size-3.5" />
                    Accept all
                  </button>
                  <button
                    type="button"
                    onClick={() => record('rejected')}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-text-secondary transition hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Essential only
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => record('rejected')}
                aria-label="Dismiss cookie banner (essential only)"
                className="grid size-8 shrink-0 place-items-center rounded-full text-text-muted transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
