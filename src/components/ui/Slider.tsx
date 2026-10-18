'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  valueDisplay?: string | number;
}

export function Slider({
  className,
  label,
  valueDisplay,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  ...props
}: SliderProps) {
  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {(label || valueDisplay !== undefined) && (
        <div className="flex items-center justify-between text-xs text-text-secondary">
          {label && <span>{label}</span>}
          {valueDisplay !== undefined && (
            <span className="font-mono font-medium text-text-primary">
              {valueDisplay}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-surface-alt rounded-pill appearance-none cursor-pointer accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        {...props}
      />
    </div>
  );
}
