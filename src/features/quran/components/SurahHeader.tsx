'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings2, Play, Pause, ChevronLeft, ChevronRight, Mic, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import type { SurahDetail } from '../types';
import { useAudioPlayer } from '@/features/audio/store/useAudioPlayer';
import { QARI_LIST } from '@/features/audio/types';
import { QariSelectorModal } from '@/features/audio/components/QariSelectorModal';

export interface SurahHeaderProps {
  surah: SurahDetail;
  onOpenSettings: () => void;
  isPlaying?: boolean;
  onTogglePlayAll?: () => void;
}

export function SurahHeader({
  surah,
  onOpenSettings,
  isPlaying = false,
  onTogglePlayAll,
}: SurahHeaderProps) {
  const [isQariModalOpen, setIsQariModalOpen] = React.useState(false);
  const { selectedQariId } = useAudioPlayer();
  const currentQari =
    QARI_LIST.find((q) => q.id === selectedQariId) || QARI_LIST[0];

  // Surah 9 (At-Taubah) tidak diawali Basmalah
  // Surah 1 (Al-Fatihah) basmalah sudah menjadi ayat 1
  const showBasmalahHeader = surah.number !== 1 && surah.number !== 9;

  return (
    <div className="space-y-4">
      {/* Sticky Header Navigasi Atas */}
      <div className="sticky top-14 md:top-0 z-30 bg-surface/95 backdrop-blur-none border-b border-border -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/quran/">
            <Button variant="ghost" size="icon" aria-label="Kembali ke Daftar Surah">
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </Button>
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-2">
              <span>{surah.nameLatin}</span>
              <span className="font-arabic text-accent font-normal text-sm">
                ({surah.nameArabic})
              </span>
            </h1>
            <p className="text-[11px] text-text-secondary">
              Surah ke-{surah.number} · {surah.numberOfAyahs} Ayat · {surah.revelation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tombol Cepat Ganti Qori */}
          <button
            type="button"
            onClick={() => setIsQariModalOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 h-9 rounded-button bg-surface border border-border hover:bg-surface-alt text-xs text-text-primary transition-colors"
            title="Pilih Qori (Tersedia 6 Qori)"
          >
            <Mic className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="max-w-[75px] sm:max-w-[110px] truncate font-medium text-[11px] sm:text-xs">
              {currentQari.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-text-secondary flex-shrink-0" />
          </button>

          {onTogglePlayAll && (
            <Button
              variant={isPlaying ? 'primary' : 'secondary'}
              size="sm"
              onClick={onTogglePlayAll}
              className="gap-1.5 text-xs h-9"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Jeda</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-primary" />
                  <span className="hidden sm:inline">Putar Surah</span>
                </>
              )}
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            aria-label="Pengaturan Tampilan Al-Qur'an"
            className="h-9 w-9"
          >
            <Settings2 className="w-4 h-4 text-text-secondary" />
          </Button>
        </div>
      </div>

      {/* Hero Banner Surah (Flat card) */}
      <div className="p-5 sm:p-6 bg-surface border border-border rounded-card text-center space-y-3 shadow-subtle">
        <div className="flex items-center justify-center gap-2">
          <Chip variant="primary" className="text-xs">
            {surah.revelation}
          </Chip>
          <Chip variant="secondary" className="text-xs">
            {surah.numberOfAyahs} Ayat
          </Chip>
        </div>

        <div className="font-arabic text-3xl sm:text-4xl font-bold text-primary my-2">
          {surah.nameArabic}
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-text-primary">
          {surah.nameLatin}
        </h2>
        <p className="text-xs text-text-secondary italic">
          Artinya: "{surah.meaning}"
        </p>

        {/* Teks Basmalah di awal surah */}
        {showBasmalahHeader && (
          <div className="pt-4 border-t border-border mt-4">
            <p dir="rtl" className="font-arabic text-2xl text-accent leading-loose">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
            <p className="text-xs text-text-secondary mt-1">
              "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang"
            </p>
          </div>
        )}

        {/* Audio Tilawah Bar dengan Pilihan Qori */}
        <div className="pt-4 border-t border-border mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-alt/70 p-3 sm:p-3.5 rounded-card border border-border/80 text-left">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center flex-shrink-0">
              <Mic className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-text-secondary font-medium">Qori Aktif:</span>
                <span className="text-xs font-bold text-text-primary truncate">
                  {currentQari.name}
                </span>
                {currentQari.badge && (
                  <Chip variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
                    {currentQari.badge}
                  </Chip>
                )}
              </div>
              <p className="text-[11px] text-text-secondary truncate">
                {currentQari.description || 'Tersedia 6 Qori Tilawah Al-Qur\'an'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsQariModalOpen(true)}
              className="text-xs h-9 gap-1.5 flex-1 sm:flex-none justify-center"
            >
              <Mic className="w-3.5 h-3.5 text-primary" />
              <span>Ganti Qori (6 Pilihan)</span>
            </Button>
            {onTogglePlayAll && (
              <Button
                variant={isPlaying ? 'primary' : 'secondary'}
                size="sm"
                onClick={onTogglePlayAll}
                className="text-xs h-9 gap-1.5 flex-1 sm:flex-none justify-center"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current text-primary" />
                    <span>Putar Surah</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modal Pilihan Qori */}
      <QariSelectorModal
        isOpen={isQariModalOpen}
        onClose={() => setIsQariModalOpen(false)}
      />

      {/* Navigasi Surah Sebelumnya & Berikutnya */}
      <div className="flex items-center justify-between text-xs pt-1">
        {surah.prevSurah ? (
          <Link
            href={`/quran/${surah.prevSurah.number}/`}
            className="flex items-center gap-1 text-primary hover:text-primary-pressed font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{surah.prevSurah.name}</span>
          </Link>
        ) : (
          <div />
        )}

        {surah.nextSurah ? (
          <Link
            href={`/quran/${surah.nextSurah.number}/`}
            className="flex items-center gap-1 text-primary hover:text-primary-pressed font-semibold"
          >
            <span>{surah.nextSurah.name}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
