'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { PrayerCard } from './PrayerCard';
import { PrayerTimesTable } from './PrayerTimesTable';
import { AdhanNotificationPrompt } from './AdhanNotificationPrompt';
import { CitySelectorModal } from './CitySelectorModal';
import { PrayerSettingsModal } from './PrayerSettingsModal';
import { GpsPromptModal } from '@/components/ui/GpsPromptModal';
import { Card } from '@/components/ui/Card';
import { Compass, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { Coordinates, Qibla } from 'adhan';

// Dynamic import with SSR disabled for QiblaView and MosqueView
const QiblaView = dynamic(
  () => import('@/features/qibla/components/QiblaView').then((mod) => mod.QiblaView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[420px] bg-surface-alt flex items-center justify-center rounded-card border border-border">
        <div className="flex flex-col items-center gap-2 text-text-secondary text-xs">
          <Compass className="w-8 h-8 animate-spin text-primary" />
          <span>Memuat kompas kiblat...</span>
        </div>
      </div>
    ),
  }
);

const MosqueView = dynamic(
  () => import('@/features/mosque/components/MosqueView').then((mod) => mod.MosqueView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[420px] bg-surface-alt flex items-center justify-center rounded-card border border-border">
        <div className="flex flex-col items-center gap-2 text-text-secondary text-xs">
          <MapPin className="w-8 h-8 animate-spin text-primary" />
          <span>Memuat peta masjid terdekat...</span>
        </div>
      </div>
    ),
  }
);

export type PrayerHubTab = 'jadwal' | 'kiblat' | 'masjid';

interface PrayerMainViewProps {
  initialTab?: PrayerHubTab;
}

