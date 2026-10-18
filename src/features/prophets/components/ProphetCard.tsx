'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';
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
    <Link href={`/kisah-nabi/${prophet.slug}/`} className="block group">
      <Card
        hoverable
        className="p-5 h-full flex flex-col justify-between border border-border transition-all duration-200"
      >
        <div>
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-accent/15 text-accent border border-accent/30 font-bold text-xs flex items-center justify-center shrink-0">
                {prophet.order}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <Chip variant="secondary" className="text-[10px] py-0.5 px-2">
                  Nabi ke-{prophet.order}
                </Chip>
                {isCompleted?.read && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Dibaca
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={toggleBookmark}
              type="button"
              aria-label={isBookmarked ? 'Hapus bookmark kisah nabi' : 'Bookmark kisah nabi'}
              className="p-1.5 rounded-full text-text-secondary hover:text-accent hover:bg-surface-alt transition-colors"
            >
              <Bookmark
                className={`w-4 h-4 ${
                  isBookmarked ? 'fill-accent text-accent' : ''
                }`}
              />
            </button>
          </div>

          {/* Name & Arabic calligraphy placeholder */}
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <h3 className="text-base sm:text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
              {prophet.name}
            </h3>
            <span className="font-arabic text-lg sm:text-xl text-primary font-normal shrink-0">
              {prophet.arabicName}
            </span>
          </div>

          {/* Summary */}
          <p className="text-xs sm:text-sm text-text-secondary line-clamp-3 leading-relaxed mb-4">
            {prophet.summary}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-text-secondary">
          <div className="flex items-center gap-1.5 truncate max-w-[65%]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-text-secondary" />
            <span className="truncate">{prophet.place}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5 text-text-secondary" />
            <span>{prophet.readingTimeMinutes} mnt baca</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
