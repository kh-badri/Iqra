'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { reverseGeocodePoint } from '@/features/mosque/mosqueService';

export interface AutoGeoCoords {
  lat: number;
  lng: number;
  name?: string;
}

interface UseAutoGeolocationOptions {
  onLocationFound?: (coords: AutoGeoCoords) => void;
  autoDetectOnMount?: boolean;
}

export function useAutoGeolocation(options: UseAutoGeolocationOptions = {}) {
  const { onLocationFound, autoDetectOnMount = true } = options;

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isGpsModalOpen, setIsGpsModalOpen] = useState<boolean>(false);
  const [gpsErrorReason, setGpsErrorReason] = useState<'off' | 'denied' | 'timeout' | null>(null);

  const hasDetectedRef = useRef<boolean>(false);
  const isLocatingRef = useRef<boolean>(false);

  // Ambil lokasi tersimpan dari localStorage terlebih dahulu saat mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iqra_prayer_city');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.lat && parsed.lng) {
            setCoords({ lat: parsed.lat, lng: parsed.lng });
            setLocationName(parsed.name || '');
          }
        } catch {}
      }
    }
  }, []);

  const detectLocation = useCallback(
    async (isUserInitiated: boolean = false) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        if (isUserInitiated) {
          alert('Perangkat Anda tidak mendukung geolokasi GPS.');
        }
        return;
      }

      if (isLocatingRef.current) return;
      isLocatingRef.current = true;
      setIsLocating(true);

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          isLocatingRef.current = false;
          setIsLocating(false);
          hasDetectedRef.current = true;
          setIsGpsModalOpen(false);
          setGpsErrorReason(null);

          const newCoords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCoords(newCoords);

          let resolvedName = 'Lokasi GPS Saat Ini';
          try {
            const geo = await reverseGeocodePoint(newCoords.lat, newCoords.lng);
            if (geo.address) {
              resolvedName = geo.address.split(',').slice(0, 3).join(', ');
            }
          } catch {}

          setLocationName(resolvedName);

          const cityObj = {
            id: 'auto-gps',
            name: resolvedName,
            province: 'GPS Otomatis',
            lat: newCoords.lat,
            lng: newCoords.lng,
          };

          try {
            localStorage.setItem('iqra_prayer_city', JSON.stringify(cityObj));
          } catch {}

          onLocationFound?.({
            lat: newCoords.lat,
            lng: newCoords.lng,
            name: resolvedName,
          });
        },
        (err) => {
          isLocatingRef.current = false;
          setIsLocating(false);

          let reason: 'off' | 'denied' | 'timeout' = 'off';
          if (err.code === 1) {
            reason = 'denied';
          } else if (err.code === 2) {
            reason = 'off'; // GPS dimatikan di HP
          } else if (err.code === 3) {
            reason = 'timeout';
          }

          setGpsErrorReason(reason);
          // Munculkan popup peringatan bahwa GPS sedang OFF / belum aktif
          setIsGpsModalOpen(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000, // Izinkan cache posisi 30 detik
        }
      );
    },
    [onLocationFound]
  );

  // Auto-deteksi langsung saat halaman dimuat
  useEffect(() => {
    if (autoDetectOnMount && !hasDetectedRef.current) {
      detectLocation(false);
    }
  }, [autoDetectOnMount, detectLocation]);

  // Otomatis deteksi ulang saat pengguna kembali ke tab browser setelah menyalakan GPS di pengaturan HP
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !hasDetectedRef.current) {
        detectLocation(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [detectLocation]);

  return {
    coords,
    locationName,
    isLocating,
    isGpsModalOpen,
    gpsErrorReason,
    detectLocation: () => detectLocation(true),
    closeGpsModal: () => setIsGpsModalOpen(false),
    openGpsModal: () => setIsGpsModalOpen(true),
    setCoords,
    setLocationName,
  };
}
