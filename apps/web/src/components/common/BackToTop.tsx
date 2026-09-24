import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/utils/cn';

const VISIBILITY_THRESHOLD = 480;

/**
 * A floating "back to top" button that appears once the user has scrolled
 * past the threshold, and smoothly scrolls back to the top of the document.
 * Keyboard-accessible (focusable button), respects prefers-reduced-motion
 * via the smooth-scroll behavior guard, and enters/exits with a subtle
 * spring-style animation.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      setVisible(window.scrollY > VISIBILITY_THRESHOLD);
    }

    function onScroll() {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  function handleClick() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Home') {
      event.preventDefault();
      handleClick();
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label="Scroll back to top"
      className={cn(
        'fixed bottom-6 right-6 z-50 inline-flex size-12 items-center justify-center rounded-full',
        'border border-white/10 bg-background/80 text-text-primary shadow-[0_8px_32px_rgba(255,60,172,0.22)] backdrop-blur-xl',
        'transition duration-300 hover:border-neon-pink/40 hover:bg-neon-pink/10 hover:text-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'motion-safe:transition-transform motion-safe:hover:-translate-y-0.5',
        visible ? 'scale-100 opacity-100' : 'pointer-events-none scale-90 opacity-0',
      )}
    >
      <ArrowUp aria-hidden className="size-5" />
    </button>
  );
}
