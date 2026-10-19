'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Sparkles, ArrowRight, Bookmark, Copy, Share2, Check, User } from 'lucide-react';
import type { HadithItem } from '../types';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export function HadithDailyCard({ hadith }: { hadith: HadithItem | null }) {
  const [copied, setCopied] = React.useState(false);

  const bookmarks = useLiveQuery(
    () => (hadith ? db.bookmarks.where('refId').equals(`hadith-${hadith.id}`).toArray() : []),
    [hadith?.id]
  );
  const isBookmarked = Boolean(bookmarks && bookmarks.length > 0);

  if (!hadith) return null;

  const formattedShareText = `${hadith.arabic}\n\n"${hadith.translation}"\n\n(HR. ${hadith.sourceRef} - Derajat: ${hadith.grade})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedShareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `HR. ${hadith.sourceRef}`,
          text: formattedShareText,
          url: window.location.href,
        });
      } catch (e) {}
    } else {
      handleCopy();
    }
  };

  const handleToggleBookmark = async () => {
    const ref = `hadith-${hadith.id}`;
    if (isBookmarked && bookmarks && bookmarks[0]?.id) {
      await db.bookmarks.delete(bookmarks[0].id);
    } else {
      await db.bookmarks.add({
        type: 'hadith',
        refId: ref,
        title: `${hadith.bookName} No. ${hadith.number}`,
        subtitle: hadith.translation,
        extraData: {
          bookId: hadith.book,
          number: hadith.number,
          arabic: hadith.arabic,
          narrator: hadith.narrator,
        },
        createdAt: Date.now(),
      });
    }
  };

  return (
    <Card className="p-5 sm:p-6 space-y-4 bg-surface border-border shadow-card">
      {/* Header Hadits Harian */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-pastel-yellow flex items-center justify-center text-warning">
            <Sparkles className="w-4 h-4 fill-warning" />
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-warning">
            Hadits Hari Ini
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Chip variant="pastel-green" className="text-[10px] py-0.5 px-2 font-bold">
            {hadith.grade}
          </Chip>
          <Chip variant="outline" className="text-[10px] py-0.5 px-2 font-bold">
            {hadith.sourceRef}
          </Chip>
        </div>
      </div>

      {/* Perawi */}
      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
        <User className="w-3.5 h-3.5 text-primary-text" />
        <span className="font-bold text-text-primary">Perawi:</span>
        <span className="font-medium">{hadith.narrator}</span>
      </div>

      {/* Teks Arab Hadits */}
      <p
        dir="rtl"
        className="font-arabic text-xl sm:text-2xl text-right leading-loose text-text-primary select-text font-medium"
      >
        {hadith.arabic}
      </p>

      {/* Terjemahan */}
      <p className="text-xs sm:text-sm text-text-secondary italic leading-relaxed select-text">
        "{hadith.translation}"
      </p>

      {/* Footer Aksi (min 44px touch targets) */}
      <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleBookmark}
            className="min-h-[44px] min-w-[44px] px-3 rounded-button text-xs font-semibold flex items-center gap-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-alt active:scale-95 transition-all"
          >
            <Bookmark
              className={`w-4 h-4 ${
                isBookmarked ? 'fill-warning text-warning' : 'text-text-secondary'
              }`}
            />
            <span>{isBookmarked ? 'Tersimpan' : 'Bookmark'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="min-h-[44px] min-w-[44px] px-3 rounded-button text-xs font-semibold flex items-center gap-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-alt active:scale-95 transition-all"
          >
            {copied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4 text-text-secondary" />
            )}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="min-h-[44px] min-w-[44px] px-3 rounded-button text-xs font-semibold flex items-center gap-1.5 text-primary-text hover:bg-surface-alt active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan</span>
          </button>
        </div>

        <Link href={`/hadits/${hadith.book}/`}>
          <Button variant="ghost" size="sm" className="text-xs font-bold text-primary-text gap-1 rounded-pill">
            <span>Pelajari Lebih Lanjut</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
