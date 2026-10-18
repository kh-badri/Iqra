'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, BookOpen, BookA, Palette, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { TajwidRoadmap } from '@/features/tajwid/components/TajwidRoadmap';
import { TajwidGlossary } from '@/features/tajwid/components/TajwidGlossary';
import { TajwidColorLegend } from '@/features/tajwid/components/TajwidColorLegend';
import { getTajwidLevels, getAllTajwidLessons, getTajwidGlossary } from '@/features/tajwid/tajwidService';
import type { TajwidLevel, TajwidLesson, TajwidGlossaryTerm } from '@/features/tajwid/types';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function TajwidCurriculumPage() {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'glossary' | 'colors'>('roadmap');
  const [levels, setLevels] = useState<TajwidLevel[]>([]);
  const [lessons, setLessons] = useState<TajwidLesson[]>([]);
  const [glossary, setGlossary] = useState<TajwidGlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const progressList = useLiveQuery(() => db.tajwidProgress.toArray(), []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [lvls, lssns, glssry] = await Promise.all([
        getTajwidLevels(),
        getAllTajwidLessons(),
        getTajwidGlossary(),
      ]);
      setLevels(lvls);
      setLessons(lssns);
      setGlossary(glssry);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat kurikulum tajwid');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const completedCount = progressList?.filter((p) => p.completed).length || 0;
  const totalLessons = lessons.length || 22;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Belajar Tajwid Interaktif
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary">
            Kurikulum bertahap 5 level standar Mushaf Kemenag RI dilengkapi contoh ayat berwarna dan latihan kuis.
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-3 bg-surface-alt px-4 py-2 rounded-card border border-border text-xs self-start sm:self-auto shrink-0">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-text-primary">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>{completedCount} dari {totalLessons} Materi</span>
            </div>
            <span className="text-[10px] text-text-secondary block mt-0.5">
              Progres Belajar: {progressPercent}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xs">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Tabs View Selector */}
      <Tabs
        items={[
          { id: 'roadmap', label: 'Roadmap Belajar (5 Level)' },
          { id: 'glossary', label: 'Glosarium Istilah' },
          { id: 'colors', label: 'Panduan Warna Tajwid' },
        ]}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* Tab Contents */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="w-full h-36 rounded-card" />
          <Skeleton className="w-full h-36 rounded-card" />
          <Skeleton className="w-full h-36 rounded-card" />
        </div>
      ) : error ? (
        <ErrorState
          title="Gagal Memuat Kurikulum"
          message={error}
          onRetry={loadData}
        />
      ) : (
        <div>
          {activeTab === 'roadmap' && (
            <TajwidRoadmap levels={levels} lessons={lessons} />
          )}

          {activeTab === 'glossary' && (
            <TajwidGlossary terms={glossary} />
          )}

          {activeTab === 'colors' && (
            <div className="space-y-6">
              <TajwidColorLegend />
              <Card className="p-6 border border-border bg-surface text-xs sm:text-sm text-text-secondary space-y-3">
                <h4 className="font-bold text-text-primary text-base">
                  Standarisasi Pewarnaan Tajwid Iqra
                </h4>
                <p className="leading-relaxed">
                  Pewarnaan tajwid pada aplikasi Iqra merujuk pada pedoman Mushaf Standar Indonesia Kementerian Agama RI (Lajnah Pentashih Mushaf Al-Qur&apos;an).
                </p>
                <p className="leading-relaxed">
                  Seluruh skema warna menggunakan token flat murni yang menjamin keterbacaan tinggi (lolos uji kontras WCAG AA) baik di Light Mode maupun Dark Mode, serta senantiasa dilengkapi dengan nama hukum dan label teks agar ramah bagi pengguna dengan gangguan penglihatan warna.
                </p>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
