import { useCallback, useEffect, useState } from 'react';

/**
 * Global Cmd/Ctrl+K toggle hook for the command palette. Returns the open
 * state and an explicit toggle/close. Listens on `window` with a guard so
 * typing `k` inside an input with Cmd/Ctrl still works. Cleans up on unmount.
 */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((current) => !current), []);

  return { open, close, toggle };
}
