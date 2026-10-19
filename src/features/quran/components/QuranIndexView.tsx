'use client';

import * as React from 'react';
import type { SurahSummary, JuzItem } from '../types';
import { SearchBar } from '@/components/ui/SearchBar';
import { Tabs } from '@/components/ui/Tabs';
import { Chip } from '@/components/ui/Chip';
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
  const [revelationFilter, setRevelationFilter] = React.useState<'all' | 'makkiyah' | 'madaniyah'>('all');

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
    let result = initialSurahs;

    if (revelationFilter !== 'all') {
      result = result.filter(
        (s) => s.revelation.toLowerCase() === revelationFilter
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((s) => {
        const matchName = s.nameLatin.toLowerCase().includes(q);
        const matchArabic = s.nameArabic.includes(q);
        const matchMeaning = s.meaning.toLowerCase().includes(q);
        const matchNumber = String(s.number) === q;
        return matchName || matchArabic || matchMeaning || matchNumber;
      });
    }

    return result;
  }, [initialSurahs, searchQuery, revelationFilter]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Info */}
      <div className="border-b border-border/80 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
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
          placeholder="Cari surah (mis. Al-Baqarah, Yasin, 36)..."
        />

        {/* Filter Chips: Semua, Makkiyah, Madaniyah */}
        {activeTab === 'surah' && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <Chip
              active={revelationFilter === 'all'}
              clickable
              onClick={() => setRevelationFilter('all')}
            >
              Semua Surah (114)
            </Chip>
            <Chip
              active={revelationFilter === 'makkiyah'}
              clickable
              onClick={() => setRevelationFilter('makkiyah')}
              variant="pastel-yellow"
            >
              Makkiyah (86)
            </Chip>
            <Chip
              active={revelationFilter === 'madaniyah'}
              clickable
              onClick={() => setRevelationFilter('madaniyah')}
              variant="pastel-blue"
            >
              Madaniyah (28)
            </Chip>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <Tabs
            items={tabs}
            activeId={activeTab}
            onChange={setActiveTab}
          />
          <span className="text-xs text-text-secondary font-semibold">
            {activeTab === 'surah'
              ? `${filteredSurahs.length} Surah`
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
            icon={<BookOpen className="w-6 h-6 text-primary-text" />}
            title="Surah Tidak Ditemukan"
            description={`Tidak ada surah yang cocok dengan pencarian "${searchQuery}". Silakan periksa kembali ejaan kata kunci.`}
            actionLabel="Reset Pencarian"
            onAction={() => {
              setSearchQuery('');
              setRevelationFilter('all');
            }}
          />
        )
      ) : (
        <JuzList juzList={juzList} surahs={initialSurahs} />
      )}
    </div>
  );
}
