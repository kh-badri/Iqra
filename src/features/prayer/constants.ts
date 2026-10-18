import type { CityLocation, PrayerName, PrayerSettings } from './types';

export const PRAYER_LABELS: Record<PrayerName, { id: PrayerName; name: string; arabic: string }> = {
  imsak: { id: 'imsak', name: 'Imsak', arabic: 'الإمساك' },
  fajr: { id: 'fajr', name: 'Subuh', arabic: 'الفجر' },
  sunrise: { id: 'sunrise', name: 'Terbit', arabic: 'الشروق' },
  dhuhr: { id: 'dhuhr', name: 'Dzuhur', arabic: 'الظهر' },
  asr: { id: 'asr', name: 'Ashar', arabic: 'العصر' },
  maghrib: { id: 'maghrib', name: 'Maghrib', arabic: 'المغرب' },
  isha: { id: 'isha', name: 'Isya', arabic: 'العشاء' },
};

export const DEFAULT_PRAYER_SETTINGS: PrayerSettings = {
  reminderMinutesBefore: 0,
  soundType: 'chime',
  adjustments: {
    imsak: 0,
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  },
};

export const INDONESIAN_CITIES: CityLocation[] = [
  { id: 'jkt', name: 'DKI Jakarta', province: 'DKI Jakarta', lat: -6.2088, lng: 106.8456 },
  { id: 'bdg', name: 'Kota Bandung', province: 'Jawa Barat', lat: -6.9175, lng: 107.6191 },
  { id: 'sby', name: 'Kota Surabaya', province: 'Jawa Timur', lat: -7.2575, lng: 112.7521 },
  { id: 'smg', name: 'Kota Semarang', province: 'Jawa Tengah', lat: -6.9667, lng: 110.4167 },
  { id: 'jog', name: 'Kota Yogyakarta', province: 'D.I. Yogyakarta', lat: -7.7956, lng: 110.3695 },
  { id: 'mdn', name: 'Kota Medan', province: 'Sumatera Utara', lat: 3.5952, lng: 98.6722 },
  { id: 'mks', name: 'Kota Makassar', province: 'Sulawesi Selatan', lat: -5.1477, lng: 119.4327 },
  { id: 'plb', name: 'Kota Palembang', province: 'Sumatera Selatan', lat: -2.9761, lng: 104.7754 },
  { id: 'dps', name: 'Kota Denpasar', province: 'Bali', lat: -8.6705, lng: 115.2126 },
  { id: 'btj', name: 'Kota Banda Aceh', province: 'Aceh', lat: 5.5483, lng: 95.3238 },
  { id: 'pdg', name: 'Kota Padang', province: 'Sumatera Barat', lat: -0.9471, lng: 100.4172 },
  { id: 'bjm', name: 'Kota Banjarmasin', province: 'Kalimantan Selatan', lat: -3.3194, lng: 114.5908 },
  { id: 'bpp', name: 'Kota Balikpapan', province: 'Kalimantan Timur', lat: -1.2379, lng: 116.8529 },
  { id: 'ptk', name: 'Kota Pontianak', province: 'Kalimantan Barat', lat: -0.0263, lng: 109.3425 },
  { id: 'mtr', name: 'Kota Mataram', province: 'Nusa Tenggara Barat', lat: -8.5799, lng: 116.0999 },
  { id: 'kdi', name: 'Kota Kendari', province: 'Sulawesi Tenggara', lat: -3.9985, lng: 122.5126 },
  { id: 'mnd', name: 'Kota Manado', province: 'Sulawesi Utara', lat: 1.4748, lng: 124.8428 },
  { id: 'jpr', name: 'Kota Jayapura', province: 'Papua', lat: -2.5489, lng: 140.7138 },
  { id: 'bgr', name: 'Kota Bogor', province: 'Jawa Barat', lat: -6.5971, lng: 106.806 },
  { id: 'tgr', name: 'Kota Tangerang', province: 'Banten', lat: -6.1783, lng: 106.6319 },
  { id: 'bks', name: 'Kota Bekasi', province: 'Jawa Barat', lat: -6.2383, lng: 106.9756 },
  { id: 'mlg', name: 'Kota Malang', province: 'Jawa Timur', lat: -7.9666, lng: 112.6326 },
  { id: 'slo', name: 'Kota Surakarta (Solo)', province: 'Jawa Tengah', lat: -7.5755, lng: 110.8243 },
];

export const DEFAULT_CITY = INDONESIAN_CITIES[0]; // Jakarta
