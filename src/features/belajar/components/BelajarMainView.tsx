'use client';

import * as React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  GraduationCap,
  Bookmark,
  Users,
  Tv,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

const VideoListView = dynamic(
  () => import('@/features/video/components/VideoListView').then((m) => m.VideoListView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[380px] bg-surface-alt flex items-center justify-center rounded-card border border-border">
        <div className="flex flex-col items-center gap-2 text-text-secondary text-xs">
          <Tv className="w-8 h-8 animate-spin text-primary" />
          <span>Memuat koleksi kajian YouTube...</span>
        </div>
      </div>
    ),
  }
);

export type BelajarTab = 'modul' | 'kajian';

interface BelajarMainViewProps {
  initialTab?: BelajarTab;
}

export function BelajarMainView({ initialTab = 'modul' }: BelajarMainViewProps = {}) {
  const [activeTab, setActiveTab] = React.useState<BelajarTab>(initialTab);

  const prophetProgress = useLiveQuery(
    () => db.prophetProgress.where('read').equals(1).count(),
    []
  );

  const tajwidProgress = useLiveQuery(
    () => db.tajwidProgress.where('completed').equals(1).count(),
    []
  );

  const modules = [
    {
      title: 'Belajar Hadits Shahih',
      desc: 'Pelajari hadits-hadits shahih dari kitab induk Shahih Bukhari dan Shahih Muslim beserta nomor, perawi, dan derajat keshahihannya.',
      href: '/hadits/',
      icon: Bookmark,
      badge: '600 Hadits',
      stats: 'Shahih Bukhari & Muslim',
      color: 'primary',
    },
    {
      title: 'Sirah Nabawiyyah',
      desc: 'Kronologi perjalanan agung kehidupan Rasulullah ﷺ dari kelahiran di Tahun Gajah, bi\'tsah kenabian, hijrah Madinah, hingga wafatnya beliau.',
      href: '/sirah/',
      icon: Sparkles,
      badge: '17 Bab Lengkap',
      stats: 'Kitab Ar-Rahiq Al-Makhtum',
      color: 'primary',
    },
    {
      title: 'Belajar Tajwid Interaktif',
      desc: 'Kurikulum bertahap 5 level standar Mushaf Kemenag RI: Makharijul Huruf, Nun Sukun, Mim Sukun, Mad, dan Qalqalah beserta kuis interaktif.',
      href: '/tajwid/',
      icon: GraduationCap,
      badge: '5 Level Kurikulum',
      stats: `${tajwidProgress || 0} / 22 Materi Selesai`,
      color: 'accent',
    },
    {
      title: 'Kisah Singkat 25 Nabi',
      desc: 'Ringkasan keteladanan agung para nabi dan rasul dari Adam AS hingga Muhammad ﷺ dengan rujukan ayat Al-Qur\'an dan hikmah keteladanan.',
      href: '/kisah-nabi/',
      icon: Users,
      badge: '25 Kisah Singkat',
      stats: `${prophetProgress || 0} / 25 Selesai Dibaca`,
      color: 'success',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Info Halaman */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center">
            {activeTab === 'modul' && <GraduationCap className="w-4 h-4" />}
            {activeTab === 'kajian' && <Tv className="w-4 h-4" />}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            {activeTab === 'modul' && 'Pusat Belajar Ilmu Islam'}
            {activeTab === 'kajian' && 'Kajian YouTube Ustadz Populer'}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary">
          {activeTab === 'modul' &&
            'Tingkatkan pemahaman keislaman melalui hadits shahih, kurikulum hukum tajwid interaktif, dan sirah keteladanan para nabi.'}
          {activeTab === 'kajian' &&
            'Koleksi rekaman ceramah, tanya jawab, dan bedah kitab dari para asatidz Ahlussunnah terverifikasi di Indonesia.'}
        </p>
      </div>

      {/* Segmented Control 2 Tab: Modul Belajar | Kajian YouTube */}
      <div className="inline-flex p-1 bg-surface-alt border border-border rounded-xl gap-1 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setActiveTab('modul')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'modul'
              ? 'bg-primary text-white shadow-subtle'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Modul Belajar</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('kajian')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'kajian'
              ? 'bg-primary text-white shadow-subtle'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          <span>Kajian YouTube</span>
        </button>
      </div>

      {/* Konten Tab Aktif */}
      {activeTab === 'modul' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Grid Modul Belajar Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Link key={m.title} href={m.href} className="block group">
                  <Card
                    hoverable
                    className="p-5 h-full flex flex-col justify-between border border-border transition-all duration-200"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-card bg-primary-soft text-primary flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <Chip variant="secondary" className="text-[10px] font-bold">
                          {m.badge}
                        </Chip>
                      </div>
                      <h2 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors">
                        {m.title}
                      </h2>
                      <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                      <span className="text-text-secondary font-normal text-[11px]">
                        {m.stats}
                      </span>
                      <div className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Mulai Belajar</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Banner Ajakan Buka Kajian YouTube */}
          <Card
            hoverable
            onClick={() => setActiveTab('kajian')}
            className="p-5 border border-primary/30 bg-primary-soft/30 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-card bg-primary text-white flex items-center justify-center shrink-0 shadow-subtle">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-text-primary">
                    Video Kajian YouTube Ustadz Populer
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">
                    Streaming Ilmiah
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  Tonton ceramah, tanya jawab fiqih, dan bedah kitab dari ustadz terpercaya langsung di tab Kajian.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-primary px-3.5 py-1.5 rounded-full bg-surface border border-border hover:border-primary transition-colors"
            >
              <span>Buka Tab Kajian</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Card>

          {/* Mutiara Nasihat Belajar */}
          <Card className="p-6 border border-accent/40 bg-accent/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/15 text-accent border border-accent/30 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent block">
                  Mutiara Nasihat Belajar
                </span>
                <h3 className="text-sm sm:text-base font-bold text-text-primary mt-0.5">
                  &ldquo;Sebaik-baik kalian adalah orang yang belajar Al-Qur&apos;an dan mengajarkannya.&rdquo;
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  HR. Bukhari no. 5027 dari sahabat Utsman bin Affan radhiyallahu &apos;anhu.
                </p>
              </div>
            </div>

            <Link
              href="/tajwid/"
              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-primary px-3 py-1.5 rounded-full bg-surface border border-border hover:border-primary transition-colors"
            >
              <span>Buka Tajwid</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        </div>
      )}

      {/* Konten Tab Kajian Video */}
      {activeTab === 'kajian' && (
        <div className="animate-in fade-in duration-200">
          <VideoListView embedded />
        </div>
      )}
    </div>
  );
}
