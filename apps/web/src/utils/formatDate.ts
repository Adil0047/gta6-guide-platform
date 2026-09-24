export function formatDate(value: string | number | Date, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));
}

const RELATIVE_UNITS: Array<{ unit: Intl.RelativeTimeFormatUnit; ms: number }> = [
  { unit: 'year', ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: 'month', ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: 'week', ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: 'day', ms: 24 * 60 * 60 * 1000 },
  { unit: 'hour', ms: 60 * 60 * 1000 },
  { unit: 'minute', ms: 60 * 1000 },
];

const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

/**
 * Returns a human-readable relative-time string for a past date
 * (e.g. "3 days ago", "just now", "in 2 months" for future dates).
 * Falls back to the absolute formatDate output for dates older than
 * ~6 months or when the value is invalid.
 */
export function formatRelativeDate(value: string | number | Date): string {
  const date = new Date(value);
  const now = Date.now();
  const diffMs = date.getTime() - now;
  const absDiff = Math.abs(diffMs);

  // Under 30 seconds → "just now"
  if (absDiff < 30 * 1000) {
    return 'just now';
  }

  for (const { unit, ms } of RELATIVE_UNITS) {
    if (absDiff >= ms || unit === 'minute') {
      const diff = Math.round(diffMs / ms);
      return RELATIVE_FORMATTER.format(diff, unit);
    }
  }

  return formatDate(value);
}
