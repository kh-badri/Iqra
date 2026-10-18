import { BookmarkView } from '@/features/bookmark/components/BookmarkView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bookmark Tersimpan - Iqra',
  description: 'Daftar ayat Al-Qur\'an dan rujukan ilmu agama yang Anda tandai di perangkat.',
};

export default function BookmarkPage() {
  return <BookmarkView />;
}
