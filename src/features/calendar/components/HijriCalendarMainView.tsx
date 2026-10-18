'use client';

import * as React from 'react';
import { Calendar, Moon, Sparkles } from 'lucide-react';
import { CalendarMonthView } from './CalendarMonthView';
import { SunnahFastingView } from './SunnahFastingView';
import { getHijriDetails } from '../calendarService';
import { Chip } from '@/components/ui/Chip';

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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Info Halaman */}
      <div className="border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                {activeTab === 'kalender' ? (
                  <Calendar className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                {activeTab === 'kalender'
                  ? 'Kalender Hijriah'
                  : 'Kalender Puasa Sunnah'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">
              Penanggalan Islam Umm al-Qura, hari besar Islam, dan jadwal puasa sunnah lengkap dengan lafadz niat serta dalil.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-surface-alt px-3 py-2 rounded-card border border-border">
            <Sparkles className="w-4 h-4 text-accent shrink-0" />
            <div className="text-left">
              <div className="text-[11px] font-bold text-text-primary leading-tight font-arabic">
                {todayHijri.formatted}
              </div>
              <div className="text-[10px] text-text-secondary leading-tight mt-0.5">
                {todayMasehiFormatted}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Tab Segmented Control Modern (Flat Solid Clean) */}
      <div className="grid grid-cols-2 p-1 bg-surface-alt rounded-card border border-border max-w-md mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('kalender')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-card text-xs sm:text-sm font-bold transition-all duration-150 ${
            activeTab === 'kalender'
              ? 'bg-primary text-white shadow-subtle'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Kalender Hijriah</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('puasa')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-card text-xs sm:text-sm font-bold transition-all duration-150 ${
            activeTab === 'puasa'
              ? 'bg-primary text-white shadow-subtle'
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
