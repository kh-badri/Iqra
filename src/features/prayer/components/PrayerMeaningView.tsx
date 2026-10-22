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
  CheckCircle2,
} from 'lucide-react';
import { PrayerPostureIllustration } from './PrayerPostureIllustration';

export function PrayerMeaningView() {
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'rukun' | 'sunnah'>('rukun');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [viewModePerStep, setViewModePerStep] = React.useState<Record<string, 'verses' | 'compact'>>({});

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
        step.transliteration.toLowerCase().includes(query) ||
        (step.verses &&
          step.verses.some(
            (v) =>
              v.translation.toLowerCase().includes(query) ||
              v.transliteration.toLowerCase().includes(query)
          ))
      );
    });
  }, [activeFilter, searchQuery]);

  const handleCopy = (step: PrayerStepMeaning) => {
    let readingContent = `Lafadz Arab:\n${step.arabic}\n\nLatin:\n${step.transliteration}\n\nArtinya:\n"${step.translation}"`;

    if (step.verses && step.verses.length > 0) {
      readingContent = step.verses
        .map(
          (v) =>
            `Ayat ${v.number}:\n${v.arabic}\n${v.transliteration}\n"${v.translation}"${
              v.hadithReply ? `\n(${v.hadithReply})` : ''
            }`
        )
        .join('\n\n');
    }

    const textToCopy = `*${step.title}* (${step.movementName})\n\n${readingContent}\n\nHikmah Ruhani:\n${step.spiritualMeaning}\n\nSumber: ${step.hadithSource}\nKitab: ${step.referenceBook}\n\n(Aplikasi Iqra: Belajar Al-Qur'an, Sholat & Tajwid)`;

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
          {/* Filter Chips: Default Rukun Wajib, Opsi Sunnah Penyempurna & Semua */}
          <div className="inline-flex p-1 bg-surface-alt border border-border rounded-pill gap-1 self-start sm:self-auto flex-wrap">
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
                    <span className="font-arabic text-xl sm:text-2xl text-primary font-bold" dir="rtl">
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

                {/* Visual Gerakan & Panduan Sesuai Sunnah (Responsive Mobile & Desktop) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-3.5 sm:p-4 rounded-card bg-surface-alt/70 border border-border/80">
                  {/* Kolom Contoh Ilustrasi Gerakan */}
                  <div className="md:col-span-4 flex flex-col items-center">
                    <PrayerPostureIllustration
                      posture={step.postureId}
                      className="w-full max-w-[260px] mx-auto shadow-xs"
                    />
                    <span className="text-[10px] sm:text-[11px] font-bold text-text-muted mt-2 text-center">
                      Posisi: {step.movementName}
                    </span>
                  </div>

                  {/* Kolom Panduan Fisik & Poin Kunci Sunnah */}
                  <div className="md:col-span-8 space-y-2.5">
                    <div className="text-xs text-text-secondary leading-relaxed">
                      <span className="font-bold text-text-primary">Panduan Gerakan: </span>
                      {step.movementDescription}
                    </div>

                    {/* Poin Kunci Posisi Sesuai Sunnah */}
                    {step.keyPoints && step.keyPoints.length > 0 && (
                      <div className="p-3 rounded-button bg-primary-soft/20 border border-primary/20 space-y-1.5">
                        <div className="text-[11px] font-extrabold text-primary flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                          <span>Poin Kunci Posisi Sesuai Sunnah:</span>
                        </div>
                        <ul className="space-y-1">
                          {step.keyPoints.map((point, idx) => (
                            <li
                              key={idx}
                              className="text-[11px] text-text-secondary flex items-start gap-1.5 leading-snug"
                            >
                              <span className="text-primary font-bold leading-none mt-0.5">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Kotak Lafadz Bacaan Arab */}
                {step.verses && step.verses.length > 0 ? (
                  <div className="p-4 sm:p-5 rounded-card bg-surface-alt border border-border/80 space-y-4">
                    {/* Bar Kontrol Mode Tampilan Ayat */}
                    <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-border/70">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs sm:text-sm font-bold text-text-primary">
                          Lafadz Bacaan ({step.verses.length} Ayat)
                        </span>
                        <span className="text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-pill bg-primary/10 text-primary font-semibold border border-primary/20">
                          Tartil &amp; Sunnah Waqaf
                        </span>
                      </div>

                      <div className="inline-flex p-0.5 bg-surface border border-border rounded-pill text-[11px] font-semibold">
                        <button
                          type="button"
                          onClick={() =>
                            setViewModePerStep((prev) => ({ ...prev, [step.id]: 'verses' }))
                          }
                          className={`px-2.5 py-1 rounded-pill transition-all ${
                            viewModePerStep[step.id] !== 'compact'
                              ? 'bg-primary text-on-primary shadow-xs font-bold'
                              : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          Per Ayat (Tartil)
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setViewModePerStep((prev) => ({ ...prev, [step.id]: 'compact' }))
                          }
                          className={`px-2.5 py-1 rounded-pill transition-all ${
                            viewModePerStep[step.id] === 'compact'
                              ? 'bg-primary text-on-primary shadow-xs font-bold'
                              : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          Teks Penuh
                        </button>
                      </div>
                    </div>

                    {/* Mode Tampilan Per Ayat (Tertata Rapi, Indah, dan Berbobot) */}
                    {viewModePerStep[step.id] !== 'compact' ? (
                      <div className="space-y-3">
                        {step.verses.map((verse) => (
                          <div
                            key={verse.number}
                            className="p-3.5 sm:p-4 rounded-button bg-surface border border-border/80 hover:border-primary/40 transition-colors space-y-3"
                          >
                            {/* Header Ayat & Catatan Hadits Qudsi */}
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold flex items-center justify-center border border-primary/20 shadow-xs">
                                  {verse.number}
                                </span>
                                <span className="text-xs font-bold text-text-secondary">
                                  Ayat {verse.number}
                                </span>
                              </div>
                              {verse.hadithReply && (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium border border-emerald-500/20">
                                  <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                  <span>{verse.hadithReply}</span>
                                </div>
                              )}
                            </div>

                            {/* Teks Arab Rasm Utsmani */}
                            <div
                              className="font-arabic text-2xl sm:text-3xl text-text-primary leading-[2.4] tracking-wide text-right selection:bg-primary/20 py-1"
                              dir="rtl"
                            >
                              {verse.arabic}
                            </div>

                            {/* Transliterasi & Terjemahan */}
                            <div className="pt-2 border-t border-border/60 space-y-1">
                              <p className="text-xs sm:text-sm font-semibold text-primary italic leading-relaxed">
                                {verse.transliteration}
                              </p>
                              <p className="text-xs sm:text-sm text-text-primary leading-relaxed font-normal">
                                &ldquo;{verse.translation}&rdquo;
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Mode Tampilan Teks Lengkap (Tetap Bersih Tanpa Karakter Rusak) */
                      <div className="space-y-3">
                        <div
                          className="font-arabic text-2xl sm:text-3xl text-text-primary leading-[2.4] tracking-wide text-right selection:bg-primary/20 py-1"
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
                    )}
                  </div>
                ) : (
                  /* Kotak Default untuk Langkah Sholat Lainnya */
                  <div className="p-4 sm:p-5 rounded-card bg-surface-alt border border-border/80 space-y-3">
                    <div
                      className="font-arabic text-2xl sm:text-3xl text-text-primary leading-[2.4] tracking-wide text-right selection:bg-primary/20 py-1"
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
                )}

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
