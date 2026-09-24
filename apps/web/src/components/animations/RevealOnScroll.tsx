import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode } from 'react';

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
  /** Viewport amount that must be visible before revealing (0–1). */
  amount?: number;
  /** Vertical offset to travel from (px). */
  y?: number;
  delay?: number;
};

/**
 * Reveals its children with a fade + upward slide when they scroll into view.
 * Uses motion's `whileInView` so it only triggers once per element (good for
 * sections below the fold). Respects prefers-reduced-motion.
 */
export function RevealOnScroll({
  children,
  className,
  amount = 0.25,
  y = 32,
  delay = 0,
}: RevealOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
