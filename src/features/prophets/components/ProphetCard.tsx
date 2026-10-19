'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import type { Prophet } from '../types';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface ProphetCardProps {
  prophet: Prophet;
}

export const ProphetCard: React.FC<ProphetCardProps> = ({ prophet }) => {
  const isBookmarked = useLiveQuery(
    () => db.bookmarks.where('refId').equals(`prophet-${prophet.slug}`).first(),
    [prophet.slug]
  );

  const isCompleted = useLiveQuery(
    () => db.prophetProgress.where('slug').equals(prophet.slug).first(),
    [prophet.slug]
  );

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBookmarked && isBookmarked.id) {
      await db.bookmarks.delete(isBookmarked.id);
    } else {
      await db.bookmarks.add({
        type: 'prophet',
        refId: `prophet-${prophet.slug}`,
        title: prophet.name,
        subtitle: `${prophet.era} · ${prophet.place}`,
        extraData: { slug: prophet.slug, order: prophet.order, arabicName: prophet.arabicName },
        createdAt: Date.now(),
      });
    }
  };

  return (
    <Link href={`/kisah-nabi/${prophet.slug}/`} className="block group select-none">
      <Card
        hoverable
        className="p-5 h-full flex flex-col justify-between border border-border hover:border-primary/40 bg-surface shadow-card rounded-card transition-all duration-200 active:scale-[0.98]"
      >
        <div>
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-pastel-pink text-[#8A1846] border border-pastel-pink/40 font-bold text-xs flex items-center justify-center shrink-0 shadow-subtle tabular-nums">
                {prophet.order}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-text-muted bg-surface-2 px-2.5 py-0.5 rounded-full border border-border">
                  Nabi ke-{prophet.order}
                </span>
                {isCompleted?.read && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-pastel-green px-2.5 py-0.5 rounded-full border border-pastel-green/40">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Selesai
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={toggleBookmark}
              type="button"
              aria-label={isBookmarked ? 'Hapus bookmark kisah nabi' : 'Bookmark kisah nabi'}
              className="w-10 h-10 rounded-full text-text-muted hover:text-warning hover:bg-surface-2 flex items-center justify-center transition-colors duration-150 active:scale-90"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isBookmarked ? 'fill-warning text-warning' : ''
                }`}
              />
            </button>
          </div>

          {/* Name & Arabic calligraphy */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <h3 className="text-base font-bold text-text-primary group-hover:text-primary-text transition-colors leading-snug">
              {prophet.name}
            </h3>
            <span className="font-arabic text-xl text-primary font-normal shrink-0">
              {prophet.arabicName}
            </span>
          </div>

          {/* Summary */}
          <p className="text-xs text-text-muted line-clamp-3 leading-relaxed mb-4">
            {prophet.summary}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-1.5 truncate max-w-[65%]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-primary-text" />
            <span className="truncate">{prophet.place}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 tabular-nums">
            <Clock className="w-3.5 h-3.5 text-text-muted" />
            <span>{prophet.readingTimeMinutes} mnt baca</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
