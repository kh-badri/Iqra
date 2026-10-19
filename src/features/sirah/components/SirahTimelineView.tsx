'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Calendar,
  MapPin,
  Clock,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Share2,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  Bookmark,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { SIRAH_EPISODES } from '../constants';
import type { SirahEpisode, SirahPhase } from '../types';

export function SirahTimelineView() {
  const [activePhase, setActivePhase] = React.useState<SirahPhase>('semua');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedId, setExpandedId] = React.useState<string | null>(SIRAH_EPISODES[0].id);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const filteredEpisodes = React.useMemo(() => {
    return SIRAH_EPISODES.filter((ep) => {
      const matchPhase =
        activePhase === 'semua' || ep.phase === activePhase;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        ep.title.toLowerCase().includes(q) ||
        ep.summary.toLowerCase().includes(q) ||
        ep.location.toLowerCase().includes(q) ||
        ep.yearMasehi.toLowerCase().includes(q) ||
        ep.content.some((c) => c.toLowerCase().includes(q));
      return matchPhase && matchSearch;
    });
  }, [activePhase, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleShare = async (ep: SirahEpisode) => {
    const text = `Sirah Nabawiyyah: ${ep.title} (${ep.yearMasehi}) - Belajar Perjalanan Hidup Rasulullah ﷺ di Iqra`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: ep.title,
          text: ep.summary,
          url: `${window.location.origin}/sirah/#${ep.id}`,
        });
      } catch {
        // User cancelled share
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${text}\n${window.location.origin}/sirah/#${ep.id}`);
      setCopiedId(ep.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumb & Navigation Back */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <Link
          href="/belajar/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-text hover:underline min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pusat Belajar</span>
        </Link>
        <Chip variant="outline" className="text-[11px] rounded-full">
          17 Bab Kronologis
        </Chip>
      </div>

      {/* Header Utama */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-full bg-pastel-green text-[#266308] border border-pastel-green/40 flex items-center justify-center shrink-0 shadow-subtle">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
              Sirah Nabawiyyah (السيرة النبوية)
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Kronologi lengkap perjalanan hidup Rasulullah Muhammad ﷺ dari lahir hingga wafat
            </p>
          </div>
        </div>

        {/* Sumber Kitab Rujukan */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Chip variant="secondary" className="text-[10px] font-semibold py-0.5 px-2.5">
            Rujukan Utama: Kitab Ar-Rahiq Al-Makhtum
          </Chip>
          <Chip variant="outline" className="text-[10px] py-0.5 px-2.5">
            Shahih Bukhari &amp; Muslim
          </Chip>
          <Chip variant="outline" className="text-[10px] py-0.5 px-2.5">
            Sirah Ibnu Hisyam
          </Chip>
        </div>
      </div>

      {/* Ringkasan Makna Sirah Card */}
      <Card className="p-5 sm:p-6 bg-surface border border-border shadow-card rounded-card">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-pastel-cyan text-[#0B5C66] border border-pastel-cyan/40 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm text-text-muted leading-relaxed">
            <p className="font-bold text-text-primary text-sm sm:text-base">
              Mengapa Wajib Mempelajari Sirah Nabawiyyah?
            </p>
            <p className="mt-1 leading-relaxed">
              Mempelajari sirah Nabi ﷺ bukan sekadar membaca kisah sejarah masa lalu, melainkan bagian dari keimanan untuk mengenal uswah hasanah (teladan terbaik), memahami konteks turunnya ayat Al-Qur'an, menumbuhkan rasa cinta sejati kepada Rasulullah, dan mengambil panduan hidup dalam berdakwah, berkeluarga, dan bermasyarakat.
            </p>
          </div>
        </div>
      </Card>

      {/* Filter Kontrol & Pencarian */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Phase Buttons */}
        <div className="inline-flex p-1 bg-surface-2 border border-border rounded-full gap-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActivePhase('semua')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all min-h-[38px] ${
              activePhase === 'semua'
                ? 'bg-primary-gradient text-on-primary shadow-subtle'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Semua (17)
          </button>
          <button
            type="button"
            onClick={() => setActivePhase('makkah')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all min-h-[38px] ${
              activePhase === 'makkah'
                ? 'bg-primary-gradient text-on-primary shadow-subtle'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Fase Makkah (1–9)
          </button>
          <button
            type="button"
            onClick={() => setActivePhase('madinah')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all min-h-[38px] ${
              activePhase === 'madinah'
                ? 'bg-primary-gradient text-on-primary shadow-subtle'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Fase Madinah (10–17)
          </button>
        </div>

        {/* Pencarian Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari peristiwa, perang, tahun..."
            className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-button bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary shadow-subtle min-h-[44px]"
          />
        </div>
      </div>

      {/* Timeline List Events */}
      <div className="space-y-4">
        {filteredEpisodes.length === 0 ? (
          <Card className="p-8 text-center bg-surface border-border">
            <BookOpen className="w-8 h-8 text-text-secondary mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-text-primary">
              Tidak ada peristiwa yang cocok
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Coba kata kunci pencarian lain atau pilih tab "Semua Fase".
            </p>
          </Card>
        ) : (
          filteredEpisodes.map((ep) => {
            const isExpanded = expandedId === ep.id;
            return (
              <Card
                key={ep.id}
                id={ep.id}
                className={`p-5 sm:p-6 bg-surface border transition-all duration-200 rounded-card shadow-card ${
                  isExpanded ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border hover:border-primary/30'
                }`}
              >
                {/* Header Episode */}
                <div
                  onClick={() => toggleExpand(ep.id)}
                  className="cursor-pointer select-none"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-pastel-green text-[#266308] border border-pastel-green/40 font-bold text-xs flex items-center justify-center shrink-0 shadow-subtle tabular-nums">
                        {ep.order}
                      </span>
                      <Chip
                        variant={ep.phase === 'makkah' ? 'secondary' : 'primary'}
                        className="text-[11px] font-semibold py-0.5 px-2.5"
                      >
                        {ep.phase === 'makkah' ? 'Fase Makkah' : 'Fase Madinah'}
                      </Chip>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-text-muted font-medium tabular-nums">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary-text" />
                        <span>{ep.yearMasehi}</span>
                        {ep.yearHijri && <span className="opacity-75">({ep.yearHijri})</span>}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Usia: {ep.age}</span>
                      </span>
                    </div>
                  </div>

                  {/* Judul & Bahasa Arab */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                        {ep.title}
                      </h3>
                      {ep.arabicTitle && (
                        <p
                          dir="rtl"
                          className="font-arabic text-sm text-text-muted mt-1 text-right sm:text-left"
                        >
                          {ep.arabicTitle}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label={isExpanded ? 'Tutup detail' : 'Buka detail'}
                      className="w-10 h-10 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-2 flex items-center justify-center transition-colors shrink-0 active:scale-90"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-primary-text" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Lokasi & Ringkasan Singkat */}
                  <div className="mt-2 text-xs text-text-muted">
                    <p className="flex items-center gap-1 text-[11px] text-text-muted mb-1">
                      <MapPin className="w-3.5 h-3.5 text-primary-text inline shrink-0" />
                      <span>{ep.location}</span>
                    </p>
                    <p className="text-text-muted leading-relaxed">
                      {ep.summary}
                    </p>
                  </div>
                </div>

                {/* Konten Terperinci (Saat Terbuka) */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-4 text-xs sm:text-sm animate-in fade-in duration-200">
                    {/* Paragraf Narasi Sejarah */}
                    <div className="space-y-2.5 text-text-primary leading-relaxed">
                      {ep.content.map((p, idx) => (
                        <p key={idx} className="text-xs sm:text-sm text-text-primary leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>

                    {/* Dalil Ayat Al-Qur'an (jika ada) */}
                    {ep.verseRefs && ep.verseRefs.length > 0 && (
                      <div className="space-y-2.5 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary-text block">
                          Rujukan Firman Allah (Al-Qur'an)
                        </span>
                        {ep.verseRefs.map((v, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-surface-2 rounded-card border border-border space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs text-primary-text font-bold">
                              <span>{v.surah}</span>
                            </div>
                            <p
                              dir="rtl"
                              className="font-arabic text-base sm:text-lg text-right text-text-primary leading-loose"
                            >
                              {v.text}
                            </p>
                            <p className="text-xs text-text-muted italic leading-relaxed">
                              &ldquo;{v.translation}&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Hadits Shahih Terkait (jika ada) */}
                    {ep.hadithRefs && ep.hadithRefs.length > 0 && (
                      <div className="space-y-2.5 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary-text block">
                          Hadits Rujukan Shahih
                        </span>
                        {ep.hadithRefs.map((h, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-pastel-green/30 rounded-card border border-pastel-green/50 text-xs leading-relaxed"
                          >
                            <span className="font-bold text-[#266308] dark:text-[#9BE35B] block mb-1">
                              {h.source}
                            </span>
                            <p className="text-text-primary leading-relaxed italic">
                              &ldquo;{h.text}&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Hikmah & Pelajaran Berharga */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                        Hikmah &amp; Pelajaran Kehidupan ('Ibrah)
                      </span>
                      <ul className="space-y-1.5 text-xs text-text-muted">
                        {ep.lessons.map((lesson, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer Episode: Share Button */}
                    <div className="pt-2 flex items-center justify-between border-t border-border">
                      <span className="text-xs text-text-muted">
                        Bab {ep.order} dari 17
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(ep)}
                        className="text-xs gap-1.5 min-h-[44px] rounded-button text-text-muted hover:text-primary-text"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{copiedId === ep.id ? 'Tersalin!' : 'Bagikan Bab'}</span>
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Rujukan Lengkap & Link ke Kisah 25 Nabi */}
      <Card className="p-5 sm:p-6 bg-surface border border-border shadow-card rounded-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-text-primary">
            Ingin Mempelajari Kisah Nabi Lainnya?
          </h4>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Baca ringkasan keteladanan 25 nabi dan rasul dari Nabi Adam AS hingga Isa AS di modul Kisah 25 Nabi.
          </p>
        </div>
        <Link href="/kisah-nabi/" className="shrink-0 w-full sm:w-auto">
          <Button variant="secondary" size="sm" className="w-full sm:w-auto min-h-[44px] rounded-button text-xs font-bold">
            Buka Kisah 25 Nabi
          </Button>
        </Link>
      </Card>
    </div>
  );
}
