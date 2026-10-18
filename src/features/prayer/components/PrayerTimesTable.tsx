import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import type { PrayerTimeItem } from '../types';
import { cn } from '@/lib/utils';
import { Clock, Sun, Sunrise, Sunset, Moon } from 'lucide-react';

export function PrayerTimesTable({ times }: { times: PrayerTimeItem[] }) {
  const getPrayerIcon = (id: string) => {
    switch (id) {
      case 'imsak':
        return <Moon className="w-4 h-4 text-accent" />;
      case 'fajr':
        return <Sunrise className="w-4 h-4 text-primary" />;
      case 'sunrise':
        return <Sun className="w-4 h-4 text-accent" />;
      case 'dhuhr':
        return <Sun className="w-4 h-4 text-warning" />;
      case 'asr':
        return <Sun className="w-4 h-4 text-accent" />;
      case 'maghrib':
        return <Sunset className="w-4 h-4 text-danger" />;
      case 'isha':
        return <Moon className="w-4 h-4 text-primary" />;
      default:
        return <Clock className="w-4 h-4 text-text-secondary" />;
    }
  };

  return (
    <div className="space-y-2.5">
      <h3 className="text-sm font-bold text-text-primary px-1">
        Jadwal Sholat Hari Ini (Standar Kemenag RI)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
        {times.map((item) => {
          return (
            <Card
              key={item.id}
              className={cn(
                'p-3.5 flex sm:flex-col justify-between sm:justify-center items-center gap-1.5 transition-colors',
                item.isNext
                  ? 'bg-primary-soft/80 border-primary shadow-subtle'
                  : item.isPassed
                  ? 'bg-surface/60 border-border opacity-70'
                  : 'bg-surface border-border'
              )}
            >
              <div className="flex items-center gap-2 sm:flex-col sm:gap-1 text-center">
                <div className="w-7 h-7 rounded-card bg-surface-alt flex items-center justify-center flex-shrink-0">
                  {getPrayerIcon(item.id)}
                </div>
                <div>
                  <div className="text-xs font-bold text-text-primary">
                    {item.name}
                  </div>
                  <div className="font-arabic text-[11px] text-text-secondary">
                    {item.arabicName}
                  </div>
                </div>
              </div>

              <div className="text-right sm:text-center mt-1 sm:mt-2">
                <div className="text-base sm:text-lg font-bold font-mono text-text-primary">
                  {item.timeStr}
                </div>
                {item.isNext && (
                  <Chip variant="primary" className="text-[10px] py-0 px-1.5 mt-0.5">
                    Berikutnya
                  </Chip>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
