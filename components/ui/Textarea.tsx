import * as React from 'react';
import {cn} from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[100px] w-full rounded-xl border border-border/60 bg-card px-3.5 py-2.5 text-sm text-heading',
          'placeholder:text-muted outline-none transition-all duration-300 resize-none',
          'hover:border-border focus:border-heading/30 focus:ring-2 focus:ring-heading/5',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export {Textarea};
