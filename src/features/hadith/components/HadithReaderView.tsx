'use client';

import * as React from 'react';
import type { HadithBook, HadithItem } from '../types';
import { HadithCard } from './HadithCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { BookOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export interface HadithReaderViewProps {
  book: HadithBook;
  initialChunk: HadithItem[];
}

export function HadithReaderView({ book, initialChunk }: HadithReaderViewProps) {
  const [activeChunk, setActiveChunk] = React.useState<number>(1);
  const [hadiths, setHadiths] = React.useState<HadithItem[]>(initialChunk);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const chunkTabs = Array.from({ length: book.totalChunks }, (_, i) => {
    const start = i * 100 + 1;
    const end = (i + 1) * 100;
    return {
      id: String(i + 1),
      label: `Hadits ${start} - ${end}`,
    };
  });

  const handleTabChange = async (tabId: string) => {
    const chunkNum = Number(tabId);
    setActiveChunk(chunkNum);
    setIsLoading(true);
    try {
      const res = await fetch(`/data/hadith/${book.id}/chunk-${chunkNum}.json`);
      if (res.ok) {
        const data = await res.json();
        setHadiths(data);
      }
    } catch (e) {
      console.warn('Gagal memuat chunk hadits:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHadiths = React.useMemo(() => {
    if (!searchQuery.trim()) return hadiths;
    const q = searchQuery.toLowerCase().trim();
    return hadiths.filter((h) => {
      const matchNum = String(h.number) === q;
      const matchNarrator = h.narrator.toLowerCase().includes(q);
      const matchText = h.translation.toLowerCase().includes(q);
      return matchNum || matchNarrator || matchText;
    });
  }, [hadiths, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Navigasi */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/hadits/"
            className="w-10 h-10 rounded-full bg-surface border border-border hover:bg-surface-2 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px] active:scale-95 shadow-subtle"
            aria-label="Kembali ke Daftar Kitab"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </Link>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-text-primary flex items-center gap-2 tracking-tight">
              <span>{book.name}</span>
              <span dir="rtl" className="font-arabic text-primary font-bold text-base sm:text-lg leading-relaxed">
                ({book.arabicName})
              </span>
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              {book.author} · {book.totalHadiths} Hadits Shahih
            </p>
          </div>
        </div>

        <Chip variant="primary" className="bg-pastel-green text-[#266308] border border-pastel-green/40 text-xs py-1 px-3 font-bold rounded-full">
          {book.grade}
        </Chip>
      </div>

      {/* Hero Kitab Card */}
      <Card className="p-5 sm:p-6 bg-surface border border-border shadow-card rounded-card">
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          {book.description}
        </p>
      </Card>

      {/* Kontrol Pencarian & Pilihan Bagian (Chunk) */}
      <div className="space-y-3">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder={`Cari nomor atau kata pada ${book.name} (mis. niat, sholat, wudhu)...`}
        />

        <div className="flex items-center justify-between overflow-x-auto pb-1">
          <Tabs
            items={chunkTabs}
            activeId={String(activeChunk)}
            onChange={handleTabChange}
          />
          <span className="text-xs text-text-secondary font-medium whitespace-nowrap ml-3">
            {filteredHadiths.length} Hadits Tampil
          </span>
        </div>
      </div>

      {/* Daftar Hadits atau Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="p-5 space-y-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-12 w-full" />
            </Card>
          ))}
        </div>
      ) : filteredHadiths.length > 0 ? (
        <div className="space-y-4">
          {filteredHadiths.map((item) => (
            <HadithCard key={item.id} hadith={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<BookOpen className="w-6 h-6 text-text-secondary" />}
          title="Hadits Tidak Ditemukan"
          description={`Tidak ditemukan hadits dengan kata kunci "${searchQuery}" pada bagian ini.`}
          actionLabel="Reset Pencarian"
          onAction={() => setSearchQuery('')}
        />
      )}
    </div>
  );
}
