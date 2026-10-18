'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  RotateCw,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { QiblaCompass } from './QiblaCompass';
import { useCompass } from '../hooks/useCompass';
import {
  calculateDistanceToKaabaKm,
  getCardinalDirection,
} from '../qiblaService';
import { CitySelectorModal } from '@/features/prayer/components/CitySelectorModal';
import { GpsPromptModal } from '@/components/ui/GpsPromptModal';
import { useAutoGeolocation } from '@/lib/useAutoGeolocation';
import { DEFAULT_CITY } from '@/features/prayer/constants';
import type { CityLocation } from '@/features/prayer/types';

interface QiblaViewProps {
  embedded?: boolean;
}

export const QiblaView: React.FC<QiblaViewProps> = ({ embedded = false }) => {
  const [city, setCity] = useState<CityLocation>(DEFAULT_CITY);
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);

  // Otomatis deteksi GPS langsung saat halaman dimuat
  const {
    isLocating,
    isGpsModalOpen,
    gpsErrorReason,
    detectLocation,
    closeGpsModal,
  } = useAutoGeolocation({
    autoDetectOnMount: true,
    onLocationFound: (loc) => {
      setCity({
        id: 'auto-gps',
        name: loc.name || 'Lokasi GPS Saya',
        province: 'GPS Otomatis',
        lat: loc.lat,
        lng: loc.lng,
      });
    },
  });

  // Load kota tersimpan dari localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iqra_prayer_city');
      if (saved) {
        try {
          setCity(JSON.parse(saved));
        } catch {}
      }
    }
  }, []);

  // Hook sensor kompas HP
  const {
    heading,
    unwrappedHeading,
    qiblaBearing,
    relativeAngle,
    isAligned,
    isFlat,
    pitch,
    roll,
    hasSensor,
    isPermissionGranted,
    isSimulated,
    turnInfo,
    requestSensorPermission,
    setSimulatedHeading,
    setIsSimulated,
  } = useCompass({ lat: city.lat, lng: city.lng });

  // Jarak lurus ke Ka'bah di Makkah
  const distanceKm = calculateDistanceToKaabaKm(city.lat, city.lng);

  const handleGetCurrentLocation = () => {
    detectLocation();
  };

  const handleSelectCity = (newCity: CityLocation) => {
    setCity(newCity);
    try {
      localStorage.setItem('iqra_prayer_city', JSON.stringify(newCity));
    } catch {}
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {!embedded && (
        <>
          {/* Header Info Halaman */}
          <div className="border-b border-border pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Arah Kiblat Dinamis
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">
              Kompas digital real-time yang bergerak otomatis mengikuti putaran smartphone Anda menuju Ka&apos;bah di Makkah.
            </p>
          </div>

          {/* Tab Navigasi: Kompas Kiblat | Jadwal Sholat | Masjid Terdekat */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-4 py-1.5 rounded-card bg-primary text-white text-xs font-bold shadow-subtle flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Kompas Kiblat</span>
            </span>
            <Link
              href="/sholat/"
              className="px-4 py-1.5 rounded-card bg-surface-alt border border-border text-text-secondary hover:text-text-primary text-xs font-semibold transition-colors"
            >
              Jadwal Sholat
            </Link>
            <Link
              href="/masjid/"
              className="px-4 py-1.5 rounded-card bg-surface-alt border border-border text-text-secondary hover:text-text-primary text-xs font-semibold transition-colors"
            >
              Masjid Terdekat
            </Link>
          </div>
        </>
      )}

      {/* Bar Lokasi Aktif & Tombol GPS */}
      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface">
        <div className="flex items-center gap-2.5 truncate">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <div className="truncate">
            <div className="text-xs sm:text-sm font-bold text-text-primary truncate">
              {city.name}
            </div>
            <div className="text-[11px] text-text-secondary">
              Koordinat: {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="text-xs gap-1.5"
          >
            <Navigation className={`w-3.5 h-3.5 text-primary ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Mencari...' : 'Gunakan GPS'}</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsCityModalOpen(true)}
            className="text-xs"
          >
            Ganti Kota
          </Button>
        </div>
      </Card>

      {/* Banner Izin Sensor iOS (jika belum diizinkan) */}
      {!isPermissionGranted && (
        <Card className="p-4 border-amber-500/40 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 text-xs text-text-primary">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Izin Sensor Kompas Diperlukan (iOS Safari)</strong>
              <span>Ketuk tombol di samping agar iPhone mengizinkan akses kompas orientasi.</span>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={requestSensorPermission}
            className="shrink-0 text-xs"
          >
            Izinkan Kompas
          </Button>
        </Card>
      )}

      {/* Grid Kartu Metrik Utama */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3 text-center">
          <div className="text-[11px] font-semibold text-text-secondary">
            Arah Kiblat
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-primary mt-0.5">
            {qiblaBearing}°
          </div>
          <div className="text-[10px] text-text-secondary truncate mt-0.5">
            {getCardinalDirection(qiblaBearing)}
          </div>
        </Card>

        <Card className="p-3 text-center">
          <div className="text-[11px] font-semibold text-text-secondary">
            Arah Hadap HP
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-text-primary mt-0.5">
            {heading}°
          </div>
          <div className="text-[10px] text-text-secondary truncate mt-0.5">
            {getCardinalDirection(heading)}
          </div>
        </Card>

        <Card className="p-3 text-center">
          <div className="text-[11px] font-semibold text-text-secondary">
            Jarak ke Ka'bah
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-accent mt-0.5">
            {distanceKm.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-text-secondary mt-0.5">
            kilometer
          </div>
        </Card>

        <Card className="p-3 text-center">
          <div className="text-[11px] font-semibold text-text-secondary">
            Status Presisi
          </div>
          <div
            className={`text-sm sm:text-base font-bold mt-1.5 flex items-center justify-center gap-1 ${
              isAligned ? 'text-emerald-500' : 'text-amber-500'
            }`}
          >
            {isAligned ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Tepat</span>
              </>
            ) : (
              <>
                <RotateCw className="w-4 h-4" />
                <span>Sesuaikan</span>
              </>
            )}
          </div>
          <div className="text-[10px] text-text-secondary mt-0.5">
            {isAligned ? '±3° dari Ka\'bah' : `${Math.abs(Math.round(relativeAngle))}° selisih`}
          </div>
        </Card>
      </div>

      {/* Kompas Utama Dinamis */}
      <Card className="p-6 sm:p-8 flex flex-col items-center justify-center bg-surface border border-border">
        <QiblaCompass
          heading={heading}
          unwrappedHeading={unwrappedHeading}
          qiblaBearing={qiblaBearing}
          relativeAngle={relativeAngle}
          isAligned={isAligned}
          isFlat={isFlat}
          pitch={pitch}
          roll={roll}
          turnInfo={turnInfo}
          isPermissionGranted={isPermissionGranted}
          onRequestPermission={requestSensorPermission}
        />
      </Card>

      {/* Mode Simulasi Interaktif untuk Pengujian Desktop (Bila Tidak Ada Magnetometer Fisik) */}
      {isSimulated && (
        <Card className="p-4 bg-surface-alt border border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
              <Sliders className="w-4 h-4 text-primary" />
              <span>Simulasi Putaran Kompas (Uji Coba Komputer/Desktop)</span>
            </div>
            <span className="text-[10px] bg-primary-soft text-primary px-2 py-0.5 rounded-full font-semibold">
              Mode Desktop
            </span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Perangkat komputer Anda tidak memiliki sensor kompas fisik. Geser slider di bawah ini untuk mensimulasikan gerakan putar smartphone secara manual (di HP Android/iPhone, kompas akan bergerak otomatis mengikuti tangan Anda).
          </p>

          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-text-secondary">0° (Utara)</span>
              <span className="font-bold text-primary">{heading}°</span>
              <span className="text-text-secondary">360°</span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={heading}
              onChange={(e) => setSimulatedHeading(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-surface rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSimulatedHeading(0)}
              className="text-xs py-1 h-7"
            >
              Utara (0°)
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSimulatedHeading(90)}
              className="text-xs py-1 h-7"
            >
              Timur (90°)
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSimulatedHeading(180)}
              className="text-xs py-1 h-7"
            >
              Selatan (180°)
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSimulatedHeading(270)}
              className="text-xs py-1 h-7"
            >
              Barat (270°)
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSimulatedHeading(qiblaBearing)}
              className="text-xs py-1 h-7 text-emerald-600 font-bold ml-auto"
            >
              ✨ Tepat Kiblat ({qiblaBearing}°)
            </Button>
          </div>
        </Card>
      )}

      {/* Petunjuk Penggunaan & Kalibrasi Kompas HP */}
      <Card className="p-4 space-y-3 bg-surface border border-border">
        <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
          <HelpCircle className="w-4 h-4 text-primary" />
          <span>Tips Memperoleh Arah Kiblat yang Sangat Akurat</span>
        </div>
        <ul className="text-xs text-text-secondary space-y-2 list-disc list-inside leading-relaxed">
          <li>
            <strong>Pegang HP secara mendatar:</strong> Letakkan HP di telapak tangan atau permukaan meja yang rata sejajar dengan lantai agar sensor kompas bekerja optimal.
          </li>
          <li>
            <strong>Jauhkan dari gangguan medan magnet:</strong> Hindari berada di dekat speaker besar, laptop, benda logam besi, atau casing HP magnetik yang dapat membiaskan jarum kompas.
          </li>
          <li>
            <strong>Kalibrasi sensor jika arah terasa meleset:</strong> Pegang smartphone dan gerakkan membentuk pola angka delapan (∞) di udara selama beberapa detik untuk mengkalibrasi ulang kompas internal.
          </li>
          <li>
            <strong>Getar Haptik:</strong> Smartphone yang mendukung getar akan bergetar lembut saat HP Anda tepat menghadap ke arah Ka'bah.
          </li>
        </ul>
      </Card>

      {/* Modal Pemilihan Kota */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={city}
        onSelectCity={handleSelectCity}
        onRequestGeolocation={handleGetCurrentLocation}
        isLocating={isLocating}
      />

      {/* Modal Peringatan GPS HP Nonaktif */}
      <GpsPromptModal
        isOpen={isGpsModalOpen}
        onClose={closeGpsModal}
        onRetry={handleGetCurrentLocation}
        isLocating={isLocating}
        reason={gpsErrorReason}
      />
    </div>
  );
};
