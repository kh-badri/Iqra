import * as React from 'react';
import { cn } from '@/lib/utils';

export type ChipVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'pastel-green'
  | 'pastel-orange'
  | 'pastel-yellow'
  | 'pastel-purple'
  | 'pastel-cyan'
  | 'pastel-pink'
  | 'pastel-blue';

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ChipVariant;
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
  const variants: Record<ChipVariant, string> = {
    primary: active
      ? 'bg-primary-gradient text-on-primary border-transparent font-bold shadow-subtle'
      : 'bg-primary-soft text-primary-text border-transparent hover:bg-primary/20',
    secondary: active
      ? 'bg-text-primary text-surface border-text-primary font-bold'
      : 'bg-surface-alt text-text-secondary border-border hover:bg-border/60',
    accent: active
      ? 'bg-accent text-on-primary border-accent font-bold'
      : 'bg-accent-soft text-[#8A5E06] dark:text-[#FFE082] border-transparent hover:bg-accent/25',
    outline: active
      ? 'bg-primary-gradient text-on-primary border-transparent font-bold'
      : 'bg-transparent text-text-secondary border-border hover:border-text-primary hover:text-text-primary',
    'pastel-green': 'bg-pastel-green text-pastel-green-text border-transparent',
    'pastel-orange': 'bg-pastel-orange text-pastel-orange-text border-transparent',
    'pastel-yellow': 'bg-pastel-yellow text-pastel-yellow-text border-transparent',
    'pastel-purple': 'bg-pastel-purple text-pastel-purple-text border-transparent',
    'pastel-cyan': 'bg-pastel-cyan text-pastel-cyan-text border-transparent',
    'pastel-pink': 'bg-pastel-pink text-pastel-pink-text border-transparent',
    'pastel-blue': 'bg-pastel-blue text-pastel-blue-text border-transparent',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-semibold border transition-all duration-150 select-none whitespace-nowrap',
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
