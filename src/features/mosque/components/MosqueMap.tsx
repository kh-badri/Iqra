'use client';

import React, { useState, useMemo } from 'react';
import { Map, Satellite, ExternalLink, Lock, Hand } from 'lucide-react';
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
  // 'm' = Peta Jalan Google Maps, 'h' = Satelit Hybrid Google Maps
  const [mapType, setMapType] = useState<'m' | 'h'>('m');
  // State interaktivitas: cegah scroll trap di HP dan hilangkan peringatan 'ctrl+scroll'
  const [isInteractive, setIsInteractive] = useState(false);

  const gmapsEmbedUrl = useMemo(() => {
    if (selectedMosque) {
      const q = encodeURIComponent(
        `${selectedMosque.name}, ${selectedMosque.address || ''}`
      );
      return `https://maps.google.com/maps?q=${q}&ll=${selectedMosque.lat},${selectedMosque.lng}&z=16&t=${mapType}&output=embed`;
    }
    return `https://maps.google.com/maps?q=masjid+terdekat&ll=${userLocation.lat},${userLocation.lng}&z=15&t=${mapType}&output=embed`;
  }, [selectedMosque, userLocation, mapType]);

  const externalMapUrl = useMemo(() => {
    if (selectedMosque) {
      return `https://www.google.com/maps/dir/?api=1&destination=${selectedMosque.lat},${selectedMosque.lng}`;
    }
    return `https://www.google.com/maps/search/masjid+terdekat/@${userLocation.lat},${userLocation.lng},15z`;
  }, [selectedMosque, userLocation]);

  return (
    <div className="w-full relative rounded-card overflow-hidden border border-border shadow-card bg-surface flex flex-col h-[210px] sm:h-[260px] md:h-[320px] lg:h-[480px]">
      {/* Sleek Top Controls Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between gap-2 pointer-events-auto">
        {/* Switcher Tipe Peta Google: Peta Jalan vs Satelit */}
        <div className="flex items-center bg-surface/90 backdrop-blur-md border border-border/80 rounded-pill p-0.5 shadow-subtle gap-0.5">
          <button
            type="button"
            onClick={() => setMapType('m')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-pill transition-all flex items-center gap-1 ${
              mapType === 'm'
                ? 'bg-primary text-white shadow-subtle'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            aria-label="Tampilan Peta Jalan Google Maps"
          >
            <Map className="w-3 h-3" />
            <span>Peta</span>
          </button>

          <button
            type="button"
            onClick={() => setMapType('h')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-pill transition-all flex items-center gap-1 ${
              mapType === 'h'
                ? 'bg-primary text-white shadow-subtle'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            aria-label="Tampilan Satelit Google Maps"
          >
            <Satellite className="w-3 h-3" />
            <span>Satelit</span>
          </button>
        </div>

        {/* Action Controls: Lock Toggle & Direct Google Maps Navigation */}
        <div className="flex items-center gap-1.5">
          {isInteractive ? (
            <button
              type="button"
              onClick={() => setIsInteractive(false)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-surface/95 text-text-primary border border-primary/40 rounded-pill shadow-elevated transition-all active:scale-95"
              title="Kunci interaksi peta agar halaman dapat digeser dengan mudah"
            >
              <Lock className="w-3 h-3 text-primary" />
              <span>Kunci Peta</span>
            </button>
          ) : null}

          <a
            href={externalMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-surface/90 backdrop-blur-md text-text-primary hover:text-primary border border-border/80 rounded-pill shadow-subtle transition-all active:scale-95"
            title="Buka navigasi rute lengkap di aplikasi Google Maps"
          >
            <span>Buka Maps</span>
            <ExternalLink className="w-3 h-3 text-primary" />
          </a>
        </div>
      </div>

      {/* Google Maps Embed with Touch-Scroll Protection */}
      <div className="w-full h-full relative flex-1">
        <iframe
          key={gmapsEmbedUrl}
          src={gmapsEmbedUrl}
          className={`w-full h-full border-0 ${
            isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps Resmi Masjid Terdekat"
        />

        {/* Non-interactive overlay: allows seamless page scrolling on touch screens without Google Maps gesture trap */}
        {!isInteractive && (
          <div
            onClick={() => setIsInteractive(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsInteractive(true);
              }
            }}
            className="absolute inset-0 z-10 cursor-pointer flex items-end justify-center pb-2.5 bg-transparent"
            title="Ketuk untuk menggeser atau memperbesar peta"
            aria-label="Ketuk untuk berinteraksi dengan peta"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-surface/90 backdrop-blur-md border border-border/80 text-[11px] font-bold text-text-primary shadow-elevated hover:bg-surface transition-all active:scale-95">
              <Hand className="w-3 h-3 text-primary" />
              <span>Sentuh untuk Geser Peta</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
