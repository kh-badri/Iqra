import type { Metadata } from 'next';
import { BelajarMainView } from '@/features/belajar/components/BelajarMainView';

export const metadata: Metadata = {
  title: 'Pusat Belajar Ilmu Islam - Iqra',
  description:
    'Tingkatkan pemahaman keislaman melalui hadits shahih, hukum tajwid interaktif, sirah 25 nabi, dan koleksi video kajian ustadz.',
};

export default function BelajarPage() {
  return <BelajarMainView initialTab="modul" />;
}
