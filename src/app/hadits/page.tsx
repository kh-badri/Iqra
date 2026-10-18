import { getHadithBooks } from '@/features/hadith/services/hadithService';
import { HadithBookCard } from '@/features/hadith/components/HadithBookCard';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ShieldCheck, BookOpen, Search } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Belajar Hadits Shahih - Bukhari & Muslim - Iqra',
  description:
    'Kumpulan hadits shahih dari kitab induk Shahih Bukhari dan Shahih Muslim dengan teks Arab, perawi, terjemahan Indonesia, dan nomor hadits lengkap.',
};

export default async function HadithIndexPage() {
  const books = await getHadithBooks();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          Pusat Belajar Hadits Shahih
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Pelajari sabda dan sunnah Rasulullah ﷺ dari kitab rujukan induk terpercaya
        </p>
      </div>

      {/* Rujukan Shahih Banner Flat */}
      <Card className="p-4 sm:p-5 bg-surface border-border flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-card bg-primary-soft text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5 text-success" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-text-primary">
            Jaminan Derajat Shahih & Rujukan Lengkap
          </h2>
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            Seluruh hadits yang disajikan dalam modul ini bersumber dari kitab induk yang telah ditashih para ulama. Setiap hadits menyertakan teks Arab lengkap, sanad/perawi awal, terjemahan bahasa Indonesia resmi, dan nomor hadits kitab induk.
          </p>
        </div>
      </Card>

      {/* Grid Kitab Hadits */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">
          Daftar Kitab Induk
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.map((b) => (
            <HadithBookCard key={b.id} book={b} />
          ))}
        </div>
      </div>
    </div>
  );
}
