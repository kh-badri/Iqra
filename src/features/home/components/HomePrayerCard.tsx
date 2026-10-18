'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { usePrayerTimes } from '@/features/prayer/hooks/usePrayerTimes';
import { MapPin } from 'lucide-react';

export function HomePrayerCard() {
  const { city, nextPrayer, countdownFormatted } = usePrayerTimes();

  return (
    <Card className="bg-primary text-white border-transparent p-5 shadow-elevated">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-white/80">
              Sholat Berikutnya
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] text-white/80 flex items-center gap-1 ml-1">
              <MapPin className="w-3 h-3 text-accent inline" />
              <span>{city.name}</span>
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-extrabold mt-1">
            {nextPrayer?.name || 'Dzuhur'}{' '}
            <span className="text-accent font-semibold font-mono">
              {nextPrayer?.timeStr || '11:52'}
            </span>
          </div>

          <p className="text-xs text-white/80 mt-1">
            Menghitung mundur:{' '}
            <span className="font-mono font-bold text-white bg-white/15 px-1.5 py-0.5 rounded-sm">
              {countdownFormatted}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/sholat/">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-primary hover:bg-surface-alt border-none font-semibold text-xs min-h-[40px]"
            >
              Lihat Semua Jadwal
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
