import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode } from 'react';

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
};

export function StaggerItem({ children, className }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={
        shouldReduceMotion
          ? undefined
          : {
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }
      }
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
