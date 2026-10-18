'use client';

import * as React from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useAudioPlayer } from '../store/useAudioPlayer';
import { QARI_LIST } from '../types';
import { Check, Mic, Volume2 } from 'lucide-react';
import { Chip } from '@/components/ui/Chip';
import { cn } from '@/lib/utils';

export interface QariSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (qariId: string) => void;
}

export function QariSelectorModal({
  isOpen,
  onClose,
  onSelect,
}: QariSelectorModalProps) {
  const { selectedQariId, setSelectedQariId } = useAudioPlayer();

  const handleSelect = (qariId: string) => {
    setSelectedQariId(qariId);
    if (onSelect) {
      onSelect(qariId);
    }
    onClose();
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center text-primary">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-text-primary">
              Pilihan Qori Tilawah
            </h3>
            <p className="text-[11px] text-text-secondary">
              Tersedia 6 Qori ternama dunia berformat audio jernih
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-3 py-2">
        <p className="text-xs text-text-secondary leading-relaxed">
          Pilih lantunan suara Qori yang Anda sukai untuk memutar surah dan ayat Al-Qur'an.
        </p>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {QARI_LIST.map((q) => {
            const isSelected = q.id === selectedQariId;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => handleSelect(q.id)}
                className={cn(
                  'w-full p-3.5 rounded-card text-left transition-all duration-150 border flex items-start justify-between gap-3',
                  isSelected
                    ? 'bg-primary-soft border-primary shadow-subtle'
                    : 'bg-surface border-border hover:border-primary/40 hover:bg-surface-alt'
                )}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold font-mono transition-colors',
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-surface-alt text-text-secondary border border-border'
                    )}
                  >
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          'text-xs sm:text-sm font-semibold truncate',
                          isSelected ? 'text-primary' : 'text-text-primary'
                        )}
                      >
                        {q.name}
                      </span>
                      {q.badge && (
                        <Chip
                          variant={isSelected ? 'primary' : 'secondary'}
                          className="text-[10px] py-0 px-1.5 h-4"
                        >
                          {q.badge}
                        </Chip>
                      )}
                    </div>

                    {q.arabicName && (
                      <div className="font-arabic text-sm text-accent font-normal leading-normal">
                        {q.arabicName}
                      </div>
                    )}

                    {q.description && (
                      <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
                        {q.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center self-center flex-shrink-0 ml-2">
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border flex items-center justify-center transition-colors',
                      isSelected
                        ? 'border-primary bg-primary'
                        : 'border-border bg-surface'
                    )}
                  >
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="p-3 bg-surface-alt border border-border rounded-card text-[11px] text-text-secondary leading-relaxed">
          Pilihan Qori akan otomatis tersimpan secara permanen di perangkat ini dan langsung aktif pada pemutar audio surah serta ayat.
        </div>
      </div>
    </BottomSheet>
  );
}
