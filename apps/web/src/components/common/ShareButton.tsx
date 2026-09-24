import { Check, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/utils/cn';

type ShareButtonProps = {
  title: string;
  text: string;
  url: string;
  className?: string;
  label?: string;
};

/**
 * A share affordance that prefers the native Web Share API when available
 * (mobile / capable desktops) and falls back to copying the URL to the
 * clipboard with a transient "Copied!" confirmation. Fully keyboard
 * accessible and announces its state to assistive tech.
 */
export function ShareButton({ title, text, url, className, label = 'Share guide' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleShare() {
    try {
      if (supported) {
        await navigator.share({ title, text, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // User dismissed the native share sheet, or clipboard permission was
      // denied. Either way, fail silently rather than surfacing an error.
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={copied ? 'Link copied to clipboard' : label}
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition',
        copied
          ? 'border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan'
          : 'border-white/10 bg-background/40 text-text-secondary backdrop-blur-xl hover:border-neon-cyan/40 hover:bg-white/[0.06] hover:text-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      {copied ? (
        <>
          <Check aria-hidden className="size-4" />
          Copied
        </>
      ) : (
        <>
          <Share2 aria-hidden className="size-4" />
          {label}
        </>
      )}
    </button>
  );
}
