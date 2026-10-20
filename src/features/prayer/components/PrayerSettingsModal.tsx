'use client';

import * as React from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Check, Play, Square, Sparkles, Bell, Volume2 } from 'lucide-react';
import type { AdhanSoundType, PrayerName, PrayerSettings } from '../types';
import { DEFAULT_PRAYER_SETTINGS, ADHAN_MUADHIN_LIST } from '../constants';
import { testAdhanNotification } from '../services/prayerNotifierService';

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

  // Audio preview state
  const [playingPreview, setPlayingPreview] = React.useState<{
    muadhinId: string;
    type: 'standard' | 'fajr';
  } | null>(null);
  const previewAudioRef = React.useRef<HTMLAudioElement | null>(null);

  // Uji coba notifikasi & suara
  const [isTesting, setIsTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<string | null>(null);

  const handleTestNotification = async () => {
    stopPreview();
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testAdhanNotification();
      setTestResult(res.message);
    } catch (err: any) {
      setTestResult(err.message || 'Gagal tes.');
    } finally {
      setIsTesting(false);
    }
  };

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Stop preview audio helper
  const stopPreview = React.useCallback(() => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current = null;
    }
    setPlayingPreview(null);
  }, []);

  // Stop audio whenever modal closes or unmounts
  React.useEffect(() => {
    if (!isOpen) {
      stopPreview();
    }
  }, [isOpen, stopPreview]);

  React.useEffect(() => {
    return () => {
      stopPreview();
    };
  }, [stopPreview]);

  const soundOptions: { id: AdhanSoundType; label: string; desc: string }[] = [
    { id: 'chime', label: 'Bip / Lonceng Lembut', desc: 'Nada bel elektronik santai' },
    { id: 'short', label: 'Adzan Ringkas (35 dtk)', desc: 'Takbir awal panggilan sholat' },
    { id: 'full', label: 'Adzan Lengkap', desc: 'Lantunan kumandang penuh' },
    { id: 'silent', label: 'Senyap', desc: 'Hanya notifikasi layar' },
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

  const handleTogglePreview = (muadhinId: string, type: 'standard' | 'fajr') => {
    if (playingPreview?.muadhinId === muadhinId && playingPreview?.type === type) {
      stopPreview();
      return;
    }

    stopPreview();

    const muadhin = ADHAN_MUADHIN_LIST.find((m) => m.id === muadhinId);
    if (!muadhin) return;

    const src = type === 'fajr' ? muadhin.audioFajr : muadhin.audioStandard;
    const audio = new Audio(src);
    previewAudioRef.current = audio;

    audio.onended = () => {
      setPlayingPreview(null);
      previewAudioRef.current = null;
    };

    audio.onerror = () => {
      setPlayingPreview(null);
      previewAudioRef.current = null;
    };

    audio.play().catch(() => {
      setPlayingPreview(null);
      previewAudioRef.current = null;
    });

    setPlayingPreview({ muadhinId, type });
  };

  const handleSave = () => {
    stopPreview();
    onSaveSettings(localSettings);
    onClose();
  };

  const handleReset = () => {
    stopPreview();
    setLocalSettings(DEFAULT_PRAYER_SETTINGS);
  };

  const handleClose = () => {
    stopPreview();
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="Pengaturan Jadwal & Pengingat">
      <div className="space-y-6 py-2 pb-6">
        {/* 1. Suara Pengingat */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-secondary mb-2.5">
            Format Suara Pengingat
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            {soundOptions.map((opt) => {
              const active = localSettings.soundType === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setLocalSettings({ ...localSettings, soundType: opt.id })}
                  className={`p-3 rounded-card text-left border transition-all active:scale-[0.98] ${
                    active
                      ? 'bg-pastel-green border-primary text-primary-text font-bold shadow-subtle ring-1 ring-primary/30'
                      : 'bg-surface border-border text-text-primary hover:bg-surface-alt'
                  }`}
                >
                  <div className="text-xs font-extrabold">{opt.label}</div>
                  <div className="text-[10px] text-text-muted mt-0.5">{opt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Pilihan Qori & Muadzin Adzan */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-secondary">
              Pilihan Qori &amp; Muadzin Adzan
            </h4>
            <span className="text-[11px] font-bold text-primary-text bg-pastel-green px-2 py-0.5 rounded-pill">
              {ADHAN_MUADHIN_LIST.length} Pilihan Muadzin
            </span>
          </div>

          {/* Info Card Pembeda Adzan Subuh vs Sholat Lain */}
          <div className="p-3 mb-3 rounded-card bg-pastel-green/40 border border-primary/25 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-primary-text shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold text-text-primary text-[12px]">
                Adzan Subuh Berbeda dengan Sholat Lainnya
              </p>
              <p className="text-text-muted text-[11px] leading-relaxed">
                Adzan <strong>Subuh</strong> secara otomatis melantunkan lafaz Tatswib:
                <span className="inline-block font-arabic font-semibold text-primary-text mx-1">
                  «الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ»
                </span>
                (Ash-shalatu khairum-minan-naum). Sementara Dzuhur, Ashar, Maghrib, dan Isya menggunakan lafaz adzan standar.
              </p>
            </div>
          </div>

          {/* Daftar Kartu Muadzin */}
          <div className="space-y-2.5">
            {ADHAN_MUADHIN_LIST.map((m) => {
              const isSelected = (localSettings.adhanMuadhin || 'makkah') === m.id;
              const isPlayingStandard =
                playingPreview?.muadhinId === m.id && playingPreview?.type === 'standard';
              const isPlayingFajr =
                playingPreview?.muadhinId === m.id && playingPreview?.type === 'fajr';

              return (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-card border transition-all ${
                    isSelected
                      ? 'bg-pastel-green/20 border-primary ring-1 ring-primary/40 shadow-subtle'
                      : 'bg-surface border-border hover:bg-surface-alt'
                  }`}
                >
                  {/* Klik untuk memilih Muadzin */}
                  <div
                    onClick={() =>
                      setLocalSettings((prev) => ({ ...prev, adhanMuadhin: m.id }))
                    }
                    className="flex items-start justify-between gap-2.5 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center transition-all shrink-0 ${
                          isSelected
                            ? 'border-primary bg-primary text-on-primary'
                            : 'border-border bg-surface'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-xs text-text-primary">
                            {m.name}
                          </span>
                          {m.badge && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-pill bg-pastel-green text-primary-text border border-primary/20">
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-text-muted">{m.origin}</span>
                          <span className="text-text-muted/40">•</span>
                          <span className="font-arabic text-xs text-text-muted font-medium">
                            {m.arabicName}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-secondary mt-1 leading-snug">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Preview Audio (Standar vs Subuh) */}
                  <div className="mt-3 pt-2.5 border-t border-border/70 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-text-muted mr-0.5 shrink-0">
                      Tes Nada:
                    </span>

                    {/* Preview Adzan Standar (Dzuhur-Isya) */}
                    <button
                      type="button"
                      onClick={() => handleTogglePreview(m.id, 'standard')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-pill text-[11px] font-bold transition-all active:scale-95 border ${
                        isPlayingStandard
                          ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-subtle'
                          : 'bg-surface border-border text-text-primary hover:bg-surface-alt'
                      }`}
                    >
                      {isPlayingStandard ? (
                        <>
                          <Square className="w-3 h-3 fill-current" />
                          <span>Stop Standar</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Adzan Standar</span>
                        </>
                      )}
                    </button>

                    {/* Preview Adzan Subuh (Tatswib) */}
                    <button
                      type="button"
                      onClick={() => handleTogglePreview(m.id, 'fajr')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-pill text-[11px] font-bold transition-all active:scale-95 border ${
                        isPlayingFajr
                          ? 'bg-primary-gradient text-on-primary border-primary animate-pulse shadow-subtle'
                          : 'bg-surface border-border text-primary-text hover:bg-surface-alt'
                      }`}
                    >
                      {isPlayingFajr ? (
                        <>
                          <Square className="w-3 h-3 fill-current" />
                          <span>Stop Subuh</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Adzan Subuh</span>
                          <span className="text-[9px] px-1 py-0.5 rounded bg-primary/10 text-primary-text font-black">
                            Tatswib
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Waktu Pengingat Sebelum Masuk */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-secondary mb-2">
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
                  className={`p-3 rounded-button text-xs text-left border transition-all active:scale-95 ${
                    active
                      ? 'bg-pastel-green border-primary text-primary-text font-bold shadow-subtle'
                      : 'bg-surface border-border text-text-primary hover:bg-surface-alt'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Koreksi Menit Waktu Sholat (Ihtiyath Manual) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-text-secondary">
              Koreksi Waktu Sholat Manual (Menit)
            </h4>
            <span className="text-[11px] text-text-muted">Standar: 0 (+2 Kemenag)</span>
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
                  className="flex items-center justify-between p-2.5 bg-surface-alt rounded-button text-xs"
                >
                  <span className="font-bold text-text-primary">{names[p]}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdjustmentChange(p, -1)}
                      className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-sm hover:bg-border/60 active:scale-90"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold w-8 text-center text-text-primary tabular-nums">
                      {offset > 0 ? `+${offset}` : offset}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdjustmentChange(p, 1)}
                      className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-sm hover:bg-border/60 active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Uji Coba Pengingat & Suara Adzan Langsung */}
        <div className="p-3 bg-pastel-green/40 rounded-card border border-primary/25 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-xs font-extrabold text-text-primary">Uji Coba Pengingat HP</div>
              <div className="text-[10px] text-text-muted">Kirim notifikasi & bunyikan adzan sekarang</div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTestNotification}
              disabled={isTesting}
              className="gap-1.5 text-xs rounded-pill font-bold border-primary/40 text-primary-text hover:bg-pastel-green active:scale-95 shadow-xs shrink-0"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isTesting ? 'Menguji...' : 'Tes Notifikasi'}</span>
            </Button>
          </div>
          {testResult && (
            <div className="text-[11px] font-medium text-primary-text bg-white/70 dark:bg-black/20 p-2 rounded border border-primary/20">
              {testResult}
            </div>
          )}
        </div>

        {/* 6. Aksi Simpan & Reset */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
            Reset Default
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            className="text-xs px-6 font-extrabold rounded-pill shadow-subtle"
          >
            Simpan Pengaturan
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
