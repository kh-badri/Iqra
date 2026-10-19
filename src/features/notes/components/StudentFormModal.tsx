'use client';

import * as React from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { UserPlus, User, Trash2 } from 'lucide-react';
import type { StudentProfile } from '@/lib/db';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, notes?: string) => Promise<any>;
  students: StudentProfile[];
  onDeleteStudent: (id: number | string, name: string) => Promise<void>;
}

export function StudentFormModal({
  isOpen,
  onClose,
  onSave,
  students,
  onDeleteStudent,
}: StudentFormModalProps) {
  const [name, setName] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  React.useEffect(() => {
    setName('');
    setNotes('');
    setErrorMsg('');
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama murid wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onSave(name.trim(), notes.trim() || undefined);
      setName('');
      setNotes('');
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal menambahkan murid');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-text-primary font-extrabold text-base sm:text-lg">
          <UserPlus className="w-5 h-5 text-primary shrink-0" />
          <span>Kelola Murid &amp; Santri</span>
        </div>
      }
    >
      <div className="space-y-5 py-2">
        {/* Form Tambah Murid */}
        <form onSubmit={handleSubmit} className="space-y-3 p-3.5 rounded-card bg-surface-alt/70 border border-border">
          <div className="text-xs font-bold text-text-primary">
            + Tambah Nama Murid Baru
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-card bg-danger/10 border border-danger/30 text-danger text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-text-secondary">
              Nama Lengkap Murid / Santri <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Muhammad Al-Fatih, Fatimah..."
              className="w-full px-3 py-2 rounded-input bg-surface border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-text-secondary">
              Keterangan / Kelas (Opsional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Kelas 3 TPA, Santri Tahsin Dewasa..."
              className="w-full px-3 py-2 rounded-input bg-surface border border-border text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Simpan Murid
            </Button>
          </div>
        </form>

        {/* Daftar Murid yang Sudah Terdaftar */}
        <div className="space-y-2">
          <div className="text-xs font-extrabold text-text-muted tracking-wider uppercase px-1">
            Daftar Murid Terdaftar ({students.length})
          </div>

          {students.length === 0 ? (
            <div className="text-center p-4 text-xs text-text-muted rounded-card bg-surface-alt/40 border border-dashed border-border">
              Belum ada murid yang ditambahkan. Tambahkan murid pertama Anda di atas!
            </div>
          ) : (
            <div className="divide-y divide-border rounded-card border border-border overflow-hidden bg-surface max-h-56 overflow-y-auto">
              {students.map((student) => (
                <div
                  key={student.id || student.name}
                  className="flex items-center justify-between p-3 hover:bg-surface-alt/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary-soft text-primary-text flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-text-primary truncate">
                        {student.name}
                      </div>
                      {student.notes && (
                        <div className="text-[11px] text-text-muted truncate">
                          {student.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const targetId = student.id || student.uid;
                      if (
                        targetId &&
                        window.confirm(
                          `Apakah Anda yakin ingin menghapus data murid "${student.name}" beserta semua catatannya?`
                        )
                      ) {
                        onDeleteStudent(targetId, student.name);
                      }
                    }}
                    className="p-1.5 rounded-button text-text-muted hover:text-danger hover:bg-danger/10 transition-colors shrink-0"
                    title="Hapus Murid"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tutup Button */}
        <div className="flex justify-end pt-2 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Selesai
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
