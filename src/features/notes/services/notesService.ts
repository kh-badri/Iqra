import { db, type StudyNote, type StudentProfile, type StudyNoteCategory } from '@/lib/db';
import { NOTE_CATEGORIES } from '../types';
import { useAuthStore } from '@/features/auth/authStore';
import { isFirebaseReady, getFirebaseFirestore } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
  syncUploadStudent,
  syncDeleteStudent,
  syncUploadStudyNote,
  syncDeleteStudyNote,
} from '@/features/sync/syncService';

const STUDENTS_STORAGE_KEY = 'iqra_students_v1';
const NOTES_STORAGE_KEY = 'iqra_study_notes_v1';

export function generateUID(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

// -------------------------------------------------------------
// Local Storage Synchronous Engine (Instan & 100% Tahan Banting)
// -------------------------------------------------------------

export function getStoredStudents(): StudentProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredStudents(students: StudentProfile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
    window.dispatchEvent(new CustomEvent('iqra_students_updated'));
  } catch (err) {
    console.warn('Gagal menyimpan murid ke localStorage:', err);
  }
}

export function getStoredNotes(): StudyNote[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredNotes(notes: StudyNote[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    window.dispatchEvent(new CustomEvent('iqra_notes_updated'));
  } catch (err) {
    console.warn('Gagal menyimpan catatan ke localStorage:', err);
  }
}

/**
 * Mendapatkan metadata kategori (warna, label, rute default)
 */
export function getCategoryMeta(category: StudyNoteCategory) {
  const found = NOTE_CATEGORIES.find((c) => c.key === category);
  return (
    found || {
      key: category,
      label: 'Lainnya',
      arabic: '',
      color: 'bg-pastel-yellow text-[#7A5B00] border-pastel-yellow/40',
      badgeBg: 'bg-yellow-100 dark:bg-yellow-950/60',
      badgeText: 'text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/60',
      defaultRoute: '/belajar/',
    }
  );
}

/**
 * Menghasilkan rute resume pembelajaran secara cerdas
 */
export function resolveResumeUrl(
  category: StudyNoteCategory,
  title: string,
  lastPosition: string,
  customResumeUrl?: string
): string {
  if (customResumeUrl && customResumeUrl.trim() !== '') {
    return customResumeUrl.trim();
  }

  if (category === 'quran') {
    const ayahMatch = lastPosition.match(/\b\d+\b/);
    const ayahNum = ayahMatch ? ayahMatch[0] : '1';
    const surahMatch = title.match(/^(?:surah\s*)?(\d+)/i) || title.match(/\b(\d+)\b/);
    if (surahMatch) {
      return `/quran/${surahMatch[1]}?ayah=${ayahNum}`;
    }
    return `/quran/`;
  }

  if (category === 'tajwid') return '/tajwid/';
  if (category === 'hadits') return '/hadits/';
  if (category === 'kisah-nabi') return '/kisah-nabi/';
  if (category === 'sirah') return '/sirah/';
  return '/belajar/';
}

// -------------------------------------------------------------
// CRUD Operations untuk StudyNotes (Local First -> Background Cloud)
// -------------------------------------------------------------

export async function addStudyNote(
  noteData: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt' | 'uid'> & { uid?: string }
): Promise<StudyNote> {
  const now = Date.now();
  const resumeUrl = resolveResumeUrl(
    noteData.category,
    noteData.title,
    noteData.lastPosition,
    noteData.resumeUrl
  );

  const newNote: StudyNote = {
    ...noteData,
    id: now,
    uid: noteData.uid || generateUID('note'),
    resumeUrl,
    createdAt: now,
    updatedAt: now,
  };

  // 1. Simpan ke Local Storage seketika (0 milidetik)
  const currentNotes = getStoredNotes();
  const updatedNotes = [newNote, ...currentNotes];
  saveStoredNotes(updatedNotes);

  // 2. Background Task: Sync ke Dexie & Firebase tanpa membebani antarmuka
  setTimeout(async () => {
    try {
      if (db && typeof db.open === 'function') {
        if (!db.isOpen()) await db.open().catch(() => {});
        await db.studyNotes.add(newNote).catch(() => {});
      }
    } catch {}

    try {
      const state = useAuthStore.getState();
      if (!state.user.isGuest && state.user.id && isFirebaseReady()) {
        await syncUploadStudyNote(state.user.id, newNote).catch(() => {});
      }
    } catch {}
  }, 10);

  return newNote;
}

export async function updateStudyNote(
  id: number | string,
  changes: Partial<Omit<StudyNote, 'id' | 'createdAt'>>
): Promise<void> {
  const now = Date.now();
  const currentNotes = getStoredNotes();
  const index = currentNotes.findIndex((n) => n.id === id || n.uid === String(id));
  if (index === -1) throw new Error('Catatan tidak ditemukan');

  const existing = currentNotes[index];
  const updatedCategory = changes.category || existing.category;
  const updatedTitle = changes.title || existing.title;
  const updatedPosition = changes.lastPosition || existing.lastPosition;
  const updatedResume =
    changes.resumeUrl !== undefined ? changes.resumeUrl : existing.resumeUrl;

  const resolvedResume = resolveResumeUrl(
    updatedCategory,
    updatedTitle,
    updatedPosition,
    updatedResume
  );

  const updatedNote: StudyNote = {
    ...existing,
    ...changes,
    resumeUrl: resolvedResume,
    updatedAt: now,
  };

  currentNotes[index] = updatedNote;
  saveStoredNotes([...currentNotes]);

  // Background Task: Update ke Dexie & Firebase
  setTimeout(async () => {
    try {
      if (db && typeof db.open === 'function') {
        if (!db.isOpen()) await db.open().catch(() => {});
        if (typeof id === 'number') {
          await db.studyNotes
            .update(id, {
              ...changes,
              resumeUrl: resolvedResume,
              updatedAt: now,
            })
            .catch(() => {});
        }
      }
    } catch {}

    try {
      const state = useAuthStore.getState();
      if (!state.user.isGuest && state.user.id && isFirebaseReady()) {
        await syncUploadStudyNote(state.user.id, updatedNote).catch(() => {});
      }
    } catch {}
  }, 10);
}

export async function deleteStudyNote(id: number | string): Promise<void> {
  const currentNotes = getStoredNotes().filter(
    (n) => n.id !== id && n.uid !== String(id)
  );
  saveStoredNotes(currentNotes);

  // Background Task: Hapus di Dexie & Firebase
  setTimeout(async () => {
    try {
      if (db && typeof db.open === 'function') {
        if (!db.isOpen()) await db.open().catch(() => {});
        if (typeof id === 'number') {
          await db.studyNotes.delete(id).catch(() => {});
        }
      }
    } catch {}

    try {
      const state = useAuthStore.getState();
      if (!state.user.isGuest && state.user.id && isFirebaseReady()) {
        await syncDeleteStudyNote(state.user.id, String(id)).catch(() => {});
      }
    } catch {}
  }, 10);
}

// -------------------------------------------------------------
// CRUD Operations untuk Student Profiles (Local First -> Background Cloud)
// -------------------------------------------------------------

export async function addStudentProfile(name: string, notes?: string): Promise<StudentProfile> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Nama murid tidak boleh kosong');

  const currentStudents = getStoredStudents();
  const existing = currentStudents.find(
    (s) => s.name.trim().toLowerCase() === trimmed.toLowerCase()
  );
  if (existing) {
    throw new Error(`Murid dengan nama "${trimmed}" sudah terdaftar.`);
  }

  const now = Date.now();
  const newStudent: StudentProfile = {
    id: now,
    uid: generateUID('student'),
    name: trimmed,
    notes: notes?.trim() || '',
    createdAt: now,
    updatedAt: now,
  };

  // 1. Simpan LANGSUNG ke localStorage (0ms, instan)
  const updatedList = [...currentStudents, newStudent];
  saveStoredStudents(updatedList);

  // 2. Background Task: Simpan ke Dexie & Firebase tanpa menunggu
  setTimeout(async () => {
    try {
      if (db && typeof db.open === 'function') {
        if (!db.isOpen()) await db.open().catch(() => {});
        await db.students.add(newStudent).catch(() => {});
      }
    } catch {}

    try {
      const state = useAuthStore.getState();
      if (!state.user.isGuest && state.user.id && isFirebaseReady()) {
        await syncUploadStudent(state.user.id, newStudent).catch(() => {});
      }
    } catch {}
  }, 10);

  return newStudent;
}

