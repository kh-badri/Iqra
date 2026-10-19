import Link from 'next/link';
import { Sparkles, ArrowRight, NotebookPen } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { InstallPrompt } from '@/components/ui/InstallPrompt';
import { LastReadCard } from '@/features/home/components/LastReadCard';
import { HomePrayerCard } from '@/features/home/components/HomePrayerCard';
import { HomeGreeting } from '@/features/home/components/HomeGreeting';
import { getDailyHadith } from '@/features/hadith/services/hadithService';
import { HadithDailyCard } from '@/features/hadith/components/HadithDailyCard';
import {
  QuranIcon,
  KaabaIcon,
  PrayerClockIcon,
  CalendarIcon,
  HadithBookIcon,
  TajwidIcon,
  SirahScrollIcon,
  ProphetsStarIcon,
  MasjidIcon,
  KajianIcon,
} from '@/components/icons/IslamicIcons';

const quickShortcuts = [
  {
    title: "Al-Qur'an",
    href: '/quran/',
    icon: QuranIcon,
    bg: 'bg-pastel-green',
  },
  {
    title: 'Catatan',
    href: '/catatan/',
    icon: NotebookPen,
    bg: 'bg-pastel-blue',
  },
  {
    title: 'Jadwal Sholat',
    href: '/sholat/',
    icon: PrayerClockIcon,
    bg: 'bg-pastel-blue',
  },
  {
    title: 'Arah Kiblat',
    href: '/kiblat/',
    icon: KaabaIcon,
    bg: 'bg-pastel-cyan',
  },
  {
    title: 'Kalender',
    href: '/kalender/',
    icon: CalendarIcon,
    bg: 'bg-pastel-yellow',
  },
  {
    title: 'Hadits',
    href: '/hadits/',
    icon: HadithBookIcon,
    bg: 'bg-pastel-purple',
  },
  {
    title: 'Tajwid',
    href: '/tajwid/',
    icon: TajwidIcon,
    bg: 'bg-pastel-green',
  },
  {
    title: 'Sirah',
    href: '/sirah/',
    icon: SirahScrollIcon,
    bg: 'bg-pastel-orange',
  },
  {
    title: '25 Nabi',
    href: '/kisah-nabi/',
    icon: ProphetsStarIcon,
    bg: 'bg-pastel-pink',
  },
];

const features = [
  {
    title: "Al-Qur'an 30 Juz",
    desc: '114 Surah, audio tilawah & tafsir ringkas Kemenag RI',
    href: '/quran/',
    icon: QuranIcon,
    badge: 'Lengkap',
    bg: 'bg-pastel-green',
  },
  {
    title: 'Catatan & Murid',
    desc: 'Riwayat pembelajaran diri & santri, target & evaluasi',
    href: '/catatan/',
    icon: NotebookPen,
    badge: 'Baru',
    bg: 'bg-pastel-blue',
  },
  {
    title: 'Jadwal Sholat',
    desc: 'Hitung mundur real-time & hisab Kemenag RI',
    href: '/sholat/',
    icon: PrayerClockIcon,
    badge: 'Presisi',
    bg: 'bg-pastel-blue',
  },
  {
    title: 'Arah Kiblat',
    desc: 'Kompas dinamis akurat hadap Ka\'bah di Makkah',
    href: '/kiblat/',
    icon: KaabaIcon,
    badge: 'Sensor HP',
    bg: 'bg-pastel-cyan',
  },
  {
    title: 'Kalender Hijriah',
    desc: 'Penanggalan Umm al-Qura & jadwal puasa sunnah',
    href: '/kalender/',
    icon: CalendarIcon,
    badge: 'Puasa',
    bg: 'bg-pastel-yellow',
  },
  {
    title: 'Koleksi Hadits',
    desc: '600+ hadits shahih dari Bukhari & Muslim',
    href: '/hadits/',
    icon: HadithBookIcon,
    badge: 'Shahihain',
    bg: 'bg-pastel-purple',
  },
  {
    title: 'Belajar Tajwid',
    desc: '5 Level materi bertahap & kuis interaktif',
    href: '/tajwid/',
    icon: TajwidIcon,
    badge: '5 Level',
    bg: 'bg-pastel-green',
  },
  {
    title: 'Sirah Nabawiyyah',
    desc: 'Kronologi 17 bab perjalanan Rasulullah ﷺ',
    href: '/sirah/',
    icon: SirahScrollIcon,
    badge: '17 Bab',
    bg: 'bg-pastel-orange',
  },
  {
    title: 'Kisah 25 Nabi',
    desc: 'Hikmah & rujukan ayat Al-Qur\'an shahih',
    href: '/kisah-nabi/',
    icon: ProphetsStarIcon,
    badge: '25 Kisah',
    bg: 'bg-pastel-pink',
  },
  {
    title: 'Masjid Terdekat',
    desc: 'Peta & rute navigasi tempat ibadah muslim',
    href: '/masjid/',
    icon: MasjidIcon,
    badge: 'Peta',
    bg: 'bg-pastel-blue',
  },
  {
    title: 'Kajian YouTube',
    desc: 'Video ceramah asatidz Ahlussunnah terverifikasi',
    href: '/kajian/',
    icon: KajianIcon,
    badge: 'Streaming',
    bg: 'bg-pastel-orange',
  },
];

