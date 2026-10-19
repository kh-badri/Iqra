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
        'p-4 sm:p-5 rounded-card border transition-all duration-200 cursor-pointer select-none card-highlight',
        isActiveAudio
          ? 'bg-pastel-green/40 border-primary shadow-glow ring-2 ring-primary/25'
          : 'bg-surface border-border hover:border-primary/40 hover:bg-surface-alt/40 shadow-card'
      )}
    >
      {/* Baris Atas: Nomor Ayat & Tombol Aksi Cepat (min 44x44px touch targets) */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
        <div className="flex items-center gap-2">
          {/* Nomor Ayat Lingkaran Pastel */}
          <div className="w-9 h-9 rounded-full bg-pastel-yellow text-[#8A5E06] dark:text-[#FFE082] font-extrabold text-xs flex items-center justify-center font-mono shadow-subtle">
            {ayah.numberInSurah}
          </div>
          {isBookmarked && (
            <Bookmark className="w-4 h-4 fill-warning text-warning" />
          )}
        </div>

        <div className="flex items-center gap-1">
          {onPlayAudio && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayAudio();
              }}
              className="w-10 h-10 rounded-button flex items-center justify-center text-text-secondary hover:text-primary-text hover:bg-surface-alt active:scale-90 transition-all"
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
            className="w-10 h-10 rounded-button flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-alt active:scale-90 transition-all"
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
          className="font-arabic text-text-primary leading-[2.2] tracking-wide select-text font-medium"
          style={{ fontSize: `${fontSizeArabic}px` }}
        >
          {ayah.arabic}
        </p>
      </div>

      {/* Transliterasi Latin */}
      {showTransliteration && (
        <div className="mt-3 text-left">
          <p className="text-xs text-primary-text font-semibold select-text leading-relaxed">
            {ayah.transliteration}
          </p>
        </div>
      )}

      {/* Terjemahan Bahasa Indonesia */}
      {showTranslation && (
        <div className="mt-2 text-left">
          <p
            className="text-text-secondary select-text leading-relaxed font-normal"
            style={{ fontSize: `${fontSizeTranslation}px` }}
          >
            {ayah.translation}
          </p>
        </div>
      )}
    </div>
  );
}
