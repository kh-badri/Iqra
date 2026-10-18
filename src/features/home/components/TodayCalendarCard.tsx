'use client';

import * as React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Sparkles, Moon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  getHijriDetails,
  getFastingsForDate,
  getUpcomingFastings,
  getEventsForHijri,
} from '@/features/calendar/calendarService';
import type { HijriDetails, UpcomingFastingItem, IslamicEvent, SunnahFastingInfo } from '@/features/calendar/types';

export function TodayCalendarCard() {
  const [mounted, setMounted] = React.useState(false);
  const [today, setToday] = React.useState<Date | null>(null);
  const [hijri, setHijri] = React.useState<HijriDetails | null>(null);
  const [todayFastings, setTodayFastings] = React.useState<SunnahFastingInfo[]>([]);
  const [upcomingFasting, setUpcomingFasting] = React.useState<UpcomingFastingItem | null>(null);
  const [todayEvents, setTodayEvents] = React.useState<IslamicEvent[]>([]);

  React.useEffect(() => {
    const now = new Date();
    setToday(now);
    const h = getHijriDetails(now);
    setHijri(h);
    const fastings = getFastingsForDate(now, h.day, h.month);
    setTodayFastings(fastings.filter((f) => !f.isProhibited));
    const events = getEventsForHijri(h.day, h.month);
    setTodayEvents(events);
    const upcoming = getUpcomingFastings(now, 2);
    const nextFasting = upcoming.find((u) => u.daysRemaining > 0) || upcoming[0] || null;
    setUpcomingFasting(nextFasting);
    setMounted(true);
  }, []);

  if (!mounted || !today || !hijri) {
    return (
      <Card className="p-4 sm:p-5 bg-surface border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-card bg-primary-soft/50 flex-shrink-0" />
            <div className="space-y-2">
              <div className="h-3 w-28 bg-surface-alt rounded" />
              <div className="h-5 w-48 bg-surface-alt rounded" />
            </div>
          </div>
          <div className="h-9 w-32 bg-surface-alt rounded" />
        </div>
      </Card>
    );
  }

  const masehiFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(today);

  const isTodayFasting = todayFastings.length > 0;
  const currentFasting = isTodayFasting ? todayFastings[0] : null;

  return (
    <Card className="p-4 sm:p-5 bg-surface border-border hover:border-primary/40 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Detail Tanggal */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-card bg-primary-soft text-primary flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
            <Calendar className="w-5 h-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                Kalender Hari Ini
              </span>
              <span className="text-[11px] text-text-secondary hidden sm:inline">·</span>
              <span className="text-xs text-text-secondary font-medium">
                {masehiFormatted}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
              <h3 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                {hijri.formatted}
              </h3>
              {hijri.monthNameArabic && (
                <span
                  dir="rtl"
                  className="font-arabic text-sm text-text-secondary"
                >
                  {hijri.day} {hijri.monthNameArabic} {hijri.year} هـ
                </span>
              )}
            </div>

            {/* Event besar hari ini jika ada */}
            {todayEvents.length > 0 && (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-accent font-medium">
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{todayEvents[0].title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Info Puasa & Aksi */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-border">
          {/* Badge Status Puasa */}
          <div className="bg-surface-alt/70 border border-border px-3 py-2 rounded-card text-xs">
            {isTodayFasting && currentFasting ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="font-semibold text-success">
                  Hari Ini:
                </span>
                <span className="text-text-primary font-medium">
                  {currentFasting.name}
                </span>
              </div>
            ) : upcomingFasting ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-text-secondary">
                  Puasa Berikutnya:
                </span>
                <span className="text-text-primary font-medium">
                  {upcomingFasting.fasting.name}
                </span>
                <span className="text-[11px] text-accent font-semibold px-1.5 py-0.5 rounded bg-accent/10">
                  {upcomingFasting.daysRemaining === 1
                    ? 'Besok'
                    : `${upcomingFasting.daysRemaining} hari lagi`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-text-secondary">
                <Moon className="w-3.5 h-3.5 text-primary" />
                <span>Kalender Hijriah &amp; Puasa Sunnah</span>
              </div>
            )}
          </div>

          {/* Tombol ke Halaman Kalender */}
          <Link href="/kalender/" className="flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto text-xs gap-1.5 font-semibold"
            >
              <span>Buka Kalender</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
