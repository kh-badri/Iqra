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
      {/* Sticky Header Navigasi Atas dengan Glass Effect */}
      <div className="sticky top-14 md:top-0 z-30 glass-surface border-b border-border/80 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link href="/quran/">
            <button
              className="w-9 h-9 rounded-button bg-surface-alt flex items-center justify-center text-text-primary hover:bg-border/40 transition-colors active:scale-90"
              aria-label="Kembali ke Daftar Surah"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-text-primary flex items-center gap-2 leading-none">
              <span>{surah.nameLatin}</span>
              <span className="font-arabic text-primary-text font-bold text-sm">
                ({surah.nameArabic})
              </span>
            </h1>
            <p className="text-[11px] text-text-secondary mt-0.5 font-medium">
              Surah ke-{surah.number} · {surah.numberOfAyahs} Ayat · {surah.revelation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tombol Cepat Ganti Qori */}
          <button
            type="button"
            onClick={() => setIsQariModalOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 h-9 rounded-pill bg-surface-alt border border-border hover:bg-border/40 text-xs text-text-primary transition-all active:scale-95"
            title="Pilih Qori (Tersedia 6 Qori)"
          >
            <Mic className="w-3.5 h-3.5 text-primary-text flex-shrink-0" />
            <span className="max-w-[70px] sm:max-w-[100px] truncate font-bold text-[11px] sm:text-xs">
              {currentQari.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-text-secondary flex-shrink-0" />
          </button>

          {onTogglePlayAll && (
            <Button
              variant={isPlaying ? 'primary' : 'secondary'}
              size="sm"
              onClick={onTogglePlayAll}
              className="gap-1.5 text-xs h-9 px-3.5 rounded-pill font-bold"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Jeda</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current text-primary-text" />
                  <span className="hidden sm:inline">Putar Surah</span>
                </>
              )}
            </Button>
          )}

          <button
            onClick={onOpenSettings}
            aria-label="Pengaturan Tampilan Al-Qur'an"
            className="w-9 h-9 rounded-button bg-surface-alt border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-border/40 transition-colors active:scale-90"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Banner Surah (Modern Rounded Card 20px) */}
      <div className="p-5 sm:p-6 bg-surface border border-border rounded-card text-center space-y-3 shadow-card card-highlight">
        <div className="flex items-center justify-center gap-2">
          <Chip variant="pastel-green" className="text-xs font-bold">
            {surah.revelation}
          </Chip>
          <Chip variant="secondary" className="text-xs font-bold">
            {surah.numberOfAyahs} Ayat
          </Chip>
        </div>

        <div className="font-arabic text-3xl sm:text-4xl font-extrabold text-primary-text my-2">
          {surah.nameArabic}
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold text-text-primary tracking-tight">
          {surah.nameLatin}
        </h2>
        <p className="text-xs text-text-secondary italic">
          Artinya: &ldquo;{surah.meaning}&rdquo;
        </p>

        {/* Teks Basmalah di awal surah */}
        {showBasmalahHeader && (
          <div className="pt-4 border-t border-border mt-4">
            <p dir="rtl" className="font-arabic text-2xl text-text-primary leading-loose font-medium">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
            <p className="text-xs text-text-secondary mt-1">
              &ldquo;Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang&rdquo;
            </p>
          </div>
        )}

        {/* Audio Tilawah Bar dengan Pilihan Qori */}
        <div className="pt-4 border-t border-border mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-alt/80 p-3 sm:p-3.5 rounded-card border border-border text-left">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-9 h-9 rounded-full bg-pastel-green text-primary-text flex items-center justify-center flex-shrink-0 shadow-subtle">
              <Mic className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-text-secondary font-semibold">Qori:</span>
                <span className="text-xs font-extrabold text-text-primary truncate">
                  {currentQari.name}
                </span>
                {currentQari.badge && (
                  <Chip variant="secondary" className="text-[10px] py-0 px-1.5 h-4 font-bold">
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
              className="text-xs h-9 gap-1.5 flex-1 sm:flex-none justify-center rounded-pill font-bold"
            >
              <Mic className="w-3.5 h-3.5 text-primary-text" />
              <span>Ganti Qori</span>
            </Button>
            {onTogglePlayAll && (
              <Button
                variant={isPlaying ? 'secondary' : 'primary'}
                size="sm"
                onClick={onTogglePlayAll}
                className="text-xs h-9 gap-1.5 flex-1 sm:flex-none justify-center rounded-pill font-extrabold"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Putar Tilawah</span>
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
      <div className="flex items-center justify-between text-xs pt-1 px-1">
        {surah.prevSurah ? (
          <Link
            href={`/quran/${surah.prevSurah.number}/`}
            className="flex items-center gap-1 text-primary-text hover:text-primary font-bold"
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
            className="flex items-center gap-1 text-primary-text hover:text-primary font-bold"
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
