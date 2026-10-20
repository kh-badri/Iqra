'use client';

import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { PRAYER_MEANINGS_DATA, type PrayerStepMeaning } from '../data/prayerMeaningsData';
import {
  BookOpen,
  Sparkles,
  HeartHandshake,
  Copy,
  Check,
  Search,
  ShieldCheck,
  Flame,
  Info,
} from 'lucide-react';

export function PrayerMeaningView() {
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'rukun' | 'sunnah'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const filteredSteps = React.useMemo(() => {
    return PRAYER_MEANINGS_DATA.filter((step) => {
      // Filter kategori
      if (activeFilter !== 'all' && step.category !== activeFilter) {
        return false;
      }
      // Filter pencarian
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        step.title.toLowerCase().includes(query) ||
        step.movementName.toLowerCase().includes(query) ||
        step.translation.toLowerCase().includes(query) ||
        step.spiritualMeaning.toLowerCase().includes(query) ||
        step.tadabbur.toLowerCase().includes(query) ||
        step.transliteration.toLowerCase().includes(query)
      );
    });
  }, [activeFilter, searchQuery]);

  const handleCopy = (step: PrayerStepMeaning) => {
    const textToCopy = `*${step.title}* (${step.movementName})\n\nLafadz Arab:\n${step.arabic}\n\nLatin:\n${step.transliteration}\n\nArtinya:\n"${step.translation}"\n\nHikmah Ruhani:\n${step.spiritualMeaning}\n\nSumber: ${step.hadithSource}\nKitab: ${step.referenceBook}\n\n(Aplikasi Iqra: Belajar Al-Qur'an, Sholat & Tajwid)`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(step.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Banner Makna Sholat */}
      <Card className="p-5 sm:p-7 bg-surface border-border shadow-card rounded-card relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-primary-soft text-primary text-xs font-extrabold border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Tadabbur &amp; Meraih Sholat Khusyuk</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-text-primary tracking-tight">
              Makna Filosofis, Ruhani &amp; Bacaan Sholat
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Sholat bukan sekadar rutinitas gerakan raga yang hampa. Di setiap gerakan, sujud, dan bacaan tersimpan rahasia penghambaan yang agung untuk mengantarkan jiwa menuju kedekatan sejati dengan Allah ﷻ.
            </p>
          </div>

          <div className="hidden lg:flex flex-col items-end text-right p-3 bg-surface-alt rounded-button border border-border">
            <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span>Rujukan Shahih &amp; Mu&apos;tamad</span>
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Shahihain, Al-Fiqh Al-Manhaji, &amp; Asrarus Shalah
            </p>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 pt-5 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Filter Chips */}
          <div className="inline-flex p-1 bg-surface-alt border border-border rounded-pill gap-1 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-pill text-xs font-bold transition-all duration-150 ${
                activeFilter === 'all'
                  ? 'bg-primary-gradient text-on-primary shadow-subtle'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Semua (13)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('rukun')}
              className={`px-3 py-1.5 rounded-pill text-xs font-bold transition-all duration-150 ${
                activeFilter === 'rukun'
                  ? 'bg-primary-gradient text-on-primary shadow-subtle'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Rukun Sholat (Wajib)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('sunnah')}
              className={`px-3 py-1.5 rounded-pill text-xs font-bold transition-all duration-150 ${
                activeFilter === 'sunnah'
                  ? 'bg-primary-gradient text-on-primary shadow-subtle'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Sunnah Penyempurna
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari gerakan atau doa..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-pill bg-surface-alt border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>
      </Card>

      {/* Daftar Langkah Sholat */}
      {filteredSteps.length === 0 ? (
        <Card className="p-8 text-center bg-surface border-border">
          <Info className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-sm font-semibold text-text-primary">
            Tidak ditemukan langkah sholat yang cocok.
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Coba gunakan kata kunci pencarian lain atau pilih filter &apos;Semua&apos;.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSteps.map((step) => {
            const isCopied = copiedId === step.id;

            return (
              <Card
                key={step.id}
                className="p-5 sm:p-6 bg-surface border-border shadow-card rounded-card space-y-4 hover:border-primary/40 transition-all group"
              >
                {/* Header Langkah */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary-soft text-primary font-mono font-extrabold text-sm flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-xs">
                      {step.stepNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                          {step.title}
                        </h3>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-pill uppercase tracking-wider ${
                            step.category === 'rukun'
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {step.category === 'rukun' ? 'Rukun Sholat' : 'Sunnah Sholat'}
                        </span>
                      </div>
                      <p className="text-xs text-primary font-medium mt-0.5">
                        {step.movementName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-arabic text-lg text-text-secondary" dir="rtl">
                      {step.arabicName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(step)}
                      title="Salin bacaan & makna"
                      className="p-2 rounded-pill bg-surface-alt border border-border text-text-secondary hover:text-primary hover:border-primary/40 active:scale-95 transition-all text-xs flex items-center gap-1.5"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-success" />
                          <span className="text-[11px] font-bold text-success">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-medium hidden sm:inline">Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Deskripsi Gerakan Fisik */}
                <div className="p-3 bg-surface-alt/70 rounded-button text-xs text-text-secondary leading-relaxed border border-border/80">
                  <span className="font-bold text-text-primary">Panduan Gerakan: </span>
                  {step.movementDescription}
                </div>

                {/* Kotak Lafadz Bacaan Arab */}
                <div className="p-4 sm:p-5 rounded-card bg-surface-alt border border-border/80 space-y-3">
                  <div
                    className="font-arabic text-xl sm:text-2xl text-text-primary leading-loose tracking-wide text-right selection:bg-primary/20"
                    dir="rtl"
                  >
                    {step.arabic}
                  </div>

                  <div className="pt-2 border-t border-border/60 space-y-1.5">
                    <p className="text-xs sm:text-sm font-semibold text-primary italic leading-relaxed">
                      {step.transliteration}
                    </p>
                    <p className="text-xs sm:text-sm text-text-primary leading-relaxed font-normal">
                      &ldquo;{step.translation}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Ruh & Hikmah Spiritual (Penghayatan Khusyuk) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* Makna Filosofis / Ruhani */}
                  <div className="p-4 rounded-card bg-primary-soft/30 border border-primary/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-primary">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <span>Ruh &amp; Rahasia Spiritual Gerakan</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {step.spiritualMeaning}
                    </p>
                  </div>

                  {/* Tadabbur Hati */}
                  <div className="p-4 rounded-card bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-700 dark:text-amber-400">
                      <HeartHandshake className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Tadabbur untuk Meraih Khusyuk</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {step.tadabbur}
                    </p>
                  </div>
                </div>

                {/* Dalil Hadits & Sumber Kitab Resmi */}
                <div className="pt-3 border-t border-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-text-muted">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Flame className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    <span className="font-medium">Dalil Shahih:</span>
                    <span className="text-text-primary font-semibold">{step.hadithSource}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] bg-surface-alt px-2.5 py-1 rounded-pill border border-border">
                    <BookOpen className="w-3 h-3 text-text-secondary" />
                    <span>Rujukan: {step.referenceBook}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
