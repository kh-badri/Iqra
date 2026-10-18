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
    <Card className="p-5 space-y-4 bg-surface border-border shadow-subtle">
      {/* Header Hadits Harian */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Hadits Hari Ini
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Chip variant="primary" className="text-[10px] py-0.5 px-2 bg-success text-white border-transparent">
            {hadith.grade}
          </Chip>
          <Chip variant="outline" className="text-[10px] py-0.5 px-2">
            {hadith.sourceRef}
          </Chip>
        </div>
      </div>

      {/* Perawi */}
      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
        <User className="w-3.5 h-3.5 text-primary" />
        <span className="font-semibold text-text-primary">Perawi:</span>
        <span>{hadith.narrator}</span>
      </div>

      {/* Teks Arab Hadits */}
      <p
        dir="rtl"
        className="font-arabic text-xl sm:text-2xl text-right leading-loose text-text-primary select-text"
      >
        {hadith.arabic}
      </p>

      {/* Terjemahan */}
      <p className="text-xs sm:text-sm text-text-secondary italic leading-relaxed select-text">
        "{hadith.translation}"
      </p>

      {/* Footer Aksi */}
      <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleBookmark}
            className="h-8 px-2 text-xs gap-1"
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${
                isBookmarked ? 'fill-accent text-accent' : 'text-text-secondary'
              }`}
            />
            <span>{isBookmarked ? 'Tersimpan' : 'Bookmark'}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 px-2 text-xs gap-1"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-success" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-text-secondary" />
            )}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-8 px-2 text-xs gap-1 text-primary"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan</span>
          </Button>
        </div>

        <Link href={`/hadits/${hadith.book}/`}>
          <Button variant="ghost" size="sm" className="text-xs text-primary gap-1">
            <span>Pelajari Lebih Lanjut</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