export function PrayerMainView({ initialTab = 'jadwal' }: PrayerMainViewProps = {}) {
  const [activeTab, setActiveTab] = React.useState<PrayerHubTab>(initialTab);

  const {
    city,
    settings,
    prayerList,
    nextPrayer,
    countdownFormatted,
    isLocating,
    isGpsModalOpen,
    closeGpsModal,
    gpsErrorReason,
    notificationPermission,
    requestGeolocation,
    changeCity,
    updateSettings,
    requestNotification,
    masehiDateStr,
    hijriDateStr,
  } = usePrayerTimes();

  const [isCityModalOpen, setIsCityModalOpen] = React.useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);

  // Hitung arah kiblat derajat
  const qiblaDirection = React.useMemo(() => {
    try {
      const coords = new Coordinates(city.lat, city.lng);
      return Math.round(Qibla(coords));
    } catch {
      return 295; // default ~295° untuk Indonesia
    }
  }, [city]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Info Halaman */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center">
            {activeTab === 'jadwal' && <Clock className="w-4 h-4" />}
            {activeTab === 'kiblat' && <Compass className="w-4 h-4" />}
            {activeTab === 'masjid' && <MapPin className="w-4 h-4" />}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            {activeTab === 'jadwal' && 'Jadwal Sholat & Pengingat'}
            {activeTab === 'kiblat' && 'Arah Kiblat Dinamis'}
            {activeTab === 'masjid' && 'Masjid & Musholla Terdekat'}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary">
          {activeTab === 'jadwal' &&
            'Waktu sholat akurat metode Kementerian Agama RI (Subuh 20°, Isya 18°, ihtiyath +2 menit).'}
          {activeTab === 'kiblat' &&
            'Kompas digital real-time yang bergerak otomatis mengikuti putaran smartphone Anda menuju Ka\'bah.'}
          {activeTab === 'masjid' &&
            'Peta Google Maps resmi untuk menemukan masjid & musholla terdekat dengan panduan navigasi rute.'}
        </p>
      </div>

      {/* Segmented Control 3-in-1 Hub: Jadwal | Arah Kiblat | Masjid Terdekat */}
      <div className="inline-flex p-1 bg-surface-alt border border-border rounded-pill gap-1 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setActiveTab('jadwal')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-pill text-xs font-extrabold transition-all duration-150 active:scale-95 ${
            activeTab === 'jadwal'
              ? 'bg-primary-gradient text-on-primary shadow-subtle'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Waktu Sholat</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('kiblat')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-pill text-xs font-extrabold transition-all duration-150 active:scale-95 ${
            activeTab === 'kiblat'
              ? 'bg-primary-gradient text-on-primary shadow-subtle'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Arah Kiblat</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('masjid')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-pill text-xs font-extrabold transition-all duration-150 active:scale-95 ${
            activeTab === 'masjid'
              ? 'bg-primary-gradient text-on-primary shadow-subtle'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Masjid Terdekat</span>
        </button>
      </div>

      {/* Konten Tab Aktif */}
      {activeTab === 'jadwal' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Hero Card Sholat Berikutnya */}
          <PrayerCard
            city={city}
            nextPrayer={nextPrayer}
            countdownFormatted={countdownFormatted}
            masehiDateStr={masehiDateStr}
            hijriDateStr={hijriDateStr}
            isLocating={isLocating}
            onOpenCitySelector={() => setIsCityModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onRequestGeolocation={requestGeolocation}
          />

          {/* Tabel 7 Waktu Sholat Hari Ini */}
          <PrayerTimesTable times={prayerList} />

          {/* Pengingat Adzan & Notifikasi Web */}
          <AdhanNotificationPrompt
            permission={notificationPermission}
            onRequestPermission={requestNotification}
          />

          {/* Quick Access Card ke Kiblat & Masjid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('kiblat')}
              className="text-left group w-full"
            >
              <Card hoverable className="p-4 flex items-center justify-between transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-card bg-primary-soft text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <span>Arah Kiblat dari {city.name}</span>
                      <span className="text-[10px] bg-primary-soft text-primary px-1.5 py-0.5 rounded font-bold">
                        Buka Kompas HP →
                      </span>
                    </div>
                    <div className="text-[11px] text-text-secondary mt-0.5">
                      {qiblaDirection}° dari arah Utara (Barat Laut)
                    </div>
                  </div>
                </div>
                <span className="font-mono font-bold text-sm text-accent">
                  {qiblaDirection}°
                </span>
              </Card>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('masjid')}
              className="text-left group w-full"
            >
              <Card hoverable className="p-4 flex items-center justify-between transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-card bg-primary-soft text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <span>Masjid &amp; Musholla Terdekat</span>
                      <span className="text-[10px] bg-primary-soft text-primary px-1.5 py-0.5 rounded font-bold">
                        Buka Peta →
                      </span>
                    </div>
                    <div className="text-[11px] text-text-secondary mt-0.5">
                      Cari masjid di sekitar lokasi Anda
                    </div>
                  </div>
                </div>
              </Card>
            </button>
          </div>

          {/* Rujukan Resmi */}
          <Card className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-card bg-primary-soft text-primary flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-text-primary">
                Rujukan Resmi Kemenag RI
              </div>
              <div className="text-[11px] text-text-secondary mt-0.5">
                Perhitungan jadwal sholat terverifikasi &amp; tersimpan offline di IndexedDB untuk 30 hari ke depan
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'kiblat' && (
        <div className="animate-in fade-in duration-200">
          <QiblaView embedded />
        </div>
      )}

      {activeTab === 'masjid' && (
        <div className="animate-in fade-in duration-200">
          <MosqueView embedded />
        </div>
      )}

      {/* Modal Pilih Kota */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={city}
        onSelectCity={changeCity}
        onRequestGeolocation={requestGeolocation}
        isLocating={isLocating}
      />

      {/* Modal Pengaturan Sholat */}
      <PrayerSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={updateSettings}
      />

      {/* Modal Peringatan GPS HP Nonaktif */}
      <GpsPromptModal
        isOpen={isGpsModalOpen}
        onClose={closeGpsModal}
        onRetry={() => requestGeolocation(false)}
        isLocating={isLocating}
        reason={gpsErrorReason}
      />
    </div>
  );
}
