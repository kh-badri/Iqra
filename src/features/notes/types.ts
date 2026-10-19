import type { StudyNoteCategory, StudyNoteStatus, StudyNote, StudentProfile } from '@/lib/db';

export type { StudyNoteCategory, StudyNoteStatus, StudyNote, StudentProfile };

export interface NoteCategoryMeta {
  key: StudyNoteCategory;
  label: string;
  arabic: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  defaultRoute: string;
}

export const NOTE_CATEGORIES: NoteCategoryMeta[] = [
  {
    key: 'quran',
    label: "Al-Qur'an",
    arabic: 'القرآن الكريم',
    color: 'bg-pastel-green text-[#266308] border-pastel-green/40',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60',
    defaultRoute: '/quran/',
  },
  {
    key: 'tajwid',
    label: 'Ilmu Tajwid',
    arabic: 'علم التجويد',
    color: 'bg-pastel-cyan text-[#0B5C66] border-pastel-cyan/40',
    badgeBg: 'bg-teal-100 dark:bg-teal-950/60',
    badgeText: 'text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60',
    defaultRoute: '/tajwid/',
  },
  {
    key: 'hadits',
    label: 'Hadits Shahih',
    arabic: 'الحديث الشريف',
    color: 'bg-pastel-purple text-[#5A2C85] border-pastel-purple/40',
    badgeBg: 'bg-purple-100 dark:bg-purple-950/60',
    badgeText: 'text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60',
    defaultRoute: '/hadits/',
  },
  {
    key: 'kisah-nabi',
    label: 'Kisah 25 Nabi',
    arabic: 'قصص الأنبياء',
    color: 'bg-pastel-pink text-[#8A1846] border-pastel-pink/40',
    badgeBg: 'bg-rose-100 dark:bg-rose-950/60',
    badgeText: 'text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60',
    defaultRoute: '/kisah-nabi/',
  },
  {
    key: 'sirah',
    label: 'Sirah Nabawiyyah',
    arabic: 'السيرة النبوية',
    color: 'bg-pastel-orange text-[#8C3E00] border-pastel-orange/40',
    badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
    badgeText: 'text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60',
    defaultRoute: '/sirah/',
  },
  {
    key: 'lainnya',
    label: 'Lainnya / Doa',
    arabic: 'متفرقات وأدعية',
    color: 'bg-pastel-yellow text-[#7A5B00] border-pastel-yellow/40',
    badgeBg: 'bg-yellow-100 dark:bg-yellow-950/60',
    badgeText: 'text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/60',
    defaultRoute: '/belajar/',
  },
];

export const GRADE_PRESETS = [
  { value: 'Mumtaz (Istimewa)', label: 'Mumtaz (Istimewa) 🌟' },
  { value: 'Jayyid Jiddan (Sangat Baik)', label: 'Jayyid Jiddan (Sangat Baik) 👏' },
  { value: 'Jayyid (Baik)', label: 'Jayyid (Baik) 👍' },
  { value: 'Maqbul (Cukup)', label: 'Maqbul (Cukup) ✍️' },
  { value: "Perlu Muraja'ah", label: "Perlu Muraja'ah 🔄" },
  { value: 'Lancar', label: 'Lancar ✅' },
  { value: 'Belum Lancar', label: 'Belum Lancar ⚠️' },
];
