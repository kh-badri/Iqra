'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  Play,
  Share2,
  Award,
  Sparkles,
  Volume2
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import type { TajwidLesson } from '../types';
import { TajwidColorLegend, TAJWID_COLOR_RULES } from './TajwidColorLegend';
import { TajwidQuizModal } from './TajwidQuizModal';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface TajwidLessonViewProps {
  lesson: TajwidLesson;
  prevLesson: TajwidLesson | null;
  nextLesson: TajwidLesson | null;
}

export const TajwidLessonView: React.FC<TajwidLessonViewProps> = ({
  lesson,
  prevLesson,
  nextLesson,
}) => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [playingExampleIndex, setPlayingExampleIndex] = useState<number | null>(null);

  const isBookmarked = useLiveQuery(
    () => db.bookmarks.where('refId').equals(`tajwid-${lesson.slug}`).first(),
    [lesson.slug]
  );

  const progressRecord = useLiveQuery(
    () => db.tajwidProgress.where('lessonSlug').equals(lesson.slug).first(),
    [lesson.slug]
  );

  const toggleBookmark = async () => {
    if (isBookmarked && isBookmarked.id) {
      await db.bookmarks.delete(isBookmarked.id);
    } else {
      await db.bookmarks.add({
        type: 'tajwid',
        refId: `tajwid-${lesson.slug}`,
        title: lesson.title,
        subtitle: `Level ${lesson.level} · ${lesson.category}`,
        extraData: { slug: lesson.slug, level: lesson.level, category: lesson.category },
        createdAt: Date.now(),
      });
    }
  };

  // Web Audio chime for pronunciation cue
  const playPronunciationTone = (exampleIndex: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 tone
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);

      setPlayingExampleIndex(exampleIndex);
      setTimeout(() => setPlayingExampleIndex(null), 800);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Link
          href="/tajwid/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kurikulum Tajwid</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant={isBookmarked ? 'secondary' : 'ghost'}
            size="sm"
            onClick={toggleBookmark}
            className="text-xs flex items-center gap-1.5"
            aria-label="Bookmark materi tajwid"
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? 'fill-accent text-accent' : ''}`}
            />
            <span className="hidden sm:inline">
              {isBookmarked ? 'Tersimpan' : 'Simpan'}
            </span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsQuizOpen(true)}
            className="text-xs flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Mulai Kuis</span>
          </Button>
        </div>
      </div>

      {/* Hero Header Card */}
      <Card className="p-6 sm:p-8 border border-border bg-surface">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary-soft text-primary font-bold text-sm flex items-center justify-center">
              L{lesson.level}
            </span>
            <Chip variant="secondary" className="text-xs font-semibold">
              Level {lesson.level} · {lesson.category}
            </Chip>
          </div>

          {progressRecord?.completed && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/15 border border-success/30 text-success text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Lulus Kuis ({progressRecord.bestScore || progressRecord.score}%)</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              {lesson.title}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              {lesson.summary}
            </p>
          </div>

          <span className="font-arabic text-3xl sm:text-4xl text-primary font-normal self-start sm:self-auto shrink-0">
            {lesson.arabicTitle}
          </span>
        </div>

        {/* Letters Badges if available */}
        {lesson.letters && lesson.letters.length > 0 && (
          <div className="pt-4 border-t border-border">
            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-2">
              Huruf / Unsur Terkait:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {lesson.letters.map((ltr, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-card bg-surface-alt border border-border text-xs sm:text-sm font-arabic text-text-primary font-bold"
                >
                  {ltr}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Explanation & Definition */}
      <Card className="p-6 sm:p-7 border border-border space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-bold text-text-primary">
            Pengertian &amp; Kaidah Hukum
          </h2>
        </div>
        <p className="text-sm sm:text-base text-text-primary leading-relaxed">
          {lesson.description}
        </p>

        {lesson.rules && lesson.rules.length > 0 && (
          <div className="space-y-3 pt-3">
            {lesson.rules.map((rule, idx) => (
              <div
                key={idx}
                className="p-4 rounded-card bg-surface-alt border border-border/80 space-y-1"
              >
                <h3 className="text-sm font-bold text-text-primary">{rule.name}</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Color Legend for Visual Reference */}
      <TajwidColorLegend compact />

      {/* Quran Examples with Colored Segments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-lg sm:text-xl font-bold text-text-primary">
              Contoh Ayat Al-Qur&apos;an &amp; Penerapan
            </h2>
          </div>
          <span className="text-xs text-text-secondary">
            {lesson.examples.length} Contoh Resmi Kemenag
          </span>
        </div>

        <div className="space-y-4">
          {lesson.examples.map((ex, idx) => (
            <Card key={idx} className="p-6 border border-border space-y-4 bg-surface">
              {/* Example Header */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-bold text-primary">
                  QS. {ex.surahName} [{ex.surahNumber}]: {ex.ayahNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 font-semibold text-[11px]">
                  {ex.ruleName}
                </span>
              </div>

              {/* Arabic Text with Tajwid Colored Highlights */}
              <div className="p-5 rounded-card bg-surface-alt border border-border text-right dir-rtl">
                <p className="font-arabic text-2xl sm:text-3xl leading-[2.2] text-text-primary">
                  {ex.segments.map((seg, sIdx) => {
                    if (seg.isHighlighted) {
                      const colorRule = TAJWID_COLOR_RULES.find((r) => r.id === seg.ruleId);
                      return (
                        <span
                          key={sIdx}
                          className={`inline-block px-1 rounded mx-0.5 font-bold ${
                            colorRule?.chipClass || 'bg-primary-soft text-primary'
                          }`}
                        >
                          {seg.text}
                        </span>
                      );
                    }
                    return <span key={sIdx}>{seg.text}</span>;
                  })}
                </p>
              </div>

              {/* Translation & Note */}
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="text-text-primary italic leading-relaxed">
                  &ldquo;{ex.translation}&rdquo;
                </p>
                {ex.note && (
                  <p className="text-xs text-text-secondary leading-relaxed pt-2 border-t border-border">
                    <strong className="text-text-primary">Penjelasan:</strong> {ex.note}
                  </p>
                )}
              </div>

              {/* Audio Pronunciation Button & Surah Link */}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => playPronunciationTone(idx)}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    playingExampleIndex === idx
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface text-text-primary border-border hover:border-primary'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>
                    {playingExampleIndex === idx ? 'Memutar Nada...' : 'Dengarkan Contoh'}
                  </span>
                </button>

                <Link
                  href={`/quran/${ex.surahNumber}/`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Buka Surah {ex.surahName} &rarr;
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Practical Tips & Common Mistakes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tips */}
        {lesson.tips && lesson.tips.length > 0 && (
          <Card className="p-5 border border-success/30 bg-success/5 space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-success" />
              <h3 className="text-sm font-bold text-text-primary">Tips Praktis Membaca</h3>
            </div>
            <ul className="space-y-2 text-xs text-text-primary">
              {lesson.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Common Mistakes */}
        {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
          <Card className="p-5 border border-danger/30 bg-danger/5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-danger" />
              <h3 className="text-sm font-bold text-text-primary">Kesalahan Umum</h3>
            </div>
            <ul className="space-y-2 text-xs text-text-primary">
              {lesson.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{mistake}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Quiz Call to Action Card */}
      <Card className="p-6 sm:p-7 border border-primary/40 bg-primary-soft/30 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-primary text-white mx-auto flex items-center justify-center">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-text-primary">
          Uji Pemahaman Materi Ini
        </h3>
        <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
          Kerjakan latihan soal interaktif untuk menguji kemampuan Anda dan dapatkan lencana kelulusan materi.
        </p>
        <Button
          variant="primary"
          onClick={() => setIsQuizOpen(true)}
          className="mt-2"
        >
          {progressRecord?.completed ? 'Ulangi Kuis Materi' : 'Mulai Latihan Kuis'}
        </Button>
      </Card>

      {/* Navigation Previous / Next Lesson */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {prevLesson ? (
          <Link href={`/tajwid/${prevLesson.slug}/`} className="block group">
            <Card className="p-4 border border-border hover:border-primary transition-colors flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 text-primary shrink-0 group-hover:-translate-x-1 transition-transform" />
              <div className="truncate">
                <span className="text-[11px] text-text-secondary block">Materi Sebelumnya</span>
                <span className="text-sm font-bold text-text-primary group-hover:text-primary">
                  {prevLesson.title}
                </span>
              </div>
            </Card>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link href={`/tajwid/${nextLesson.slug}/`} className="block group text-right">
            <Card className="p-4 border border-border hover:border-primary transition-colors flex items-center justify-end gap-3">
              <div className="truncate">
                <span className="text-[11px] text-text-secondary block">Materi Selanjutnya</span>
                <span className="text-sm font-bold text-text-primary group-hover:text-primary">
                  {nextLesson.title}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
            </Card>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Quiz Modal */}
      <TajwidQuizModal
        lesson={lesson}
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      />
    </div>
  );
};
