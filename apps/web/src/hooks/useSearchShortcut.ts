import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { ROUTES } from '@/constants/routes';

const SKIP_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'OBJECT']);
const SEARCH_INPUT_SELECTOR = '[data-search-input]';

/**
 * Global keyboard shortcut: pressing `/` (when not already typing in an
 * input, textarea, select, or contenteditable element) focuses the nearest
 * search input on the page. If no search input is present, the user is
 * navigated to the dedicated search route where the input will be focused
 * on mount. Also surfaces a tiny hint to the body when the shortcut is
 * available so power users can discover it.
 *
 * Listens on `window` with a passive guard; cleans up on unmount.
 */
export function useSearchShortcut() {
  const navigate = useNavigate();

  useEffect(() => {
    function isTypingTarget(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) {
        return false;
      }

      if (SKIP_TAGS.has(target.tagName)) {
        return true;
      }

      if (target.isContentEditable) {
        return true;
      }

      return false;
    }

    function onKeydown(event: KeyboardEvent) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      const input = document.querySelector<HTMLElement>(SEARCH_INPUT_SELECTOR);

      if (input) {
        event.preventDefault();
        input.focus();
        return;
      }

      event.preventDefault();
      navigate(ROUTES.search);
    }

    window.addEventListener('keydown', onKeydown);

    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, [navigate]);
}
