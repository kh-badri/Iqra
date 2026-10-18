import Link from 'next/link';
import type { SurahSummary } from '../types';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';

export function SurahCard({ surah }: { surah: SurahSummary }) {
  return (
    <Link href={`/quran/${surah.number}/`} className="group block">
      <Card
        hoverable
        className="p-4 flex items-center justify-between gap-3 bg-surface"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Nomor Surah */}
          <div className="w-10 h-10 rounded-card bg-surface-alt border border-border flex items-center justify-center font-bold text-xs text-text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors flex-shrink-0">
            {surah.number}
          </div>

          {/* Nama Latin & Info */}
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors truncate">
              {surah.nameLatin}
            </h3>
            <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5 truncate">
              <span>{surah.meaning}</span>
              <span>•</span>
              <span>{surah.numberOfAyahs} Ayat</span>
            </div>
          </div>
        </div>

        {/* Nama Arab & Badge */}
        <div className="text-right flex-shrink-0">
          <div className="font-arabic text-xl font-bold text-accent group-hover:text-primary transition-colors">
            {surah.nameArabic}
          </div>
          <div className="text-[10px] text-text-secondary uppercase tracking-wider mt-0.5">
            {surah.revelation}
          </div>
        </div>
      </Card>
    </Link>
  );
}
