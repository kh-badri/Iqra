import Link from 'next/link';
import type { SurahSummary } from '../types';
import { Card } from '@/components/ui/Card';

export function SurahCard({ surah }: { surah: SurahSummary }) {
  const isMakkiyah = surah.revelation.toUpperCase() === 'MAKKIYYAH';

  return (
    <Link href={`/quran/${surah.number}/`} className="group block select-none">
      <Card
        hoverable
        className="p-3.5 sm:p-4 flex items-center justify-between gap-3 bg-surface border border-border hover:border-primary/40 transition-all duration-200 shadow-card"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Circular Surah Number Badge with Pastel Green Background */}
          <div className="w-11 h-11 rounded-full bg-pastel-green text-primary-text flex-shrink-0 flex items-center justify-center font-bold text-xs font-mono shadow-subtle group-hover:scale-105 transition-transform">
            {surah.number}
          </div>

          {/* Nama Latin & Info Surah */}
          <div className="min-w-0">
            <h3 className="text-sm font-extrabold text-text-primary group-hover:text-primary-text transition-colors duration-150 truncate leading-snug tracking-tight">
              {surah.nameLatin}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-text-secondary mt-0.5 truncate">
              <span className="truncate">{surah.meaning}</span>
              <span className="text-border">•</span>
              <span className="whitespace-nowrap font-semibold">{surah.numberOfAyahs} Ayat</span>
            </div>
          </div>
        </div>

        {/* Nama Arab & Tempat Turun */}
        <div className="text-right flex-shrink-0">
          <div className="font-arabic text-xl sm:text-2xl font-bold text-text-primary group-hover:text-primary-text transition-colors duration-150 leading-tight">
            {surah.nameArabic}
          </div>
          <div className="mt-1">
            <span
              className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-pill ${
                isMakkiyah
                  ? 'bg-pastel-yellow text-[#8A5E06] dark:text-[#FFE082]'
                  : 'bg-pastel-blue text-pastel-blue-text'
              }`}
            >
              {surah.revelation}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
