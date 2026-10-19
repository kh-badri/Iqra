'use client';

import * as React from 'react';
import {
  Moon,
  Calendar,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { SUNNAH_FASTINGS } from '../constants';
import { getUpcomingFastings } from '../calendarService';
import type { SunnahFastingInfo, UpcomingFastingItem } from '../types';

export function SunnahFastingView() {
  const [selectedFilter, setSelectedFilter] = React.useState<string>('all');
  const [selectedNiatModal, setSelectedNiatModal] = React.useState<SunnahFastingInfo | null>(null);
  const [cachedFasting, setCachedFasting] = React.useState<SunnahFastingInfo | null>(null);

  React.useEffect(() => {
    if (selectedNiatModal) {
      setCachedFasting(selectedNiatModal);
    }
  }, [selectedNiatModal]);

  const activeFastingModal = selectedNiatModal || cachedFasting;

  const upcomingFasts = React.useMemo(() => {
    return getUpcomingFastings(new Date(), 10);
  }, []);

  const allFastingList = Object.values(SUNNAH_FASTINGS).filter(
    (f) => !f.isProhibited
  );

  const filteredFastings = React.useMemo(() => {
    if (selectedFilter === 'all') return allFastingList;
    if (selectedFilter === 'senin_kamis')
      return allFastingList.filter((f) => f.id === 'senin_kamis');
    if (selectedFilter === 'ayyamul_bidh')
      return allFastingList.filter((f) => f.id === 'ayyamul_bidh');
    if (selectedFilter === 'spesifik')
      return allFastingList.filter((f) =>
        ['asyura_tasua', 'arafah_tarwiyah', 'syawal', 'syaban'].includes(f.id)
      );
    if (selectedFilter === 'daud')
      return allFastingList.filter((f) => f.id === 'daud');
    return allFastingList;
  }, [selectedFilter, allFastingList]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner Pengantar Puasa Sunnah */}
      <Card className="p-4 sm:p-5 bg-surface border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                Jadwal & Panduan Puasa Sunnah
              </h2>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Kumpulan jadwal puasa sunnah terdekat, lafadz niat resmi Arab-Latin-Arti, serta dalil shahih keutamaannya.
            </p>
          </div>
          <Chip variant="primary" className="text-xs self-start sm:self-auto py-1 px-2.5">
            Sunnah Mu'akkadah
          </Chip>
        </div>
      </Card>

      {/* Bagian 1: Jadwal Puasa Sunnah Terdekat Mendatang */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>Jadwal Puasa Terdekat (Mulai Hari Ini):</span>
          </h3>
          <span className="text-[11px] text-text-secondary font-mono">
            10 jadwal berikutnya
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {upcomingFasts.map((item, idx) => {
            const isToday = item.daysRemaining === 0;
            const isTomorrow = item.daysRemaining === 1;

            return (
              <Card
                key={idx}
                hoverable
                onClick={() => setSelectedNiatModal(item.fasting)}
                className="p-3.5 bg-surface border border-border hover:border-primary/50 transition-all flex flex-col justify-between gap-2.5 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-card bg-pastel-green text-primary-text flex flex-col items-center justify-center shrink-0 font-mono font-bold text-xs shadow-subtle">
                      <span>{item.dayName.slice(0, 3)}</span>
                      <span className="text-sm leading-none mt-0.5">
                        {item.date.getDate()}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-text-primary truncate">
                        {item.fasting.name}
                      </div>
                      <div className="text-[11px] text-text-secondary truncate mt-0.5">
                        {item.dateFormattedMasehi} ·{' '}
                        <span className="text-accent font-semibold">
                          {item.dateFormattedHijri}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isToday ? (
                      <Chip variant="primary" className="text-[10px] font-bold py-0.5 px-2">
                        Hari Ini
                      </Chip>
                    ) : isTomorrow ? (
                      <Chip variant="secondary" className="text-[10px] font-bold py-0.5 px-2 text-primary-text">
                        Besok
                      </Chip>
                    ) : (
                      <span className="text-[10px] text-text-secondary font-mono bg-surface-alt px-1.5 py-0.5 rounded border border-border">
                        {item.daysRemaining} hari lagi
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-[11px] text-text-secondary truncate font-medium">
                    {item.fasting.badge}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNiatModal(item.fasting);
                    }}
                    className="text-primary-text hover:text-primary font-extrabold text-[11px] flex items-center gap-1 hover:underline"
                  >
                    <span>Lihat Niat &amp; Dalil</span>
                    <span>→</span>
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bagian 2: Direktori Niat & Dalil Lengkap */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Panduan & Lafadz Niat Puasa Sunnah:</span>
          </h3>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'senin_kamis', label: 'Senin & Kamis' },
              { id: 'ayyamul_bidh', label: 'Ayyamul Bidh' },
              { id: 'spesifik', label: 'Asyura & Arafah' },
              { id: 'daud', label: 'Puasa Daud' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 rounded-pill text-xs font-bold transition-all duration-150 active:scale-95 ${
                  selectedFilter === tab.id
                    ? 'bg-primary-gradient text-on-primary shadow-subtle'
                    : 'bg-surface-alt border border-border text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Daftar Kartu Puasa */}
        <div className="space-y-4">
          {filteredFastings.map((fasting) => (
            <Card
              key={fasting.id}
              className="p-4 sm:p-5 bg-surface border border-border shadow-subtle space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-text-primary">
                      {fasting.name}
                    </h4>
                    <Chip variant="primary" className="text-[10px] py-0 px-1.5 h-4">
                      {fasting.badge}
                    </Chip>
                  </div>
                  <p className="text-[11px] text-text-secondary">
                    {fasting.scheduleDescription}
                  </p>
                </div>

                <div className="font-arabic text-sm sm:text-base text-accent font-normal text-right sm:text-left">
                  {fasting.arabicName}
                </div>
              </div>

              {/* Lafadz Niat */}
              {fasting.niatArabic && (
                <div className="bg-surface-alt/80 p-3 sm:p-4 rounded-card border border-border/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Lafadz Niat:</span>
                    </span>
                    <span className="text-[10px] text-text-secondary italic">
                      Dibaca pada malam hari atau sebelum waktu zawal
                    </span>
                  </div>

                  <p
                    dir="rtl"
                    className="font-arabic text-lg sm:text-xl text-text-primary leading-loose text-right pt-1"
                  >
                    {fasting.niatArabic}
                  </p>

                  <p className="text-xs text-primary font-medium italic leading-relaxed pt-1">
                    "{fasting.niatLatin}"
                  </p>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    <strong>Artinya:</strong> {fasting.niatArti}
                  </p>
                </div>
              )}

              {/* Dalil & Keutamaan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-card bg-surface border border-border/70 space-y-1">
                  <span className="font-bold text-text-primary flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    <span>Keutamaan:</span>
                  </span>
                  <p className="text-text-secondary text-[11px] leading-relaxed">
                    {fasting.keutamaan}
                  </p>
                </div>

                <div className="p-3 rounded-card bg-surface border border-border/70 space-y-1">
                  <span className="font-bold text-text-primary flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-accent" />
                    <span>Dalil Hadits:</span>
                  </span>
                  <p className="text-text-secondary text-[11px] italic leading-relaxed">
                    {fasting.dalil}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bagian 3: Edukasi Hari yang Diharamkan Berpuasa */}
      <Card className="p-4 sm:p-5 bg-surface border border-danger/40 space-y-3">
        <div className="flex items-center gap-2 text-danger font-bold text-sm border-b border-border pb-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Hari-Hari yang Diharamkan Berpuasa (Larangan Syariat)</span>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          Dalam syariat Islam, terdapat hari-hari tertentu di mana seorang muslim <strong>dilarang keras (haram)</strong> berpuasa, baik puasa wajib maupun puasa sunnah:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          <div className="p-3 rounded-card bg-surface-alt border border-border space-y-1">
            <strong className="text-danger block font-bold">1. Hari Raya Idul Fitri</strong>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              1 Syawal. Hari kemenangan dan berbuka bagi umat Islam setelah sebulan penuh berpuasa Ramadhan.
            </p>
          </div>

          <div className="p-3 rounded-card bg-surface-alt border border-border space-y-1">
            <strong className="text-danger block font-bold">2. Hari Raya Idul Adha</strong>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              10 Dzulhijjah. Hari raya penyembelihan hewan kurban dan pelaksanaan ibadah haji di Makkah.
            </p>
          </div>

          <div className="p-3 rounded-card bg-surface-alt border border-border space-y-1">
            <strong className="text-danger block font-bold">3. Tiga Hari Tasyrik</strong>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              11, 12, dan 13 Dzulhijjah. Merupakan hari makan, minum, dan mengingat Allah SWT (HR. Muslim).
            </p>
          </div>
        </div>
      </Card>

      {/* Modal Detail Niat & Dalil Puasa Sunnah */}
      <BottomSheet
        isOpen={Boolean(selectedNiatModal)}
        onClose={() => setSelectedNiatModal(null)}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-pastel-green text-primary-text flex items-center justify-center shadow-subtle">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-text-primary">
                {activeFastingModal?.name || 'Niat Puasa Sunnah'}
              </h3>
              <p className="text-[11px] text-text-secondary">
                Lafadz Niat, Terjemahan &amp; Dalil Hadits
              </p>
            </div>
          </div>
        }
      >
        {activeFastingModal && (
          <div className="space-y-4 py-2 select-none">
            {/* Header Info Pelaksanaan */}
            <div className="p-3.5 rounded-card bg-surface-alt border border-border flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-text-secondary uppercase tracking-wider block font-semibold">
                  Jadwal Pelaksanaan:
                </span>
                <span className="text-xs font-bold text-text-primary">
                  {activeFastingModal.scheduleDescription}
                </span>
              </div>
              <Chip variant="primary" className="text-[10px] py-0 px-2 h-5 shrink-0">
                {activeFastingModal.badge}
              </Chip>
            </div>

            {/* Kotak Niat Utama */}
            <div className="p-4 rounded-card bg-surface border border-primary/40 shadow-subtle space-y-3">
              <div className="flex items-center justify-between border-b border-border/70 pb-2">
                <span className="text-xs font-bold text-primary-text flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Lafadz Niat Puasa:</span>
                </span>
                <span className="text-[11px] text-accent font-arabic font-bold">
                  {activeFastingModal.arabicName}
                </span>
              </div>

              {/* Teks Arab Besar */}
              <div className="text-right py-1">
                <p
                  dir="rtl"
                  className="font-arabic text-xl sm:text-2xl text-text-primary leading-[2.2] select-text"
                >
                  {activeFastingModal.niatArabic}
                </p>
              </div>

              {/* Transliterasi Latin */}
              <div className="pt-2 border-t border-border/70">
                <p className="text-xs sm:text-sm text-primary-text font-medium italic select-text leading-relaxed">
                  "{activeFastingModal.niatLatin}"
                </p>
              </div>

              {/* Terjemahan Arti */}
              <div className="pt-1">
                <p className="text-xs text-text-secondary leading-relaxed select-text">
                  <strong className="text-text-primary">Artinya:</strong> {activeFastingModal.niatArti}
                </p>
              </div>
            </div>

            {/* Keutamaan */}
            <div className="p-3.5 rounded-card bg-surface border border-border space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Keutamaan Puasa:</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {activeFastingModal.keutamaan}
              </p>
            </div>

            {/* Dalil Hadits */}
            <div className="p-3.5 rounded-card bg-surface border border-border space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-accent">
                <BookOpen className="w-4 h-4" />
                <span>Dalil Hadits Shahih:</span>
              </div>
              <p className="text-xs text-text-secondary italic leading-relaxed">
                {activeFastingModal.dalil}
              </p>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
