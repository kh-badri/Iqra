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
  Scroll,
  PlayCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
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
      arabic: 'الحديث النبوي',
      desc: 'Pelajari 600+ hadits shahih dari Shahih Bukhari dan Shahih Muslim beserta perawi dan sanad.',
      href: '/hadits/',
      icon: Bookmark,
      badge: '600 Hadits',
      stats: 'Bukhari & Muslim',
      bg: 'bg-pastel-purple',
      textColor: 'text-pastel-purple-text',
    },
    {
      title: 'Sirah Nabawiyyah',
      arabic: 'السيرة النبوية',
      desc: 'Kronologi 17 bab perjalanan agung kehidupan Rasulullah ﷺ dari lahir hingga wafat.',
      href: '/sirah/',
      icon: Scroll,
      badge: '17 Bab Lengkap',
      stats: 'Ar-Rahiq Al-Makhtum',
      bg: 'bg-pastel-orange',
      textColor: 'text-pastel-orange-text',
    },
    {
      title: 'Belajar Tajwid Interaktif',
      arabic: 'علم التجويد',
      desc: 'Kurikulum 5 level standar Mushaf Kemenag RI dilengkapi kuis interaktif.',
      href: '/tajwid/',
      icon: GraduationCap,
      badge: '5 Level',
      stats: `${tajwidProgress || 0} / 22 Materi Selesai`,
      bg: 'bg-pastel-green',
      textColor: 'text-pastel-green-text',
    },
    {
      title: 'Kisah Singkat 25 Nabi',
      arabic: 'قصص الأنبياء',
      desc: 'Keteladanan para nabi dari Adam AS hingga Isa AS bersumber dari ayat Al-Qur\'an.',
      href: '/kisah-nabi/',
      icon: Users,
      badge: '25 Kisah',
      stats: `${prophetProgress || 0} / 25 Dibaca`,
      bg: 'bg-pastel-pink',
      textColor: 'text-pastel-pink-text',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Info Halaman */}
      <div className="border-b border-border/80 pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-9 h-9 rounded-full bg-pastel-green text-primary-text flex items-center justify-center shadow-subtle">
            {activeTab === 'modul' ? (
              <GraduationCap className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <Tv className="w-5 h-5 stroke-[2.2]" />
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight leading-tight">
              {activeTab === 'modul' ? 'Pusat Belajar Ilmu Islam' : 'Kajian YouTube Terpilih'}
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
              {activeTab === 'modul'
                ? 'Kurikulum ilmu syar\'i terstruktur berlandaskan dalil shahih dan kitab ulama mu\'tamad.'
                : 'Koleksi ceramah & bedah kitab dari para asatidz Ahlussunnah terverifikasi di Indonesia.'}
            </p>
          </div>
        </div>
      </div>

      {/* Segmented Control 2 Tab Pill */}
      <div className="grid grid-cols-2 p-1 bg-surface-alt rounded-pill border border-border max-w-sm">
        <button
          type="button"
          onClick={() => setActiveTab('modul')}
          className={`flex items-center justify-center gap-2 py-2 rounded-pill text-xs font-extrabold transition-all duration-150 active:scale-95 ${
            activeTab === 'modul'
              ? 'bg-primary-gradient text-on-primary shadow-subtle'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Modul Belajar</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('kajian')}
          className={`flex items-center justify-center gap-2 py-2 rounded-pill text-xs font-extrabold transition-all duration-150 active:scale-95 ${
            activeTab === 'kajian'
              ? 'bg-primary-gradient text-on-primary shadow-subtle'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Kajian Video</span>
        </button>
      </div>

      {/* Konten Tab Modul */}
      {activeTab === 'modul' && (
        <div className="space-y-6">
          {/* Grid Modul Belajar Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((m, idx) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.title}
                  href={m.href}
                  className="block group select-none animate-fade-in-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <Card
                    hoverable
                    className="p-5 h-full flex flex-col justify-between bg-surface border border-border hover:border-primary/40 transition-all duration-200 shadow-card"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-subtle ${m.bg} ${m.textColor}`}
                        >
                          <Icon className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-pill bg-surface-alt border border-border text-text-secondary">
                          {m.badge}
                        </span>
                      </div>

                      <div className="mb-1">
                        <span className="font-arabic text-xs text-text-secondary/70 block text-right font-bold -mt-2">
                          {m.arabic}
                        </span>
                        <h2 className="text-base font-extrabold text-text-primary group-hover:text-primary-text transition-colors duration-150 tracking-tight">
                          {m.title}
                        </h2>
                      </div>

                      <p className="text-xs text-text-secondary mt-1.5 leading-relaxed line-clamp-3">
                        {m.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border flex items-center justify-between text-xs font-bold text-primary-text">
                      <span className="text-text-secondary font-medium text-[11px] truncate max-w-[130px]">
                        {m.stats}
                      </span>
                      <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-150">
                        <span>Mulai</span>
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
            className="p-4 sm:p-5 border border-primary/30 bg-pastel-green/20 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 shadow-card"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-primary-gradient text-on-primary flex items-center justify-center shrink-0 shadow-subtle">
                <PlayCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-text-primary">
                    Video Kajian YouTube Ustadz Terverifikasi
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-pill bg-primary-gradient text-on-primary">
                    Streaming
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  Tonton ceramah aqidah, fiqih ibadah, dan tafsir langsung di aplikasi tanpa membuka YouTube.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-extrabold text-primary-text px-4 py-2 rounded-pill bg-surface border border-border hover:border-primary transition-colors shadow-subtle active:scale-95"
            >
              <span>Buka Video</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Card>

          {/* Mutiara Nasihat Belajar */}
          <Card className="p-5 border border-border bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-pastel-yellow text-warning flex items-center justify-center shrink-0 mt-0.5 shadow-subtle">
                <Sparkles className="w-5 h-5 fill-warning" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-warning block">
                  Mutiara Hadits
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-text-primary mt-0.5 leading-snug">
                  &ldquo;Sebaik-baik kalian adalah orang yang belajar Al-Qur&apos;an dan mengajarkannya.&rdquo;
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  HR. Bukhari no. 5027 dari sahabat Utsman bin Affan radhiyallahu &apos;anhu.
                </p>
              </div>
            </div>

            <Link
              href="/tajwid/"
              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-extrabold text-primary-text px-4 py-2 rounded-pill bg-surface-alt border border-border hover:border-primary transition-colors active:scale-95 shadow-subtle"
            >
              <span>Belajar Tajwid</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        </div>
      )}

      {/* Konten Tab Kajian Video */}
      {activeTab === 'kajian' && (
        <div className="animate-fade-in">
          <VideoListView embedded />
        </div>
      )}
    </div>
  );
}
