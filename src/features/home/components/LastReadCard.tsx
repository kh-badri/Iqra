'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, ArrowRight } from 'lucide-react';

export function LastReadCard() {
  const lastReadList = useLiveQuery(() => db.lastRead.toArray(), []);
  const lastRead = lastReadList && lastReadList.length > 0 ? lastReadList[0] : null;

  return (
    <Card className="p-4 sm:p-5 bg-surface border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-card bg-primary-soft text-primary flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
            Terakhir Dibaca
          </span>
          {lastRead ? (
            <h3 className="text-sm sm:text-base font-bold text-text-primary mt-0.5">
              {lastRead.surahName} <span className="text-accent font-normal">: Ayat {lastRead.ayahNumber}</span>
            </h3>
          ) : (
            <h3 className="text-sm sm:text-base font-bold text-text-primary mt-0.5">
              Al-Fatihah <span className="text-text-secondary font-normal">: Belum dimulai</span>
            </h3>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end">
        {lastRead ? (
          <Link href={`/quran/${lastRead.surahNumber}/#ayah-${lastRead.ayahNumber}`}>
            <Button variant="primary" size="sm" className="gap-1.5 text-xs">
              <span>Lanjut Baca</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        ) : (
          <Link href="/quran/1/">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <span>Mulai Membaca</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
