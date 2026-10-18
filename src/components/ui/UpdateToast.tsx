'use client';

import * as React from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface UpdateToastProps {
  onReload: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function UpdateToast({ onReload, onDismiss, className }: UpdateToastProps) {
  return (
    <div
      role="alert"
      className={cn(
        'fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-sm p-4 bg-surface border border-primary/40 rounded-card shadow-elevated flex items-center justify-between gap-3 animate-in fade-in duration-200',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center flex-shrink-0">
          <RefreshCw className="w-4 h-4" />
        </div>
        <div className="text-xs sm:text-sm">
          <p className="font-semibold text-text-primary">Pembaruan Tersedia</p>
          <p className="text-text-secondary text-[11px] mt-0.5">
            Muat ulang untuk fitur terbaru.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Button variant="primary" size="sm" onClick={onReload} className="h-8 px-3 text-xs">
          Muat Ulang
        </Button>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-sm text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
