'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePrayerTimes } from '@/features/prayer/hooks/usePrayerTimes';
import {
  getHijriDetails,
  getFastingsForDate,
  getUpcomingFastings,
} from '@/features/calendar/calendarService';
import type { HijriDetails, UpcomingFastingItem, SunnahFastingInfo } from '@/features/calendar/types';
import { MapPin, Clock, ArrowRight, Calendar, Sparkles } from 'lucide-react';

export function HomePrayerCard() {
  const { city, nextPrayer, countdownFormatted, prayerList, now } = usePrayerTimes();
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

    const upcoming = getUpcomingFastings(currentDate, 2);
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
  }, [now]);

  // Ambil hanya 5 sholat fardhu utama: Subuh, Dzuhur, Ashar, Maghrib, Isya
  const fardhuPrayers = React.useMemo(() => {
    if (!prayerList) return [];
    const validIds = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    return prayerList.filter((p) => validIds.includes(p.id));
  }, [prayerList]);

  const fastingRecommendationText = React.useMemo(() => {
    if (todayFastings.length > 0) {
      const name = todayFastings[0].name.replace(/^Puasa\s+/i, '').toLowerCase();
      return `Rekomendasi puasa sunnah : ${name} (hari ini)`;
    }
    if (upcomingFasting && upcomingFasting.daysRemaining <= 1) {
      const name = upcomingFasting.fasting.name.replace(/^Puasa\s+/i, '').toLowerCase();
      const timeLabel = upcomingFasting.daysRemaining === 1 ? 'besok' : `${upcomingFasting.daysRemaining} hari lagi`;
      return `Rekomendasi puasa sunnah : ${name} (${timeLabel})`;
    }
    return null;
  }, [todayFastings, upcomingFasting]);

  return (
    <div className="relative overflow-hidden rounded-card bg-primary-gradient text-[#0D3B13] shadow-elevated p-4 sm:p-5 card-highlight">
      {/* Dekorasi lingkaran-lingkaran transparan di sudutnya (loop pelan, only transform) */}
      <div
        className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/20 pointer-events-none animate-hero-float"
        aria-hidden
      />
      <div
        className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-white/15 pointer-events-none animate-hero-float delay-200"
        aria-hidden
      />
      <div
        className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-white/10 pointer-events-none animate-hero-float delay-120"
        aria-hidden
      />

      <div className="relative z-10">
        {/* Top Header: Tanggal Masehi & Hijriah + Lokasi Kota */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#0D3B13]/15 pb-2.5">
          <Link
            href="/kalender/"
            className="group inline-flex items-center gap-2 text-[#0D3B13] hover:opacity-90 transition-opacity"
            title="Buka Kalender Hijriah Lengkap"
          >
            <div className="w-7 h-7 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center flex-shrink-0 text-[#0D3B13] group-hover:scale-105 transition-transform border border-white/40">
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
            className="inline-flex items-center gap-1.5 text-xs text-[#0D3B13] bg-white/35 hover:bg-white/45 px-2.5 py-1 rounded-pill border border-white/40 self-start sm:self-auto backdrop-blur-sm transition-all duration-150 active:scale-95 shadow-subtle font-bold"
            title="Ubah Kota Jadwal Sholat"
          >
            <MapPin className="w-3 h-3 text-[#0D3B13] shrink-0" />
            <span className="truncate max-w-[180px] sm:max-w-none">
              {city.name}
            </span>
          </Link>
        </div>

        {/* Rekomendasi Puasa Sunnah Pill */}
        {mounted && fastingRecommendationText && (
          <div className="mt-2">
            <Link
              href="/kalender/"
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold bg-white/30 hover:bg-white/40 border border-white/40 px-2.5 py-0.5 rounded-pill text-[#0D3B13] transition-all duration-150 backdrop-blur-sm active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-[#0D3B13] flex-shrink-0" />
              <span>{fastingRecommendationText}</span>
              <ArrowRight className="w-3 h-3 text-[#0D3B13]/70" />
            </Link>
          </div>
        )}

        {/* Main Countdown Hero Display */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2.5 sm:py-3">
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
              <span className="font-mono font-extrabold text-[11px] sm:text-xs bg-white/35 text-[#0D3B13] px-2 py-0.5 rounded-button tabular-nums border border-white/40 backdrop-blur-sm">
                {countdownFormatted}
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
          <div className="pt-2.5 border-t border-[#0D3B13]/15">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {fardhuPrayers.map((prayer) => {
                const isNext = prayer.id === nextPrayer?.id || prayer.name === nextPrayer?.name;
                return (
                  <div
                    key={prayer.id}
                    className={`py-1.5 px-1 text-center rounded-button transition-all duration-150 ${
                      isNext
                        ? 'bg-white text-[#0D3B13] shadow-card ring-2 ring-[#0D3B13]/25 font-extrabold'
                        : 'bg-white/20 text-[#0D3B13]/80 hover:bg-white/30 border border-white/25 backdrop-blur-sm'
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
  );
}
