'use client';

import * as React from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Play, Bookmark, Copy, Share2, BookOpen, Check } from 'lucide-react';
import type { Ayah, SurahDetail } from '../types';

export interface AyahActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  surah: SurahDetail;
  ayah: Ayah | null;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onPlayAudio?: () => void;
}

export function AyahActionSheet({
  isOpen,
  onClose,
  surah,
  ayah,
  isBookmarked,
  onToggleBookmark,
  onPlayAudio,
}: AyahActionSheetProps) {
  const [copied, setCopied] = React.useState(false);
  const [showTafsir, setShowTafsir] = React.useState(false);

  if (!ayah) return null;

  const handleCopy = () => {
    const textToCopy = `${ayah.arabic}\n\n"${ayah.translation}"\n\n(QS. ${surah.nameLatin}: ${ayah.numberInSurah} - Sumber: Kemenag RI)`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    const textToShare = `${ayah.arabic}\n\n"${ayah.translation}"\n\n(QS. ${surah.nameLatin}: ${ayah.numberInSurah} - Sumber: Kemenag RI)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QS. ${surah.nameLatin}: ${ayah.numberInSurah}`,
          text: textToShare,
          url: window.location.href,
        });
      } catch (e) {
        // user cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={() => {
        setShowTafsir(false);
        onClose();
      }}
      title={`QS. ${surah.nameLatin} : Ayat ${ayah.numberInSurah}`}
    >
      <div className="space-y-4 py-2">
        {/* Teks Ringkas Ayat */}
        <div className="p-3 bg-surface-alt rounded-card text-right">
          <p dir="rtl" className="font-arabic text-lg text-text-primary leading-loose">
            {ayah.arabic}
          </p>
          <p className="text-xs text-text-secondary text-left mt-2 italic">
            "{ayah.translation}"
          </p>
        </div>

        {/* Tafsir Ringkas Bila Diaktifkan */}
        {showTafsir && (
          <div className="p-3.5 bg-primary-soft/50 border border-primary/20 rounded-card text-xs text-text-primary leading-relaxed space-y-1">
            <p className="font-semibold text-primary">Tafsir Ringkas Kemenag:</p>
            <p>
              {surah.description || 'Tafsir ayat merujuk pada penjelasan Mushaf Standar Kemenag RI.'}
            </p>
          </div>
        )}

        {/* Menu Aksi Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          {onPlayAudio && (
            <Button
              variant="secondary"
              className="gap-2 text-xs min-h-[44px] font-bold"
              onClick={() => {
                onPlayAudio();
                onClose();
              }}
            >
              <Play className="w-4 h-4 text-primary-text" />
              <span>Putar Ayat</span>
            </Button>
          )}

          <Button
            variant="secondary"
            className="gap-2 text-xs min-h-[44px] font-bold"
            onClick={onToggleBookmark}
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? 'fill-warning text-warning' : 'text-text-secondary'}`}
            />
            <span>{isBookmarked ? 'Hapus Bookmark' : 'Simpan Bookmark'}</span>
          </Button>

          <Button
            variant="secondary"
            className="gap-2 text-xs min-h-[44px] font-bold"
            onClick={() => setShowTafsir(!showTafsir)}
          >
            <BookOpen className="w-4 h-4 text-primary-text" />
            <span>{showTafsir ? 'Tutup Tafsir' : 'Lihat Tafsir'}</span>
          </Button>

          <Button
            variant="secondary"
            className="gap-2 text-xs min-h-[44px] font-bold"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4 text-text-secondary" />
            )}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </Button>

          <Button
            variant="primary"
            className="gap-2 text-xs col-span-2 min-h-[48px] font-extrabold shadow-subtle"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan Ayat &amp; Terjemahan</span>
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
