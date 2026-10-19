'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Bookmark,
  Sparkles,
  Scroll,
  HelpCircle,
  PlayCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  User,
  ExternalLink,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { StudyNote } from '@/lib/db';
import { getCategoryMeta } from '../services/notesService';

interface NoteCardProps {
  note: StudyNote;
  onEdit: (note: StudyNote) => void;
  onDelete: (id: number | string) => void;
  onToggleStatus: (note: StudyNote) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  quran: BookOpen,
  tajwid: GraduationCap,
  hadits: Bookmark,
  'kisah-nabi': Sparkles,
  sirah: Scroll,
  lainnya: HelpCircle,
};

export function NoteCard({ note, onEdit, onDelete, onToggleStatus }: NoteCardProps) {
  const meta = getCategoryMeta(note.category);
  const CategoryIcon = CATEGORY_ICONS[note.category] || HelpCircle;
  const isSelf = note.studentName === 'Diri Sendiri';

  const formattedDate = React.useMemo(() => {
    try {
      const d = new Date(note.updatedAt || note.createdAt);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d);
    } catch {
      return '';
    }
  }, [note.updatedAt, note.createdAt]);

  const resumeHref = note.resumeUrl || meta.defaultRoute;

  return (
    <Card className="flex flex-col justify-between p-4 sm:p-5 hover:border-primary/50 transition-all duration-200 shadow-card bg-surface relative overflow-hidden group">
      {/* Top ambient colored line matching category */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-1.5 transition-all',
          note.status === 'completed'
            ? 'bg-emerald-500'
            : note.category === 'quran'
            ? 'bg-emerald-500'
            : note.category === 'tajwid'
            ? 'bg-teal-500'
            : note.category === 'hadits'
            ? 'bg-purple-500'
            : note.category === 'kisah-nabi'
            ? 'bg-rose-500'
            : note.category === 'sirah'
            ? 'bg-amber-500'
            : 'bg-yellow-500'
        )}
      />

      {/* Header Badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {/* Student Tag */}
        <div
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-bold border transition-colors',
            isSelf
              ? 'bg-surface-alt text-text-primary border-border'
              : 'bg-primary-soft text-primary-text border-primary/20'
          )}
        >
          <User className="w-3.5 h-3.5 text-primary" />
          <span className="truncate max-w-[120px] sm:max-w-[160px]">{note.studentName}</span>
        </div>

        {/* Category Badge */}
        <div
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-semibold',
            meta.badgeBg,
            meta.badgeText
          )}
        >
          <CategoryIcon className="w-3.5 h-3.5" />
          <span>{meta.label}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-2.5 mb-4">
        {/* Title & Position */}
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-text-primary group-hover:text-primary transition-colors leading-snug">
            {note.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-text-secondary font-medium">
            <span className="font-semibold text-text-primary">Posisi Terakhir:</span>
            <span className="px-2 py-0.5 rounded-button bg-surface-alt border border-border font-bold text-primary-text">
              {note.lastPosition}
            </span>
          </div>
        </div>

        {/* Evaluation / Feedback Note */}
        {note.notes && (
          <div className="p-3 rounded-card bg-surface-alt/70 border border-border text-xs text-text-secondary leading-relaxed space-y-1">
            <div className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider">
              Catatan &amp; Evaluasi:
            </div>
            <p className="italic text-text-primary whitespace-pre-wrap">{note.notes}</p>
          </div>
        )}

        {/* Grade / Predikat Badge */}
        {note.grade && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-button bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold">
            <span>Predikat:</span>
            <span>{note.grade}</span>
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-border mt-auto space-y-3">
        <div className="flex items-center justify-between text-[11px] text-text-muted">
          {/* Status Badge */}
          <button
            onClick={() => onToggleStatus(note)}
            title="Klik untuk ubah status"
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold transition-transform active:scale-95',
              note.status === 'completed'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
            )}
          >
            {note.status === 'completed' ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Selesai</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>Sedang Berjalan</span>
              </>
            )}
          </button>

          {/* Date */}
          <div className="flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2">
          {/* Resume Learning Button */}
          <Link
            href={resumeHref}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-button bg-primary-gradient text-on-primary text-xs font-bold shadow-subtle hover:brightness-105 active:scale-95 transition-all"
          >
            <PlayCircle className="w-4 h-4 shrink-0" />
            <span>Lanjutkan Belajar</span>
          </Link>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(note)}
            aria-label="Edit Catatan"
            title="Edit Catatan"
            className="p-2 rounded-button bg-surface-alt border border-border text-text-secondary hover:text-primary hover:border-primary/40 active:scale-95 transition-all"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => {
              const targetId = note.id || note.uid;
              if (targetId) onDelete(targetId);
            }}
            aria-label="Hapus Catatan"
            title="Hapus Catatan"
            className="p-2 rounded-button bg-surface-alt border border-border text-text-secondary hover:text-danger hover:border-danger/40 active:scale-95 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}
