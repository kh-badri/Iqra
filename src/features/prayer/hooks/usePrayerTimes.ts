'use client';

import * as React from 'react';
import type { CityLocation, PrayerName, PrayerSettings, PrayerTimeItem } from '../types';
import {
  calculateKemenagPrayerTimes,
  formatTimeHM,
  getHijriDateFormatted,
  getMasehiDateFormatted,
  sync30DaysScheduleToDb,
} from '../services/prayerService';
import { DEFAULT_CITY, DEFAULT_PRAYER_SETTINGS, PRAYER_LABELS } from '../constants';

export function usePrayerTimes() {
  const [city, setCity] = React.useState<CityLocation>(DEFAULT_CITY);
  const [settings, setSettings] = React.useState<PrayerSettings>(DEFAULT_PRAYER_SETTINGS);
  const [now, setNow] = React.useState<Date>(new Date());
  const [isGeolocationActive, setIsGeolocationActive] = React.useState<boolean>(false);
  const [isLocating, setIsLocating] = React.useState<boolean>(false);
  const [notificationPermission, setNotificationPermission] = React.useState<NotificationPermission>('default');

  // Load preferences from localStorage on client
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCity = localStorage.getItem('iqra_prayer_city');
      if (savedCity) {
        try {
          setCity(JSON.parse(savedCity));
        } catch (e) {}
      }

      const savedSettings = localStorage.getItem('iqra_prayer_settings');
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch (e) {}
      }

      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    }
  }, []);

  // Update clock every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync 30 days schedule when city or settings change
  React.useEffect(() => {
    sync30DaysScheduleToDb(city, settings);
  }, [city, settings]);

  const [isGpsModalOpen, setIsGpsModalOpen] = React.useState<boolean>(false);
  const [gpsErrorReason, setGpsErrorReason] = React.useState<'off' | 'denied' | 'timeout' | null>(null);

  // Request Geolocation
  const requestGeolocation = React.useCallback((isSilent: boolean = false) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      if (!isSilent) alert('Perangkat Anda tidak mendukung geolokasi.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setIsGpsModalOpen(false);
        setGpsErrorReason(null);
        const autoCity: CityLocation = {
          id: 'auto-location',
          name: 'Lokasi Saat Ini',
          province: 'GPS Otomatis',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCity(autoCity);
        setIsGeolocationActive(true);
        localStorage.setItem('iqra_prayer_city', JSON.stringify(autoCity));
      },
      (err) => {
        setIsLocating(false);
        let reason: 'off' | 'denied' | 'timeout' = 'off';
        if (err.code === 1) reason = 'denied';
        else if (err.code === 2) reason = 'off';
        else if (err.code === 3) reason = 'timeout';
        setGpsErrorReason(reason);
        // Tampilkan modal peringatan jika diinisiasi user atau belum ada kota tersimpan
        if (!isSilent || !localStorage.getItem('iqra_prayer_city')) {
          setIsGpsModalOpen(true);
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  // Cek GPS otomatis saat mount jika tersimpan mode auto-location
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iqra_prayer_city');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.id === 'auto-location' || parsed.id === 'custom-gps') {
            requestGeolocation(true);
          }
        } catch {}
      }
    }
  }, [requestGeolocation]);

  const changeCity = (newCity: CityLocation) => {
    setCity(newCity);
    setIsGeolocationActive(false);
    localStorage.setItem('iqra_prayer_city', JSON.stringify(newCity));
  };

  const updateSettings = (newSettings: PrayerSettings) => {
    setSettings(newSettings);
    localStorage.setItem('iqra_prayer_settings', JSON.stringify(newSettings));
  };

  const requestNotification = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    const perm = await Notification.requestPermission();
    setNotificationPermission(perm);
    return perm === 'granted';
  };

  // Hitung jadwal hari ini
  const rawTimes = React.useMemo(() => {
    return calculateKemenagPrayerTimes(city.lat, city.lng, now, settings);
  }, [city, now, settings]);

  // Daftar sholat berurutan
  const prayerList: PrayerTimeItem[] = React.useMemo(() => {
    const list: PrayerName[] = ['imsak', 'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const nowMs = now.getTime();

    // Cari sholat berikutnya
    let foundNext = false;

    return list.map((id) => {
      const date = rawTimes[id];
      const isPassed = date.getTime() <= nowMs;
      let isNext = false;

      if (!isPassed && !foundNext) {
        isNext = true;
        foundNext = true;
      }

      return {
        id,
        name: PRAYER_LABELS[id].name,
        arabicName: PRAYER_LABELS[id].arabic,
        timeStr: formatTimeHM(date),
        date,
        isNext,
        isPassed,
      };
    });
  }, [rawTimes, now]);

  // Tentukan waktu sholat berikutnya & hitung mundur
  const nextPrayer = React.useMemo(() => {
    const found = prayerList.find((p) => p.isNext);
    if (found) return found;

    // Jika semua sholat hari ini sudah lewat (setelah Isya), maka sholat berikutnya adalah Subuh besok
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = calculateKemenagPrayerTimes(city.lat, city.lng, tomorrow, settings);

    return {
      id: 'fajr' as PrayerName,
      name: 'Subuh',
      arabicName: 'الفجر',
      timeStr: formatTimeHM(tomorrowTimes.fajr),
      date: tomorrowTimes.fajr,
      isNext: true,
      isPassed: false,
    };
  }, [prayerList, now, city, settings]);

  const countdownSeconds = React.useMemo(() => {
    if (!nextPrayer) return 0;
    const diff = Math.floor((nextPrayer.date.getTime() - now.getTime()) / 1000);
    return Math.max(0, diff);
  }, [nextPrayer, now]);

  const countdownFormatted = React.useMemo(() => {
    const hours = Math.floor(countdownSeconds / 3600);
    const minutes = Math.floor((countdownSeconds % 3600) / 60);
    const seconds = countdownSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${String(hours).padStart(2, '0')} jam`);
    parts.push(`${String(minutes).padStart(2, '0')} menit`);
    parts.push(`${String(seconds).padStart(2, '0')} dtk`);

    return parts.join(' ');
  }, [countdownSeconds]);

  // Play gentle web audio chime for adhan reminder when time hits 0
  React.useEffect(() => {
    if (countdownSeconds === 0 && settings.soundType !== 'silent') {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // 440 Hz
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.5);
      } catch (e) {}

      // Tampilkan web notification jika izin diberikan
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(`Waktu ${nextPrayer?.name} Telah Tiba`, {
          body: `Waktu sholat ${nextPrayer?.name} untuk wilayah ${city.name} telah masuk (${nextPrayer?.timeStr} WIB/WITA/WIT).`,
          icon: '/icons/icon-192.png',
        });
      }
    }
  }, [countdownSeconds, settings.soundType, nextPrayer, city]);

  return {
    city,
    settings,
    now,
    prayerList,
    nextPrayer,
    countdownSeconds,
    countdownFormatted,
    isGeolocationActive,
    isLocating,
    isGpsModalOpen,
    gpsErrorReason,
    closeGpsModal: () => setIsGpsModalOpen(false),
    notificationPermission,
    requestGeolocation,
    changeCity,
    updateSettings,
    requestNotification,
    masehiDateStr: getMasehiDateFormatted(now),
    hijriDateStr: getHijriDateFormatted(now),
  };
}
