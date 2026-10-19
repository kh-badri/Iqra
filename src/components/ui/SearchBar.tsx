'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  onFilterClick?: () => void;
  hasActiveFilter?: boolean;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      value,
      onChange,
      onClear,
      onFilterClick,
      hasActiveFilter = false,
      placeholder = 'Cari...',
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('relative flex items-center w-full gap-2', className)}>
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-text-secondary pointer-events-none" />
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-12 pl-11 pr-10 text-[15px] sm:text-sm bg-surface-alt border border-border rounded-input text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-surface transition-all duration-150"
            {...props}
          />
          {value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3.5 p-1 rounded-full text-text-secondary hover:text-text-primary hover:bg-border/40 focus:outline-none active:scale-90 transition-all"
              aria-label="Bersihkan pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {onFilterClick && (
          <button
            type="button"
            onClick={onFilterClick}
            className={cn(
              'h-12 w-12 rounded-input flex items-center justify-center border transition-all duration-150 active:scale-95 flex-shrink-0',
              hasActiveFilter
                ? 'bg-primary-gradient text-on-primary border-transparent shadow-subtle'
                : 'bg-surface-alt border-border text-text-secondary hover:text-primary hover:border-primary/40'
            )}
            aria-label="Filter pencarian"
            title="Filter"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';
