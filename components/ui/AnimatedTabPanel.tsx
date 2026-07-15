'use client';

import {type ReactNode} from 'react';
import {AnimatePresence, motion} from 'motion/react';

interface AnimatedTabPanelProps {
  activeTab: string;
  children: ReactNode;
  direction?: 'horizontal' | 'vertical';
}

export function AnimatedTabPanel({
  activeTab,
  children,
  direction = 'horizontal',
}: AnimatedTabPanelProps) {
  const offset = direction === 'horizontal' ? 14 : 10;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activeTab}
        initial={{opacity: 0, x: offset}}
        animate={{opacity: 1, x: 0}}
        exit={{opacity: 0, x: -offset}}
        transition={{duration: 0.32, ease: [0.22, 1, 0.36, 1]}}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
