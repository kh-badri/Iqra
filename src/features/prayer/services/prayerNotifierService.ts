'use client';

import { calculateKemenagPrayerTimes, formatDateYMD, formatTimeHM } from './prayerService';
import { DEFAULT_CITY, DEFAULT_PRAYER_SETTINGS, PRAYER_LABELS, ADHAN_MUADHIN_LIST } from '../constants';
import type { CityLocation, PrayerName, PrayerSettings, AdhanSoundType } from '../types';

// Global audio reference for adhan playback
let globalAdhanAudio: HTMLAudioElement | null = null;
let adhanStopTimeout: any = null;
let isAudioContextUnlocked = false;

/**
 * Mendapatkan pengaturan sholat dari localStorage
 */
export function getStoredPrayerSettings(): PrayerSettings {
  if (typeof window === 'undefined') return DEFAULT_PRAYER_SETTINGS;
  try {
    const raw = localStorage.getItem('iqra_prayer_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PRAYER_SETTINGS,
        ...parsed,
        adhanMuadhin: parsed.adhanMuadhin || DEFAULT_PRAYER_SETTINGS.adhanMuadhin || 'makkah',
      };
    }
  } catch {}
  return DEFAULT_PRAYER_SETTINGS;
}

/**
 * Mendapatkan lokasi kota tersimpan
 */
export function getStoredCity(): CityLocation {
  if (typeof window === 'undefined') return DEFAULT_CITY;
  try {
    const raw = localStorage.getItem('iqra_prayer_city');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return DEFAULT_CITY;
}

/**
 * Mengambil rekam jejak notifikasi yang telah dibunyikan hari ini
 */
function getTriggeredRecordKey(dateStr: string, prayerId: string, reminderMins: number): string {
  return `adhan_${dateStr}_${prayerId}_rem${reminderMins}`;
}

export function isPrayerTriggered(dateStr: string, prayerId: string, reminderMins: number): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const key = getTriggeredRecordKey(dateStr, prayerId, reminderMins);
    return localStorage.getItem(`iqra_notif_${key}`) === '1';
  } catch {
    return false;
  }
}

export function markPrayerTriggered(dateStr: string, prayerId: string, reminderMins: number): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getTriggeredRecordKey(dateStr, prayerId, reminderMins);
    localStorage.setItem(`iqra_notif_${key}`, '1');

    // Bersihkan riwayat lama (> 2 hari yang lalu) agar localStorage tetap bersih
    const now = new Date();
    const oldDate = new Date(now);
    oldDate.setDate(oldDate.getDate() - 2);
    const oldDateStr = formatDateYMD(oldDate);

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('iqra_notif_adhan_') && k.includes(oldDateStr)) {
        localStorage.removeItem(k);
      }
    }
  } catch {}
}

/**
 * Membuka kunci (unlock) Web Audio API & Audio Element pada interaksi pengguna pertama
 * Sangat penting untuk mengatasi Autoplay Policy di browser Mobile (Android Chrome & Safari iOS)
 */
export function primeAudioOnUserInteraction(): void {
  if (typeof window === 'undefined' || isAudioContextUnlocked) return;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      // Buat buffer hening sebentar untuk membebaskan restriction
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    }
    isAudioContextUnlocked = true;
  } catch {}
}

/**
 * Menghentikan audio adzan yang sedang berkumandang
 */
export function stopAdhanAudio(): void {
  if (adhanStopTimeout) {
    clearTimeout(adhanStopTimeout);
    adhanStopTimeout = null;
  }

  if (globalAdhanAudio) {
    try {
      globalAdhanAudio.pause();
      globalAdhanAudio.currentTime = 0;
    } catch {}
    globalAdhanAudio = null;
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('iqraAdhanStatusChange', {
        detail: { isPlaying: false, prayerName: null },
      })
    );
  }
}

/**
 * Mengecek apakah audio adzan sedang aktif
 */
export function isAdhanPlaying(): boolean {
  return globalAdhanAudio !== null && !globalAdhanAudio.paused;
}

/**
 * Memutar suara adzan atau chime
 */
