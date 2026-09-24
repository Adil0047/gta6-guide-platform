import { storage } from '@/lib/storage';

export type CookieConsent = 'accepted' | 'rejected' | null;

const CONSENT_KEY = 'gta6-cookie-consent';
const CONSENT_TIMESTAMP_KEY = 'gta6-cookie-consent-ts';

/**
 * Persists the user's cookie/privacy consent choice to localStorage.
 * Returns null when no choice has been recorded (so the banner shows).
 * A timestamp is also stored so a future "re-ask after N months" policy
 * can be implemented without changing the call sites.
 */
export const cookieConsentStore = {
  get(): CookieConsent {
    const value = storage.getItem(CONSENT_KEY);
    if (value === 'accepted' || value === 'rejected') {
      return value;
    }
    return null;
  },

  set(consent: Exclude<CookieConsent, null>) {
    storage.setItem(CONSENT_KEY, consent);
    storage.setItem(CONSENT_TIMESTAMP_KEY, String(Date.now()));
  },

  clear() {
    storage.removeItem(CONSENT_KEY);
    storage.removeItem(CONSENT_TIMESTAMP_KEY);
  },
};
