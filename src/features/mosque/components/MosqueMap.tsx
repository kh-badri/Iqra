'use client';

import React, { useState, useMemo } from 'react';
import type { Mosque } from '../types';

interface MosqueMapProps {
  userLocation: { lat: number; lng: number };
  mosques?: Mosque[];
  selectedMosque: Mosque | null;
  onSelectMosque?: (mosque: Mosque) => void;
  onRequestAddMosque?: (point: {
    lat: number;
    lng: number;
    defaultName?: string;
    defaultAddress?: string;
  }) => void;
  radiusKm?: number;
}

export default function MosqueMap({
  userLocation,
  selectedMosque,
}: MosqueMapProps) {
  // 'm' = Peta Jalan Google Maps (100% mulus), 'h' = Satelit Hybrid Google Maps (tanpa kepingan puzzle)
  const [mapType, setMapType] = useState<'m' | 'h'>('m');

  const gmapsEmbedUrl = useMemo(() => {
    if (selectedMosque) {
      const q = encodeURIComponent(
        `${selectedMosque.name}, ${selectedMosque.address || ''}`
      );
      return `https://maps.google.com/maps?q=${q}&ll=${selectedMosque.lat},${selectedMosque.lng}&z=16&t=${mapType}&output=embed`;
    }
    return `https://maps.google.com/maps?q=masjid+terdekat&ll=${userLocation.lat},${userLocation.lng}&z=15&t=${mapType}&output=embed`;
  }, [selectedMosque, userLocation, mapType]);

  return (
    <div className="w-full h-full relative rounded-card overflow-hidden border border-border shadow-subtle min-h-[420px] lg:min-h-[640px] bg-surface flex flex-col">
      {/* Switcher Tipe Peta Google: Peta Jalan vs Satelit */}
      <div className="absolute top-3 left-3 z-10 flex items-center bg-surface/95 backdrop-blur-sm border border-border rounded-pill shadow-elevated p-1 gap-1">
        <button
          type="button"
          onClick={() => setMapType('m')}
          className={`px-3 py-1 text-xs font-bold rounded-pill transition-colors flex items-center gap-1.5 ${
            mapType === 'm'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
          }`}
          aria-label="Peta Google Maps Standar"
        >
          <span>🗺️ Peta Google</span>
        </button>

        <button
          type="button"
          onClick={() => setMapType('h')}
          className={`px-3 py-1 text-xs font-bold rounded-pill transition-colors flex items-center gap-1.5 ${
            mapType === 'h'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
          }`}
          aria-label="Satelit Google Maps"
        >
          <span>🛰️ Satelit Google</span>
        </button>
      </div>

      {/* Google Maps Full Frame (100% Bebas Garis Puzzle & Data Tempat Lengkap) */}
      <iframe
        key={gmapsEmbedUrl}
        src={gmapsEmbedUrl}
        className="w-full h-full min-h-[420px] lg:min-h-[640px] flex-1 border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps Resmi Masjid Terdekat"
      />
    </div>
  );
}
