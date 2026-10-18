import Link from 'next/link';
import {
  Compass,
  Tv,
  Bookmark,
  Calendar,
  Download,
  Settings,
  Info,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

export default function LainnyaPage() {
  const menuGroups = [
    {
      title: 'Layanan & Konten',
      items: [
        {
          href: '/kalender/',
          label: 'Kalender Hijriah & Puasa Sunnah',
          desc: 'Penanggalan Islam Umm al-Qura, hari besar Islam, dan panduan puasa sunnah',
          icon: Calendar,
        },
        {
          href: '/sholat/',
          label: 'Ibadah Sholat & Kiblat',
          desc: 'Jadwal sholat harian, kompas kiblat HP, dan peta masjid terdekat',
          icon: Compass,
        },
        {
          href: '/kajian/',
          label: 'Kajian YouTube Ustadz',
          desc: 'Ceramah & tausiyah ustadz Ahlussunnah terverifikasi',
          icon: Tv,
        },
        {
          href: '/bookmark/',
          label: 'Bookmark Tersimpan',
          desc: 'Ayat Al-Qur\'an, hadits, dan materi belajar tersimpan',
          icon: Bookmark,
        },
      ],
    },
    {
      title: 'Aplikasi & Preferensi',
      items: [
        {
          href: '/pasang/',
          label: 'Install App',
          desc: 'Panduan install ke layar utama HP Android & iOS',
          icon: Download,
        },
        {
          href: '/pengaturan/',
          label: 'Pengaturan',
          desc: 'Tema, ukuran font Arab, dan cache',
          icon: Settings,
        },
        {
          href: '/tentang/',
          label: 'Tentang & Sumber Data',
          desc: 'Referensi resmi Kemenag dan privasi',
          icon: Info,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          Menu Lainnya
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Fitur pendukung, manajemen aplikasi, dan preferensi pengguna
        </p>
      </div>

      <div className="space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-xs font-semibold text-text-secondary tracking-wider uppercase mb-2 px-1">
              {group.title}
            </h2>
            <Card className="divide-y divide-border p-0 overflow-hidden">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between p-4 hover:bg-surface-alt transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-card bg-primary-soft text-primary flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-text-primary">
                          {item.label}
                        </div>
                        <div className="text-xs text-text-secondary mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-secondary flex-shrink-0" />
                  </Link>
                );
              })}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
