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

export class IqraDatabase extends Dexie {
  bookmarks!: Table<BookmarkItem, number>;
  lastRead!: Table<LastReadItem, number>;
  prayerDays!: Table<PrayerDay, number>;
  tajwidProgress!: Table<TajwidProgress, number>;
  prophetProgress!: Table<ProphetProgress, number>;
  cachedMosques!: Table<CachedMosqueArea, number>;

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
  }
}

export const db = new IqraDatabase();
