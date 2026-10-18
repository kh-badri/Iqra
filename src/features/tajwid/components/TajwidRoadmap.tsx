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

  return (
    <div className="space-y-8">
      {levels.map((lvl, lvlIdx) => {
        const Icon = getLevelIcon(lvl.icon);
        const levelLessons = lessons.filter((l) => l.level === lvl.level);
        const completedInLevel = levelLessons.filter(
          (l) => progressMap.get(l.slug)?.completed
        ).length;
        const isLevelCompleted =
          levelLessons.length > 0 && completedInLevel === levelLessons.length;

        return (
          <div key={lvl.level} className="relative">
            {/* Connecting vertical line to next level */}
            {lvlIdx < levels.length - 1 && (
              <div className="hidden sm:block absolute left-6 top-16 bottom-[-32px] w-0.5 bg-border z-0" />
            )}

            <Card className="p-5 sm:p-7 border border-border bg-surface relative z-10 space-y-5">
              {/* Level Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-card bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Level {lvl.level}
                      </span>
                      {isLevelCompleted && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-success/15 px-2.5 py-0.5 rounded-full border border-success/30">
                          <Award className="w-3.5 h-3.5" />
                          Lencana Selesai
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-text-primary">
                      {lvl.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-secondary self-start sm:self-auto">
                  <span className="font-semibold text-text-primary">
                    {completedInLevel}/{levelLessons.length}
                  </span>
                  <span>Materi Selesai</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-text-secondary">
                {lvl.description}
              </p>

              {/* Lesson Nodes List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {levelLessons.map((lesson) => {
                  const progress = progressMap.get(lesson.slug);
                  const isDone = progress?.completed;

                  return (
                    <Link
                      key={lesson.slug}
                      href={`/tajwid/${lesson.slug}/`}
                      className="block group"
                    >
                      <div className="p-4 rounded-card border border-border bg-surface-alt hover:bg-surface hover:border-primary transition-all duration-150 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 truncate">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                              isDone
                                ? 'bg-success/20 text-success border border-success/30'
                                : 'bg-surface text-text-secondary border border-border'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            ) : (
                              <BookOpen className="w-3.5 h-3.5 text-text-secondary" />
                            )}
                          </span>

                          <div className="truncate">
                            <span className="text-xs sm:text-sm font-bold text-text-primary block truncate group-hover:text-primary transition-colors">
                              {lesson.title}
                            </span>
                            <span className="text-[11px] text-text-secondary truncate block">
                              {lesson.summary}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isDone && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success">
                              {progress.score}%
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
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
