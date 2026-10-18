export interface HijriDetails {
  day: number;
  month: number;
  year: number;
  monthName: string;
  monthNameArabic?: string;
  formatted: string;
}

export type FastingType = 'senin_kamis' | 'ayyamul_bidh' | 'asyura_tasua' | 'arafah_tarwiyah' | 'syawal' | 'daud' | 'syaban' | 'prohibited';

export interface SunnahFastingInfo {
  id: FastingType;
  name: string;
  badge: string;
  isProhibited?: boolean;
  arabicName: string;
  niatArabic: string;
  niatLatin: string;
  niatArti: string;
  dalil: string;
  keutamaan: string;
  scheduleDescription: string;
}

export interface IslamicEvent {
  title: string;
  hijriDay: number;
  hijriMonth: number;
  description: string;
  isHoliday?: boolean;
}

export interface CalendarDayCell {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayNumber: number; // Masehi day
  isCurrentMonth: boolean;
  isToday: boolean;
  hijri: HijriDetails;
  fastings: SunnahFastingInfo[];
  events: IslamicEvent[];
  prohibitedReason?: string;
}

export interface UpcomingFastingItem {
  fasting: SunnahFastingInfo;
  date: Date;
  dateFormattedMasehi: string;
  dateFormattedHijri: string;
  dayName: string;
  daysRemaining: number;
}
