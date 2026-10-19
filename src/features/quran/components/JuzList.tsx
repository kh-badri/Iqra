import Link from 'next/link';
import type { JuzItem, SurahSummary } from '../types';
import { Card } from '@/components/ui/Card';
import { ChevronRight } from 'lucide-react';

export function JuzList({
  juzList,
  surahs,
}: {
  juzList: JuzItem[];
  surahs: SurahSummary[];
}) {
  const getSurahName = (num: number) => {
    const s = surahs.find((item) => item.number === num);
    return s ? s.nameLatin : `Surah ${num}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {juzList.map((j) => (
        <Link
          key={j.juz}
          href={`/quran/${j.startSurah}/#ayah-${j.startAyat}`}
          className="group block select-none"
        >
          <Card hoverable className="p-4 flex items-center justify-between bg-surface border border-border shadow-card hover:border-primary/40 transition-all duration-200">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-full bg-pastel-cyan text-pastel-cyan-text font-extrabold text-xs flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-subtle font-mono">
                {j.juz}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-extrabold text-text-primary group-hover:text-primary-text transition-colors tracking-tight">
                  {j.name}
                </h4>
                <p className="text-xs text-text-secondary mt-0.5 truncate font-medium">
                  Mulai dari {getSurahName(j.startSurah)}: {j.startAyat} s.d.{' '}
                  {getSurahName(j.endSurah)}: {j.endAyat}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-primary-text group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </Card>
        </Link>
      ))}
    </div>
  );
}
