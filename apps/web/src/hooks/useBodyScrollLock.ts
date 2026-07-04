import { useEffect } from 'react';

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) {
      return;
    }

    const previousValue = document.body.dataset.scrollLock;
    document.body.dataset.scrollLock = 'true';

    return () => {
      if (previousValue) {
        document.body.dataset.scrollLock = previousValue;
      } else {
        delete document.body.dataset.scrollLock;
      }
    };
  }, [isLocked]);
}
