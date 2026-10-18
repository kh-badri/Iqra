import type {
  HijriDetails,
  CalendarDayCell,
  SunnahFastingInfo,
  UpcomingFastingItem,
  IslamicEvent,
} from './types';
import { HIJRI_MONTHS, SUNNAH_FASTINGS, ISLAMIC_EVENTS } from './constants';

/**
 * Mengambil detail tanggal Hijriah dari objek Date JavaScript
 */
export function getHijriDetails(date: Date): HijriDetails {
  try {
    const parts = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(date);

    let day = 1;
    let month = 1;
    let year = 1448;

    for (const p of parts) {
      if (p.type === 'day') day = parseInt(p.value, 10);
      if (p.type === 'month') month = parseInt(p.value, 10);
      if (p.type === 'year') year = parseInt(p.value, 10);
    }

    const monthObj = HIJRI_MONTHS.find((m) => m.id === month) || HIJRI_MONTHS[0];

    return {
      day,
      month,
      year,
      monthName: monthObj.name,
      monthNameArabic: monthObj.arabic,
      formatted: `${day} ${monthObj.name} ${year} H`,
    };
  } catch {
    return {
      day: 1,
      month: 1,
      year: 1448,
      monthName: 'Muharram',
      monthNameArabic: 'مُحَرَّم',
      formatted: '1 Muharram 1448 H',
    };
  }
}

/**
 * Mencari peristiwa / hari besar Islam pada tanggal Hijriah tertentu
 */
export function getEventsForHijri(hijriDay: number, hijriMonth: number): IslamicEvent[] {
  return ISLAMIC_EVENTS.filter(
    (e) => e.hijriDay === hijriDay && e.hijriMonth === hijriMonth
  );
}

/**
 * Memeriksa apakah suatu tanggal merupakan hari yang diharamkan berpuasa
 */
export function checkProhibitedFasting(
  hijriDay: number,
  hijriMonth: number
): { isProhibited: boolean; reason?: string } {
  // 1 Syawal: Idul Fitri
  if (hijriMonth === 10 && hijriDay === 1) {
    return { isProhibited: true, reason: 'Hari Raya Idul Fitri (1 Syawal)' };
  }
  // 10 Dzulhijjah: Idul Adha
  if (hijriMonth === 12 && hijriDay === 10) {
    return { isProhibited: true, reason: 'Hari Raya Idul Adha (10 Dzulhijjah)' };
  }
  // 11, 12, 13 Dzulhijjah: Hari Tasyrik
  if (hijriMonth === 12 && (hijriDay === 11 || hijriDay === 12 || hijriDay === 13)) {
    return {
      isProhibited: true,
      reason: `Hari Tasyrik ke-${hijriDay - 10} (${hijriDay} Dzulhijjah)`,
    };
  }
  return { isProhibited: false };
}

/**
 * Menentukan jenis puasa sunnah (atau larangan puasa) pada suatu tanggal
 */
export function getFastingsForDate(
  date: Date,
  hijriDay: number,
  hijriMonth: number
): SunnahFastingInfo[] {
  const result: SunnahFastingInfo[] = [];
  const prohibited = checkProhibitedFasting(hijriDay, hijriMonth);

  if (prohibited.isProhibited) {
    result.push({
      ...SUNNAH_FASTINGS.prohibited,
      scheduleDescription: prohibited.reason || 'Diharamkan berpuasa',
    });
    return result; // Jika diharamkan berpuasa, jangan sertakan puasa sunnah
  }

  // Bukan bulan Ramadhan (karena Ramadhan adalah puasa wajib, bukan sunnah)
  const isRamadhan = hijriMonth === 9;
  if (isRamadhan) {
    return result;
  }

  const dayOfWeek = date.getDay(); // 0 = Ahad, 1 = Senin, ..., 4 = Kamis

  // 1. Puasa Senin & Kamis
  if (dayOfWeek === 1 || dayOfWeek === 4) {
    result.push(SUNNAH_FASTINGS.senin_kamis);
  }

  // 2. Puasa Ayyamul Bidh (13, 14, 15 setiap bulan Hijriah)
  if (hijriDay === 13 || hijriDay === 14 || hijriDay === 15) {
    result.push(SUNNAH_FASTINGS.ayyamul_bidh);
  }

  // 3. Puasa Tasu'a & Asyura (9 & 10 Muharram)
  if (hijriMonth === 1 && (hijriDay === 9 || hijriDay === 10)) {
    result.push(SUNNAH_FASTINGS.asyura_tasua);
  }

  // 4. Puasa Tarwiyah & Arafah (8 & 9 Dzulhijjah)
  if (hijriMonth === 12 && (hijriDay === 8 || hijriDay === 9)) {
    result.push(SUNNAH_FASTINGS.arafah_tarwiyah);
  }

  // 5. Puasa 6 Hari Syawal (mulai 2 Syawal sampai akhir Syawal)
  if (hijriMonth === 10 && hijriDay >= 2 && hijriDay <= 30) {
    result.push(SUNNAH_FASTINGS.syawal);
  }

  // 6. Puasa Sya'ban (1-15 Sya'ban)
  if (hijriMonth === 8 && hijriDay <= 15 && !result.some((f) => f.id === 'ayyamul_bidh')) {
    result.push(SUNNAH_FASTINGS.syaban);
  }

  return result;
}

