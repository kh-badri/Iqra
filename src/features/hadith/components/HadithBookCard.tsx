import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ArrowRight, BookOpen } from 'lucide-react';
import type { HadithBook } from '../types';

export function HadithBookCard({ book }: { book: HadithBook }) {
  return (
    <Link href={`/hadits/${book.id}/`} className="group block select-none">
      <Card hoverable className="p-5 sm:p-6 h-full flex flex-col justify-between bg-surface border border-border shadow-card hover:border-primary/40 transition-all duration-200">
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="w-12 h-12 rounded-full bg-pastel-purple text-pastel-purple-text flex items-center justify-center font-bold text-sm shadow-subtle group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-1.5">
              <Chip variant="pastel-green" className="text-[10px] py-0.5 px-2 font-bold">
                {book.grade}
              </Chip>
              <Chip variant="secondary" className="text-[10px] py-0.5 px-2 font-bold">
                {book.totalHadiths} Hadits
              </Chip>
            </div>
          </div>

          <div dir="rtl" className="font-arabic text-xl sm:text-2xl font-bold text-text-primary group-hover:text-primary-text transition-colors text-right my-1 leading-relaxed">
            {book.arabicName}
          </div>

          <h3 className="text-base sm:text-lg font-extrabold text-text-primary group-hover:text-primary-text transition-colors tracking-tight">
            {book.name}
          </h3>
          <p className="text-xs text-primary-text font-bold mt-0.5">
            {book.author}
          </p>
          <p className="text-xs text-text-secondary mt-2 line-clamp-3 leading-relaxed">
            {book.description}
          </p>
        </div>

        <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between text-xs font-extrabold text-primary-text">
          <span>Buka Kitab</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Card>
    </Link>
  );
}
