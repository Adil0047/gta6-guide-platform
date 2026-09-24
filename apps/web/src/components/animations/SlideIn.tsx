import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode } from 'react';

type SlideInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Direction the content slides in from. */
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
};

const OFFSET: Record<NonNullable<SlideInProps['direction']>, { x: number; y: number }> = {
  left: { x: -48, y: 0 },
  right: { x: 48, y: 0 },
  up: { x: 0, y: 48 },
  down: { x: 0, y: -48 },
};

export function SlideIn({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance,
}: SlideInProps) {
  const shouldReduceMotion = useReducedMotion();
  const offset = OFFSET[direction];
  const x = distance ?? offset.x;
  const y = distance ?? offset.y;

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, x, y }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
