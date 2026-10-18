import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = 'Terjadi Kesalahan',
  message = 'Gagal memuat konten. Periksa koneksi internet Anda dan coba lagi.',
  onRetry,
  retryLabel = 'Coba Lagi',
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-card bg-surface border border-danger/30 my-4 shadow-subtle',
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-danger/10 flex items-center justify-center text-danger mb-3">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-text-secondary max-w-sm mb-4">
        {message}
      </p>
      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>{retryLabel}</span>
        </Button>
      )}
    </div>
  );
}
