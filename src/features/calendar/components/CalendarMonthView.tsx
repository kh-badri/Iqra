'use client';

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Star,
  Moon,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import type { CalendarDayCell } from '../types';
import { getMonthMatrix, getHijriDetails } from '../calendarService';
import { DateDetailModal } from './DateDetailModal';
import { cn } from '@/lib/utils';

export function CalendarMonthView() {
  const today = React.useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = React.useState<number>(() => today.getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = React.useState<number>(() => today.getMonth());
  const [selectedCell, setSelectedCell] = React.useState<CalendarDayCell | null>(null);

  const monthMatrix = React.useMemo(() => {
    return getMonthMatrix(currentYear, currentMonthIndex);
  }, [currentYear, currentMonthIndex]);

  // Rentang bulan Hijriah dalam bulan Masehi ini
  const hijriRangeText = React.useMemo(() => {
    if (monthMatrix.length === 0) return '';
    const firstCurrent = monthMatrix.find((c) => c.isCurrentMonth) || monthMatrix[0];
    const lastCurrent =
      [...monthMatrix].reverse().find((c) => c.isCurrentMonth) ||
      monthMatrix[monthMatrix.length - 1];

    if (firstCurrent.hijri.month === lastCurrent.hijri.month) {
      return `${firstCurrent.hijri.monthName} ${firstCurrent.hijri.year} H`;
    }
    return `${firstCurrent.hijri.monthName} - ${lastCurrent.hijri.monthName} ${lastCurrent.hijri.year} H`;
  }, [monthMatrix]);

  const monthNamesIndo = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  const handleResetToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonthIndex(today.getMonth());
  };

  // Daftar agenda penting (peristiwa & puasa) di bulan yang sedang aktif
  const activeMonthHighlights = React.useMemo(() => {
    return monthMatrix.filter(
      (c) =>
        c.isCurrentMonth &&
        (c.events.length > 0 ||
          c.fastings.filter((f) => !f.isProhibited).length > 0 ||
          c.prohibitedReason)
    );
  }, [monthMatrix]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Bar Navigasi Bulan */}
      <Card className="p-4 bg-surface border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                {monthNamesIndo[currentMonthIndex]} {currentYear}
              </h2>
              <Chip variant="primary" className="text-[11px] py-0.5 px-2">
                Hijriah
              </Chip>
            </div>
            <p className="text-xs font-semibold text-accent mt-0.5 font-arabic">
              {hijriRangeText}
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetToday}
              className="text-xs h-9 gap-1"
              title="Kembali ke Hari Ini"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Hari Ini</span>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handlePrevMonth}
              className="h-9 w-9"
              aria-label="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleNextMonth}
              className="h-9 w-9"
              aria-label="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Legend Penanda Warna */}
        <div className="pt-3 mt-3 border-t border-border flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-text-secondary">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border-2 border-primary bg-primary/20" />
            <span>Hari Ini</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Puasa Sunnah</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-accent" />
            <span>Hari Besar Islam</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-danger" />
            <span>Dilarang Puasa</span>
          </div>
        </div>
      </Card>

      {/* Grid Kalender (7 Kolom Ahad - Sabtu) */}
      <Card className="p-2 sm:p-4 bg-surface border border-border shadow-subtle overflow-hidden">
        {/* Header Hari dalam Seminggu */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs pb-2 border-b border-border mb-1">
          <div className="text-danger py-1">Ahad</div>
          <div className="text-text-primary py-1">Senin</div>
          <div className="text-text-primary py-1">Selasa</div>
          <div className="text-text-primary py-1">Rabu</div>
          <div className="text-text-primary py-1">Kamis</div>
          <div className="text-primary py-1">Jum'at</div>
          <div className="text-text-primary py-1">Sabtu</div>
        </div>

        {/* Sel-Sel Tanggal */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 pt-1">
          {monthMatrix.map((cell, idx) => {
            const hasSunnahFasting = cell.fastings.some((f) => !f.isProhibited);
            const hasEvent = cell.events.length > 0;
            const isProhibited = Boolean(cell.prohibitedReason);

            return (
              <div
                key={idx}
                onClick={() => setSelectedCell(cell)}
                className={cn(
                  'min-h-[64px] sm:min-h-[82px] p-1 sm:p-1.5 rounded-card border transition-all duration-150 cursor-pointer select-none flex flex-col justify-between relative group',
                  cell.isCurrentMonth
                    ? 'bg-surface hover:border-primary/50 hover:bg-surface-alt/70'
                    : 'bg-surface-alt/40 border-border/40 opacity-40 hover:opacity-80',
                  cell.isToday
                    ? 'border-primary ring-2 ring-primary/20 bg-primary-soft/30'
                    : 'border-border'
                )}
              >
                {/* Baris Atas: Tanggal Masehi Kecil */}
                <div className="flex items-center justify-between text-[10px] leading-tight text-text-secondary">
                  <span className={cn('font-mono font-medium', cell.isToday && 'font-bold text-primary')}>
                    {cell.dayNumber}
                  </span>
                  {cell.isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </div>

                {/* Angka Tanggal Hijriah Utama (Pusat Sel) */}
                <div className="text-center my-0.5 sm:my-1">
                  <span
                    className={cn(
                      'text-sm sm:text-lg font-bold font-arabic leading-none transition-colors',
                      cell.isToday
                        ? 'text-primary font-black'
                        : cell.isCurrentMonth
                        ? 'text-text-primary group-hover:text-primary'
                        : 'text-text-secondary'
                    )}
                  >
                    {cell.hijri.day}
                  </span>
                </div>

                {/* Indikator Tag / Dot Bawah */}
                <div className="flex items-center justify-center gap-1 min-h-[14px] flex-wrap">
                  {hasEvent && (
                    <span
                      title={cell.events[0]?.title}
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent shrink-0"
                    />
                  )}
                  {hasSunnahFasting && (
                    <span
                      title="Ada jadwal puasa sunnah"
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shrink-0"
                    />
                  )}
                  {isProhibited && (
                    <span
                      title="Diharamkan berpuasa"
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-danger shrink-0"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Ringkasan Agenda & Puasa Bulan Ini */}
      <Card className="p-4 sm:p-5 bg-surface border border-border space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary-soft text-primary flex items-center justify-center">
              <Info className="w-4 h-4" />
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-text-primary">
              Agenda Penting & Puasa ({monthNamesIndo[currentMonthIndex]} {currentYear})
            </h3>
          </div>
          <span className="text-[11px] text-text-secondary font-mono">
            {activeMonthHighlights.length} agenda
          </span>
        </div>

        {activeMonthHighlights.length === 0 ? (
          <p className="text-xs text-text-secondary py-2 text-center">
            Tidak ada agenda puasa khusus atau hari besar di bulan ini.
          </p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {activeMonthHighlights.map((c, i) => {
              const hasSunnah = c.fastings.some((f) => !f.isProhibited);

              return (
                <div
                  key={i}
                  onClick={() => setSelectedCell(c)}
                  className="p-3 rounded-card bg-surface-alt/70 border border-border hover:border-primary/40 hover:bg-surface-alt transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-card bg-surface border border-border flex flex-col items-center justify-center shrink-0 font-mono">
                      <span className="text-[9px] text-text-secondary leading-none">
                        {monthNamesIndo[c.date.getMonth()].slice(0, 3)}
                      </span>
                      <span className="text-xs font-bold text-text-primary leading-tight">
                        {c.dayNumber}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-text-primary truncate flex items-center gap-1.5">
                        {c.events[0]?.title ||
                          (hasSunnah ? c.fastings[0].name : c.prohibitedReason)}
                      </div>
                      <div className="text-[11px] text-accent font-arabic">
                        {c.hijri.formatted}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {c.events.length > 0 && (
                      <Chip variant="primary" className="text-[10px] py-0 px-1.5 h-4">
                        Hari Besar
                      </Chip>
                    )}
                    {hasSunnah && (
                      <Chip variant="secondary" className="text-[10px] py-0 px-1.5 h-4 text-emerald-600 font-bold">
                        Puasa Sunnah
                      </Chip>
                    )}
                    {c.prohibitedReason && (
                      <Chip variant="secondary" className="text-[10px] py-0 px-1.5 h-4 text-danger font-bold">
                        Dilarang
                      </Chip>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Modal Detail Saat Tanggal Diklik */}
      <DateDetailModal
        isOpen={Boolean(selectedCell)}
        onClose={() => setSelectedCell(null)}
        cell={selectedCell}
      />
    </div>
  );
}