export default async function HomePage() {
  const dailyHadith = await getDailyHadith();

  return (
    <div className="relative space-y-6 sm:space-y-7 animate-fade-in-up pb-6 overflow-x-hidden max-w-full">
      {/* Organic Blob Background Accent - Cleanly clipped inside container to eliminate mobile horizontal wobble */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden>
        <div className="absolute -top-14 -right-12 w-72 h-72 bg-pastel-green opacity-40 organic-blob" />
        <div className="absolute top-96 -left-16 w-64 h-64 bg-pastel-yellow opacity-30 organic-blob" />
      </div>

      {/* ── 1. Sapaan & Salam Bersih (Dinamis Tamu / Akun Google) ────── */}
      <HomeGreeting />

      {/* ── 2. Hero Card: Jadwal Sholat Berikutnya (Lime Gradient) ───── */}
      <HomePrayerCard />

      {/* ── 3. Quick Actions: Baris Ikon Pastel (Scroll-Snap Horizontal) ─ */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="text-sm font-extrabold text-text-primary tracking-tight">
            Akses Cepat
          </h2>
          <span className="text-[11px] text-text-muted font-medium">Geser untuk fitur lainnya →</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory overscroll-x-contain touch-pan-x">
          {quickShortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="snap-start flex-shrink-0 flex flex-col items-center justify-center w-[74px] p-2 rounded-card bg-surface border border-border hover:border-primary/40 transition-all duration-150 active:scale-95 group shadow-card"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-subtle border border-black/5 dark:border-white/10 ${item.bg}`}
                >
                  <Icon size={30} className="w-7.5 h-7.5 drop-shadow-sm transition-transform duration-200 group-hover:scale-110" />
                </div>
                <span className="text-[11px] font-bold text-text-primary group-hover:text-primary-text transition-colors mt-2 text-center leading-tight truncate w-full">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── 4. Lanjutkan Membaca Terakhir (IndexedDB) ─────────────────── */}
      <LastReadCard />

      {/* ── 5. Katalog 10 Fitur Utama (Fresh Rounded Cards) ─────────── */}
      <div>
        <SectionHeader
          title="Layanan &amp; Fitur Lengkap"
          subtitle="Pilih panduan ibadah atau modul syar'i yang ingin Anda pelajari"
          accent
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group block select-none"
              >
                <Card
                  hoverable
                  className="h-full flex flex-col justify-between p-4 bg-surface border border-border hover:border-primary/40 transition-all duration-200 shadow-card"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      {/* Circular icon with pastel background & realistic Islamic icon */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-subtle border border-black/5 dark:border-white/10 ${item.bg}`}
                      >
                        <Icon size={28} className="w-7 h-7 drop-shadow-sm transition-transform duration-200 group-hover:scale-110" />
                      </div>
                      <span className="text-[10px] font-extrabold text-text-secondary bg-surface-alt px-2 py-0.5 rounded-pill border border-border">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-text-primary group-hover:text-primary-text transition-colors duration-150 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-text-secondary mt-1 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-primary-text">Buka</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary-text group-hover:translate-x-1 transition-transform duration-150" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── 6. Inspirasi Firman & Sabda Hari Ini ──────────────────────── */}
      <div>
        <SectionHeader
          title="Inspirasi Hari Ini"
          subtitle="Renungan firman Allah dan hadits shahih Rasulullah ﷺ"
          accent
        />

        {/* Ayat Al-Qur'an Card */}
        <Card className="p-5 sm:p-6 space-y-4 bg-surface border-border shadow-card">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pastel-yellow text-warning flex items-center justify-center shadow-subtle">
                <Sparkles className="w-4 h-4 fill-warning" />
              </div>
              <span className="text-xs font-extrabold text-warning uppercase tracking-wider">
                QS. Al-Baqarah : 185
              </span>
            </div>
            <Chip variant="pastel-green" className="text-[10px] py-0.5 px-2.5 font-bold">
              Al-Qur'an
            </Chip>
          </div>

          <p
            dir="rtl"
            className="font-arabic text-xl sm:text-2xl text-right leading-loose text-text-primary select-text font-medium"
          >
            شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ هُدًى لِلنَّاسِ وَبَيِّنَاتٍ مِنَ الْهُدَىٰ وَالْفُرْقَانِ
          </p>

          <p className="text-xs sm:text-sm text-text-secondary italic leading-relaxed select-text">
            &ldquo;Bulan Ramadan adalah (bulan) yang di dalamnya diturunkan Al-Qur'an, sebagai
            petunjuk bagi manusia dan penjelasan-penjelasan mengenai petunjuk itu dan
            pembeda (antara yang benar dan yang batil).&rdquo;
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-border">
            <span className="text-[11px] text-text-muted">
              Mushaf Standar RI · Kemenag
            </span>
            <Link href="/quran/">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-primary-text gap-1 group rounded-pill">
                <span>Baca Surah</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Hadits Harian */}
        <div className="mt-4">
          <HadithDailyCard hadith={dailyHadith} />
        </div>
      </div>

      {/* ── 8. Install PWA Prompt ────────────────────────────────────── */}
      <InstallPrompt />
    </div>
  );
}
