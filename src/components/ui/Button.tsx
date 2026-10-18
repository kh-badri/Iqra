'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
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
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-primary text-white hover:bg-primary-pressed shadow-subtle border border-transparent',
      secondary:
        'bg-surface-alt text-text-primary hover:bg-border/60 border border-border shadow-subtle',
      ghost:
        'bg-transparent text-text-primary hover:bg-surface-alt hover:text-text-primary',
      danger:
        'bg-danger text-white hover:opacity-90 shadow-subtle border border-transparent',
    };

    const sizes = {
      sm: 'text-xs h-9 px-3 rounded-sm gap-1.5',
      md: 'text-sm h-11 px-5 rounded-card gap-2 min-h-[44px]',
      lg: 'text-base h-13 px-6 rounded-card gap-2.5 min-h-[48px]',
      icon: 'h-11 w-11 rounded-card min-h-[44px] min-w-[44px]',
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
