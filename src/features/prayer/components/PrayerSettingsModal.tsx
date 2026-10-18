'use client';

import * as React from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import type { AdhanSoundType, PrayerName, PrayerSettings } from '../types';
import { DEFAULT_PRAYER_SETTINGS } from '../constants';

export interface PrayerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PrayerSettings;
  onSaveSettings: (settings: PrayerSettings) => void;
}

export function PrayerSettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}: PrayerSettingsModalProps) {
  const [localSettings, setLocalSettings] = React.useState<PrayerSettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const soundOptions: { id: AdhanSoundType; label: string }[] = [
    { id: 'chime', label: 'Bip / Lonceng Lembut' },
    { id: 'short', label: 'Adzan Pendek' },
    { id: 'full', label: 'Adzan Penuh' },
    { id: 'silent', label: 'Senyap (Hanya Notifikasi)' },
  ];

  const reminderOptions = [
    { value: 0, label: 'Saat Waktu Tiba' },
    { value: 5, label: '5 Menit Sebelumnya' },
    { value: 10, label: '10 Menit Sebelumnya' },
    { value: 15, label: '15 Menit Sebelumnya' },
  ];

  const handleAdjustmentChange = (p: PrayerName, delta: number) => {
    setLocalSettings((prev) => ({
      ...prev,
      adjustments: {
        ...prev.adjustments,
        [p]: Math.min(5, Math.max(-5, (prev.adjustments[p] || 0) + delta)),
      },
    }));
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_PRAYER_SETTINGS);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Pengaturan Jadwal & Pengingat">
      <div className="space-y-5 py-2">
        {/* Suara Pengingat */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
            Pilihan Suara Pengingat
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {soundOptions.map((opt) => {
              const active = localSettings.soundType === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setLocalSettings({ ...localSettings, soundType: opt.id })}
                  className={`p-2.5 rounded-card text-xs text-left border transition-colors ${
                    active
                      ? 'bg-primary-soft border-primary text-primary font-semibold'
                      : 'bg-surface border-border text-text-primary hover:bg-surface-alt'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Waktu Pengingat Sebelum Masuk */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
            Pemberitahuan Waktu
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {reminderOptions.map((opt) => {
              const active = localSettings.reminderMinutesBefore === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() =>
                    setLocalSettings({ ...localSettings, reminderMinutesBefore: opt.value })
                  }
                  className={`p-2.5 rounded-card text-xs text-left border transition-colors ${
                    active
                      ? 'bg-primary-soft border-primary text-primary font-semibold'
                      : 'bg-surface border-border text-text-primary hover:bg-surface-alt'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Koreksi Menit Waktu Sholat (Ihtiyath Manual) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Koreksi Waktu Sholat Manual (Menit)
            </h4>
            <span className="text-[11px] text-text-secondary">Standar: 0 (+2 Kemenag)</span>
          </div>

          <div className="space-y-1.5">
            {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as PrayerName[]).map((p) => {
              const names: Record<string, string> = {
                fajr: 'Subuh',
                dhuhr: 'Dzuhur',
                asr: 'Ashar',
                maghrib: 'Maghrib',
                isha: 'Isya',
              };
              const offset = localSettings.adjustments[p] || 0;

              return (
                <div
                  key={p}
                  className="flex items-center justify-between p-2.5 bg-surface-alt rounded-card text-xs"
                >
                  <span className="font-semibold text-text-primary">{names[p]}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAdjustmentChange(p, -1)}
                      className="w-7 h-7 rounded-sm bg-surface border border-border flex items-center justify-center font-bold text-sm hover:bg-border/60"
                    >
                      -
                    </button>
                    <span className="font-mono font-semibold w-8 text-center text-text-primary">
                      {offset > 0 ? `+${offset}` : offset}
                    </span>
                    <button
                      onClick={() => handleAdjustmentChange(p, 1)}
                      className="w-7 h-7 rounded-sm bg-surface border border-border flex items-center justify-center font-bold text-sm hover:bg-border/60"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Aksi Simpan & Reset */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
            Reset Default
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} className="text-xs px-6">
            Simpan Pengaturan
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
