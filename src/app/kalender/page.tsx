import { Metadata } from 'next';
import { HijriCalendarMainView } from '@/features/calendar/components/HijriCalendarMainView';

export const metadata: Metadata = {
  title: 'Kalender Hijriah & Jadwal Puasa Sunnah | Iqra',
  description:
    'Kalender Hijriah Umm al-Qura lengkap dengan konversi Masehi, hari besar Islam, serta jadwal puasa sunnah (Senin-Kamis, Ayyamul Bidh, Asyura, Arafah) beserta lafadz niat dan dalil shahih.',
};

export default function KalenderPage() {
  return <HijriCalendarMainView initialTab="kalender" />;
}