export async function deleteStudentProfile(
  id: number | string,
  studentName: string
): Promise<void> {
  // 1. Hapus seketika dari localStorage
  const currentStudents = getStoredStudents().filter(
    (s) => s.id !== id && s.name !== studentName
  );
  saveStoredStudents(currentStudents);

  const currentNotes = getStoredNotes().filter((n) => n.studentName !== studentName);
  saveStoredNotes(currentNotes);

  // 2. Background Task: Hapus di Dexie & Firebase
  setTimeout(async () => {
    try {
      if (db && typeof db.open === 'function') {
        if (!db.isOpen()) await db.open().catch(() => {});
        if (typeof id === 'number') {
          await db.students.delete(id).catch(() => {});
        }
        await db.studyNotes.where('studentName').equals(studentName).delete().catch(() => {});
      }
    } catch {}

    try {
      const state = useAuthStore.getState();
      if (!state.user.isGuest && state.user.id && isFirebaseReady()) {
        await syncDeleteStudent(state.user.id, String(id)).catch(() => {});
      }
    } catch {}
  }, 10);
}

// -------------------------------------------------------------
// Two-Way Sync Sinkronisasi Awal (Dexie / Cloud -> LocalStorage)
// -------------------------------------------------------------

export async function syncStoredDataFromDexieAndCloud(): Promise<void> {
  if (typeof window === 'undefined') return;

  // 1. Sinkronisasi dari Dexie jika localStorage masih kosong
  try {
    const localStudents = getStoredStudents();
    if (localStudents.length === 0 && db && typeof db.open === 'function') {
      if (!db.isOpen()) await db.open().catch(() => {});
      const dexieStudents = await db.students.toArray().catch(() => []);
      if (dexieStudents.length > 0) {
        saveStoredStudents(dexieStudents);
      }
    }

    const localNotes = getStoredNotes();
    if (localNotes.length === 0 && db && typeof db.open === 'function') {
      if (!db.isOpen()) await db.open().catch(() => {});
      const dexieNotes = await db.studyNotes.toArray().catch(() => []);
      if (dexieNotes.length > 0) {
        saveStoredNotes(dexieNotes);
      }
    }
  } catch (dexieErr) {
    console.warn('Sync dari Dexie ke LocalStorage:', dexieErr);
  }

  // 2. Sinkronisasi dari Cloud Firestore jika user terhubung Google
  try {
    const state = useAuthStore.getState();
    if (!state.user.isGuest && state.user.id && isFirebaseReady()) {
      const firestore = getFirebaseFirestore();
      if (firestore) {
        // Ambil murid dari Cloud
        const studentsSnap = await getDocs(
          collection(firestore, `users/${state.user.id}/students`)
        ).catch(() => null);

        if (studentsSnap && !studentsSnap.empty) {
          const cloudStudents: StudentProfile[] = [];
          studentsSnap.forEach((d) => cloudStudents.push(d.data() as StudentProfile));
          const current = getStoredStudents();
          const map = new Map<string, StudentProfile>();
          for (const s of current) map.set(s.name.toLowerCase(), s);
          for (const cs of cloudStudents) {
            if (!map.has(cs.name.toLowerCase())) {
              map.set(cs.name.toLowerCase(), cs);
            }
          }
          saveStoredStudents(Array.from(map.values()));
        }

        // Ambil catatan dari Cloud
        const notesSnap = await getDocs(
          collection(firestore, `users/${state.user.id}/studyNotes`)
        ).catch(() => null);

        if (notesSnap && !notesSnap.empty) {
          const cloudNotes: StudyNote[] = [];
          notesSnap.forEach((d) => cloudNotes.push(d.data() as StudyNote));
          const current = getStoredNotes();
          const map = new Map<string, StudyNote>();
          for (const n of current) map.set(n.uid || String(n.id), n);
          for (const cn of cloudNotes) {
            const key = cn.uid || String(cn.id);
            if (!map.has(key) || (cn.updatedAt && cn.updatedAt > (map.get(key)?.updatedAt || 0))) {
              map.set(key, cn);
            }
          }
          saveStoredNotes(Array.from(map.values()));
        }
      }
    }
  } catch (cloudErr) {
    console.warn('Sync dari Cloud Firestore:', cloudErr);
  }
}
