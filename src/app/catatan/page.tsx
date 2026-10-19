import type { Metadata } from 'next';
import { NotesMainView } from '@/features/notes/components/NotesMainView';

export const metadata: Metadata = {
  title: 'Catatan Belajar & Progress Tracker Santri - Iqra',
  description:
    'Catat dan pantau hasil pembelajaran Al-Qur\'an, hukum tajwid, hadits, kisah nabi, dan sirah baik untuk diri sendiri maupun murid/santri Anda.',
};

export default function CatatanPage() {
  return <NotesMainView />;
}
