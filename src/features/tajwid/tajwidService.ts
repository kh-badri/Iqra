import type { TajwidLevel, TajwidLesson, TajwidGlossaryTerm } from './types';

let cachedLevels: TajwidLevel[] | null = null;
let cachedLessons: TajwidLesson[] | null = null;
let cachedGlossary: TajwidGlossaryTerm[] | null = null;

export async function getTajwidLevels(): Promise<TajwidLevel[]> {
  if (cachedLevels) return cachedLevels;

  if (typeof window === 'undefined') {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'tajwid', 'levels.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    cachedLevels = JSON.parse(raw);
    return cachedLevels || [];
  }

  const res = await fetch('/data/tajwid/levels.json');
  if (!res.ok) throw new Error('Gagal memuat level kurikulum tajwid');
  const data = await res.json();
  cachedLevels = data;
  return data;
}

export async function getAllTajwidLessons(): Promise<TajwidLesson[]> {
  if (cachedLessons) return cachedLessons;

  if (typeof window === 'undefined') {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'tajwid', 'lessons.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    cachedLessons = JSON.parse(raw);
    return cachedLessons || [];
  }

  const res = await fetch('/data/tajwid/lessons.json');
  if (!res.ok) throw new Error('Gagal memuat materi pelajaran tajwid');
  const data = await res.json();
  cachedLessons = data;
  return data;
}

export async function getTajwidLessonBySlug(slug: string): Promise<TajwidLesson | null> {
  const lessons = await getAllTajwidLessons();
  return lessons.find((l) => l.slug === slug) || null;
}

export async function getTajwidGlossary(): Promise<TajwidGlossaryTerm[]> {
  if (cachedGlossary) return cachedGlossary;

  if (typeof window === 'undefined') {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'tajwid', 'glossary.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    cachedGlossary = JSON.parse(raw);
    return cachedGlossary || [];
  }

  const res = await fetch('/data/tajwid/glossary.json');
  if (!res.ok) throw new Error('Gagal memuat glosarium tajwid');
  const data = await res.json();
  cachedGlossary = data;
  return data;
}
