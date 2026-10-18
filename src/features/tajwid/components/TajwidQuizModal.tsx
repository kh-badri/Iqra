'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { TajwidLesson, TajwidQuizQuestion } from '../types';
import { db } from '@/lib/db';

interface TajwidQuizModalProps {
  lesson: TajwidLesson;
  isOpen: boolean;
  onClose: () => void;
  onCompleted?: (score: number) => void;
}

export const TajwidQuizModal: React.FC<TajwidQuizModalProps> = ({
  lesson,
  isOpen,
  onClose,
  onCompleted,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const questions: TajwidQuizQuestion[] = lesson.quiz || [];
  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.answerIndex) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Finished
      const finalScore = Math.round(
        ((correctAnswersCount + (selectedOption === currentQ.answerIndex ? 0 : 0)) /
          questions.length) *
          100
      );
      setIsFinished(true);

      // Save to IndexedDB
      try {
        const existing = await db.tajwidProgress
          .where('lessonSlug')
          .equals(lesson.slug)
          .first();

        const bestScore = existing ? Math.max(existing.bestScore || 0, finalScore) : finalScore;

        if (existing && existing.id) {
          await db.tajwidProgress.update(existing.id, {
            completed: true,
            score: finalScore,
            bestScore,
            updatedAt: Date.now(),
          });
        } else {
          await db.tajwidProgress.add({
            lessonSlug: lesson.slug,
            level: lesson.level,
            completed: true,
            score: finalScore,
            bestScore,
            updatedAt: Date.now(),
          });
        }
      } catch (err) {
        console.error('Failed to save tajwid quiz progress', err);
      }

      if (onCompleted) {
        onCompleted(finalScore);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectAnswersCount(0);
    setIsFinished(false);
  };

  const calculatedFinalScore = Math.round((correctAnswersCount / (questions.length || 1)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none">
      <Card className="w-full max-w-lg border border-border bg-surface p-6 sm:p-7 shadow-lg relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Tutup kuis"
          className="absolute top-4 right-4 p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isFinished ? (
          <div>
            {/* Header info */}
            <div className="flex items-center justify-between pr-8 mb-4">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider block">
                  Kuis Tajwid · Level {lesson.level}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-text-primary">
                  {lesson.title}
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-surface-alt border border-border text-text-secondary">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-card bg-surface-alt border border-border/80 mb-5">
              <p className="text-sm sm:text-base font-semibold text-text-primary leading-relaxed">
                {currentQ.question}
              </p>
            </div>

            {/* Option Buttons */}
            <div className="space-y-2.5 mb-5">
              {currentQ.options.map((option, idx) => {
                let btnStyle = 'border-border bg-surface hover:bg-surface-alt text-text-primary';

                if (isAnswered) {
                  if (idx === currentQ.answerIndex) {
                    btnStyle = 'border-success bg-success/15 text-success font-semibold';
                  } else if (idx === selectedOption) {
                    btnStyle = 'border-danger bg-danger/15 text-danger font-semibold';
                  } else {
                    btnStyle = 'border-border opacity-50 bg-surface text-text-secondary';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-3.5 rounded-card border text-left text-xs sm:text-sm transition-all duration-150 flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && idx === currentQ.answerIndex && (
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQ.answerIndex && (
                      <XCircle className="w-4 h-4 text-danger shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answering */}
            {isAnswered && (
              <div
                className={`p-3.5 rounded-card mb-5 border text-xs leading-relaxed ${
                  selectedOption === currentQ.answerIndex
                    ? 'bg-success/10 border-success/30 text-success'
                    : 'bg-danger/10 border-danger/30 text-danger'
                }`}
              >
                <div className="font-bold mb-1">
                  {selectedOption === currentQ.answerIndex ? 'Jawaban Benar!' : 'Jawaban Kurang Tepat'}
                </div>
                <p className="text-text-primary">{currentQ.explanation}</p>
              </div>
            )}

            {/* Next Action Button */}
            {isAnswered && (
              <Button
                variant="primary"
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2"
              >
                <span>
                  {currentIndex < questions.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Kuis'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : (
          /* Finished State */
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-full bg-accent/15 text-accent border border-accent/30 mx-auto flex items-center justify-center">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                Hasil Latihan Kuis
              </span>
              <h3 className="text-2xl font-black text-text-primary mt-1">
                {calculatedFinalScore >= 80
                  ? 'Mumtaz! (Sangat Sempurna)'
                  : calculatedFinalScore >= 60
                  ? 'Jayyid Jiddan (Bagus)'
                  : 'Terus Semangat Belajar!'}
              </h3>
            </div>

            {/* Flat Score Badge */}
            <div className="p-5 rounded-card bg-surface-alt border border-border inline-block min-w-[200px]">
              <span className="text-4xl font-extrabold text-primary">
                {calculatedFinalScore}%
              </span>
              <span className="text-xs text-text-secondary block mt-1">
                {correctAnswersCount} dari {questions.length} soal terjawab benar
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary max-w-sm mx-auto">
              {calculatedFinalScore >= 70
                ? 'Alhamdulillah, pemahaman hukum tajwid Anda sangat baik dan progres telah tersimpan di perangkat.'
                : 'Jangan berkecil hati. Anda dapat membaca kembali materi dan mencoba kuis lagi sampai mahir.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={handleRestart}
                className="flex-1 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Kuis</span>
              </Button>
              <Button
                variant="primary"
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-1.5"
              >
                <span>Selesai &amp; Lanjut</span>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
