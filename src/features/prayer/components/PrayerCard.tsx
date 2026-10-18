import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { MapPin, Navigation, Settings2 } from 'lucide-react';
import type { CityLocation, PrayerTimeItem } from '../types';

export interface PrayerCardProps {
  city: CityLocation;
  nextPrayer: PrayerTimeItem | null;
  countdownFormatted: string;
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
    <Card className="bg-primary text-white border-transparent p-5 sm:p-6 shadow-elevated space-y-4">
      {/* Baris Lokasi & Tanggal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCitySelector}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white hover:text-white/80 transition-colors bg-white/10 px-2.5 py-1 rounded-card border border-white/20"
          >
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span>{city.name}</span>
          </button>

          <button
            onClick={onRequestGeolocation}
            disabled={isLocating}
            className="p-1.5 rounded-card bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Deteksi Lokasi GPS Otomatis"
            aria-label="Deteksi Lokasi GPS"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="text-right text-[11px] text-white/80">
          <div>{masehiDateStr}</div>
          <div className="text-accent font-semibold">{hijriDateStr}</div>
        </div>
      </div>

      {/* Konten Waktu Sholat Berikutnya */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-white/80 font-medium">
              Sholat Berikutnya
            </span>
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
            {nextPrayer?.name || 'Subuh'}{' '}
            <span className="text-accent font-semibold font-mono">
              {nextPrayer?.timeStr || '--:--'}
            </span>
          </div>

          <p className="text-xs text-white/80 mt-1.5">
            Menghitung mundur:{' '}
            <span className="font-mono font-bold text-white bg-white/15 px-2 py-0.5 rounded-sm">
              {countdownFormatted}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="text-white hover:bg-white/15 border border-white/20 text-xs gap-1.5"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Pengaturan</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
