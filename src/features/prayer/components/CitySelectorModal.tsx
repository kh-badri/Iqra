'use client';

import * as React from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { Navigation, Check } from 'lucide-react';
import { INDONESIAN_CITIES } from '../constants';
import type { CityLocation } from '../types';

export interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  onRequestGeolocation: () => void;
  isLocating?: boolean;
}

export function CitySelectorModal({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
  onRequestGeolocation,
  isLocating = false,
}: CitySelectorModalProps) {
  const [query, setQuery] = React.useState('');

  const filteredCities = React.useMemo(() => {
    if (!query.trim()) return INDONESIAN_CITIES;
    const q = query.toLowerCase().trim();
    return INDONESIAN_CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.province.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Pilih Kota & Wilayah Sholat">
      <div className="space-y-4 py-2">
        {/* Tombol Deteksi Lokasi Otomatis (Gradient Lime) */}
        <Button
          variant="primary"
          onClick={() => {
            onRequestGeolocation();
            onClose();
          }}
          disabled={isLocating}
          className="w-full gap-2 text-xs h-11 font-extrabold shadow-subtle"
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Mendeteksi Lokasi...' : 'Gunakan Lokasi GPS Otomatis'}</span>
        </Button>

        {/* Input Pencarian Kota */}
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          placeholder="Cari nama kota atau kabupaten..."
        />

        {/* Daftar Kota */}
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {filteredCities.map((c) => {
            const isSelected = selectedCity.name === c.name;
            return (
              <button
                key={c.id}
                onClick={() => {
                  onSelectCity(c);
                  onClose();
                }}
                className={`w-full p-3 rounded-button text-left flex items-center justify-between transition-colors border ${
                  isSelected
                    ? 'bg-pastel-green border-primary text-primary-text font-bold shadow-subtle'
                    : 'bg-surface border-border text-text-primary hover:bg-surface-alt'
                }`}
              >
                <div>
                  <div className="text-xs sm:text-sm font-bold tracking-tight">{c.name}</div>
                  <div className="text-[11px] text-text-secondary mt-0.5">{c.province}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary-text" />}
              </button>
            );
          })}
        </div>
      </div>
    </BottomSheet>
  );
}
