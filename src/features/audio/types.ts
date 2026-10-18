export interface Qari {
  id: string; // '01' | '02' | '03' | '04' | '05' | '06'
  name: string;
  arabicName?: string;
  description?: string;
  badge?: string;
}

export const QARI_LIST: Qari[] = [
  {
    id: '05',
    name: 'Misyari Rasyid Al-Afasi',
    arabicName: 'مشاري راشد العفاسي',
    description: 'Lantunan merdu, syahdu & makhraj sangat jelas',
    badge: 'Populer',
  },
  {
    id: '03',
    name: 'Abdurrahman As-Sudais',
    arabicName: 'عبد الرحمن السديس',
    description: 'Imam Besar Masjidil Haram Makkah, tegas & berwibawa',
    badge: 'Masjidil Haram',
  },
  {
    id: '01',
    name: 'Abdullah Al-Juhany',
    arabicName: 'عبد الله الجهني',
    description: 'Imam Masjidil Haram Makkah, tartil berirama khas',
    badge: 'Masjidil Haram',
  },
  {
    id: '02',
    name: 'Abdul-Muhsin Al-Qasim',
    arabicName: 'عبد المحسن القاسم',
    description: 'Imam & Khatib Masjid Nabawi Madinah, tenang & fasih',
    badge: 'Masjid Nabawi',
  },
  {
    id: '06',
    name: 'Yasser Al-Dosari',
    arabicName: 'ياسر الدوسري',
    description: 'Imam Masjidil Haram Makkah, nada khas menggetarkan jiwa',
    badge: 'Masjidil Haram',
  },
  {
    id: '04',
    name: 'Ibrahim Al-Dossari',
    arabicName: 'إبراهيم الدوسري',
    description: 'Pakar qiraat & tilawah bertajwid presisi',
  },
];

export type RepeatMode = 'none' | 'ayah' | 'surah';

export interface AudioTrackInfo {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  totalAyahs: number;
  currentAyahNumber: number;
  qariId: string;
  audioUrl: string;
  ayahs: Array<{
    numberInSurah: number;
    arabic: string;
    translation: string;
    audioUrl: string;
  }>;
  rawAyahs?: any[];
}
