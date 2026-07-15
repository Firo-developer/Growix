'use client';

import * as ProgressPrimitive from '@radix-ui/react-progress';
import {cn} from '@/lib/utils';

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
}

export function Progress({className, value, indicatorClassName, ...props}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-gray', className)}
      {...props}>
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full rounded-full bg-heading transition-all duration-500 ease-out',
          indicatorClassName,
        )}
        style={{transform: `translateX(-${100 - (value || 0)}%)`}}
      />
    </ProgressPrimitive.Root>
  );
}
