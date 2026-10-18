import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

export interface ListItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  leftContent?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  rightContent?: React.ReactNode;
  showChevron?: boolean;
  clickable?: boolean;
}

export function ListItem({
  className,
  leftContent,
  title,
  subtitle,
  rightContent,
  showChevron = false,
  clickable = false,
  ...props
}: ListItemProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-3.5 rounded-card transition-colors duration-150',
        clickable && 'cursor-pointer hover:bg-surface-alt active:bg-surface-alt/80',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {leftContent && <div className="flex-shrink-0">{leftContent}</div>}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-text-primary truncate">{title}</div>
          {subtitle && (
            <div className="text-xs text-text-secondary truncate mt-0.5">{subtitle}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
        {rightContent}
        {showChevron && <ChevronRight className="w-4 h-4 text-text-secondary" />}
      </div>
    </div>
  );
}
