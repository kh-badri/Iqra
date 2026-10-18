import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  active?: boolean;
  clickable?: boolean;
}

export function Chip({
  className,
  variant = 'secondary',
  active = false,
  clickable = false,
  children,
  ...props
}: ChipProps) {
  const variants = {
    primary: active
      ? 'bg-primary text-white border-primary'
      : 'bg-primary-soft text-primary border-transparent hover:bg-primary/20',
    secondary: active
      ? 'bg-text-primary text-surface border-text-primary'
      : 'bg-surface-alt text-text-secondary border-border hover:bg-border/60',
    accent: active
      ? 'bg-accent text-white border-accent'
      : 'bg-accent/15 text-accent border-transparent hover:bg-accent/25',
    outline: active
      ? 'bg-primary text-white border-primary'
      : 'bg-transparent text-text-secondary border-border hover:border-text-primary hover:text-text-primary',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-medium border transition-colors duration-150 select-none whitespace-nowrap',
        variants[variant],
        clickable && 'cursor-pointer active:scale-95',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
