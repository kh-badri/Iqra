import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ArrowRight, BookOpen } from 'lucide-react';
import type { HadithBook } from '../types';

export function HadithBookCard({ book }: { book: HadithBook }) {
  return (
    <Link href={`/hadits/${book.id}/`} className="group block">
      <Card hoverable className="p-5 h-full flex flex-col justify-between bg-surface">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-card bg-primary-soft text-primary flex items-center justify-center font-bold text-sm shadow-subtle group-hover:bg-primary group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <Chip variant="primary" className="text-[10px] py-0.5 px-2 bg-success text-white border-transparent">
                {book.grade}
              </Chip>
              <Chip variant="secondary" className="text-[10px] py-0.5 px-2">
                {book.totalHadiths} Hadits
              </Chip>
            </div>
          </div>

          <div className="font-arabic text-xl font-bold text-accent group-hover:text-primary transition-colors text-right my-1">
            {book.arabicName}
          </div>

          <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors">
            {book.name}
          </h3>
          <p className="text-[11px] text-primary font-medium mt-0.5">
            {book.author}
          </p>
          <p className="text-xs text-text-secondary mt-2 line-clamp-3 leading-relaxed">
            {book.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
          <span>Buka Kitab</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </Card>
    </Link>
  );
}
