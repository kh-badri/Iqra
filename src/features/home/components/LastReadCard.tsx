'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function LastReadCard() {
  const lastReadList = useLiveQuery(() => db.lastRead.toArray(), []);
  const lastRead = lastReadList && lastReadList.length > 0 ? lastReadList[0] : null;

  return (
    <Card className="p-4 sm:p-5 bg-surface border-border hover:border-primary/40 transition-all duration-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative w-12 h-12 rounded-full bg-pastel-green text-primary-text flex items-center justify-center flex-shrink-0 shadow-subtle">
          <BookOpen className="w-5 h-5 stroke-[2.2]" />
          {lastRead && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-success ring-2 ring-surface flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </span>
          )}
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-extrabold text-primary-text uppercase tracking-wider block">
            Terakhir Dibaca
          </span>
          {lastRead ? (
            <h3 className="text-sm sm:text-base font-extrabold text-text-primary mt-0.5 truncate tracking-tight">
              {lastRead.surahName}{' '}
              <span className="text-warning font-extrabold">: Ayat {lastRead.ayahNumber}</span>
            </h3>
          ) : (
            <h3 className="text-sm sm:text-base font-bold text-text-primary mt-0.5">
              Al-Fatihah <span className="text-text-secondary font-normal">: Belum dimulai</span>
            </h3>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end flex-shrink-0">
        {lastRead ? (
          <Link href={`/quran/${lastRead.surahNumber}/#ayah-${lastRead.ayahNumber}`} className="w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full sm:w-auto gap-1.5 text-xs font-extrabold h-10 px-5 rounded-pill shadow-subtle">
              <span>Lanjut Membaca</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        ) : (
          <Link href="/quran/1/" className="w-full sm:w-auto">
            <Button variant="secondary" size="sm" className="w-full sm:w-auto gap-1.5 text-xs font-bold h-10 px-5 rounded-pill">
              <span>Mulai Membaca</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
