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
import {
  checkAndTriggerPrayers,
  primeAudioOnUserInteraction,
  stopAdhanAudio as stopGlobalAdhanAudio,
  testAdhanNotification,
} from '../services/prayerNotifierService';
import { registerWebPushSubscription } from '../services/webPushService';

export function usePrayerTimes() {
  const [city, setCity] = React.useState<CityLocation>(DEFAULT_CITY);
  const [settings, setSettings] = React.useState<PrayerSettings>(DEFAULT_PRAYER_SETTINGS);
  const [now, setNow] = React.useState<Date>(new Date());
  const [isGeolocationActive, setIsGeolocationActive] = React.useState<boolean>(false);
  const [isLocating, setIsLocating] = React.useState<boolean>(false);
  const [notificationPermission, setNotificationPermission] = React.useState<NotificationPermission>('default');

  // Stop adhan audio helper
  const stopAdhanAudio = React.useCallback(() => {
    stopGlobalAdhanAudio();
  }, []);

  // Cleanup active audio on unmount
  React.useEffect(() => {
    return () => {
      stopAdhanAudio();
    };
  }, [stopAdhanAudio]);

  // Load preferences from localStorage on client
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      let loadedCity = DEFAULT_CITY;
      const savedCity = localStorage.getItem('iqra_prayer_city');
      if (savedCity) {
        try {
          loadedCity = JSON.parse(savedCity);
          setCity(loadedCity);
        } catch (e) {}
      }

      const savedSettings = localStorage.getItem('iqra_prayer_settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings({
            ...DEFAULT_PRAYER_SETTINGS,
            ...parsed,
            adhanMuadhin: parsed.adhanMuadhin || DEFAULT_PRAYER_SETTINGS.adhanMuadhin || 'makkah',
          });
        } catch (e) {}
      }

      if ('Notification' in window) {
        const perm = Notification.permission;
        setNotificationPermission(perm);
        if (perm === 'granted') {
          // Sinkronkan Web Push subscription ke cPanel
          registerWebPushSubscription(loadedCity).catch(() => {});
        }
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
        if (Notification.permission === 'granted') {
          registerWebPushSubscription(autoCity).catch(() => {});
        }
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
    checkAndTriggerPrayers();
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      registerWebPushSubscription(newCity).catch(() => {});
    }
  };

  const updateSettings = (newSettings: PrayerSettings) => {
    setSettings(newSettings);
    localStorage.setItem('iqra_prayer_settings', JSON.stringify(newSettings));
    checkAndTriggerPrayers();
  };

  const requestNotification = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    primeAudioOnUserInteraction();
    const perm = await Notification.requestPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      checkAndTriggerPrayers();
      registerWebPushSubscription(city).catch(() => {});
    }
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

  // Sinkronisasi pemicu ketika countdown mendekati 0
  React.useEffect(() => {
    if (countdownSeconds <= 1) {
      checkAndTriggerPrayers();
    }
  }, [countdownSeconds]);

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
    stopAdhanAudio,
    requestNotification,
    testAdhanNotification,
    masehiDateStr: getMasehiDateFormatted(now),
    hijriDateStr: getHijriDateFormatted(now),
  };
}
