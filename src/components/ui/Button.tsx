'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'cta';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold tracking-tight transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97]';

    const variants = {
      primary:
        'bg-primary-gradient text-on-primary shadow-elevated hover:brightness-[1.03] active:brightness-[0.96] border-none',
      secondary:
        'bg-surface-alt text-text-primary hover:bg-border/60 border border-border shadow-subtle',
      outline:
        'bg-transparent text-primary-text border border-primary/40 hover:bg-primary-soft/50 hover:border-primary',
      ghost:
        'bg-transparent text-text-primary hover:bg-surface-alt hover:text-primary-text',
      danger:
        'bg-danger text-white hover:opacity-90 shadow-subtle border-none',
    };

    const sizes = {
      sm: 'text-xs h-9 px-3.5 rounded-button gap-1.5 min-h-[38px]',
      md: 'text-sm h-11 px-5 rounded-button gap-2 min-h-[44px]',
      lg: 'text-base h-12 px-6 rounded-button gap-2.5 min-h-[48px]',
      cta: 'text-base h-[52px] w-full px-6 rounded-button gap-2.5 min-h-[52px] font-extrabold',
      icon: 'h-11 w-11 rounded-button min-h-[44px] min-w-[44px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Memuat...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
