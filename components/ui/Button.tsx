'use client';

import {cn} from '@/lib/utils';
import {type ButtonHTMLAttributes, forwardRef} from 'react';

type ButtonVariant = 'dark' | 'gray' | 'ghost' | 'text';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<ButtonVariant, string> = {
  dark: 'bg-btn-dark text-white hover:bg-heading active:opacity-85 dark:text-[#191B1F] dark:hover:bg-[#FAFAFA]',
  gray: 'bg-gray text-text hover:bg-[#E8E8EA] hover:text-heading active:bg-[#E0E0E2] dark:hover:bg-white/10 dark:active:bg-white/15',
  ghost: 'bg-transparent text-text hover:bg-gray/70 hover:text-heading',
  text: 'bg-transparent text-heading font-medium hover:opacity-70',
};

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-8 px-3 text-[14px] gap-1.5',
  md: 'h-9 px-4 text-[14px] gap-2',
  lg: 'h-10 px-5 text-[14px] gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({variant = 'dark', size = 'md', className, children, ...props}, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-200 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&>svg]:text-current',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
