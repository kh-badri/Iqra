import fs from 'fs';
import path from 'path';

const surahsRaw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/data/quran/surahs.json'), 'utf-8'));
const prophetsRaw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/data/prophets.json'), 'utf-8'));
const tajwidRaw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/data/tajwid/lessons.json'), 'utf-8'));

const searchItems = [
  // Surahs
  ...surahsRaw.map((s) => ({
    type: 'surah',
    badge: "Al-Qur'an",
    title: `${s.number}. ${s.nameLatin}`,
    subtitle: `${s.meaning} · ${s.numberOfAyahs} Ayat (${s.revelation})`,
    arabic: s.nameArabic,
    keywords: `${s.nameLatin} ${s.meaning} surat juz ${s.number}`,
    href: `/quran/${s.number}/`,
  })),

  // Prophets
  ...prophetsRaw.map((p) => ({
    type: 'prophet',
    badge: 'Kisah Singkat',
    title: `${p.order}. Kisah Singkat ${p.name}`,
    subtitle: p.summary.slice(0, 85) + '...',
    arabic: p.arabicName,
    keywords: `kisah singkat ${p.name} nabi rasul ${p.order} ${p.era}`,
    href: `/kisah-nabi/${p.slug}/`,
  })),

  // Tajwid
  ...tajwidRaw.map((t) => ({
    type: 'tajwid',
    badge: 'Tajwid',
    title: t.title,
    subtitle: `${t.category} · Level ${t.level}`,
    arabic: t.arabicTitle || '',
    keywords: `${t.title} ${t.category} hukum bacaan tajwid level ${t.level}`,
    href: `/tajwid/${t.slug}/`,
  })),

  // Hadith Kitabs & Common Topics
  {
    type: 'hadith',
    badge: 'Hadits',
    title: 'Kitab Shahih Al-Bukhari',
    subtitle: 'Koleksi hadits shahih terlengkap disusun Imam Al-Bukhari',
    arabic: 'صحيح البخاري',
    keywords: 'shahih bukhari hadis hadits bukhory imam bukhari',
    href: '/hadits/baca/?kitab=bukhari',
  },
  {
    type: 'hadith',
    badge: 'Hadits',
    title: 'Kitab Shahih Muslim',
    subtitle: 'Koleksi hadits shahih bersanad kuat disusun Imam Muslim',
    arabic: 'صحيح مسلم',
    keywords: 'shahih muslim hadis hadits moslem imam muslim',
    href: '/hadits/baca/?kitab=muslim',
  },
  {
    type: 'hadith',
    badge: 'Hadits',
    title: 'Hadits: Niat & Keikhlasan',
    subtitle: 'Innamal a\'maalu bin niyyaat - Bukhari No. 1',
    arabic: 'إنما الأعمال بالنيات',
    keywords: 'niat ikhlas hadits pertama bukhari 1 amal perbuatan',
    href: '/hadits/baca/?kitab=bukhari&no=1',
  },
  {
    type: 'hadith',
    badge: 'Hadits',
    title: 'Hadits: Rukun Islam & Iman',
    subtitle: 'Hadits Jibril AS mengenai Islam, Iman, dan Ihsan - Muslim No. 1',
    arabic: 'حديث جبريل عليه السلام',
    keywords: 'rukun islam rukun iman ihsan hadits jibril muslim 1',
    href: '/hadits/baca/?kitab=muslim&no=1',
  },
];

const outDir = path.join(process.cwd(), 'src/features/search');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'searchIndex.json'), JSON.stringify(searchItems, null, 2));
console.log(`Successfully generated search index with ${searchItems.length} items.`);
