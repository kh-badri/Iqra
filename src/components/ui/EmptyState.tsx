import * as React from 'react';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-card bg-surface border border-border my-4 card-highlight',
        className
      )}
    >
      {/* Decorative subtle organic blob in background */}
      <div
        className="absolute -top-10 -right-10 w-44 h-44 bg-pastel-green opacity-40 organic-blob pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -bottom-10 -left-10 w-36 h-36 bg-pastel-yellow opacity-30 organic-blob pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 w-16 h-16 rounded-full bg-pastel-green text-primary flex items-center justify-center mb-4 shadow-subtle">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <h3 className="relative z-10 text-base sm:text-lg font-extrabold text-text-primary mb-1 tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="relative z-10 text-xs sm:text-sm text-text-secondary max-w-sm mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="sm"
          onClick={onAction}
          className="relative z-10 font-bold"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
