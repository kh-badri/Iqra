import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Clock,
  Compass,
  Tv,
  Users,
  Sparkles,
  ArrowRight,
  Bookmark,
  Share2,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { InstallPrompt } from '@/components/ui/InstallPrompt';
import { LastReadCard } from '@/features/home/components/LastReadCard';
import { HomePrayerCard } from '@/features/home/components/HomePrayerCard';
import { TodayCalendarCard } from '@/features/home/components/TodayCalendarCard';
import { getDailyHadith } from '@/features/hadith/services/hadithService';
import { HadithDailyCard } from '@/features/hadith/components/HadithDailyCard';

export default async function HomePage() {
  const dailyHadith = await getDailyHadith();
  const features = [
    {
      title: "Al-Qur'an",
      desc: '114 Surah & audio tilawah',
      href: '/quran/',
      icon: BookOpen,
      badge: 'Lengkap',
    },
    {
      title: 'Jadwal Sholat',
      desc: 'Hitung mundur & pengingat',
      href: '/sholat/',
      icon: Clock,
      badge: 'Lokasi',
    },
    {
      title: 'Arah Kiblat',
      desc: 'Kompas dinamis hadap Ka\'bah',
      href: '/kiblat/',
      icon: Compass,
      badge: 'Kompas HP',
    },
    {
      title: 'Kalender Hijriah',
      desc: 'Penanggalan Islam & puasa sunnah',
      href: '/kalender/',
      icon: Calendar,
      badge: 'Puasa',
    },
    {
      title: 'Belajar Hadits',
      desc: 'Shahih Bukhari & Muslim',
      href: '/hadits/',
      icon: Bookmark,
      badge: 'Shahih',
    },
    {
      title: 'Belajar Tajwid',
      desc: 'Materi bertahap & kuis',
      href: '/tajwid/',
      icon: GraduationCap,
      badge: '5 Level',
    },
    {
      title: 'Sirah Nabawiyyah',
      desc: 'Kronologi hidup Rasulullah ﷺ',
      href: '/sirah/',
      icon: Sparkles,
      badge: 'Sirah Nabi',
    },
    {
      title: 'Kisah 25 Nabi',
      desc: 'Hikmah & rujukan ayat',
      href: '/kisah-nabi/',
      icon: Users,
      badge: '25 Nabi',
    },
    {
      title: 'Masjid Terdekat',
      desc: 'Peta & rute OpenStreetMap',
      href: '/masjid/',
      icon: Compass,
      badge: 'Peta',
    },
    {
      title: 'Kajian YouTube',
      desc: 'Video ustadz terpopuler',
      href: '/kajian/',
      icon: Tv,
      badge: 'Kajian',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Salam & Header Tanggal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Assalamu'alaikum
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Selamat datang di Iqra. Mari terus memperdalam ilmu agama Islam hari ini.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Chip variant="primary" active>
            Fase 6 · Masjid &amp; Kajian Siap
          </Chip>
        </div>
      </div>

      {/* Kartu Waktu Sholat Real-Time */}
      <HomePrayerCard />

      {/* Kalender Hijriah & Puasa Sunnah Hari Ini */}
      <TodayCalendarCard />

      {/* Lanjutkan Membaca Terakhir (Dexie IndexedDB) */}
      <LastReadCard />

      {/* Pintasan 7 Fitur Utama */}
      <div>
        <SectionHeader
          title="Layanan & Fitur Utama"
          subtitle="Pilih materi atau panduan ibadah yang ingin Anda pelajari"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href} className="group">
                <Card
                  hoverable
                  className="h-full flex flex-col justify-between p-4 bg-surface"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-card bg-primary-soft text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-150">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Chip variant="secondary" className="text-[10px] py-0.5 px-2">
                        {item.badge}
                      </Chip>
                    </div>
                    <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] font-semibold text-primary">
                    <span>Buka</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Ayat / Hadits Harian Preview */}
      <div>
        <SectionHeader
          title="Inspirasi Hari Ini"
          subtitle="Renungan firman Allah dan sabda Rasulullah ﷺ"
        />
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                QS. Al-Baqarah : 185
              </span>
            </div>
            <Chip variant="outline" className="text-[11px]">
              Al-Qur'an
            </Chip>
          </div>

          <p
            dir="rtl"
            className="font-arabic text-xl sm:text-2xl text-right leading-loose text-text-primary"
          >
            شَهْرُ رَمَضَانَ الَّذِي أُنْزِلَ فِيهِ الْقُرْآنُ هُدًى لِلنَّاسِ وَبَيِّنَاتٍ مِنَ الْهُدَىٰ وَالْفُرْقَانِ
          </p>

          <p className="text-xs sm:text-sm text-text-secondary italic leading-relaxed">
            "Bulan Ramadan adalah (bulan) yang di dalamnya diturunkan Al-Qur'an, sebagai petunjuk bagi manusia dan penjelasan-penjelasan mengenai petunjuk itu dan pembeda (antara yang benar dan yang batil)."
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-border">
            <span className="text-[11px] text-text-secondary">
              Sumber: Mushaf Standar Indonesia (Kemenag RI)
            </span>
            <Link href="/quran/">
              <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
                <span>Baca Surah</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Hadits Harian Shahih */}
        <div className="mt-4">
          <HadithDailyCard hadith={dailyHadith} />
        </div>
      </div>

      {/* Ajakan Install App */}
      <InstallPrompt />
    </div>
  );
}
