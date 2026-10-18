export interface ProphetSection {
  id: string;
  title: string;
  content: string;
}

export interface ProphetVerseRef {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
}

export interface Prophet {
  slug: string;
  name: string;
  arabicName: string;
  order: number;
  era: string;
  place: string;
  mentionCount: number;
  summary: string;
  readingTimeMinutes: number;
  sections: ProphetSection[];
  verseRefs: ProphetVerseRef[];
  lessons: string[];
  sources: string[];
}
