'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center p-1 bg-surface-alt border border-border rounded-pill max-w-full overflow-x-auto no-scrollbar',
        className
      )}
      role="tablist"
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'px-4 py-2 text-xs font-bold rounded-pill transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 focus:outline-none select-none active:scale-95',
              isActive
                ? 'bg-primary-gradient text-on-primary shadow-subtle'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.2 rounded-pill font-mono font-bold',
                  isActive
                    ? 'bg-on-primary/20 text-on-primary'
                    : 'bg-border text-text-secondary'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
