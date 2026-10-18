'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { getHadithBooks, getHadithChunk } from '@/features/hadith/services/hadithService';
import type { HadithBook, HadithItem } from '@/features/hadith/types';
import { HadithCard } from '@/features/hadith/components/HadithCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';

function HadithBacaContent() {
  const searchParams = useSearchParams();
  const kitab = searchParams.get('kitab') || 'bukhari';
  const no = Number(searchParams.get('no')) || 1;

  const [hadith, setHadith] = React.useState<HadithItem | null>(null);
  const [book, setBook] = React.useState<HadithBook | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const books = await getHadithBooks();
        const currentBook = books.find((b) => b.id === kitab) || books[0];
        setBook(currentBook);

        // Tentukan chunk mana yang memuat nomor hadits ini
        const chunkIndex = Math.ceil(no / 100) || 1;
        const chunk = await getHadithChunk(currentBook.id, chunkIndex);
        const found = chunk.find((h) => h.number === no) || chunk[0] || null;
        setHadith(found);
      } catch (e) {
        console.warn('Gagal memuat hadits:', e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [kitab, no]);

  return (
    <div className="space-y-6 max-w-reading mx-auto animate-in fade-in duration-200">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Link
          href={`/hadits/${kitab}/`}
          className="p-2 rounded-card bg-surface border border-border hover:bg-surface-alt transition-colors"
          aria-label="Kembali ke Daftar Hadits"
        >
          <ArrowLeft className="w-4 h-4 text-text-primary" />
        </Link>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-text-primary">
            {book?.name || 'Hadits'} No. {no}
          </h1>
          <p className="text-[11px] text-text-secondary">
            Rujukan resmi kitab induk derajat Shahih
          </p>
        </div>
      </div>

      {isLoading ? (
        <Card className="p-5 space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
        </Card>
      ) : hadith ? (
        <div className="space-y-4">
          <HadithCard hadith={hadith} />

          {/* Navigasi nomor sebelum/berikut */}
          <div className="flex items-center justify-between pt-2">
            {no > 1 ? (
              <Link href={`/hadits/baca/?kitab=${kitab}&no=${no - 1}`}>
                <Button variant="secondary" size="sm" className="text-xs">
                  ← Hadits Sebelumnya
                </Button>
              </Link>
            ) : (
              <div />
            )}

            <Link href={`/hadits/baca/?kitab=${kitab}&no=${no + 1}`}>
              <Button variant="secondary" size="sm" className="text-xs">
                Hadits Selanjutnya →
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<BookOpen className="w-6 h-6 text-text-secondary" />}
          title="Hadits Tidak Ditemukan"
          description={`Nomor hadits ${no} pada kitab ${kitab} tidak ditemukan atau belum tersedia.`}
          actionLabel="Kembali ke Kitab"
          onAction={() => window.history.back()}
        />
      )}
    </div>
  );
}

export default function HadithBacaPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-6">
          <Skeleton className="h-40 w-full" />
        </div>
      }
    >
      <HadithBacaContent />
    </React.Suspense>
  );
}
