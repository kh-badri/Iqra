'use client';

import * as React from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Chip } from '@/components/ui/Chip';
import type { CalendarDayCell } from '../types';
import { Calendar, Moon, AlertTriangle, BookOpen, Star, CheckCircle } from 'lucide-react';

export interface DateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cell: CalendarDayCell | null;
}

export function DateDetailModal({ isOpen, onClose, cell }: DateDetailModalProps) {
  const [cachedCell, setCachedCell] = React.useState<CalendarDayCell | null>(cell);

  React.useEffect(() => {
    if (cell) {
      setCachedCell(cell);
    }
  }, [cell]);

  const activeCell = cell || cachedCell;
  if (!activeCell) return null;

  const masehiFormatter = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const fullMasehi = masehiFormatter.format(activeCell.date);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pastel-green text-primary-text flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-text-primary">
              Detail Penanggalan
            </h3>
            <p className="text-[11px] text-text-secondary">{fullMasehi}</p>
          </div>
        </div>
      }
    >
      <div className="space-y-4 py-2 select-none">
        {/* Banner Tanggal Hijriah Utama */}
        <div className="p-4 rounded-card bg-surface-alt border border-border text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            {activeCell.isToday && (
              <Chip variant="primary" className="text-[10px] py-0 px-2 h-5">
                Hari Ini
              </Chip>
            )}
            <Chip variant="secondary" className="text-[10px] py-0 px-2 h-5">
              Tahun {activeCell.hijri.year} H
            </Chip>
          </div>
          <div className="font-arabic text-2xl sm:text-3xl text-primary-text font-bold my-1">
            {activeCell.hijri.day} {activeCell.hijri.monthNameArabic || activeCell.hijri.monthName}
          </div>
          <div className="text-sm sm:text-base font-bold text-text-primary">
            {activeCell.hijri.formatted}
          </div>
          <div className="text-xs text-text-secondary">{fullMasehi}</div>
        </div>

        {/* Jika ada Peringatan Hari Dilarang Puasa */}
        {activeCell.prohibitedReason && (
          <div className="p-3.5 rounded-card bg-danger/10 border border-danger/30 space-y-1.5">
            <div className="flex items-center gap-2 text-danger font-bold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Hari Diharamkan Berpuasa</span>
            </div>
            <p className="text-xs text-text-primary leading-relaxed">
              {activeCell.prohibitedReason}. Umat Islam dilarang berpuasa pada hari raya dan hari Tasyrik berdasarkan hadits shahih riwayat Bukhari & Muslim.
            </p>
          </div>
        )}

        {/* Jika ada Peristiwa / Hari Besar Islam */}
        {activeCell.events.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-accent" />
              <span>Hari Besar & Peristiwa Islam:</span>
            </h4>
            <div className="space-y-2">
              {activeCell.events.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-card bg-surface border border-accent/40 shadow-subtle space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs sm:text-sm text-text-primary">
                      {ev.title}
                    </span>
                    {ev.isHoliday && (
                      <Chip variant="primary" className="text-[10px] py-0 px-1.5 h-4">
                        Hari Libur / Utama
                      </Chip>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {ev.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jika ada Jadwal Puasa Sunnah */}
        {activeCell.fastings.filter((f) => !f.isProhibited).length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-primary" />
              <span>Jadwal Puasa Sunnah Hari Ini:</span>
            </h4>
            <div className="space-y-3">
              {activeCell.fastings
                .filter((f) => !f.isProhibited)
                .map((fasting) => (
                  <div
                    key={fasting.id}
                    className="p-4 rounded-card bg-surface border border-primary/40 shadow-subtle space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span>{fasting.name}</span>
                      </span>
                      <Chip variant="primary" className="text-[10px] py-0 px-1.5 h-4">
                        {fasting.badge}
                      </Chip>
                    </div>

                    {/* Teks Niat Arab */}
                    {fasting.niatArabic && (
                      <div className="pt-2 border-t border-border/70 text-right">
                        <span className="text-[10px] text-text-secondary uppercase tracking-wider block text-left mb-1">
                          Lafadz Niat Puasa:
                        </span>
                        <p
                          dir="rtl"
                          className="font-arabic text-base sm:text-lg text-text-primary leading-loose"
                        >
                          {fasting.niatArabic}
                        </p>
                        <p className="text-xs text-primary font-medium text-left mt-1 italic">
                          "{fasting.niatLatin}"
                        </p>
                        <p className="text-xs text-text-secondary text-left mt-0.5">
                          Artinya: {fasting.niatArti}
                        </p>
                      </div>
                    )}

                    {/* Dalil & Keutamaan */}
                    {fasting.dalil && (
                      <div className="pt-2 border-t border-border/70 text-xs text-text-secondary space-y-1">
                        <strong className="text-text-primary block font-semibold">
                          Keutamaan & Dalil:
                        </strong>
                        <p className="italic text-[11px] leading-relaxed">
                          {fasting.dalil}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Jika hari biasa tanpa puasa spesifik */}
        {activeCell.fastings.length === 0 && activeCell.events.length === 0 && !activeCell.prohibitedReason && (
          <div className="p-3.5 bg-surface-alt rounded-card border border-border text-xs text-text-secondary leading-relaxed flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              Hari ini merupakan hari penanggalan biasa. Sangat dianjurkan untuk memperbanyak amal shalih harian, dzikir, tilawah Al-Qur'an, atau menjalankan Puasa Daud bagi yang rutin menjalankannya.
            </span>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
