export type PrayerName =
  | 'imsak'
  | 'fajr'
  | 'sunrise'
  | 'dhuhr'
  | 'asr'
  | 'maghrib'
  | 'isha';

export interface PrayerTimeItem {
  id: PrayerName;
  name: string;
  arabicName: string;
  timeStr: string; // HH:mm
  date: Date;
  isNext: boolean;
  isPassed: boolean;
}

export interface CityLocation {
  id: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
}

export type AdhanSoundType = 'full' | 'short' | 'chime' | 'silent';

export interface AdhanMuadhin {
  id: string;
  name: string;
  arabicName: string;
  origin: string;
  description: string;
  badge?: string;
  audioStandard: string;
  audioFajr: string;
}

export interface PrayerSettings {
  reminderMinutesBefore: number; // 0, 5, 10, 15
  soundType: AdhanSoundType;
  adhanMuadhin?: string; // id from ADHAN_MUADHIN_LIST (default: 'makkah')
  adjustments: Record<PrayerName, number>; // minute offsets (-5 to +5)
}

