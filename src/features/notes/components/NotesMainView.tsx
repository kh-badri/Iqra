'use client';

import * as React from 'react';
import {
  BookOpen,
  GraduationCap,
  Plus,
  Search,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Filter,
  User,
  SlidersHorizontal,
  Cloud,
  RefreshCw,
} from 'lucide-react';
import type { StudyNote, StudentProfile, StudyNoteCategory } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { NoteCard } from './NoteCard';
import { NoteFormModal } from './NoteFormModal';
import { StudentFormModal } from './StudentFormModal';
import {
  addStudyNote,
  updateStudyNote,
  deleteStudyNote,
  addStudentProfile,
  deleteStudentProfile,
  getStoredNotes,
  getStoredStudents,
  syncStoredDataFromDexieAndCloud,
} from '../services/notesService';
import { NOTE_CATEGORIES } from '../types';
import { useAuthStore } from '@/features/auth/authStore';
import {
  syncAllUserData,
  syncUploadStudent,
  syncUploadStudyNote,
} from '@/features/sync/syncService';

export function NotesMainView() {
  const { user, openAuthModal } = useAuthStore();
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = React.useState<string | null>(null);

  // State langsung dari LocalStorage (0 milidetik, tanpa tunggu IndexedDB)
  const [notes, setNotes] = React.useState<StudyNote[]>([]);
  const [students, setStudents] = React.useState<StudentProfile[]>([]);

  // Muat data awal dan pasang listener real-time
  React.useEffect(() => {
    setNotes(getStoredNotes());
    setStudents(getStoredStudents());

    const handleNotesUpdate = () => setNotes(getStoredNotes());
    const handleStudentsUpdate = () => setStudents(getStoredStudents());

    window.addEventListener('iqra_notes_updated', handleNotesUpdate);
    window.addEventListener('iqra_students_updated', handleStudentsUpdate);

    syncStoredDataFromDexieAndCloud();

    return () => {
      window.removeEventListener('iqra_notes_updated', handleNotesUpdate);
      window.removeEventListener('iqra_students_updated', handleStudentsUpdate);
    };
  }, []);

  const handleManualSync = async () => {
    if (user.isGuest || !user.id) {
      openAuthModal();
      return;
    }
    setIsSyncing(true);
    setSyncStatusMsg(null);
    try {
      const currentStudents = getStoredStudents();
      const currentNotes = getStoredNotes();
      for (const s of currentStudents) {
        await syncUploadStudent(user.id, s);
      }
      for (const n of currentNotes) {
        await syncUploadStudyNote(user.id, n);
      }
      await syncAllUserData(user.id);
      setSyncStatusMsg(
        `✓ Berhasil! ${currentStudents.length} murid dan ${currentNotes.length} catatan tersinkron aman di Firebase Cloud.`
      );
    } catch (err: any) {
      setSyncStatusMsg(`Sinkronisasi selesai. Status: ${err?.message || 'Tersambung'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter state
  const [selectedStudent, setSelectedStudent] = React.useState<string>('all'); // 'all' | 'Diri Sendiri' | student name
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<'all' | 'ongoing' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Modal state
  const [isNoteModalOpen, setIsNoteModalOpen] = React.useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState<StudyNote | null>(null);

  // Statistics
  const totalNotes = notes.length;
  const selfNotesCount = notes.filter((n) => n.studentName === 'Diri Sendiri').length;
  const ongoingNotesCount = notes.filter((n) => n.status === 'ongoing').length;
  const completedNotesCount = notes.filter((n) => n.status === 'completed').length;
  const totalStudents = students.length;

  // Filtered Notes
  const filteredNotes = React.useMemo(() => {
    return notes.filter((note) => {
      // 1. Filter student
      if (selectedStudent !== 'all' && note.studentName !== selectedStudent) {
        return false;
      }
      // 2. Filter category
      if (selectedCategory !== 'all' && note.category !== selectedCategory) {
        return false;
      }
      // 3. Filter status
      if (selectedStatus !== 'all' && note.status !== selectedStatus) {
        return false;
      }
      // 4. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesPosition = note.lastPosition.toLowerCase().includes(query);
        const matchesNotes = note.notes ? note.notes.toLowerCase().includes(query) : false;
        const matchesStudent = note.studentName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesPosition && !matchesNotes && !matchesStudent) {
          return false;
        }
      }
      return true;
    });
  }, [notes, selectedStudent, selectedCategory, selectedStatus, searchQuery]);

  // Handler: Buka modal tambah catatan baru
  const handleOpenAddNote = (studentTarget?: string) => {
    setEditingNote(null);
    if (studentTarget && studentTarget !== 'all') {
      setSelectedStudent(studentTarget);
    }
    setIsNoteModalOpen(true);
  };

  // Handler: Buka modal edit catatan
  const handleOpenEditNote = (note: StudyNote) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  // Handler: Simpan catatan (Tambah / Update)
  const handleSaveNote = async (
    noteData: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt' | 'uid'>
  ) => {
    if (editingNote && editingNote.id) {
      await updateStudyNote(editingNote.id, noteData);
    } else {
      await addStudyNote(noteData);
    }
  };

  // Handler: Hapus catatan
  const handleDeleteNote = async (id: number | string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan pembelajaran ini?')) {
      await deleteStudyNote(id);
    }
  };

  // Handler: Toggle status selesai/ongoing
  const handleToggleStatus = async (note: StudyNote) => {
    const targetId = note.id || note.uid;
    if (!targetId) return;
    const nextStatus = note.status === 'completed' ? 'ongoing' : 'completed';
    await updateStudyNote(targetId, { status: nextStatus });
  };

  // Handler: Tambah murid
  const handleAddStudent = async (name: string, studentNotes?: string) => {
    await addStudentProfile(name, studentNotes);
    setSelectedStudent(name);
  };

  // Handler: Hapus murid
  const handleDeleteStudent = async (id: number | string, studentName: string) => {
    await deleteStudentProfile(id, studentName);
    if (selectedStudent === studentName) {
      setSelectedStudent('all');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 animate-fade-in pb-10">
      {/* 1. Hero Header Banner */}
      <div className="relative overflow-hidden rounded-card bg-surface border border-border p-5 sm:p-7 shadow-card card-highlight">
        <div
          className="absolute -top-12 -right-12 w-64 h-64 bg-pastel-green opacity-40 organic-blob pointer-events-none -z-10"
          aria-hidden
        />
        <div
          className="absolute -bottom-12 -left-12 w-56 h-56 bg-pastel-blue opacity-30 organic-blob pointer-events-none -z-10"
          aria-hidden
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-primary-soft text-primary-text text-xs font-bold border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Tracking Pembelajaran &amp; Evaluasi Santri</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Catatan Belajar &amp; Murid
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary max-w-xl leading-relaxed">
              Pantau progres belajar Al-Qur&apos;an, tajwid, hadits, kisah nabi, dan sirah. Catat posisi terakhir, evaluasi bacaan murid, dan lanjutkan belajar kapan saja.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStudentModalOpen(true)}
              className="font-bold flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-primary" />
              <span>Kelola Murid ({totalStudents})</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenAddNote()}
              className="font-bold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catatan Baru</span>
            </Button>
          </div>
        </div>

        {/* Cloud Sync Status Banner */}
        <div className="mt-5 p-3 rounded-card bg-surface-alt/70 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                !user.isGuest ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <div className="min-w-0">
              <div className="font-bold text-text-primary flex items-center gap-1.5 truncate">
                <Cloud className="w-4 h-4 text-primary shrink-0" />
                <span>
                  {!user.isGuest
                    ? `Cloud Backup Aktif: ${user.name} (${user.email})`
                    : 'Penyimpanan Lokal Aktif (Data tersimpan di browser)'}
                </span>
              </div>
              <div className="text-[11px] text-text-muted mt-0.5">
                {!user.isGuest
                  ? 'Data murid & catatan pembelajaran otomatis tersimpan ke Firebase Firestore'
                  : 'Hubungkan Akun Google agar data tersimpan aman di Cloud dan sinkron di semua perangkat'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!user.isGuest ? (
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button bg-primary-soft text-primary-text font-bold text-xs hover:bg-primary/20 transition-all active:scale-95 border border-primary/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-button bg-primary-gradient text-on-primary font-bold text-xs shadow-subtle hover:brightness-105 transition-all active:scale-95"
              >
                <span>Hubungkan Google</span>
              </button>
            )}
          </div>
        </div>

        {syncStatusMsg && (
          <div className="mt-2.5 p-2.5 rounded-card bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncStatusMsg}</span>
          </div>
        )}

        {/* 2. Quick Stat Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border">
          <div className="p-3 rounded-card bg-surface-alt/60 border border-border">
            <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Total Catatan
            </div>
            <div className="text-xl sm:text-2xl font-black text-text-primary mt-0.5">
              {totalNotes}
            </div>
          </div>

          <div className="p-3 rounded-card bg-surface-alt/60 border border-border">
            <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
              Catatan Pribadi
            </div>
            <div className="text-xl sm:text-2xl font-black text-text-primary mt-0.5">
              {selfNotesCount}
            </div>
          </div>

          <div className="p-3 rounded-card bg-surface-alt/60 border border-border">
            <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Sedang Belajar</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-text-primary mt-0.5">
              {ongoingNotesCount}
            </div>
          </div>

          <div className="p-3 rounded-card bg-surface-alt/60 border border-border">
            <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Selesai / Khatam</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
              {completedNotesCount}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Profil Switcher Tabs (Diri Sendiri vs Murid) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-extrabold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" />
            <span>Pilih Profil Belajar:</span>
          </div>
          <button
            onClick={() => setIsStudentModalOpen(true)}
            className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Tambah Nama Murid</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
          {/* Tab Semua */}
          <button
            type="button"
            onClick={() => setSelectedStudent('all')}
            className={`px-3.5 py-2 rounded-pill text-xs font-bold border transition-all shrink-0 flex items-center gap-2 ${
              selectedStudent === 'all'
                ? 'bg-primary-gradient text-on-primary border-transparent shadow-subtle'
                : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-alt'
            }`}
          >
            <span>Semua Profil</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                selectedStudent === 'all'
                  ? 'bg-on-primary/20 text-on-primary'
                  : 'bg-surface-alt text-text-secondary'
              }`}
            >
              {totalNotes}
            </span>
          </button>

          {/* Tab Diri Sendiri */}
          <button
            type="button"
            onClick={() => setSelectedStudent('Diri Sendiri')}
            className={`px-3.5 py-2 rounded-pill text-xs font-bold border transition-all shrink-0 flex items-center gap-2 ${
              selectedStudent === 'Diri Sendiri'
                ? 'bg-primary-gradient text-on-primary border-transparent shadow-subtle'
                : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-alt'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Diri Sendiri</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                selectedStudent === 'Diri Sendiri'
                  ? 'bg-on-primary/20 text-on-primary'
                  : 'bg-surface-alt text-text-secondary'
              }`}
            >
              {selfNotesCount}
            </span>
          </button>

          {/* Tabs per Murid */}
          {students.map((st) => {
            const count = notes.filter((n) => n.studentName === st.name).length;
            const isSelected = selectedStudent === st.name;
            return (
              <button
                type="button"
                key={st.id || st.name}
                onClick={() => setSelectedStudent(st.name)}
                className={`px-3.5 py-2 rounded-pill text-xs font-bold border transition-all shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-primary-gradient text-on-primary border-transparent shadow-subtle'
                    : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{st.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isSelected
                      ? 'bg-on-primary/20 text-on-primary'
                      : 'bg-surface-alt text-text-secondary'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Search and Filters Toolbar */}
      <div className="space-y-3 p-4 rounded-card bg-surface border border-border shadow-card">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi belajar, posisi terakhir (ayat/halaman), atau catatan evaluasi..."
            className="w-full pl-10 pr-4 py-2.5 rounded-input bg-surface-alt border border-border text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[11px] font-bold text-text-muted hover:text-text-primary absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface border border-border"
            >
              Reset
            </button>
          )}
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border">
          <div className="text-[11px] font-bold text-text-muted flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-primary" />
            <span>Kategori:</span>
          </div>

          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`text-xs px-2.5 py-1 rounded-pill border transition-all font-semibold ${
              selectedCategory === 'all'
                ? 'bg-primary-soft text-primary-text border-primary/40 font-bold'
                : 'bg-surface-alt border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            Semua
          </button>

          {NOTE_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`text-xs px-2.5 py-1 rounded-pill border transition-all font-semibold ${
                selectedCategory === cat.key
                  ? 'bg-primary-soft text-primary-text border-primary/40 font-bold'
                  : 'bg-surface-alt border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Status Filter */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-text-muted">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="text-xs px-2.5 py-1 rounded-button bg-surface-alt border border-border text-text-primary font-semibold focus:outline-none focus:border-primary"
            >
              <option value="all">Semua Status</option>
              <option value="ongoing">Sedang Belajar</option>
              <option value="completed">Selesai / Khatam</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Notes List / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-bold text-text-secondary">
            Menampilkan <strong className="text-text-primary">{filteredNotes.length}</strong> catatan
            {selectedStudent !== 'all' && (
              <span> untuk profil <strong className="text-primary">{selectedStudent}</strong></span>
            )}
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-8 h-8 text-primary" />}
            title={
              searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Tidak ada catatan yang sesuai filter'
                : selectedStudent !== 'all'
                ? `Belum ada catatan untuk "${selectedStudent}"`
                : 'Belum Ada Catatan Belajar'
            }
            description={
              searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Coba ubah kata kunci pencarian atau sesuaikan pilihan filter kategori dan status di atas.'
                : 'Mulai rekam pencapaian hafalan, tilawah Al-Qur\'an, hukum tajwid, hadits, atau sirah sekarang!'
            }
            actionLabel="+ Buat Catatan Pertama"
            onAction={() => handleOpenAddNote(selectedStudent !== 'all' ? selectedStudent : undefined)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id || note.uid}
                note={note}
                onEdit={handleOpenEditNote}
                onDelete={handleDeleteNote}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <NoteFormModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        editNote={editingNote}
        students={students}
        defaultStudentName={selectedStudent !== 'all' ? selectedStudent : 'Diri Sendiri'}
        onOpenAddStudent={() => {
          setIsNoteModalOpen(false);
          setIsStudentModalOpen(true);
        }}
      />

      <StudentFormModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleAddStudent}
        students={students}
        onDeleteStudent={handleDeleteStudent}
      />
    </div>
  );
}
