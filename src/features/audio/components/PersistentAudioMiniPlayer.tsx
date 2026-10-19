'use client';

import * as React from 'react';
import { useAudioPlayer } from '../store/useAudioPlayer';
import { Play, Pause, SkipForward, SkipBack, X, Maximize2 } from 'lucide-react';
import { QARI_LIST } from '../types';
import { cn } from '@/lib/utils';
import { QariSelectorModal } from './QariSelectorModal';

export function PersistentAudioMiniPlayer() {
  const [isQariModalOpen, setIsQariModalOpen] = React.useState(false);
  const {
    track,
    isPlaying,
    currentTime,
    duration,
    selectedQariId,
    togglePlay,
    nextAyah,
    prevAyah,
    stopAndClose,
    openDrawer,
  } = useAudioPlayer();

  if (!track) return null;

  const currentAyah = track.ayahs.find((a) => a.numberInSurah === track.currentAyahNumber);
  const qari = QARI_LIST.find((q) => q.id === selectedQariId) || QARI_LIST[0];

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <div
        className={cn(
          'fixed z-40 transition-all duration-200 select-none animate-slide-up',
          // Floating tepat di atas floating bottom nav mobile
          'bottom-[82px] left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96',
          'bg-surface/95 backdrop-blur-md border border-border shadow-elevated rounded-card overflow-hidden card-highlight'
        )}
      >
        {/* Progress Bar with Lime-green Gradient */}
        <div className="w-full h-1 bg-surface-alt">
          <div
            className="h-full bg-primary-gradient transition-all duration-150"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>

        <div className="flex items-center justify-between p-3 gap-2">
          {/* Click to open full player drawer */}
          <div
            onClick={openDrawer}
            className="flex-1 min-w-0 cursor-pointer hover:opacity-85 transition-opacity"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-bold text-text-primary truncate">
                {track.surahName}
              </span>
              <span className="text-xs font-bold text-primary-text font-mono flex-shrink-0">
                : {track.currentAyahNumber}
              </span>
            </div>
            <div className="text-[11px] text-text-secondary truncate mt-0.5 flex items-center gap-1.5">
              <span className="truncate">{qari.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQariModalOpen(true);
                }}
                className="text-[10px] text-primary-text hover:underline font-bold flex-shrink-0 bg-pastel-green px-1.5 py-0.5 rounded-pill"
                title="Ganti Qori Tilawah"
              >
                Ganti
              </button>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={prevAyah}
              disabled={track.currentAyahNumber <= 1}
              className="p-1.5 text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors"
              aria-label="Ayat sebelumnya"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-primary-gradient text-on-primary flex items-center justify-center shadow-subtle active:scale-95 transition-transform"
              aria-label={isPlaying ? 'Jeda audio' : 'Putar audio'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={nextAyah}
              disabled={track.currentAyahNumber >= track.totalAyahs}
              className="p-1.5 text-text-secondary hover:text-text-primary disabled:opacity-30 transition-colors"
              aria-label="Ayat berikutnya"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={openDrawer}
              className="p-1.5 text-text-secondary hover:text-text-primary transition-colors ml-0.5"
              aria-label="Buka layar penuh pemutar"
              title="Perbesar Pemutar"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={stopAndClose}
              className="p-1.5 text-text-secondary hover:text-danger transition-colors"
              aria-label="Tutup pemutar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <QariSelectorModal
        isOpen={isQariModalOpen}
        onClose={() => setIsQariModalOpen(false)}
      />
    </>
  );
}
