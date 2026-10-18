import type { SurahSummary, SurahDetail, JuzItem } from '../types';

/**
 * Service untuk membaca data Al-Qur'an statis
 * Mendukung pembacaan server-side saat build statis dan client-side saat runtime
 */

export async function getSurahs(): Promise<SurahSummary[]> {
  if (typeof window === 'undefined') {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'quran', 'surahs.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }
  const res = await fetch('/data/quran/surahs.json');
  return res.json();
}

export async function getJuzList(): Promise<JuzItem[]> {
  if (typeof window === 'undefined') {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'quran', 'juz.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }
  const res = await fetch('/data/quran/juz.json');
  return res.json();
}

export async function getSurahDetail(number: number): Promise<SurahDetail> {
  if (typeof window === 'undefined') {
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(
      process.cwd(),
      'public',
      'data',
      'quran',
      `surah-${number}.json`
    );
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  }
  const res = await fetch(`/data/quran/surah-${number}.json`);
  return res.json();
}
