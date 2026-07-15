'use client';

import {useRef, useState, type ReactNode} from 'react';
import {AnimatePresence, motion, type TargetAndTransition} from 'motion/react';
import {cn} from '@/lib/utils';

type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: TooltipSide;
  className?: string;
  delay?: number;
}

const sideStyles: Record<TooltipSide, {container: string}> = {
  top: {
    container: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  },
  bottom: {
    container: 'top-full left-1/2 -translate-x-1/2 mt-2',
  },
  left: {
    container: 'right-full top-1/2 -translate-y-1/2 mr-2',
  },
  right: {
    container: 'left-full top-1/2 -translate-y-1/2 ml-2',
  },
};

const motionOffset: Record<TooltipSide, {initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition}> = {
  top: {initial: {opacity: 0, y: 4}, animate: {opacity: 1, y: 0}, exit: {opacity: 0, y: 4}},
  bottom: {initial: {opacity: 0, y: -4}, animate: {opacity: 1, y: 0}, exit: {opacity: 0, y: -4}},
  left: {initial: {opacity: 0, x: 4}, animate: {opacity: 1, x: 0}, exit: {opacity: 0, x: 4}},
  right: {initial: {opacity: 0, x: -4}, animate: {opacity: 1, x: 0}, exit: {opacity: 0, x: -4}},
};

export function Tooltip({
  content,
  children,
  side = 'top',
  className,
  delay = 120,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = () => {
    clearTimeout(hideTimer.current);
    showTimer.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 80);
  };

  const styles = sideStyles[side];
  const offset = motionOffset[side];

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}>
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            role="tooltip"
            initial={offset.initial}
            animate={offset.animate}
            exit={offset.exit}
            transition={{duration: 0.18, ease: [0.22, 1, 0.36, 1]}}
            className={cn('absolute z-[300] pointer-events-none', styles.container)}>
            <div className="bg-[#2D2F34] px-2 py-1 text-[11px] font-semibold leading-4 text-white shadow-[0_5px_14px_rgba(0,0,0,0.2)] dark:bg-[#2D2F34] rounded-[8px] whitespace-nowrap">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
