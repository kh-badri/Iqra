import type { Metadata } from 'next';
import { SirahTimelineView } from '@/features/sirah/components/SirahTimelineView';

export const metadata: Metadata = {
  title: 'Sirah Nabawiyyah - Kronologi Perjalanan Hidup Rasulullah ﷺ | Iqra',
  description:
    'Pelajari kronologi lengkap perjalanan hidup Rasulullah Muhammad ﷺ dari kelahiran di Tahun Gajah, masa muda Al-Amin, wahyu pertama, dakwah Makkah, hijrah Madinah, hingga wafatnya beliau berdasarkan kitab Ar-Rahiq Al-Makhtum.',
  keywords: [
    'Sirah Nabawiyyah',
    'Kisah Nabi Muhammad',
    'Ar-Rahiq Al-Makhtum',
    'Perjalanan Hidup Rasulullah',
    'Fase Makkah Madinah',
    'Iqra',
  ],
};

export default function SirahPage() {
  return <SirahTimelineView />;
}
