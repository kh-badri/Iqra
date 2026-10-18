'use client';

import * as React from 'react';
import type { Ayah } from '../types';
import { Bookmark, MoreVertical, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AyahCardProps {
  ayah: Ayah;
  surahNumber: number;
  fontSizeArabic: number;
  fontSizeTranslation: number;
  showTranslation: boolean;
  showTransliteration: boolean;
  isBookmarked: boolean;
  isActiveAudio?: boolean;
  onSelectAyah: () => void;
  onPlayAudio?: () => void;
}

export function AyahCard({
  ayah,
  surahNumber,
  fontSizeArabic,
  fontSizeTranslation,
  showTranslation,
  showTransliteration,
  isBookmarked,
  isActiveAudio = false,
  onSelectAyah,
  onPlayAudio,
}: AyahCardProps) {
  return (
    <div
      id={`ayah-${ayah.numberInSurah}`}
      onClick={onSelectAyah}
      className={cn(
        'p-4 sm:p-5 rounded-card border transition-all duration-150 cursor-pointer select-none',
        isActiveAudio
          ? 'bg-primary-soft/60 border-primary shadow-subtle'
          : 'bg-surface border-border hover:border-primary/40 hover:bg-surface-alt/50'
      )}
    >
      {/* Baris Atas: Nomor Ayat Beraksen Emas & Tombol Aksi Cepat */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/70">
        <div className="flex items-center gap-2">
          {/* Nomor Ayat Lingkaran Beraksen Emas */}
          <div className="w-8 h-8 rounded-full border border-accent bg-accent/10 text-accent font-bold text-xs flex items-center justify-center font-mono">
            {ayah.numberInSurah}
          </div>
          {isBookmarked && (
            <Bookmark className="w-4 h-4 fill-accent text-accent" />
          )}
        </div>

        <div className="flex items-center gap-1">
          {onPlayAudio && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayAudio();
              }}
              className="p-1.5 rounded-sm text-text-secondary hover:text-primary hover:bg-surface-alt transition-colors"
              aria-label={`Putar audio ayat ${ayah.numberInSurah}`}
            >
              <Play className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectAyah();
            }}
            className="p-1.5 rounded-sm text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
            aria-label="Menu aksi ayat"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Teks Arab Al-Qur'an (Amiri Quran) */}
      <div className="w-full text-right my-2">
        <p
          dir="rtl"
          className="font-arabic text-text-primary leading-[2.2] tracking-wide select-text"
          style={{ fontSize: `${fontSizeArabic}px` }}
        >
          {ayah.arabic}
        </p>
      </div>

      {/* Transliterasi Latin */}
      {showTransliteration && (
        <div className="mt-3 text-left">
          <p className="text-xs text-primary font-medium select-text leading-relaxed">
            {ayah.transliteration}
          </p>
        </div>
      )}

      {/* Terjemahan Bahasa Indonesia */}
      {showTranslation && (
        <div className="mt-2 text-left">
          <p
            className="text-text-secondary select-text leading-relaxed"
            style={{ fontSize: `${fontSizeTranslation}px` }}
          >
            {ayah.translation}
          </p>
        </div>
      )}
    </div>
  );
}
