'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, X, SkipForward, SkipBack } from 'lucide-react';

export interface AudioMiniPlayerProps {
  surahName?: string;
  ayahNumber?: number;
  qariName?: string;
  isPlaying?: boolean;
  progressPercent?: number;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onClose?: () => void;
  className?: string;
}

export function AudioMiniPlayer({
  surahName = 'Al-Fatihah',
  ayahNumber = 1,
  qariName = 'Mishary Rashid Alafasy',
  isPlaying = false,
  progressPercent = 0,
  onPlayPause,
  onNext,
  onPrev,
  onClose,
  className,
}: AudioMiniPlayerProps) {
  return (
    <div
      className={cn(
        'w-full bg-surface border border-border shadow-elevated rounded-card overflow-hidden',
        className
      )}
    >
      {/* Progress bar flat */}
      <div className="w-full h-1 bg-surface-alt">
        <div
          className="h-full bg-primary transition-all duration-200"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>

      <div className="flex items-center justify-between p-3 gap-3">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-sm font-semibold text-text-primary truncate">
            {surahName} <span className="text-accent font-normal">: Ayat {ayahNumber}</span>
          </div>
          <div className="text-[11px] text-text-secondary truncate mt-0.5">
            {qariName}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {onPrev && (
            <button
              onClick={onPrev}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-sm"
              aria-label="Ayat sebelumnya"
            >
              <SkipBack className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onPlayPause}
            className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-pressed transition-colors shadow-subtle active:scale-95"
            aria-label={isPlaying ? 'Jeda' : 'Putar'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {onNext && (
            <button
              onClick={onNext}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-sm"
              aria-label="Ayat berikutnya"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-text-secondary hover:text-text-primary transition-colors rounded-sm ml-1"
              aria-label="Tutup pemutar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
