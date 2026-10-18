'use client';

import * as React from 'react';
import type { SurahSummary, JuzItem } from '../types';
import { SearchBar } from '@/components/ui/SearchBar';
import { Tabs } from '@/components/ui/Tabs';
import { SurahCard } from './SurahCard';
import { JuzList } from './JuzList';
import { EmptyState } from '@/components/ui/EmptyState';
import { BookOpen } from 'lucide-react';
import { db } from '@/lib/db';

export function QuranIndexView({
  initialSurahs,
  juzList,
}: {
  initialSurahs: SurahSummary[];
  juzList: JuzItem[];
}) {
  const [activeTab, setActiveTab] = React.useState('surah');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Handle PWA shortcut: /quran/?lanjut=1
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('lanjut') === '1') {
        db.lastRead.orderBy('timestamp').last().then((last) => {
          if (last && last.surahNumber) {
            window.location.replace(`/quran/${last.surahNumber}/#ayah-${last.ayahNumber}`);
          }
        });
      }
    }
  }, []);

  const tabs = [
    { id: 'surah', label: 'Daftar Surah', count: 114 },
    { id: 'juz', label: '30 Juz', count: 30 },
  ];

  const filteredSurahs = React.useMemo(() => {
    if (!searchQuery.trim()) return initialSurahs;
    const q = searchQuery.toLowerCase().trim();
    return initialSurahs.filter((s) => {
      const matchName = s.nameLatin.toLowerCase().includes(q);
      const matchArabic = s.nameArabic.includes(q);
      const matchMeaning = s.meaning.toLowerCase().includes(q);
      const matchNumber = String(s.number) === q;
      return matchName || matchArabic || matchMeaning || matchNumber;
    });
  }, [initialSurahs, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          Al-Qur'an Al-Karim
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          114 Surah · 30 Juz · Mushaf Standar Kementerian Agama Republik Indonesia
        </p>
      </div>

      {/* Baris Pencarian & Tab Switcher */}
      <div className="space-y-3">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Cari surah (mis. Al-Baqarah, Yasin, 36, pembukaan)..."
        />

        <div className="flex items-center justify-between">
          <Tabs
            items={tabs}
            activeId={activeTab}
            onChange={setActiveTab}
          />
          <span className="text-xs text-text-secondary font-medium">
            {activeTab === 'surah'
              ? `${filteredSurahs.length} Surah ditemukan`
              : '30 Juz Lengkap'}
          </span>
        </div>
      </div>

      {/* Konten Tab */}
      {activeTab === 'surah' ? (
        filteredSurahs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredSurahs.map((surah) => (
              <SurahCard key={surah.number} surah={surah} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen className="w-6 h-6 text-text-secondary" />}
            title="Surah Tidak Ditemukan"
            description={`Tidak ada surah yang cocok dengan kata kunci "${searchQuery}". Silakan coba kata kunci lain.`}
            actionLabel="Reset Pencarian"
            onAction={() => setSearchQuery('')}
          />
        )
      ) : (
        <JuzList juzList={juzList} surahs={initialSurahs} />
      )}
    </div>
  );
}
