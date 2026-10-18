import type { Metadata } from 'next';
import { PrayerMainView } from '@/features/prayer/components/PrayerMainView';

export const metadata: Metadata = {
  title: 'Masjid Terdekat - Iqra',
  description: 'Temukan masjid dan musholla terdekat dengan panduan Google Maps resmi dan navigasi rute.',
};

export default function MasjidPage() {
  return <PrayerMainView initialTab="masjid" />;
}
