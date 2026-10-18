'use client';

import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Bookmark, Copy, Share2, Check, User } from 'lucide-react';
import type { HadithItem } from '../types';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export interface HadithCardProps {
  hadith: HadithItem;
  highlightQuery?: string;
}

export function HadithCard({ hadith }: HadithCardProps) {
  const [copied, setCopied] = React.useState(false);

  // Check if bookmarked in Dexie
  const bookmarks = useLiveQuery(
    () => db.bookmarks.where('refId').equals(`hadith-${hadith.id}`).toArray(),
    [hadith.id]
  );
  const isBookmarked = bookmarks && bookmarks.length > 0;

  const handleToggleBookmark = async () => {
    const ref = `hadith-${hadith.id}`;
    if (isBookmarked && bookmarks[0].id) {
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

  return (
    <Card id={`hadith-${hadith.number}`} className="p-5 space-y-4 bg-surface border-border">
      {/* Header Hadits: Nomor, Derajat & Perawi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-accent bg-accent/10 text-accent font-bold text-xs flex items-center justify-center font-mono">
            {hadith.number}
          </div>
          <div>
            <span className="text-xs font-bold text-text-primary">
              {hadith.bookName} No. {hadith.number}
            </span>
            <div className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5">
              <User className="w-3 h-3 text-primary inline" />
              <span>Perawi: {hadith.narrator}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Chip variant="primary" className="text-[10px] py-0.5 px-2 bg-success text-white border-transparent">
            {hadith.grade}
          </Chip>
        </div>
      </div>

      {/* Teks Arab Hadits */}
      <div className="text-right py-2">
        <p
          dir="rtl"
          className="font-arabic text-xl sm:text-2xl text-text-primary leading-[2.2] select-text"
        >
          {hadith.arabic}
        </p>
      </div>

      {/* Terjemahan Bahasa Indonesia */}
      <div className="text-left">
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed select-text italic">
          "{hadith.translation}"
        </p>
      </div>

      {/* Footer Aksi & Atribusi Sumber Resmi */}
      <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="text-[11px] text-text-secondary font-medium">
          Sumber rujukan: {hadith.sourceRef} (Kitab Induk)
        </span>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleBookmark}
            className="h-8 px-2.5 text-xs gap-1.5"
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
            className="h-8 px-2.5 text-xs gap-1.5"
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
            className="h-8 px-2.5 text-xs gap-1.5 text-primary"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
