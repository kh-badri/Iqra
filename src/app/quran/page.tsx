import { getSurahs, getJuzList } from '@/features/quran/services/quranService';
import { QuranIndexView } from '@/features/quran/components/QuranIndexView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Al-Qur'an Al-Karim - 114 Surah & 30 Juz - Iqra",
  description:
    "Baca dan pelajari Al-Qur'an 114 Surah dan 30 Juz teks Arab, transliterasi Latin, dan terjemahan resmi Kemenag RI secara offline.",
};

export default async function QuranPage() {
  const [surahs, juzList] = await Promise.all([getSurahs(), getJuzList()]);

  return <QuranIndexView initialSurahs={surahs} juzList={juzList} />;
}
