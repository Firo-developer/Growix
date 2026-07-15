import {cn} from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export function Skeleton({className, variant = 'rect'}: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton-shimmer',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'rounded-md h-4',
        variant === 'rect' && 'rounded-xl',
        className,
      )}
    />
  );
}
