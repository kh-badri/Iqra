import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Navigation, Settings2, Clock } from 'lucide-react';
import { PrayerCountdown } from './PrayerCountdown';
import type { CityLocation, PrayerTimeItem } from '../types';

export interface PrayerCardProps {
  city: CityLocation;
  nextPrayer: PrayerTimeItem | null;
  countdownFormatted?: string;
  masehiDateStr: string;
  hijriDateStr: string;
  isLocating?: boolean;
  onOpenCitySelector: () => void;
  onOpenSettings: () => void;
  onRequestGeolocation: () => void;
}

export function PrayerCard({
  city,
  nextPrayer,
  countdownFormatted,
  masehiDateStr,
  hijriDateStr,
  isLocating = false,
  onOpenCitySelector,
  onOpenSettings,
  onRequestGeolocation,
}: PrayerCardProps) {
  return (
    <div className="relative overflow-hidden rounded-card bg-primary-gradient text-[#0D3B13] shadow-elevated p-5 sm:p-6 card-highlight">
      {/* Decorative static transparent circles (GPU-friendly, 0 animation cost on low-spec phones) */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/20 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/15 pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 text-[#0D3B13]">
        {/* Baris Lokasi & Tanggal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#0D3B13]/15 pb-3.5">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCitySelector}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#0D3B13] hover:bg-white/45 transition-all bg-white/35 px-3 py-1.5 rounded-pill border border-white/40 active:scale-95 shadow-subtle"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0D3B13]" />
              <span>{city.name}</span>
            </button>

            <button
              onClick={onRequestGeolocation}
              disabled={isLocating}
              className="p-2 rounded-full bg-white/30 hover:bg-white/40 text-[#0D3B13] transition-all active:scale-95 border border-white/40"
              title="Deteksi Lokasi GPS Otomatis"
              aria-label="Deteksi Lokasi GPS"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="text-left sm:text-right text-[11px] text-[#0D3B13]/85">
            <div className="font-semibold">{masehiDateStr}</div>
            <div className="text-[#0D3B13] font-extrabold mt-0.5">{hijriDateStr}</div>
          </div>
        </div>

        {/* Konten Waktu Sholat Berikutnya */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0D3B13] animate-pulse-dot" />
              <span className="text-xs uppercase tracking-wider text-[#0D3B13]/85 font-extrabold">
                Sholat Berikutnya
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1.5 flex items-baseline gap-3 text-[#0D3B13]">
              <span>{nextPrayer?.name || 'Subuh'}</span>
              <span className="text-[#0D3B13] font-black font-mono text-2xl sm:text-3xl tabular-nums">
                {nextPrayer?.timeStr || '--:--'}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-3.5 h-3.5 text-[#0D3B13]/75" />
              <span className="text-xs text-[#0D3B13]/85 font-medium">Menghitung mundur:</span>
              <span className="font-mono font-extrabold text-xs bg-white/40 text-[#0D3B13] px-2.5 py-0.5 rounded-button tabular-nums border border-white/50 shadow-subtle">
                <PrayerCountdown targetDate={nextPrayer?.date} />
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 bg-white text-[#0D3B13] font-extrabold text-xs h-10 px-4 rounded-pill shadow-elevated hover:bg-white/95 transition-all duration-150 active:scale-95"
            >
              <Settings2 className="w-3.5 h-3.5 text-[#0D3B13]" />
              <span>Pengaturan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
