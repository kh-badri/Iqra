import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'rounded' | 'card';
}

export function Skeleton({ className, variant = 'rounded', ...props }: SkeletonProps) {
  const variants = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-button',
    card: 'rounded-card',
  };

  return (
    <div
      className={cn(
        'bg-surface-alt animate-shimmer-wave',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
