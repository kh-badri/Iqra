import * as React from 'react';
import { Card } from '@/components/ui/Card';
import type { PrayerTimeItem } from '../types';
import { cn } from '@/lib/utils';
import { Clock, Sun, Sunrise, Sunset, Moon } from 'lucide-react';

export function PrayerTimesTable({ times }: { times: PrayerTimeItem[] }) {
  const getPrayerIcon = (id: string, isNext: boolean) => {
    const iconClass = isNext ? 'w-4 h-4 text-on-primary' : 'w-4 h-4';
    switch (id) {
      case 'imsak':
        return <Moon className={cn(iconClass, !isNext && 'text-warning')} />;
      case 'fajr':
        return <Sunrise className={cn(iconClass, !isNext && 'text-primary-text')} />;
      case 'sunrise':
        return <Sun className={cn(iconClass, !isNext && 'text-warning')} />;
      case 'dhuhr':
        return <Sun className={cn(iconClass, !isNext && 'text-warning')} />;
      case 'asr':
        return <Sun className={cn(iconClass, !isNext && 'text-warning')} />;
      case 'maghrib':
        return <Sunset className={cn(iconClass, !isNext && 'text-danger')} />;
      case 'isha':
        return <Moon className={cn(iconClass, !isNext && 'text-primary-text')} />;
      default:
        return <Clock className={cn(iconClass, !isNext && 'text-text-secondary')} />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs sm:text-sm font-extrabold text-text-primary uppercase tracking-wider">
          Jadwal Sholat Hari Ini (Standar Kemenag RI)
        </h3>
        <span className="text-[11px] text-text-muted font-bold font-mono">
          7 Waktu
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
        {times.map((item) => {
          return (
            <Card
              key={item.id}
              className={cn(
                'p-3.5 sm:p-4 flex sm:flex-col justify-between sm:justify-center items-center gap-2.5 transition-all duration-200 select-none shadow-card',
                item.isNext
                  ? 'bg-primary-gradient text-on-primary border-transparent ring-2 ring-primary/40 shadow-glow'
                  : item.isPassed
                  ? 'bg-surface/60 border-border opacity-70'
                  : 'bg-surface border-border hover:border-primary/40'
              )}
            >
              <div className="flex items-center gap-3 sm:flex-col sm:gap-1.5 text-left sm:text-center min-w-0">
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform shadow-subtle',
                    item.isNext
                      ? 'bg-on-primary/15 text-on-primary'
                      : 'bg-surface-alt'
                  )}
                >
                  {getPrayerIcon(item.id, Boolean(item.isNext))}
                </div>
                <div className="min-w-0">
                  <div
                    className={cn(
                      'text-xs font-extrabold leading-tight truncate',
                      item.isNext ? 'text-on-primary' : 'text-text-primary'
                    )}
                  >
                    {item.name}
                  </div>
                  <div
                    className={cn(
                      'font-arabic text-[11px] leading-tight mt-0.5 font-bold',
                      item.isNext ? 'text-on-primary/80' : 'text-text-secondary'
                    )}
                  >
                    {item.arabicName}
                  </div>
                </div>
              </div>

              <div className="text-right sm:text-center sm:mt-1.5 flex flex-col items-end sm:items-center">
                <div
                  className={cn(
                    'text-base sm:text-lg font-black font-mono tracking-tight tabular-nums',
                    item.isNext ? 'text-on-primary' : 'text-text-primary'
                  )}
                >
                  {item.timeStr}
                </div>
                {item.isNext && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-on-primary bg-on-primary/15 px-2 py-0.5 rounded-pill mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-on-primary animate-pulse-dot" />
                    Berikutnya
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
