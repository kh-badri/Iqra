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
import { DEFAULT_CITY, DEFAULT_PRAYER_SETTINGS, PRAYER_LABELS, ADHAN_MUADHIN_LIST } from '../constants';

export function usePrayerTimes() {
  const [city, setCity] = React.useState<CityLocation>(DEFAULT_CITY);
  const [settings, setSettings] = React.useState<PrayerSettings>(DEFAULT_PRAYER_SETTINGS);
  const [now, setNow] = React.useState<Date>(() => new Date());
  const [isGeolocationActive, setIsGeolocationActive] = React.useState<boolean>(false);
  const [isLocating, setIsLocating] = React.useState<boolean>(false);
  const [notificationPermission, setNotificationPermission] = React.useState<NotificationPermission>('default');

  // Active audio reference & trigger control
  const activeAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const lastTriggeredKeyRef = React.useRef<string | null>(null);

  // Stop adhan audio helper
  const stopAdhanAudio = React.useCallback(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
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
      const savedCity = localStorage.getItem('iqra_prayer_city');
      if (savedCity) {
        try {
          setCity(JSON.parse(savedCity));
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
        setNotificationPermission(Notification.permission);
      }
    }
  }, []);

  // Optimized clock updates: update every 30 seconds or on tab focus instead of 1,000ms polling.
  // This completely eliminates high-frequency re-render churn and CPU lag on mobile devices!
  React.useEffect(() => {
    const updateTime = () => setNow(new Date());

    const timer = setInterval(updateTime, 30000);

    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        updateTime();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
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

  const todayDateStr = React.useMemo(() => {
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }, [now]);

  // Hitung jadwal hari ini (hanya dihitung ulang ketika kota, pengaturan, atau tanggal hari kalender berubah)
  const rawTimes = React.useMemo(() => {
    return calculateKemenagPrayerTimes(city.lat, city.lng, now, settings);
  }, [city.lat, city.lng, todayDateStr, settings]);

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
  }, [prayerList, now, city.lat, city.lng, settings]);

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

  // Trigger adhan audio & web notifications precisely at prayer time
  React.useEffect(() => {
    if (!nextPrayer) return;

    const triggerKey = `${nextPrayer.id}_${nextPrayer.timeStr}_${todayDateStr}`;

    const fireAdhan = () => {
      if (lastTriggeredKeyRef.current === triggerKey) return;
      lastTriggeredKeyRef.current = triggerKey;

      if (settings.soundType !== 'silent') {
        if (settings.soundType === 'chime') {
          try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
              const audioCtx = new AudioCtx();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.type = 'sine';
              osc.frequency.setValueAtTime(440, audioCtx.currentTime);
              gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);
              osc.start();
              osc.stop(audioCtx.currentTime + 1.8);
            }
          } catch (e) {}
        } else if (settings.soundType === 'full' || settings.soundType === 'short') {
          const muadhinId = settings.adhanMuadhin || 'makkah';
          const muadhin =
            ADHAN_MUADHIN_LIST.find((m) => m.id === muadhinId) || ADHAN_MUADHIN_LIST[0];

          const isFajr = nextPrayer.id === 'fajr';
          const audioSrc = isFajr ? muadhin.audioFajr : muadhin.audioStandard;

          try {
            stopAdhanAudio();
            const audio = new Audio(audioSrc);
            activeAudioRef.current = audio;

            audio.play().catch(() => {
              try {
                const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioCtx) {
                  const audioCtx = new AudioCtx();
                  const osc = audioCtx.createOscillator();
                  const gain = audioCtx.createGain();
                  osc.connect(gain);
                  gain.connect(audioCtx.destination);
                  osc.type = 'sine';
                  osc.frequency.setValueAtTime(440, audioCtx.currentTime);
                  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
                  osc.start();
                  osc.stop(audioCtx.currentTime + 1.5);
                }
              } catch (err) {}
            });

            if (settings.soundType === 'short') {
              setTimeout(() => {
                if (activeAudioRef.current === audio) {
                  stopAdhanAudio();
                }
              }, 35000);
            }
          } catch (e) {}
        }
      }

      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        const isFajr = nextPrayer.id === 'fajr';
        const bodyText = isFajr
          ? `الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ. Waktu sholat Subuh untuk wilayah ${city.name} telah masuk (${nextPrayer.timeStr} WIB/WITA/WIT). Mari raih keberkahan fajar.`
          : `Waktu sholat ${nextPrayer.name} untuk wilayah ${city.name} telah masuk (${nextPrayer.timeStr} WIB/WITA/WIT). Hayya 'alash Shalah.`;

        new Notification(`Waktu ${nextPrayer.name} Telah Tiba`, {
          body: bodyText,
          icon: '/icons/icon-192.png',
        });
      }

      // Update current time to transition nextPrayer
      setNow(new Date());
    };

    const msUntilPrayer = nextPrayer.date.getTime() - Date.now();
    if (msUntilPrayer <= 0 && msUntilPrayer > -60000) {
      fireAdhan();
    } else if (msUntilPrayer > 0) {
      const timer = setTimeout(fireAdhan, msUntilPrayer);
      return () => clearTimeout(timer);
    }
  }, [nextPrayer, todayDateStr, settings, city, stopAdhanAudio]);

  const masehiDateStr = React.useMemo(() => getMasehiDateFormatted(now), [todayDateStr]);
  const hijriDateStr = React.useMemo(() => getHijriDateFormatted(now), [todayDateStr]);

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
    masehiDateStr,
    hijriDateStr,
  };
}
