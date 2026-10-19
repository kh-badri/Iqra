import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
}

export function Card({
  className,
  hoverable = false,
  variant = 'default',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-card transition-all duration-200 card-highlight',
        variant === 'default' && 'shadow-card',
        variant === 'elevated' && 'shadow-elevated',
        variant === 'outlined' && 'shadow-none',
        variant === 'flat' && 'shadow-none border-transparent bg-surface-alt',
        hoverable &&
          'hover:-translate-y-0.5 hover:shadow-elevated hover:border-primary/40 cursor-pointer active:scale-[0.98] active:translate-y-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
