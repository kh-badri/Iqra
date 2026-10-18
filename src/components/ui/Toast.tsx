'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastProps {
  id?: string;
  type?: ToastType;
  message: string;
  onClose?: () => void;
  className?: string;
}

export function Toast({ type = 'info', message, onClose, className }: ToastProps) {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-danger flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-primary flex-shrink-0" />,
  };

  const borders = {
    success: 'border-success/30',
    warning: 'border-warning/30',
    error: 'border-danger/30',
    info: 'border-primary/30',
  };

  return (
    <div
      role="status"
      className={cn(
        'flex items-center gap-3 p-3.5 bg-surface border rounded-card shadow-elevated text-sm text-text-primary max-w-sm w-full transition-all duration-200',
        borders[type],
        className
      )}
    >
      {icons[type]}
      <div className="flex-1 text-xs sm:text-sm font-medium">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-sm text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
          aria-label="Tutup pesan"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
