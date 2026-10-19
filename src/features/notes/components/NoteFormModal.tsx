'use client';

import * as React from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import {
  BookOpen,
  GraduationCap,
  Bookmark,
  Sparkles,
  Scroll,
  HelpCircle,
  Plus,
  Check,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StudyNote, StudentProfile, StudyNoteCategory, StudyNoteStatus } from '@/lib/db';
import { NOTE_CATEGORIES, GRADE_PRESETS } from '../types';

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt' | 'uid'>) => Promise<void>;
  editNote?: StudyNote | null;
  students: StudentProfile[];
  defaultStudentName?: string;
  onOpenAddStudent?: () => void;
}

export function NoteFormModal({
  isOpen,
  onClose,
  onSave,
  editNote,
  students,
  defaultStudentName = 'Diri Sendiri',
  onOpenAddStudent,
}: NoteFormModalProps) {
  const [studentName, setStudentName] = React.useState<string>(defaultStudentName);
  const [category, setCategory] = React.useState<StudyNoteCategory>('quran');
  const [title, setTitle] = React.useState<string>('');
  const [lastPosition, setLastPosition] = React.useState<string>('');
  const [resumeUrl, setResumeUrl] = React.useState<string>('');
  const [notes, setNotes] = React.useState<string>('');
  const [grade, setGrade] = React.useState<string>('');
  const [status, setStatus] = React.useState<StudyNoteStatus>('ongoing');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string>('');

  // Sinkronisasi data saat mode edit atau open
  React.useEffect(() => {
    if (editNote) {
      setStudentName(editNote.studentName || 'Diri Sendiri');
      setCategory(editNote.category || 'quran');
      setTitle(editNote.title || '');
      setLastPosition(editNote.lastPosition || '');
      setResumeUrl(editNote.resumeUrl || '');
      setNotes(editNote.notes || '');
      setGrade(editNote.grade || '');
      setStatus(editNote.status || 'ongoing');
    } else {
      setStudentName(defaultStudentName);
      setCategory('quran');
      setTitle('');
      setLastPosition('');
      setResumeUrl('');
      setNotes('');
      setGrade('');
      setStatus('ongoing');
    }
    setErrorMsg('');
  }, [editNote, isOpen, defaultStudentName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Judul materi pembelajaran wajib diisi.');
      return;
    }
    if (!lastPosition.trim()) {
      setErrorMsg('Posisi terakhir (misal: Ayat 45 atau Level 2) wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onSave({
        studentName: studentName || 'Diri Sendiri',
        category,
        title: title.trim(),
        lastPosition: lastPosition.trim(),
        resumeUrl: resumeUrl.trim() || undefined,
        notes: notes.trim() || undefined,
        grade: grade.trim() || undefined,
        status,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal menyimpan catatan');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shortcut judul cepat berdasarkan kategori
  const suggestions = React.useMemo(() => {
    switch (category) {
      case 'quran':
        return ['Surah 1: Al-Fatihah', 'Surah 2: Al-Baqarah', 'Surah 18: Al-Kahf', 'Surah 36: Ya-Sin', 'Surah 78: An-Naba (Juz 30)'];
      case 'tajwid':
        return ['Makharijul Huruf', 'Hukum Nun Sukun & Tanwin', 'Hukum Mim Sukun', 'Hukum Mad & Qashr', 'Waqaf & Ibtida'];
      case 'hadits':
        return ['Hadits Arba\'in Nawawi', 'Shahih Bukhari - Kitab Iman', 'Shahih Muslim - Kitab Thaharah', 'Hadits Akhlak & Budi Pekerti'];
      case 'kisah-nabi':
        return ['Kisah Nabi Adam AS', 'Kisah Nabi Nuh AS', 'Kisah Nabi Ibrahim AS', 'Kisah Nabi Musa AS', 'Kisah Nabi Muhammad ﷺ'];
      case 'sirah':
        return ['Kelahiran & Masa Kecil Rasulullah', 'Peristiwa Isra\' Mi\'raj', 'Hijrah ke Yatsrib (Madinah)', 'Perang Badar Al-Kubra', 'Fathu Makkah'];
      default:
        return ['Dzikir Pagi & Petang', 'Doa Harian', 'Hafalan Juz 30'];
    }
  }, [category]);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-text-primary font-extrabold text-base sm:text-lg">
          <BookOpen className="w-5 h-5 text-primary shrink-0" />
          <span>{editNote ? 'Edit Catatan Belajar' : 'Tambah Catatan Baru'}</span>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {errorMsg && (
          <div className="p-3 rounded-card bg-danger/10 border border-danger/30 text-danger text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* 1. Pilih Profil (Diri Sendiri / Murid) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" />
              <span>Untuk Siapa Catatan Ini?</span>
            </label>
            {onOpenAddStudent && (
              <button
                type="button"
                onClick={onOpenAddStudent}
                className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" />
                <span>+ Murid Baru</span>
              </button>
            )}
          </div>
          <select
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-input bg-surface-alt border border-border text-sm font-semibold text-text-primary focus:outline-none focus:border-primary transition-colors"
          >
            <option value="Diri Sendiri">👤 Diri Sendiri (Pribadi)</option>
            {students.map((s) => (
              <option key={s.id || s.name} value={s.name}>
                🎓 Murid: {s.name} {s.notes ? `(${s.notes})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Kategori Pembelajaran */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-primary">
            Kategori Pembelajaran
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {NOTE_CATEGORIES.map((cat) => {
              const isSelected = category === cat.key;
              return (
                <button
                  type="button"
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={cn(
                    'flex items-center gap-2 p-2.5 rounded-button text-xs font-bold border transition-all text-left',
                    isSelected
                      ? 'bg-primary-soft border-primary text-primary-text shadow-subtle'
                      : 'bg-surface-alt border-border text-text-secondary hover:text-text-primary hover:bg-surface-alt/80'
                  )}
                >
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Judul Materi */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-primary">
            Judul Materi / Pelajaran <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Surah Al-Baqarah, Makhraj Huruf Halq, Hadits 1..."
            className="w-full px-3.5 py-2.5 rounded-input bg-surface-alt border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            required
          />
          {/* Suggestion Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {suggestions.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setTitle(s)}
                className="text-[10px] px-2 py-0.5 rounded-pill bg-surface-alt border border-border text-text-secondary hover:text-primary hover:border-primary/40 transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Posisi Terakhir / Capaian */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-primary">
              Posisi Terakhir <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={lastPosition}
              onChange={(e) => setLastPosition(e.target.value)}
              placeholder="Contoh: Ayat 45, Level 2 Bab 3, Hadits 5..."
              className="w-full px-3.5 py-2.5 rounded-input bg-surface-alt border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          {/* 5. Status Pembelajaran */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-primary">
              Status Capaian
            </label>
            <div className="grid grid-cols-2 gap-2 h-[42px]">
              <button
                type="button"
                onClick={() => setStatus('ongoing')}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-button text-xs font-bold border transition-all',
                  status === 'ongoing'
                    ? 'bg-blue-100 text-blue-800 border-blue-400 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-surface-alt border-border text-text-secondary'
                )}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Sedang Berjalan</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-button text-xs font-bold border transition-all',
                  status === 'completed'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-surface-alt border-border text-text-secondary'
                )}
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Selesai / Khatam</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6. Nilai / Predikat (Opsional untuk Guru atau Evaluasi Diri) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-primary">
            Predikat / Nilai Evaluasi (Opsional)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {GRADE_PRESETS.map((p) => {
              const isSelected = grade === p.value;
              return (
                <button
                  type="button"
                  key={p.value}
                  onClick={() => setGrade(isSelected ? '' : p.value)}
                  className={cn(
                    'text-[11px] font-semibold px-2.5 py-1 rounded-pill border transition-all',
                    isSelected
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-400 shadow-subtle'
                      : 'bg-surface-alt border-border text-text-secondary hover:text-text-primary'
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="Atau ketik nilai bebas (misal: Nilai 90, Mumtaz, dll)..."
            className="w-full mt-1 px-3 py-2 rounded-input bg-surface-alt border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* 7. Catatan Evaluasi Guru / Catatan Diri Sendiri */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-primary">
            Catatan Evaluasi / Pesan Perbaikan (Opsional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Contoh: Makhraj huruf 'Ain masih perlu diulang. PR: muraja'ah ayat 1-20 sampai lancar sebelum pertemuan berikutnya..."
            className="w-full px-3.5 py-2.5 rounded-input bg-surface-alt border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* 8. Link Resume Khusus (Opsional) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-text-primary">
            Link Lanjutkan Belajar (Opsional)
          </label>
          <input
            type="text"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="Otomatis diisi sistem jika dikosongkan (misal: /quran/2?ayah=45)"
            className="w-full px-3 py-2 rounded-input bg-surface-alt border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors font-mono"
          />
          <p className="text-[10px] text-text-muted">
            Kosongkan saja untuk menggunakan link pintar otomatis berdasarkan kategori &amp; nomor materi.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
          >
            {editNote ? 'Simpan Perubahan' : 'Tambah Catatan'}
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
}
