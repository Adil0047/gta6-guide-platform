import { useEffect, useState } from 'react';

import { formatRelativeDate } from '@/utils/formatDate';

/**
 * Live-updating relative-time hook. Returns a relative-time string
 * (e.g. "5 minutes ago") for the given value, re-rendered every `intervalMs`
 * (default 60000ms = 1 minute) so the displayed label stays fresh without a
 * page reload.
 *
 * Re-render frequency is throttled: timestamps are only re-computed on the
 * tick, so a page with 50 comments only schedules a single interval (the
 * hook is called per-component, but each is cheap). Respects cleanup on
 * unmount.
 */
export function useRelativeTime(value: string | number | Date, intervalMs = 60_000): string {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return formatRelativeDate(value);
}
