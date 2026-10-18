'use client';

import * as React from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { useAudioPlayer } from '@/features/audio/store/useAudioPlayer';
import { QARI_LIST } from '@/features/audio/types';
import { QariSelectorModal } from '@/features/audio/components/QariSelectorModal';

export interface QuranReaderSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  fontSizeArabic: number;
  setFontSizeArabic: (size: number) => void;
  fontSizeTranslation: number;
  setFontSizeTranslation: (size: number) => void;
  showTranslation: boolean;
  setShowTranslation: (show: boolean) => void;
  showTransliteration: boolean;
  setShowTransliteration: (show: boolean) => void;
}

export function QuranReaderSettings({
  isOpen,
  onClose,
  fontSizeArabic,
  setFontSizeArabic,
  fontSizeTranslation,
  setFontSizeTranslation,
  showTranslation,
  setShowTranslation,
  showTransliteration,
  setShowTransliteration,
}: QuranReaderSettingsProps) {
  const [isQariModalOpen, setIsQariModalOpen] = React.useState(false);
  const { selectedQariId } = useAudioPlayer();
  const currentQari =
    QARI_LIST.find((q) => q.id === selectedQariId) || QARI_LIST[0];

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Pengaturan Tampilan Al-Qur'an">
      <div className="space-y-5 py-2">
        {/* Font Size Arab */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text-primary">Ukuran Teks Arab</span>
            <Chip variant="secondary" className="font-mono text-xs py-0.5">
              {fontSizeArabic} px
            </Chip>
          </div>
          <Slider
            min={22}
            max={44}
            step={2}
            value={fontSizeArabic}
            onChange={(e) => setFontSizeArabic(Number(e.target.value))}
          />
        </div>

        {/* Font Size Terjemahan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-text-primary">Ukuran Teks Terjemahan</span>
            <Chip variant="secondary" className="font-mono text-xs py-0.5">
              {fontSizeTranslation} px
            </Chip>
          </div>
          <Slider
            min={12}
            max={20}
            step={1}
            value={fontSizeTranslation}
            onChange={(e) => setFontSizeTranslation(Number(e.target.value))}
          />
        </div>

        {/* Toggles */}
        <div className="pt-2 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-text-primary">
                Tampilkan Terjemahan
              </p>
              <p className="text-[11px] text-text-secondary">
                Bahasa Indonesia resmi Kemenag RI
              </p>
            </div>
            <Switch checked={showTranslation} onChange={setShowTranslation} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-text-primary">
                Tampilkan Transliterasi Latin
              </p>
              <p className="text-[11px] text-text-secondary">
                Panduan pelafalan huruf Arab
              </p>
            </div>
            <Switch checked={showTransliteration} onChange={setShowTransliteration} />
          </div>
        </div>

        {/* Pilihan Qori Tilawah */}
        <div className="pt-2 border-t border-border space-y-2">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs sm:text-sm font-semibold text-text-primary">
                Qori Tilawah Suara
              </p>
              <p className="text-[11px] text-text-secondary truncate">
                {currentQari.name} (Tersedia 6 Qori)
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsQariModalOpen(true)}
              className="text-xs h-8 flex-shrink-0"
            >
              Ganti Qori
            </Button>
          </div>
        </div>
      </div>

      <QariSelectorModal
        isOpen={isQariModalOpen}
        onClose={() => setIsQariModalOpen(false)}
      />
    </BottomSheet>
  );
}
