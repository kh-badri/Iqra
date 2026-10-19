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
  const isBookmarked = Boolean(bookmarks && bookmarks.length > 0);

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
    <Card id={`hadith-${hadith.number}`} className="p-5 sm:p-6 space-y-4 bg-surface border-border shadow-card">
      {/* Header Hadits: Nomor, Derajat & Perawi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-pastel-purple text-pastel-purple-text font-black text-xs flex items-center justify-center font-mono shadow-subtle">
            {hadith.number}
          </div>
          <div>
            <span className="text-xs sm:text-sm font-extrabold text-text-primary tracking-tight">
              {hadith.bookName} No. {hadith.number}
            </span>
            <div className="text-[11px] text-text-secondary flex items-center gap-1 mt-0.5 font-medium">
              <User className="w-3.5 h-3.5 text-primary-text inline" />
              <span>Perawi: {hadith.narrator}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Chip variant="pastel-green" className="text-[10px] py-0.5 px-2 font-bold">
            {hadith.grade}
          </Chip>
        </div>
      </div>

      {/* Teks Arab Hadits */}
      <div className="text-right py-2">
        <p
          dir="rtl"
          className="font-arabic text-xl sm:text-2xl text-text-primary leading-[2.2] select-text font-medium"
        >
          {hadith.arabic}
        </p>
      </div>

      {/* Terjemahan Bahasa Indonesia */}
      <div className="text-left">
        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed select-text italic">
          &ldquo;{hadith.translation}&rdquo;
        </p>
      </div>

      {/* Footer Aksi (min 44x44px touch targets) */}
      <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="text-[11px] text-text-muted font-medium">
          Sumber rujukan: {hadith.sourceRef} (Kitab Induk)
        </span>

        <div className="flex items-center gap-1 self-end sm:self-auto">
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
      </div>
    </Card>
  );
}
