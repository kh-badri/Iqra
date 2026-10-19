'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePrayerTimes } from '@/features/prayer/hooks/usePrayerTimes';
import { PrayerCountdown } from '@/features/prayer/components/PrayerCountdown';
import {
  getHijriDetails,
  getFastingsForDate,
  getUpcomingFastings,
} from '@/features/calendar/calendarService';
import type { HijriDetails, UpcomingFastingItem, SunnahFastingInfo } from '@/features/calendar/types';
import { MapPin, Clock, ArrowRight, Calendar, Sparkles } from 'lucide-react';

export function HomePrayerCard() {
  const { city, nextPrayer, prayerList, now } = usePrayerTimes();
  const [mounted, setMounted] = React.useState(false);
  const [hijri, setHijri] = React.useState<HijriDetails | null>(null);
  const [todayFastings, setTodayFastings] = React.useState<SunnahFastingInfo[]>([]);
  const [upcomingFasting, setUpcomingFasting] = React.useState<UpcomingFastingItem | null>(null);

  React.useEffect(() => {
    const currentDate = new Date();
    const h = getHijriDetails(currentDate);
    setHijri(h);

    const fastings = getFastingsForDate(currentDate, h.day, h.month);
    setTodayFastings(fastings.filter((f) => !f.isProhibited));

    const upcoming = getUpcomingFastings(currentDate, 7);
    const nextFasting = upcoming.find((u) => u.daysRemaining > 0) || upcoming[0] || null;
    setUpcomingFasting(nextFasting);

    setMounted(true);
  }, []);

  const masehiFormatted = React.useMemo(() => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(now || new Date());
  }, [now?.toDateString()]);

  // Ambil hanya 5 sholat fardhu utama: Subuh, Dzuhur, Ashar, Maghrib, Isya
  const fardhuPrayers = React.useMemo(() => {
    if (!prayerList) return [];
    const validIds = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    return prayerList.filter((p) => validIds.includes(p.id));
  }, [prayerList]);

  // Data rekomendasi puasa sunnah untuk Card 2
  const activeFasting = React.useMemo(() => {
    if (todayFastings.length > 0) {
      return {
        name: todayFastings[0].name,
        badgeText: 'Hari Ini',
        isToday: true,
      };
    }
    if (upcomingFasting) {
      const timeLabel =
        upcomingFasting.daysRemaining === 1
          ? 'Besok'
          : `${upcomingFasting.daysRemaining} hari lagi`;
      return {
        name: upcomingFasting.fasting.name,
        badgeText: timeLabel,
        isToday: false,
      };
    }
    return null;
  }, [todayFastings, upcomingFasting]);

  return (
    <div className="space-y-3">
      {/* ── CARD 1 (DI ATAS): Tanggal Hari Ini & Jadwal Sholat (Lebih Ramping & Kompak) ── */}
      <div className="relative overflow-hidden rounded-card bg-primary-gradient text-[#0D3B13] shadow-elevated p-3.5 sm:p-4.5 card-highlight">
        {/* Dekorasi lingkaran transparan (statik GPU-friendly untuk performa tinggi di HP spek rendah) */}
        <div
          className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/20 pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-white/15 pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white/10 pointer-events-none"
          aria-hidden
        />

        <div className="relative z-10 space-y-3">
          {/* Top Header: Tanggal Masehi & Hijriah + Lokasi Kota */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#0D3B13]/15 pb-2.5">
            <Link
              href="/kalender/"
              className="group inline-flex items-center gap-2 text-[#0D3B13] hover:opacity-90 transition-opacity"
              title="Buka Kalender Hijriah Lengkap"
            >
              <div className="w-7 h-7 rounded-full bg-white/35 flex items-center justify-center flex-shrink-0 text-[#0D3B13] group-hover:scale-105 transition-transform border border-white/40 shadow-subtle">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-extrabold tracking-tight text-[#0D3B13]">
                    {masehiFormatted}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-pill bg-[#0D3B13]/15 text-[#0D3B13] leading-none">
                    Hari Ini
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#0D3B13]/85 font-bold">
                  <span>{hijri ? hijri.formatted : 'Memuat kalender...'}</span>
                  {hijri?.monthNameArabic && (
                    <span
                      dir="rtl"
                      className="font-arabic text-xs font-bold text-[#0D3B13]/80 hidden xs:inline"
                    >
                      · {hijri.day} {hijri.monthNameArabic} {hijri.year} هـ
                    </span>
                  )}
                </div>
              </div>
            </Link>

            <Link
              href="/sholat/"
              className="inline-flex items-center gap-1.5 text-xs text-[#0D3B13] bg-white/40 hover:bg-white/50 px-2.5 py-1 rounded-pill border border-white/40 self-start sm:self-auto transition-all duration-150 active:scale-95 shadow-subtle font-bold"
              title="Ubah Kota Jadwal Sholat"
            >
              <MapPin className="w-3 h-3 text-[#0D3B13] shrink-0" />
              <span className="truncate max-w-[180px] sm:max-w-none">
                {city.name}
              </span>
            </Link>
          </div>

          {/* Main Countdown Hero Display */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#0D3B13] animate-pulse-dot" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0D3B13]/85">
                  Sholat Berikutnya
                </span>
              </div>

              <div className="flex items-baseline gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0D3B13]">
                  {nextPrayer?.name || 'Dzuhur'}
                </h2>
                <span className="text-xl sm:text-2xl font-extrabold text-[#0D3B13] font-mono tabular-nums">
                  {nextPrayer?.timeStr || '--:--'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="w-3.5 h-3.5 text-[#0D3B13]/75" />
                <span className="text-[11px] sm:text-xs font-semibold text-[#0D3B13]/85">Menghitung mundur:</span>
                <span className="font-mono font-extrabold text-[11px] sm:text-xs bg-white/40 text-[#0D3B13] px-2 py-0.5 rounded-button tabular-nums border border-white/50 shadow-subtle">
                  <PrayerCountdown targetDate={nextPrayer?.date} />
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <Link href="/sholat/" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-white text-[#0D3B13] font-extrabold text-xs h-8.5 sm:h-9 px-4 rounded-pill shadow-elevated hover:bg-white/95 transition-all duration-150 active:scale-95"
                >
                  <span>Lihat Semua Jadwal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0D3B13]" />
                </button>
              </Link>
            </div>
          </div>

          {/* 5 Sholat Fardhu Mini Tracker Row */}
          {fardhuPrayers.length > 0 && (
            <div className="pt-2 border-t border-[#0D3B13]/15">
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {fardhuPrayers.map((prayer) => {
                  const isNext = prayer.id === nextPrayer?.id || prayer.name === nextPrayer?.name;
                  return (
                    <div
                      key={prayer.id}
                      className={`py-1.5 px-1 text-center rounded-button transition-all duration-150 ${
                        isNext
                          ? 'bg-white text-[#0D3B13] shadow-card ring-2 ring-[#0D3B13]/25 font-extrabold'
                          : 'bg-white/25 text-[#0D3B13]/90 hover:bg-white/35 border border-white/30'
                      }`}
                    >
                      <div
                        className={`text-[10px] sm:text-[11px] font-extrabold leading-tight ${
                          isNext ? 'text-[#0D3B13]' : 'text-[#0D3B13]'
                        }`}
                      >
                        {prayer.name}
                      </div>
                      <div
                        className={`text-[10px] sm:text-[11px] font-mono mt-0.5 leading-tight tabular-nums ${
                          isNext ? 'text-[#0D3B13] font-extrabold' : 'text-[#0D3B13]/85 font-bold'
                        }`}
                      >
                        {prayer.timeStr}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CARD 2 (DI BAWAHNYA): Rekomendasi Puasa Sunnah (Card Mandiri, Ramping & Bersih) ── */}
      {mounted && activeFasting && (
        <Link
          href="/kalender/"
          className="group block rounded-card bg-surface border border-border hover:border-primary/50 p-3 sm:p-3.5 shadow-card transition-all duration-150 active:scale-[0.99] card-highlight"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-pastel-green text-primary-text flex items-center justify-center shrink-0 border border-primary/20 shadow-subtle group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-text-muted">
                    Rekomendasi Puasa Sunnah
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-pill leading-none ${
                      activeFasting.isToday
                        ? 'bg-pastel-green text-primary-text animate-pulse'
                        : 'bg-surface-alt border border-border text-text-secondary'
                    }`}
                  >
                    {activeFasting.badgeText}
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-extrabold text-text-primary group-hover:text-primary transition-colors truncate mt-0.5">
                  {activeFasting.name}
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform shrink-0 px-2.5 py-1 rounded-pill bg-pastel-green/40">
              <span className="hidden xs:inline">Lihat Jadwal &amp; Niat</span>
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
