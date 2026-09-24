import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode } from 'react';

type BlurInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Blur-to-focus entrance. The element starts blurred + slightly scaled down,
 * then sharpens + settles into place. Great for hero headings where you want
 * a cinematic "focusing" feel.
 */
export function BlurIn({ children, className, delay = 0 }: BlurInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, filter: 'blur(14px)', scale: 0.98 }}
      animate={
        shouldReduceMotion
          ? undefined
          : { opacity: 1, filter: 'blur(0px)', scale: 1 }
      }
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
