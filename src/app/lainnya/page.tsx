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
  ShieldCheck,
  Sparkles,
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
          desc: 'Penanggalan Umm al-Qura, hari besar Islam, dan jadwal puasa',
          icon: Calendar,
          color: 'bg-pastel-green text-[#266308] border border-pastel-green/40',
        },
        {
          href: '/sholat/',
          label: 'Ibadah Sholat & Kiblat',
          desc: 'Jadwal sholat harian, kompas kiblat HP, dan peta masjid',
          icon: Compass,
          color: 'bg-pastel-cyan text-[#0B5C66] border border-pastel-cyan/40',
        },
        {
          href: '/kajian/',
          label: 'Kajian YouTube Ustadz',
          desc: 'Ceramah & tausiyah ustadz Ahlussunnah terverifikasi',
          icon: Tv,
          color: 'bg-pastel-orange text-[#8C3E00] border border-pastel-orange/40',
        },
        {
          href: '/bookmark/',
          label: 'Bookmark Tersimpan',
          desc: 'Ayat Al-Qur\'an, hadits, dan materi belajar tersimpan',
          icon: Bookmark,
          color: 'bg-pastel-yellow text-[#7A5B00] border border-pastel-yellow/40',
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
          color: 'bg-pastel-purple text-[#5A2C85] border border-pastel-purple/40',
          badge: 'PWA',
        },
        {
          href: '/pengaturan/',
          label: 'Pengaturan',
          desc: 'Tema, ukuran font Arab, dan manajemen cache',
          icon: Settings,
          color: 'bg-pastel-blue text-[#1E4E8C] border border-pastel-blue/40',
        },
        {
          href: '/tentang/',
          label: 'Tentang & Sumber Data',
          desc: 'Referensi resmi Kemenag RI dan komitmen amanah',
          icon: Info,
          color: 'bg-pastel-pink text-[#8A1846] border border-pastel-pink/40',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Info Halaman */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
          Menu Lainnya
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Fitur pendukung, manajemen aplikasi, dan preferensi pengguna
        </p>
      </div>

      {/* Menu Groups */}
      <div className="space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-[11px] font-bold text-text-muted tracking-widest uppercase mb-2.5 px-1">
              {group.title}
            </h2>
            <Card className="divide-y divide-border p-0 overflow-hidden shadow-card border-border rounded-card bg-surface">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between p-4 sm:p-5 hover:bg-surface-2 active:bg-surface-2 transition-colors duration-150 group min-h-[64px]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-150 group-hover:scale-105 shadow-subtle ${item.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-text-primary group-hover:text-primary-text transition-colors truncate">
                            {item.label}
                          </span>
                          {'badge' in item && item.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-gradient text-on-primary shadow-subtle">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-text-muted mt-0.5 truncate leading-relaxed">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted group-hover:translate-x-0.5 group-hover:text-primary-text transition-all duration-150 flex-shrink-0 ml-2" />
                  </Link>
                );
              })}
            </Card>
          </div>
        ))}
      </div>

      {/* Footer Info App */}
      <div className="pt-2 text-center text-xs text-text-muted space-y-1">
        <p className="font-bold text-text-primary">Iqra · Belajar Agama Islam</p>
        <p className="text-[11px]">Versi 1.0 · PWA &amp; Static Export · Bebas Iklan</p>
      </div>
    </div>
  );
}
