export interface SurahSummary {
  number: number;
  nameLatin: string;
  nameArabic: string;
  meaning: string;
  numberOfAyahs: number;
  revelation: 'Makkiyah' | 'Madaniyah';
  description?: string;
  audioFull?: Record<string, string>;
}

export interface Ayah {
  numberInSurah: number;
  arabic: string;
  transliteration: string;
  translation: string;
  audio?: Record<string, string>;
}

export interface SurahDetail extends SurahSummary {
  nextSurah: { number: number; name: string } | null;
  prevSurah: { number: number; name: string } | null;
  ayahs: Ayah[];
}

export interface JuzItem {
  juz: number;
  name: string;
  startSurah: number;
  startAyat: number;
  endSurah: number;
  endAyat: number;
}

export interface QuranSettings {
  fontSizeArabic: number;
  showTranslation: boolean;
  showTransliteration: boolean;
}
