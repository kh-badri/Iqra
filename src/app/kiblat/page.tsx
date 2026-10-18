import { Metadata } from 'next';
import { PrayerMainView } from '@/features/prayer/components/PrayerMainView';

export const metadata: Metadata = {
  title: 'Arah Kiblat Dinamis - Kompas Kiblat Akurat | Iqra',
  description:
    'Kompas arah kiblat online akurat yang bergerak otomatis mengikuti arah putaran smartphone Anda secara real-time menuju Ka\'bah di Makkah.',
};

export default function KiblatPage() {
  return <PrayerMainView initialTab="kiblat" />;
}
