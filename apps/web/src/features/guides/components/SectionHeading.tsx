import { Check, Link2 } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';

import { cn } from '@/utils/cn';

type SectionHeadingProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

/**
 * A guide section heading (h2) with a hover-reveal anchor link + a
 * copy-deep-link button. Clicking the link or the copy button updates the
 * URL hash to `#<id>` (so it's shareable + scrollable), and the copy button
 * writes the full URL with the hash to the clipboard, showing a transient
 * "Copied" confirmation.
 *
 * Accessibility: the heading keeps its plain text for screen readers; the
 * anchor + copy affordances are additional controls with descriptive
 * aria-labels.
 */
export function SectionHeading({ id, children, className }: SectionHeadingProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard permission denied — fail silently (the anchor link still works).
    }
  }

  return (
    <h2 className={cn('group flex items-start gap-3 text-3xl font-black tracking-tight text-white', className)}>
      <a
        href={`#${id}`}
        aria-label={`Link to this section: ${typeof children === 'string' ? children : 'section'}`}
        className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-lg text-text-muted opacity-0 transition hover:text-neon-cyan focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background group-hover:opacity-100"
      >
        <Link2 aria-hidden className="size-4" />
      </a>
      <span className="flex-1">{children}</span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? 'Section link copied to clipboard' : 'Copy link to this section'}
        className={cn(
          'mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          copied
            ? 'text-neon-cyan opacity-100'
            : 'text-text-muted opacity-0 hover:text-neon-cyan group-hover:opacity-100',
        )}
      >
        {copied ? <Check aria-hidden className="size-4" /> : <Link2 aria-hidden className="size-4" />}
      </button>
    </h2>
  );
}
