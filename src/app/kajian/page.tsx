import type { Metadata } from 'next';
import { BelajarMainView } from '@/features/belajar/components/BelajarMainView';

export const metadata: Metadata = {
  title: 'Kajian YouTube Ustadz Populer - Iqra',
  description:
    'Tonton video ceramah dan kajian Islam resmi dari ustadz terpopuler di Indonesia melalui pemutar resmi YouTube.',
};

export default function KajianPage() {
  return <BelajarMainView initialTab="kajian" />;
}
