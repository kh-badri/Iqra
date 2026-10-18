import { PrayerMainView } from '@/features/prayer/components/PrayerMainView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jadwal Sholat & Pengingat Adzan Akurat - Iqra',
  description:
    'Jadwal sholat 5 waktu akurat standar Kemenag RI (Imsak, Subuh, Terbit, Dzuhur, Ashar, Maghrib, Isya) berdasarkan lokasi dan hitung mundur.',
};

export default function SholatPage() {
  return <PrayerMainView />;
}
