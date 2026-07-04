import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode } from 'react';

type ScaleInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function ScaleIn({ children, className, delay = 0 }: ScaleInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
