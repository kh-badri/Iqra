'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  calculateQiblaBearing,
  unwrapAngle,
  getTurnInstruction,
} from '../qiblaService';
import type { CompassData } from '../types';

interface UseCompassOptions {
  lat: number;
  lng: number;
}

export const isMobileBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const hasTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  return Boolean(isMobileUA || hasTouch);
};

export const isIosDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /iPhone|iPad|iPod/i.test(ua);
};

export const isIosPermissionRequired = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    typeof (DeviceOrientationEvent as any) !== 'undefined' &&
    typeof (DeviceOrientationEvent as any).requestPermission === 'function'
  );
};

export function useCompass({ lat, lng }: UseCompassOptions) {
  const [heading, setHeading] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);
  const [roll, setRoll] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [hasSensor, setHasSensor] = useState<boolean>(true);
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(() => {
    return !isIosPermissionRequired();
  });
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [simulatedHeading, setSimulatedHeading] = useState<number>(0);

  const prevHeadingRef = useRef<number>(0);
  const unwrappedHeadingRef = useRef<number>(0);
  const hasReceivedDataRef = useRef<boolean>(false);
  const wasAlignedRef = useRef<boolean>(false);
  const receivedAbsoluteRef = useRef<boolean>(false);

  // Arah Kiblat berdasarkan koordinat pengguna
  const qiblaBearing = calculateQiblaBearing(lat, lng);

  // Derajat aktif (apakah menggunakan sensor atau simulasi desktop)
  const activeHeading = isSimulated ? simulatedHeading : heading;

  // Hitung perbedaan sudut hadap HP ke arah Kiblat (-180 sampai +180)
  const diff = ((qiblaBearing - activeHeading + 540) % 360) - 180;
  const isAligned = Math.abs(diff) <= 3;

  // Cek apakah HP dipegang mendatar (optimal untuk akurasi sensor kompas)
  const isFlat = Math.abs(pitch) <= 25 && Math.abs(roll) <= 25;

  // Haptic feedback (getar halus) saat tepat mengarah ke Kiblat
  useEffect(() => {
    if (isAligned && !wasAlignedRef.current) {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([40, 60, 40]);
        } catch {}
      }
    }
    wasAlignedRef.current = isAligned;
  }, [isAligned]);

  // Request Permission khusus iOS Safari 13+
  const requestSensorPermission = useCallback(async () => {
    if (isIosPermissionRequired()) {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setIsPermissionGranted(true);
          return true;
        } else {
          setIsPermissionGranted(false);
          return false;
        }
      } catch {
        setIsPermissionGranted(false);
        return false;
      }
    }
    setIsPermissionGranted(true);
    return true;
  }, []);

  // Handler Event Orientasi Perangkat
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobile = isMobileBrowser();

    // Timeout untuk mendeteksi apakah perangkat memiliki sensor kompas fisik
    // HANYA aktifkan simulasi pada Desktop/Komputer yang tidak memiliki sensor fisik
    const timeout = setTimeout(() => {
      if (!hasReceivedDataRef.current && !isMobile) {
        setHasSensor(false);
        setIsSimulated(true); // Fallback simulasi hanya untuk desktop browser
      }
    }, 2500);

    const processOrientationEvent = (event: DeviceOrientationEvent) => {
      let currentHeading: number | null = null;

      // 1. Prioritas iOS: webkitCompassHeading langsung memberikan arah kompas magnetik (0 - 360°)
      if (typeof (event as any).webkitCompassHeading === 'number') {
        currentHeading = (event as any).webkitCompassHeading;
        if (typeof (event as any).webkitCompassAccuracy === 'number') {
          setAccuracy((event as any).webkitCompassAccuracy);
        }
      }
      // 2. Android / W3C DeviceOrientationEvent:
      // event.alpha memutar balik (counter-clockwise) dari arah utara ketika HP mendatar
      else if (event.alpha !== null && typeof event.alpha === 'number') {
        let headingDeg = (360 - event.alpha) % 360;

        // Kompensasi rotasi orientasi layar (Portrait vs Landscape)
        const screenAngle =
          (window.screen?.orientation?.angle) ||
          (typeof window.orientation === 'number' ? (window.orientation as number) : 0);

        if (screenAngle) {
          headingDeg = (headingDeg + screenAngle) % 360;
        }

        currentHeading = headingDeg;
      }

      if (currentHeading !== null && !isNaN(currentHeading)) {
        hasReceivedDataRef.current = true;
        setHasSensor(true);
        setIsSimulated(false);

        // Low-pass filter melingkar (circular filter) untuk memperhalus jitter getaran tangan
        // Menghitung selisih sudut terdekat (-180 sampai +180) agar tidak melompat di batas 0/360
        const delta = ((currentHeading - prevHeadingRef.current + 540) % 360) - 180;
        const smoothHeading = ((prevHeadingRef.current + delta * 0.45) % 360 + 360) % 360;

        prevHeadingRef.current = smoothHeading;
        unwrappedHeadingRef.current = unwrapAngle(unwrappedHeadingRef.current, smoothHeading);

        setHeading(Math.round(smoothHeading));

        if (event.beta !== null) setPitch(Math.round(event.beta));
        if (event.gamma !== null) setRoll(Math.round(event.gamma));
      }
    };

    const handleOrientationAbsolute = (event: DeviceOrientationEvent) => {
      receivedAbsoluteRef.current = true;
      processOrientationEvent(event);
    };

    const handleOrientationStandard = (event: DeviceOrientationEvent) => {
      // Jika event absolute Android sudah diterima, abaikan event standar kecuali pada iOS
      if (receivedAbsoluteRef.current && typeof (event as any).webkitCompassHeading !== 'number') {
        return;
      }
      processOrientationEvent(event);
    };

    // Listen ke kedua event (deviceorientationabsolute & deviceorientation)
    // untuk menjamin kompatibilitas 100% pada seluruh jenis browser Android dan iOS
    try {
      window.addEventListener('deviceorientationabsolute' as any, handleOrientationAbsolute as any, true);
    } catch {}

    try {
      window.addEventListener('deviceorientation', handleOrientationStandard, true);
    } catch {}

    return () => {
      clearTimeout(timeout);
      try {
        window.removeEventListener('deviceorientationabsolute' as any, handleOrientationAbsolute as any, true);
      } catch {}
      try {
        window.removeEventListener('deviceorientation', handleOrientationStandard, true);
      } catch {}
    };
  }, []);

  const turnInfo = getTurnInstruction(diff);

  const compassData: CompassData = {
    heading: activeHeading,
    qiblaBearing,
    relativeAngle: diff,
    isAligned,
    accuracy,
    hasSensor,
    isPermissionGranted,
    pitch,
    roll,
    isFlat,
    isSimulated,
  };

  return {
    ...compassData,
    unwrappedHeading: unwrappedHeadingRef.current,
    turnInfo,
    requestSensorPermission,
    setSimulatedHeading,
    setIsSimulated,
    isIos: isIosDevice(),
  };
}
