'use client';

import * as React from 'react';
import { Volume2, VolumeX, Bell } from 'lucide-react';
import {
  checkAndTriggerPrayers,
  primeAudioOnUserInteraction,
  stopAdhanAudio,
} from '../services/prayerNotifierService';

export function GlobalPrayerNotifier() {
  const [adhanState, setAdhanState] = React.useState<{
    isPlaying: boolean;
    prayerName: string | null;
    muadhinName?: string;
  }>({
    isPlaying: false,
    prayerName: null,
  });

  React.useEffect(() => {
    // 1. Prime Audio Context saat sentuhan/klik pertama pada aplikasi
    const handleFirstInteraction = () => {
      primeAudioOnUserInteraction();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });

    // 2. Dengarkan status pemutaran Adzan untuk memunculkan floating player
    const handleAdhanStatus = (e: any) => {
      const detail = e.detail || {};
      setAdhanState({
        isPlaying: !!detail.isPlaying,
        prayerName: detail.prayerName || null,
        muadhinName: detail.muadhinName || '',
      });
    };
    window.addEventListener('iqraAdhanStatusChange', handleAdhanStatus);

    // 3. Tangani klik notifikasi dari Service Worker saat layar HP dibuka
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NOTIFICATION_CLICKED') {
          // Ketika notifikasi diklik, cek dan sinkronkan jadwal
          checkAndTriggerPrayers();
        }
      });
    }

    // 4. Jalankan pengecekan pertama saat mount
    checkAndTriggerPrayers();

    // 5. Timer pengecekan berkala (setiap 2 detik saat aktif)
    const intervalId = setInterval(() => {
      checkAndTriggerPrayers();
    }, 2000);

    // 6. Tangani event saat layar HP dinyalakan kembali (Visibility Change)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndTriggerPrayers();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('iqraAdhanStatusChange', handleAdhanStatus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, []);

  if (!adhanState.isPlaying) {
    return null;
  }

  return (
    <div className="fixed top-3 inset-x-3 sm:inset-x-auto sm:right-6 sm:w-96 z-50 animate-slide-down">
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-3.5 rounded-card shadow-2xl border border-emerald-500/40 flex items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-emerald-500/25 border border-emerald-400/30 flex items-center justify-center shrink-0 animate-pulse text-emerald-200">
            <Volume2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Adzan Berkumandang</span>
            </div>
            <div className="text-xs font-bold text-white truncate">
              Waktu {adhanState.prayerName || 'Sholat'} Telah Tiba
            </div>
            {adhanState.muadhinName && (
              <div className="text-[10px] text-emerald-200/80 truncate">
                Lantunan: {adhanState.muadhinName}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => stopAdhanAudio()}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black shadow-md transition-all border border-rose-400/40"
        >
          <VolumeX className="w-3.5 h-3.5" />
          <span>Hentikan</span>
        </button>
      </div>
    </div>
  );
}
