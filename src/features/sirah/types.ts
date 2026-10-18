export type SirahPhase = 'semua' | 'makkah' | 'madinah';

export interface SirahEpisode {
  id: string;
  order: number;
  phase: 'makkah' | 'madinah';
  title: string;
  arabicTitle?: string;
  yearMasehi: string;
  yearHijri?: string;
  age: string;
  summary: string;
  content: string[];
  verseRefs?: {
    surah: string;
    text: string;
    translation: string;
  }[];
  hadithRefs?: {
    source: string;
    text: string;
  }[];
  lessons: string[];
  location: string;
}
