import {cn} from '@/lib/utils';
import {type HTMLAttributes} from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
};

export function Card({padding = 'md', className, children, ...props}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[24px] border border-border/60 bg-card',
        paddingStyles[padding],
        className,
      )}
      {...props}>
      {children}
    </div>
  );
}
