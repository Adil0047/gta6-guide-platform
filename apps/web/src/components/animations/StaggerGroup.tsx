import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode } from 'react';

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
};

export function StaggerGroup({ children, className }: StaggerGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate={shouldReduceMotion ? undefined : 'visible'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
