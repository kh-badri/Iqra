import type { HadithBook, HadithItem } from '../types';

export async function getHadithBooks(): Promise<HadithBook[]> {
  if (typeof window === 'undefined') {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'hadith', 'books.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }
  const res = await fetch('/data/hadith/books.json');
  return res.json();
}

export async function getHadithBookById(bookId: string): Promise<HadithBook | null> {
  const books = await getHadithBooks();
  return books.find((b) => b.id === bookId) || null;
}

export async function getHadithChunk(
  bookId: string,
  chunkNumber: number = 1
): Promise<HadithItem[]> {
  if (typeof window === 'undefined') {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(
      process.cwd(),
      'public',
      'data',
      'hadith',
      bookId,
      `chunk-${chunkNumber}.json`
    );
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }
  const res = await fetch(`/data/hadith/${bookId}/chunk-${chunkNumber}.json`);
  if (!res.ok) return [];
  return res.json();
}

export async function getDailyHadith(date: Date = new Date()): Promise<HadithItem | null> {
  let list: HadithItem[] = [];

  if (typeof window === 'undefined') {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'hadith', 'daily.json');
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf-8');
    list = JSON.parse(content);
  } else {
    const res = await fetch('/data/hadith/daily.json');
    if (!res.ok) return null;
    list = await res.json();
  }

  if (list.length === 0) return null;
  // Pilih deterministik berdasarkan tanggal hari ini dalam sebulan (1..30)
  const dayIndex = (date.getDate() - 1) % list.length;
  return list[dayIndex];
}
