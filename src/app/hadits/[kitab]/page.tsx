import {
  getHadithBooks,
  getHadithBookById,
  getHadithChunk,
} from '@/features/hadith/services/hadithService';
import { HadithReaderView } from '@/features/hadith/components/HadithReaderView';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamicParams = false;

export async function generateStaticParams() {
  const books = await getHadithBooks();
  return books.map((b) => ({
    kitab: b.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { kitab: string };
}): Promise<Metadata> {
  const book = await getHadithBookById(params.kitab);
  if (!book) return { title: 'Kitab Hadits - Iqra' };

  return {
    title: `Kitab ${book.name} - Hadits Shahih - Iqra`,
    description: `Baca dan pelajari kumpulan hadits shahih ${book.name} (${book.author}) teks Arab dan terjemahan Indonesia lengkap dengan nomor hadits.`,
  };
}

export default async function HadithBookPage({
  params,
}: {
  params: { kitab: string };
}) {
  const book = await getHadithBookById(params.kitab);
  if (!book) notFound();

  const initialChunk = await getHadithChunk(book.id, 1);

  return <HadithReaderView book={book} initialChunk={initialChunk} />;
}
