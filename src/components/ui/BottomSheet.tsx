'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto">
      {/* Backdrop with fade */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Dialog with 28px top radius & slide-up spring animation */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full max-w-lg bg-surface border border-border shadow-elevated z-10 overflow-hidden card-highlight animate-slide-up',
          'rounded-t-[28px] sm:rounded-card max-h-[85dvh] sm:max-h-[88vh] flex flex-col safe-bottom',
          className
        )}
      >
        {/* Drag handle for mobile */}
        <div className="w-12 h-1.5 bg-border rounded-pill mx-auto mt-3.5 mb-1 sm:hidden flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <div className="text-base font-bold text-text-primary tracking-tight">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors active:scale-90"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 overscroll-contain">{children}</div>
      </div>
    </div>,
    document.body
  );
}
