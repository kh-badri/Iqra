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
          className="group block"
        >
          <Card hoverable className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-card bg-primary-soft text-primary font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                {j.juz}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                  {j.name}
                </h4>
                <p className="text-xs text-text-secondary mt-0.5 truncate">
                  Mulai dari {getSurahName(j.startSurah)}: {j.startAyat} s.d.{' '}
                  {getSurahName(j.endSurah)}: {j.endAyat}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-primary flex-shrink-0" />
          </Card>
        </Link>
      ))}
    </div>
  );
}
