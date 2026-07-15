'use client';

import {motion} from 'motion/react';
import {cn} from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({title, description, children, className}: PageHeaderProps) {
  return (
    <motion.div
      initial={{opacity: 0, y: 12}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.4, ease: 'easeOut'}}
      className={cn('flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8', className)}>
      <div>
        <h1 className="text-[28px] sm:text-[32px] font-semibold text-heading tracking-tight font-display">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted mt-1.5 max-w-xl">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </motion.div>
  );
}