export async function playAdhanAudio(
  soundType: AdhanSoundType,
  muadhinId: string = 'makkah',
  isFajr: boolean = false,
  prayerName: string = 'Sholat'
): Promise<void> {
  if (typeof window === 'undefined') return;

  // Jika disetel senyap, tidak perlu memutar audio
  if (soundType === 'silent') return;

  stopAdhanAudio();

  // 1. Opsi Chime / Nada bel lembut
  if (soundType === 'chime') {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 2.2);
      }
    } catch {}
    return;
  }

  // 2. Opsi Adzan (Full atau Short)
  if (soundType === 'full' || soundType === 'short') {
    const muadhin = ADHAN_MUADHIN_LIST.find((m) => m.id === muadhinId) || ADHAN_MUADHIN_LIST[0];
    const audioSrc = isFajr ? muadhin.audioFajr : muadhin.audioStandard;

    try {
      const audio = new Audio(audioSrc);
      globalAdhanAudio = audio;

      audio.onended = () => {
        stopAdhanAudio();
      };

      audio.onerror = () => {
        stopAdhanAudio();
      };

      // Siarkan event agar komponen UI menampilkan floating player "Hentikan Adzan"
      window.dispatchEvent(
        new CustomEvent('iqraAdhanStatusChange', {
          detail: { isPlaying: true, prayerName, muadhinName: muadhin.name },
        })
      );

      await audio.play();

      // Jika mode ringkas (short), otomatis berhenti setelah 35 detik (takbir awal)
      if (soundType === 'short') {
        adhanStopTimeout = setTimeout(() => {
          stopAdhanAudio();
        }, 35000);
      }
    } catch (err) {
      console.warn('Gagal memutar audio adzan otomatis (Autoplay terhambat oleh browser):', err);
      // Fallback nada Web Audio jika browser memblokir berkas audio besar
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          if (audioCtx.state === 'suspended') await audioCtx.resume();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
          gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);
          osc.start();
          osc.stop(audioCtx.currentTime + 2.5);
        }
      } catch {}
    }
  }
}

/**
 * Memutar adzan langsung berdasarkan ID sholat (fajr, dhuhr, asr, maghrib, isha)
 * Dipanggil saat notifikasi diketuk atau tombol 'Putar Adzan' ditekan
 */
export async function triggerAdhanDirectly(prayerId?: string): Promise<void> {
  if (typeof window === 'undefined') return;
  primeAudioOnUserInteraction();
  const settings = getStoredPrayerSettings();
  const isFajr = prayerId === 'fajr';
  const prayerName = prayerId
    ? (PRAYER_LABELS[prayerId as PrayerName]?.name || prayerId)
    : 'Sholat';

  await playAdhanAudio(
    settings.soundType || 'full',
    settings.adhanMuadhin || 'makkah',
    isFajr,
    prayerName
  );
}

/**
 * Menampilkan Web Notification yang kompatibel dengan Android Mobile PWA & Desktop
 * Menggunakan ServiceWorkerRegistration.showNotification() sebagai jalur utama
 */
export async function showPrayerNotification({
  title,
  body,
  tag,
  prayerId,
}: {
  title: string;
  body: string;
  tag: string;
  prayerId?: string;
}): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  const notificationOptions: any = {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag, // Mencegah notifikasi ganda bertumpuk
    renotify: true,
    requireInteraction: true,
    vibrate: [500, 200, 500, 200, 500, 200, 800], // Pola getar pengingat di Android
    actions: [
      {
        action: 'play_adhan',
        title: '🔊 Putar Adzan',
        icon: '/icons/icon-192.png',
      },
      {
        action: 'open_schedule',
        title: '📖 Buka Jadwal',
        icon: '/icons/icon-192.png',
      },
    ],
    data: {
      url: '/sholat/?adzan=' + (prayerId || 'dhuhr') + '&play=1',
      prayerId: prayerId || 'dhuhr',
      shouldPlay: true,
      timestamp: Date.now(),
    },
  };

  // 1. Jalur Utama (Wajib untuk Android PWA / Chrome Mobile): ServiceWorkerRegistration
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, notificationOptions);
        return true;
      }
    } catch (err) {
      console.warn('ServiceWorker showNotification gagal, mencoba fallback window.Notification:', err);
    }
  }

  // 2. Jalur Cadangan (Desktop Chrome/Firefox/Safari): window.Notification
  try {
    new Notification(title, notificationOptions);
    return true;
  } catch (err) {
    console.warn('Gagal memunculkan notifikasi:', err);
    return false;
  }
}

/**
 * Pengecekan inti jadwal sholat dan penembakan notifikasi & adzan
 * Fungsi ini dipanggil secara adaptif oleh GlobalPrayerNotifier
 */