/**
 * Format tanggal ke format standar YYYY-MM-DD
 */
export function formatYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Format nama hari dalam Bahasa Indonesia
 */
export function getDayNameIndo(d: Date): string {
  const names = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
  return names[d.getDay()] || 'Ahad';
}

/**
 * Menghasilkan kisi tanggal bulanan (7 kolom Ahad-Sabtu) untuk tampilan kalender
 */
export function getMonthMatrix(year: number, monthIndex: number): CalendarDayCell[] {
  const cells: CalendarDayCell[] = [];
  const todayStr = formatYMD(new Date());

  // Hari pertama dan terakhir bulan yang dipilih
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);
  const totalDays = lastDayOfMonth.getDate();

  // Hari dalam seminggu untuk tanggal 1 (0 = Ahad, 1 = Senin, ...)
  const startDayOfWeek = firstDayOfMonth.getDay();

  // 1. Padding hari dari bulan sebelumnya
  if (startDayOfWeek > 0) {
    const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, monthIndex - 1, prevMonthLastDay - i);
      const hijri = getHijriDetails(d);
      const prohibited = checkProhibitedFasting(hijri.day, hijri.month);
      const fastings = getFastingsForDate(d, hijri.day, hijri.month);
      const events = getEventsForHijri(hijri.day, hijri.month);
      const ymd = formatYMD(d);

      cells.push({
        date: d,
        dateString: ymd,
        dayNumber: d.getDate(),
        isCurrentMonth: false,
        isToday: ymd === todayStr,
        hijri,
        fastings,
        events,
        prohibitedReason: prohibited.reason,
      });
    }
  }

  // 2. Hari-hari dalam bulan aktif
  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, monthIndex, day);
    const hijri = getHijriDetails(d);
    const prohibited = checkProhibitedFasting(hijri.day, hijri.month);
    const fastings = getFastingsForDate(d, hijri.day, hijri.month);
    const events = getEventsForHijri(hijri.day, hijri.month);
    const ymd = formatYMD(d);

    cells.push({
      date: d,
      dateString: ymd,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: ymd === todayStr,
      hijri,
      fastings,
      events,
      prohibitedReason: prohibited.reason,
    });
  }

  // 3. Padding hari ke bulan berikutnya (agar kelipatan 7 pas)
  const remainingCells = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, monthIndex + 1, i);
    const hijri = getHijriDetails(d);
    const prohibited = checkProhibitedFasting(hijri.day, hijri.month);
    const fastings = getFastingsForDate(d, hijri.day, hijri.month);
    const events = getEventsForHijri(hijri.day, hijri.month);
    const ymd = formatYMD(d);

    cells.push({
      date: d,
      dateString: ymd,
      dayNumber: d.getDate(),
      isCurrentMonth: false,
      isToday: ymd === todayStr,
      hijri,
      fastings,
      events,
      prohibitedReason: prohibited.reason,
    });
  }

  return cells;
}

/**
 * Mendapatkan daftar jadwal puasa sunnah terdekat mulai dari tanggal tertentu
 */
export function getUpcomingFastings(startDate: Date = new Date(), limit: number = 8): UpcomingFastingItem[] {
  const result: UpcomingFastingItem[] = [];
  const startCopy = new Date(startDate);
  startCopy.setHours(0, 0, 0, 0);

  const masehiFormatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Cari hingga 60 hari ke depan
  for (let i = 0; i < 60; i++) {
    const d = new Date(startCopy);
    d.setDate(startCopy.getDate() + i);

    const hijri = getHijriDetails(d);
    const fastings = getFastingsForDate(d, hijri.day, hijri.month);

    // Filter hanya puasa sunnah (bukan yang dilarang)
    const validFastings = fastings.filter((f) => !f.isProhibited);

    for (const f of validFastings) {
      result.push({
        fasting: f,
        date: d,
        dateFormattedMasehi: masehiFormatter.format(d),
        dateFormattedHijri: hijri.formatted,
        dayName: getDayNameIndo(d),
        daysRemaining: i,
      });

      if (result.length >= limit) {
        return result;
      }
    }
  }

  return result;
}
