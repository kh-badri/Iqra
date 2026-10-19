'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Lock,
  ChevronRight,
  Award,
  BookOpen,
  Sparkles,
  Layers,
  Volume2,
  Maximize2
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import type { TajwidLevel, TajwidLesson } from '../types';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface TajwidRoadmapProps {
  levels: TajwidLevel[];
  lessons: TajwidLesson[];
}

export const TajwidRoadmap: React.FC<TajwidRoadmapProps> = ({ levels, lessons }) => {
  const progressList = useLiveQuery(() => db.tajwidProgress.toArray(), []);

  const progressMap = new Map<string, { completed: boolean; score: number }>();
  progressList?.forEach((p) => {
    progressMap.set(p.lessonSlug, { completed: p.completed, score: p.score });
  });

  const getLevelIcon = (iconName: string) => {
    switch (iconName) {
      case 'volume-2':
        return Volume2;
      case 'book-open':
        return BookOpen;
      case 'layers':
        return Layers;
      case 'maximize-2':
        return Maximize2;
      default:
        return CheckCircle2;
    }
  };

  const getLevelPastel = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-pastel-green text-[#266308] border-pastel-green/40';
      case 2:
        return 'bg-pastel-cyan text-[#0B5C66] border-pastel-cyan/40';
      case 3:
        return 'bg-pastel-purple text-[#5A2C85] border-pastel-purple/40';
      case 4:
        return 'bg-pastel-orange text-[#8C3E00] border-pastel-orange/40';
      default:
        return 'bg-pastel-green text-[#266308] border-pastel-green/40';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {levels.map((lvl, lvlIdx) => {
        const Icon = getLevelIcon(lvl.icon);
        const levelLessons = lessons.filter((l) => l.level === lvl.level);
        const completedInLevel = levelLessons.filter(
          (l) => progressMap.get(l.slug)?.completed
        ).length;
        const isLevelCompleted =
          levelLessons.length > 0 && completedInLevel === levelLessons.length;
        const completionPercentage = levelLessons.length > 0
          ? Math.round((completedInLevel / levelLessons.length) * 100)
          : 0;

        return (
          <div key={lvl.level} className="relative">
            {/* Connecting vertical line to next level */}
            {lvlIdx < levels.length - 1 && (
              <div className="hidden sm:block absolute left-8 top-20 bottom-[-32px] w-0.5 bg-gradient-to-b from-primary/30 to-border z-0" />
            )}

            <Card className="p-5 sm:p-7 border border-border bg-surface shadow-card relative z-10 space-y-5 rounded-card">
              {/* Level Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${getLevelPastel(
                      lvl.level
                    )}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-primary-text uppercase tracking-wider">
                        Level {lvl.level}
                      </span>
                      {isLevelCompleted && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-success/15 px-2.5 py-0.5 rounded-full border border-success/30">
                          <Award className="w-3.5 h-3.5" />
                          Lencana Selesai
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                      {lvl.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-muted self-start sm:self-auto">
                  <span className="font-bold text-text-primary tabular-nums">
                    {completedInLevel}/{levelLessons.length}
                  </span>
                  <span>Materi Selesai</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-gradient transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                {lvl.description}
              </p>

              {/* Lesson Nodes List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {levelLessons.map((lesson) => {
                  const progress = progressMap.get(lesson.slug);
                  const isDone = progress?.completed;

                  return (
                    <Link
                      key={lesson.slug}
                      href={`/tajwid/${lesson.slug}/`}
                      className="block group"
                    >
                      <div className="p-4 rounded-button border border-border bg-surface-2 hover:bg-surface hover:border-primary/40 hover:shadow-subtle active:scale-[0.98] transition-all duration-150 flex items-center justify-between gap-3 min-h-[52px]">
                        <div className="flex items-center gap-3 truncate">
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                              isDone
                                ? 'bg-pastel-green text-[#266308] border border-pastel-green/40'
                                : 'bg-surface text-text-muted border border-border'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <BookOpen className="w-4 h-4 text-text-muted" />
                            )}
                          </span>

                          <div className="truncate">
                            <span className="text-xs sm:text-sm font-bold text-text-primary block truncate group-hover:text-primary-text transition-colors">
                              {lesson.title}
                            </span>
                            <span className="text-[11px] text-text-muted truncate block">
                              {lesson.summary}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isDone && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pastel-green text-[#266308] tabular-nums">
                              {progress.score}%
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary-text group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
};
