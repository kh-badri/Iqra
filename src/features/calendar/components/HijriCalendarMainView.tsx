'use client';

import * as React from 'react';
import { Calendar, Moon, Sparkles } from 'lucide-react';
import { CalendarMonthView } from './CalendarMonthView';
import { SunnahFastingView } from './SunnahFastingView';
import { getHijriDetails } from '../calendarService';

export type CalendarTab = 'kalender' | 'puasa';

interface HijriCalendarMainViewProps {
  initialTab?: CalendarTab;
}

export function HijriCalendarMainView({
  initialTab = 'kalender',
}: HijriCalendarMainViewProps) {
  const [activeTab, setActiveTab] = React.useState<CalendarTab>(initialTab);

  const todayHijri = React.useMemo(() => {
    return getHijriDetails(new Date());
  }, []);

  const todayMasehiFormatted = React.useMemo(() => {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Info Halaman */}
      <div className="border-b border-border/80 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-9 h-9 rounded-full bg-pastel-green text-primary-text flex items-center justify-center shadow-subtle">
                {activeTab === 'kalender' ? (
                  <Calendar className="w-4 h-4 stroke-[2.2]" />
                ) : (
                  <Moon className="w-4 h-4 stroke-[2.2]" />
                )}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
                {activeTab === 'kalender'
                  ? 'Kalender Hijriah'
                  : 'Kalender Puasa Sunnah'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Penanggalan Islam Umm al-Qura, hari besar Islam, dan jadwal puasa sunnah lengkap dengan lafadz niat serta dalil.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto bg-surface-alt px-3.5 py-2 rounded-card border border-border shadow-subtle">
            <Sparkles className="w-4 h-4 text-warning shrink-0" />
            <div className="text-left">
              <div className="text-[12px] font-extrabold text-text-primary leading-tight font-arabic">
                {todayHijri.formatted}
              </div>
              <div className="text-[10px] text-text-secondary leading-tight mt-0.5 font-medium">
                {todayMasehiFormatted}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Tab Segmented Control (Pill Shape with Lime Gradient Active State) */}
      <div className="grid grid-cols-2 p-1 bg-surface-alt rounded-pill border border-border max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('kalender')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-pill text-xs sm:text-sm font-extrabold transition-all duration-150 active:scale-95 ${
            activeTab === 'kalender'
              ? 'bg-primary-gradient text-on-primary shadow-subtle'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Kalender Hijriah</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('puasa')}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-pill text-xs sm:text-sm font-extrabold transition-all duration-150 active:scale-95 ${
            activeTab === 'puasa'
              ? 'bg-primary-gradient text-on-primary shadow-subtle'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span>Puasa Sunnah</span>
        </button>
      </div>

      {/* Konten Tab Aktif */}
      {activeTab === 'kalender' && <CalendarMonthView />}
      {activeTab === 'puasa' && <SunnahFastingView />}
    </div>
  );
}