export async function checkAndTriggerPrayers(): Promise<void> {
  if (typeof window === 'undefined') return;

  const now = new Date();
  const city = getStoredCity();
  const settings = getStoredPrayerSettings();
  const todayTimes = calculateKemenagPrayerTimes(city.lat, city.lng, now, settings);
  const todayDateStr = formatDateYMD(now);

  // Daftar sholat fardhu + imsak yang dicek
  const prayersToCheck: PrayerName[] = ['imsak', 'fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  for (const prayerId of prayersToCheck) {
    const prayerDate = todayTimes[prayerId];
    if (!prayerDate) continue;

    const prayerName = PRAYER_LABELS[prayerId]?.name || prayerId;
    const timeStr = formatTimeHM(prayerDate);
    const isFajr = prayerId === 'fajr';

    // ── KASUS A: PEMBERITAHUAN SEBELUM WAKTU TIBA (misal: 5, 10, atau 15 menit sebelumnya) ──
    const reminderMins = settings.reminderMinutesBefore || 0;
    if (reminderMins > 0) {
      const reminderTargetMs = prayerDate.getTime() - reminderMins * 60 * 1000;
      const reminderDiffMs = now.getTime() - reminderTargetMs;

      // Jendela pemicu: Jika waktu reminder telah tiba dan masih dalam rentang 10 menit
      if (reminderDiffMs >= 0 && reminderDiffMs < 10 * 60 * 1000) {
        if (!isPrayerTriggered(todayDateStr, prayerId, reminderMins)) {
          markPrayerTriggered(todayDateStr, prayerId, reminderMins);

          const reminderTitle = `⏳ ${reminderMins} Menit Menuju ${prayerName}`;
          const reminderBody = `Waktu ${prayerName} untuk wilayah ${city.name} akan tiba pukul ${timeStr} WIB/WITA/WIT. Bersiaplah mengambil wudhu.`;

          await showPrayerNotification({
            title: reminderTitle,
            body: reminderBody,
            tag: `iqra-reminder-${prayerId}-${todayDateStr}`,
            prayerId,
          });

          // Bunyikan chime lembut untuk pengingat awal
          try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
              const ctx = new AudioCtx();
              if (ctx.state === 'suspended') await ctx.resume();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
              gain.gain.setValueAtTime(0.12, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
              osc.start();
              osc.stop(ctx.currentTime + 1.2);
            }
          } catch {}
        }
      }
    }

    // ── KASUS B: KETIKA WAKTU SHOLAT TELAH MASUK (SAAT WAKTU TIBA - ADZAN BERKUMANDANG) ──
    const arrivalDiffMs = now.getTime() - prayerDate.getTime();

    // Jendela pemicu adzan: Jika sudah masuk waktu dan masih dalam rentang 12 menit setelahnya
    if (arrivalDiffMs >= 0 && arrivalDiffMs < 12 * 60 * 1000) {
      if (!isPrayerTriggered(todayDateStr, prayerId, 0)) {
        markPrayerTriggered(todayDateStr, prayerId, 0);

        const adhanTitle = `🕌 Waktu Sholat ${prayerName} Telah Masuk!`;
        const adhanBody = isFajr
          ? `الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ. Waktu Subuh untuk wilayah ${city.name} (${timeStr}). Mari raih keberkahan fajar.`
          : `Waktu sholat ${prayerName} untuk wilayah ${city.name} (${timeStr}). Hayya 'alash Shalah.`;

        // 1. Munculkan Notifikasi Layar / Lockscreen
        await showPrayerNotification({
          title: adhanTitle,
          body: adhanBody,
          tag: `iqra-adhan-${prayerId}-${todayDateStr}`,
          prayerId,
        });

        // 2. Kumandangkan Suara Adzan Otomatis
        await playAdhanAudio(
          settings.soundType || 'full',
          settings.adhanMuadhin || 'makkah',
          isFajr,
          prayerName
        );
      }
    }
  }
}

/**
 * Uji coba Notifikasi & Suara Adzan langsung untuk verifikasi instan oleh user
 */
export async function testAdhanNotification(): Promise<{ success: boolean; message: string }> {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Browser tidak didukung.' };
  }

  // 1. Minta izin notifikasi jika belum
  if ('Notification' in window && Notification.permission !== 'granted') {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      return {
        success: false,
        message: 'Izin notifikasi belum diberikan. Silakan izinkan notifikasi pada browser/HP Anda.',
      };
    }
  }

  primeAudioOnUserInteraction();

  const city = getStoredCity();
  const settings = getStoredPrayerSettings();
  const muadhin = ADHAN_MUADHIN_LIST.find((m) => m.id === settings.adhanMuadhin) || ADHAN_MUADHIN_LIST[0];

  // 2. Munculkan Notifikasi Uji Coba ke Layar HP
  await showPrayerNotification({
    title: '🕌 Tes Notifikasi & Adzan Berhasil!',
    body: `Alhamdulillah! Pengingat sholat dan audio adzan Iqra (${muadhin.name}) aktif untuk wilayah ${city.name}.`,
    tag: `iqra-test-${Date.now()}`,
    prayerId: 'dhuhr',
  });

  // 3. Putar audio adzan selama 8 detik sebagai simulasi verifikasi
  try {
    const audioSrc = muadhin.audioStandard;
    stopAdhanAudio();

    const audio = new Audio(audioSrc);
    globalAdhanAudio = audio;

    window.dispatchEvent(
      new CustomEvent('iqraAdhanStatusChange', {
        detail: { isPlaying: true, prayerName: 'Tes Adzan', muadhinName: muadhin.name },
      })
    );

    await audio.play();

    // Hentikan setelah 8 detik tes
    adhanStopTimeout = setTimeout(() => {
      stopAdhanAudio();
    }, 8000);

    return {
      success: true,
      message: `Tes berhasil! Notifikasi dikirim dan audio adzan (${muadhin.name}) terdengar.`,
    };
  } catch (err: any) {
    return {
      success: true,
      message: 'Notifikasi berhasil dikirim. (Audio otomatis terhambat oleh izin autoplay browser)',
    };
  }
}
