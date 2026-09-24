import { Printer } from 'lucide-react';

import { cn } from '@/utils/cn';

type PrintButtonProps = {
  className?: string;
  label?: string;
};

/**
 * Triggers the browser's print dialog for the current page. Intended for
 * guide detail pages where a clean, readable print stylesheet hides the
 * navigation, table of contents, and interactive chrome so the article
 * itself prints cleanly. Keyboard accessible.
 */
export function PrintButton({ className, label = 'Print guide' }: PrintButtonProps) {
  function handlePrint() {
    window.print();
  }

  return (
    <button
      type="button"
      onClick={handlePrint}
      aria-label={label}
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-background/40 px-5 text-sm font-semibold text-text-secondary backdrop-blur-xl transition',
        'hover:border-neon-cyan/40 hover:bg-white/[0.06] hover:text-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <Printer aria-hidden className="size-4" />
      {label}
    </button>
  );
}
