'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Share2,
  Sparkles,
  BookOpen,
  Calendar,
  Check
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import type { Prophet } from '../types';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface ProphetDetailViewProps {
  prophet: Prophet;
  prevProphet: Prophet | null;
  nextProphet: Prophet | null;
}

export const ProphetDetailView: React.FC<ProphetDetailViewProps> = ({
  prophet,
  prevProphet,
  nextProphet,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const isBookmarked = useLiveQuery(
    () => db.bookmarks.where('refId').equals(`prophet-${prophet.slug}`).first(),
    [prophet.slug]
  );

  const progressRecord = useLiveQuery(
    () => db.prophetProgress.where('slug').equals(prophet.slug).first(),
    [prophet.slug]
  );

  // Track scroll progress for reading indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const current = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, current)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleBookmark = async () => {
    if (isBookmarked && isBookmarked.id) {
      await db.bookmarks.delete(isBookmarked.id);
    } else {
      await db.bookmarks.add({
        type: 'prophet',
        refId: `prophet-${prophet.slug}`,
        title: prophet.name,
        subtitle: `${prophet.era} · ${prophet.place}`,
        extraData: { slug: prophet.slug, order: prophet.order, arabicName: prophet.arabicName },
        createdAt: Date.now(),
      });
    }
  };

  const toggleCompleted = async () => {
    if (progressRecord && progressRecord.id) {
      await db.prophetProgress.update(progressRecord.id, {
        read: !progressRecord.read,
        updatedAt: Date.now(),
      });
    } else {
      await db.prophetProgress.add({
        slug: prophet.slug,
        read: true,
        updatedAt: Date.now(),
      });
    }
  };

  const handleShare = async () => {
    const shareText = `Kisah ${prophet.name} (${prophet.arabicName}) - Kisah 25 Nabi dan Teladan di Iqra: ${window.location.href}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Kisah ${prophet.name}`,
          text: prophet.summary,
          url: window.location.href,
        });
        return;
      } catch (err) {
        // User cancelled or fallback
      }
    }
    // Fallback clipboard
    await navigator.clipboard.writeText(shareText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Top sticky reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-border/40 z-50">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Link
          href="/kisah-nabi/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Daftar Kisah Singkat 25 Nabi</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-xs flex items-center gap-1.5"
            aria-label="Bagikan kisah nabi"
          >
            {isCopied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isCopied ? 'Tersalin' : 'Bagikan'}</span>
          </Button>

          <Button
            variant={isBookmarked ? 'secondary' : 'ghost'}
            size="sm"
            onClick={toggleBookmark}
            className="text-xs flex items-center gap-1.5"
            aria-label="Bookmark kisah nabi"
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? 'fill-accent text-accent' : ''}`}
            />
            <span className="hidden sm:inline">
              {isBookmarked ? 'Tersimpan' : 'Simpan'}
            </span>
          </Button>
        </div>
      </div>

      {/* Hero Header Card */}
      <Card className="p-6 sm:p-8 border border-border bg-surface">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-accent/15 text-accent border border-accent/30 font-bold text-sm flex items-center justify-center">
              {prophet.order}
            </span>
            <Chip variant="secondary" className="text-xs font-semibold">
              Nabi & Rasul ke-{prophet.order}
            </Chip>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Clock className="w-4 h-4" />
            <span>Estimasi {prophet.readingTimeMinutes} menit baca</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Kisah Singkat {prophet.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-text-secondary">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4 text-text-secondary" />
                {prophet.era}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4 text-text-secondary" />
                {prophet.place}
              </span>
              <span className="inline-flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-text-secondary" />
                Disebut {prophet.mentionCount} kali di Al-Qur&apos;an
              </span>
            </div>
          </div>

          <span className="font-arabic text-3xl sm:text-4xl text-primary font-normal self-start sm:self-end">
            {prophet.arabicName}
          </span>
        </div>

        <p className="text-sm sm:text-base text-text-primary leading-relaxed pt-4 border-t border-border">
          {prophet.summary}
        </p>

        {/* Read Completion Action */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <button
            onClick={toggleCompleted}
            type="button"
            className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              progressRecord?.read
                ? 'bg-success/15 text-success border-success/30'
                : 'bg-surface-alt text-text-secondary border-border hover:text-text-primary'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {progressRecord?.read ? 'Sudah Dibaca Selesai' : 'Tandai Sudah Selesai Dibaca'}
            </span>
          </button>
        </div>
      </Card>

      {/* Story Sections */}
      <div className="space-y-6">
        {prophet.sections.map((section, idx) => (
          <Card key={section.id} className="p-6 sm:p-7 border border-border">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="w-6 h-6 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-text-primary">
                {section.title}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-text-primary leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          </Card>
        ))}
      </div>

      {/* Quran Verse References */}
      {prophet.verseRefs && prophet.verseRefs.length > 0 && (
        <Card className="p-6 border border-border bg-surface">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-base sm:text-lg font-bold text-text-primary">
              Rujukan Ayat Al-Qur&apos;an
            </h2>
          </div>

          <div className="space-y-3.5">
            {prophet.verseRefs.map((v, i) => (
              <div
                key={i}
                className="p-4 rounded-card bg-surface-alt border border-border/70 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">
                      QS. {v.surahName} [{v.surahNumber}]: {v.ayahNumber}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary italic leading-relaxed">
                    &ldquo;{v.text}&rdquo;
                  </p>
                </div>

                <Link
                  href={`/quran/${v.surahNumber}/`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
                >
                  <span>Buka Surah</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Lessons Learned Box (Kotak Hikmah) */}
      <Card className="p-6 sm:p-7 border border-accent/40 bg-accent/5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-base sm:text-lg font-bold text-text-primary">
            Kotak Hikmah & Pelajaran Berharga
          </h2>
        </div>

        <ul className="space-y-2.5">
          {prophet.lessons.map((lesson, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
              <span className="leading-relaxed">{lesson}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Sources / References (Wajib Sesuai PRD) */}
      <Card className="p-5 border border-border bg-surface text-xs text-text-secondary">
        <h3 className="font-bold text-text-primary mb-2 uppercase tracking-wider text-[11px]">
          Sumber & Referensi Mu&apos;tabar
        </h3>
        <ul className="space-y-1 list-disc list-inside">
          {prophet.sources.map((src, i) => (
            <li key={i} className="leading-relaxed">
              {src}
            </li>
          ))}
        </ul>
      </Card>

      {/* Previous / Next Prophet Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {prevProphet ? (
          <Link href={`/kisah-nabi/${prevProphet.slug}/`} className="block group">
            <Card className="p-4 border border-border hover:border-primary transition-colors flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 text-primary shrink-0 group-hover:-translate-x-1 transition-transform" />
              <div className="truncate">
                <span className="text-[11px] text-text-secondary block">Nabi Sebelumnya</span>
                <span className="text-sm font-bold text-text-primary group-hover:text-primary">
                  {prevProphet.name}
                </span>
              </div>
            </Card>
          </Link>
        ) : (
          <div />
        )}

        {nextProphet ? (
          <Link href={`/kisah-nabi/${nextProphet.slug}/`} className="block group text-right">
            <Card className="p-4 border border-border hover:border-primary transition-colors flex items-center justify-end gap-3">
              <div className="truncate">
                <span className="text-[11px] text-text-secondary block">Nabi Selanjutnya</span>
                <span className="text-sm font-bold text-text-primary group-hover:text-primary">
                  {nextProphet.name}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
            </Card>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
