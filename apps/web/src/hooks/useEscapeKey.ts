import { useEffect } from 'react';

type UseEscapeKeyOptions = {
  enabled?: boolean;
  onEscape: () => void;
};

export function useEscapeKey({ enabled = true, onEscape }: UseEscapeKeyOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onEscape();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onEscape]);
}
