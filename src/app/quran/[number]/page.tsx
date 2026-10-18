import { getSurahDetail, getSurahs } from '@/features/quran/services/quranService';
import { SurahReader } from '@/features/quran/components/SurahReader';
import type { Metadata } from 'next';

export const dynamicParams = false;

export async function generateStaticParams() {
  const surahs = await getSurahs();
  return surahs.map((s) => ({
    number: String(s.number),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { number: string };
}): Promise<Metadata> {
  const num = Number(params.number);
  const surah = await getSurahDetail(num);

  return {
    title: `Surah ${surah.nameLatin} (${surah.nameArabic}) - Al-Qur'an Iqra`,
    description: `Baca Surah ${surah.nameLatin} online (${surah.numberOfAyahs} ayat) teks Arab, transliterasi Latin, dan terjemahan Bahasa Indonesia resmi Kemenag RI.`,
  };
}

export default async function QuranDetailPage({
  params,
}: {
  params: { number: string };
}) {
  const num = Number(params.number);
  const surah = await getSurahDetail(num);

  return <SurahReader surah={surah} />;
}
