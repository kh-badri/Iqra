import Dexie, { type Table } from 'dexie';

export interface BookmarkItem {
  id?: number;
  type: 'ayah' | 'hadith' | 'prophet' | 'tajwid';
  refId: string; // e.g. "quran-1-1" or "hadith-bukhari-1"
  title: string;
  subtitle?: string;
  extraData?: any;
  createdAt: number;
}

export interface LastReadItem {
  id?: number;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  timestamp: number;
}

export interface PrayerDay {
  id?: number;
  date: string; // YYYY-MM-DD
  city: string;
  imsak: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  timestamp: number;
}

export interface TajwidProgress {
  id?: number;
  lessonSlug: string;
  level: number;
  completed: boolean;
  score: number;
  bestScore: number;
  updatedAt: number;
}

export interface ProphetProgress {
  id?: number;
  slug: string;
  read: boolean;
  updatedAt: number;
}

export interface CachedMosqueArea {
  id?: number;
  areaKey: string;
  mosques: any[];
  timestamp: number;
}

export type StudyNoteCategory = 'quran' | 'tajwid' | 'kisah-nabi' | 'hadits' | 'sirah' | 'lainnya';
export type StudyNoteStatus = 'ongoing' | 'completed';

export interface StudyNote {
  id?: number;
  uid?: string; // unique identifier for Firebase sync
  studentName: string; // 'Diri Sendiri' or custom student name
  category: StudyNoteCategory;
  title: string; // e.g. "Surah Al-Baqarah", "Makhraj Huruf Al-Halq", etc.
  lastPosition: string; // e.g. "Ayat 45", "Level 2: Bab Idgham", etc.
  resumeUrl?: string; // direct URL to continue learning
  notes?: string; // feedback/notes from teacher or personal reflection
  grade?: string; // evaluation e.g. "Mumtaz", "Jayyid Jiddan", "Perlu Muraja'ah"
  status: StudyNoteStatus;
  createdAt: number;
  updatedAt: number;
}

export interface StudentProfile {
  id?: number;
  uid?: string;
  name: string;
  notes?: string; // e.g. "Santri Kelas 3 TPA"
  createdAt: number;
  updatedAt?: number;
}

export class IqraDatabase extends Dexie {
  bookmarks!: Table<BookmarkItem, number>;
  lastRead!: Table<LastReadItem, number>;
  prayerDays!: Table<PrayerDay, number>;
  tajwidProgress!: Table<TajwidProgress, number>;
  prophetProgress!: Table<ProphetProgress, number>;
  cachedMosques!: Table<CachedMosqueArea, number>;
  studyNotes!: Table<StudyNote, number>;
  students!: Table<StudentProfile, number>;

  constructor() {
    super('IqraDB');
    this.version(2).stores({
      bookmarks: '++id, type, refId, createdAt',
      lastRead: '++id, surahNumber, timestamp',
      prayerDays: '++id, date, city',
    });
    this.version(3).stores({
      bookmarks: '++id, type, refId, createdAt',
      lastRead: '++id, surahNumber, timestamp',
      prayerDays: '++id, date, city',
      tajwidProgress: '++id, lessonSlug, level, completed',
      prophetProgress: '++id, slug, read',
    });
    this.version(4).stores({
      bookmarks: '++id, type, refId, createdAt',
      lastRead: '++id, surahNumber, timestamp',
      prayerDays: '++id, date, city',
      tajwidProgress: '++id, lessonSlug, level, completed',
      prophetProgress: '++id, slug, read',
      cachedMosques: '++id, areaKey, timestamp',
    });
    this.version(5).stores({
      bookmarks: '++id, type, refId, createdAt',
      lastRead: '++id, surahNumber, timestamp',
      prayerDays: '++id, date, city',
      tajwidProgress: '++id, lessonSlug, level, completed',
      prophetProgress: '++id, slug, read',
      cachedMosques: '++id, areaKey, timestamp',
      studyNotes: '++id, uid, studentName, category, status, updatedAt',
      students: '++id, uid, name, createdAt',
    });
  }
}

export const db = new IqraDatabase();

// Menangani pergantian versi secara otomatis agar tidak terblokir oleh tab lain
if (typeof window !== 'undefined') {
  db.on('versionchange', function () {
    // Tutup koneksi lama agar tab baru dapat meng-upgrade database tanpa hang
    db.close();
  });

  db.on('blocked', function () {
    console.warn('Dexie database upgrade is blocked by another open tab.');
  });
}

