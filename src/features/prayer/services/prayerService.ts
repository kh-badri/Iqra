import {
  Coordinates,
  CalculationParameters,
  PrayerTimes,
} from 'adhan';
import type { CityLocation, PrayerName, PrayerSettings, PrayerTimeItem } from '../types';
import { PRAYER_LABELS, DEFAULT_PRAYER_SETTINGS } from '../constants';
import { db, type PrayerDay } from '@/lib/db';

export function calculateKemenagPrayerTimes(
  lat: number,
  lng: number,
  date: Date = new Date(),
  settings: PrayerSettings = DEFAULT_PRAYER_SETTINGS
): Record<PrayerName, Date> {
  const coords = new Coordinates(lat, lng);

  // Parameter Kemenag RI: Subuh 20°, Isya 18°
  const params = new CalculationParameters('Other', 20.0, 18.0);

  // Standar koreksi waktu sholat Kemenag (ihtiyath +2 menit) + manual adjustment
  params.adjustments = {
    fajr: 2 + (settings.adjustments.fajr || 0),
    sunrise: settings.adjustments.sunrise || 0,
    dhuhr: 2 + (settings.adjustments.dhuhr || 0),
    asr: 2 + (settings.adjustments.asr || 0),
    maghrib: 2 + (settings.adjustments.maghrib || 0),
    isha: 2 + (settings.adjustments.isha || 0),
  };

  const pt = new PrayerTimes(coords, date, params);

  // Imsak: 10 menit sebelum Subuh + adjustment
  const imsakDate = new Date(
    pt.fajr.getTime() - (10 - (settings.adjustments.imsak || 0)) * 60 * 1000
  );

  return {
    imsak: imsakDate,
    fajr: pt.fajr,
    sunrise: pt.sunrise,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
  };
}

export function formatTimeHM(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function formatDateYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getMasehiDateFormatted(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function getHijriDateFormatted(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch (e) {
    return 'Hijriah';
  }
}

/**
 * Menyimpan jadwal 30 hari ke depan ke IndexedDB (Dexie)
 */
export async function sync30DaysScheduleToDb(
  city: CityLocation,
  settings: PrayerSettings = DEFAULT_PRAYER_SETTINGS
) {
  if (typeof window === 'undefined') return;

  try {
    const today = new Date();
    const daysToSave: PrayerDay[] = [];

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const times = calculateKemenagPrayerTimes(city.lat, city.lng, d, settings);
      const dateStr = formatDateYMD(d);

      daysToSave.push({
        date: dateStr,
        city: city.name,
        imsak: formatTimeHM(times.imsak),
        fajr: formatTimeHM(times.fajr),
        sunrise: formatTimeHM(times.sunrise),
        dhuhr: formatTimeHM(times.dhuhr),
        asr: formatTimeHM(times.asr),
        maghrib: formatTimeHM(times.maghrib),
        isha: formatTimeHM(times.isha),
        timestamp: d.getTime(),
      });
    }

    // Bersihkan jadwal lama dan simpan yang baru
    await db.prayerDays.where('city').equals(city.name).delete();
    await db.prayerDays.bulkAdd(daysToSave);
  } catch (err) {
    console.warn('Gagal menyimpan jadwal 30 hari ke IndexedDB:', err);
  }
}
