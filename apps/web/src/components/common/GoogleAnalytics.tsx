import { useEffect, useState } from 'react';

import { cookieConsentStore, type CookieConsent } from '@/store';

// The Google tag ID. Read from VITE_GA_ID at build time; falls back to the
// committed default so the site still has analytics configured out of the box
// once consent is granted. Override via Vercel project env for a different ID.
const GA_ID =
  ((import.meta as { env?: { VITE_GA_ID?: string } }).env?.VITE_GA_ID as string | undefined) ??
  'G-TD8VDDK5P2';

/**
 * Consent-gated Google Analytics loader. Dynamically injects the gtag script
 * + the gtag('config') call ONLY when the user has accepted optional cookies
 * via the CookieConsentBanner. Returns null (renders nothing).
 *
 * GDPR behavior:
 * - On mount: reads consent. If 'accepted', injects gtag. If 'rejected' or
 *   null (no choice yet), does NOT inject (and does NOT load the script).
 * - Listens for consent changes (a custom `gta6-cookie-consent-change` window
 *   event dispatched by the banner when the user makes a choice) so accepting
 *   after the initial load injects gtag without a page reload.
 * - Cleans up the listener on unmount. The injected script is intentionally
 *   NOT removed on a later 'rejected' (Google's Consent Mode v2 is the
 *   proper way to handle take-back; removing a loaded script is unreliable).
 *   For a stricter approach, use Consent Mode v2's `ad_storage`/`analytics_storage`.
 *
 * This component is the SINGLE place gtag is loaded — it was removed from
 * index.html so the raw HTML ships NO analytics scripts for non-JS clients
 * or users who reject cookies.
 */
export function GoogleAnalytics() {
  const [consent, setConsent] = useState<CookieConsent>(null);

  useEffect(() => {
    setConsent(cookieConsentStore.get());

    function onConsentChange() {
      setConsent(cookieConsentStore.get());
    }

    window.addEventListener('gta6-cookie-consent-change', onConsentChange);
    return () => window.removeEventListener('gta6-cookie-consent-change', onConsentChange);
  }, []);

  useEffect(() => {
    if (consent !== 'accepted') {
      return;
    }

    // Idempotent: skip if gtag is already loaded (e.g. React strict-mode
    // double-invoke or a re-render).
    if (document.getElementById('gtag-script-src')) {
      return;
    }

    // 1. Inject the gtag loader.
    const scriptSrc = document.createElement('script');
    scriptSrc.id = 'gtag-script-src';
    scriptSrc.async = true;
    scriptSrc.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(scriptSrc);

    // 2. Initialize dataLayer + config.
    const scriptInit = document.createElement('script');
    scriptInit.id = 'gtag-script-init';
    scriptInit.textContent = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
`;
    document.head.appendChild(scriptInit);
  }, [consent]);

  return null;
}
