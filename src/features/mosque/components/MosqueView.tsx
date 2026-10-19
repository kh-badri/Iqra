'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Compass,
  MapPin,
  RefreshCw,
  Search,
  Navigation,
  Sliders,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { MosqueCard } from './MosqueCard';
import type { Mosque } from '../types';
import { GpsPromptModal } from '@/components/ui/GpsPromptModal';
import { useAutoGeolocation } from '@/lib/useAutoGeolocation';
import {
  fetchNearbyMosques,
  searchCityNominatim,
  deleteCustomMosque,
  searchMosqueByNameOnline,
  reverseGeocodePoint,
} from '../mosqueService';

// Dynamic import with SSR disabled for MosqueMap
const MosqueMap = dynamic(() => import('./MosqueMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[210px] sm:h-[260px] md:h-[320px] lg:h-[480px] bg-surface-alt flex items-center justify-center rounded-card border border-border">
      <div className="flex flex-col items-center gap-2 text-text-secondary text-xs">
        <Compass className="w-8 h-8 animate-spin text-primary" />
        <span>Memuat Google Maps resmi...</span>
      </div>
    </div>
  ),
});

const DEFAULT_COORDS = { lat: -6.1754, lng: 106.8272 }; // Jakarta Pusat (Masjid Istiqlal area)

interface MosqueViewProps {
  embedded?: boolean;
}

export const MosqueView: React.FC<MosqueViewProps> = ({ embedded = false }) => {
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [locationName, setLocationName] = useState('Jakarta Pusat (Default)');
  const [radiusKm, setRadiusKm] = useState<number>(3);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchingOnlineName, setSearchingOnlineName] = useState(false);

  // Filter: by default prioritize and show only mosques with real names
  const [filterOnlyNamed, setFilterOnlyNamed] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Manual city search
  const [searchCityQuery, setSearchCityQuery] = useState('');
  const [citySearchResults, setCitySearchResults] = useState<
    { name: string; lat: number; lng: number }[]
  >([]);
  const [searchingCity, setSearchingCity] = useState(false);

  const loadMosques = useCallback(
    async (lat: number, lng: number, rad: number, force: boolean = false) => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchNearbyMosques(lat, lng, rad, force);
        setMosques(data);
        if (data.length > 0) {
          const firstNamed = data.find((m) => m.isNamed) || data[0];
          setSelectedMosque(firstNamed);
        } else {
          setSelectedMosque(null);
        }
      } catch (err: any) {
        setError(err?.message || 'Gagal mengambil data masjid');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Auto-deteksi GPS otomatis saat halaman dimuat
  const {
    isLocating,
    isGpsModalOpen,
    gpsErrorReason,
    detectLocation,
    closeGpsModal,
  } = useAutoGeolocation({
    autoDetectOnMount: true,
    onLocationFound: (loc) => {
      const newCoords = { lat: loc.lat, lng: loc.lng };
      setCoords(newCoords);
      setLocationName(loc.name || 'Lokasi GPS Saya');
      loadMosques(loc.lat, loc.lng, radiusKm, true);
    },
  });

  // Restore lokasi terakhir dari localStorage saat pertama kali dimuat
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iqra_prayer_city');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.lat && parsed.lng) {
            setCoords({ lat: parsed.lat, lng: parsed.lng });
            setLocationName(parsed.name || 'Lokasi Tersimpan');
          }
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    loadMosques(coords.lat, coords.lng, radiusKm, false);
  }, [coords, radiusKm, loadMosques]);

  const handleGetCurrentLocation = () => {
    detectLocation();
  };

  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCityQuery.trim()) return;

    try {
      setSearchingCity(true);
      const results = await searchCityNominatim(searchCityQuery);
      setCitySearchResults(results);
    } catch {
      alert('Pencarian kota gagal. Pastikan jaringan internet aktif.');
    } finally {
      setSearchingCity(false);
    }
  };

  const selectCityResult = (res: { name: string; lat: number; lng: number }) => {
    setCoords({ lat: res.lat, lng: res.lng });
    setLocationName(res.name.split(',')[0]);
    setCitySearchResults([]);
    setSearchCityQuery('');
    loadMosques(res.lat, res.lng, radiusKm, true);
  };

  const handleDeleteCustomMosque = (id: string) => {
    deleteCustomMosque(id);
    setMosques((prev) => prev.filter((m) => m.id !== id));
    if (selectedMosque?.id === id) {
      setSelectedMosque(null);
    }
  };

  // Filtered mosques based on "Only Named" toggle and search query
  const displayedMosques = useMemo(() => {
    let list = mosques;
    if (filterOnlyNamed) {
      list = list.filter((m) => m.isNamed);
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          (m.address && m.address.toLowerCase().includes(q))
      );
    }
    return list;
  }, [mosques, filterOnlyNamed, searchFilter]);

  const namedCount = mosques.filter((m) => m.isNamed).length;
  const totalCount = mosques.length;

  return (
    <div className="space-y-6">
      {!embedded ? (
        <div className="border-b border-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Masjid &amp; Musholla Terdekat
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">
              Peta Google Maps resmi untuk menemukan masjid &amp; musholla terdekat dengan navigasi rute langsung ke lokasi.
            </p>
          </div>

          {/* Location Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className="text-xs flex items-center gap-1.5"
            >
              <Navigation className={`w-3.5 h-3.5 text-primary ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Mencari Lokasi...' : 'Gunakan GPS'}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadMosques(coords.lat, coords.lng, radiusKm, true)}
              disabled={loading}
              className="text-xs flex items-center gap-1.5"
              aria-label="Refresh data masjid"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Segarkan</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-surface p-3 rounded-card border border-border">
          <div className="flex items-center gap-2 text-xs text-text-secondary truncate">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate font-semibold text-text-primary">{locationName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className="text-xs flex items-center gap-1.5"
            >
              <Navigation className={`w-3.5 h-3.5 text-primary ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Mencari...' : 'Gunakan GPS'}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadMosques(coords.lat, coords.lng, radiusKm, true)}
              disabled={loading}
              className="text-xs flex items-center gap-1.5"
              aria-label="Refresh data masjid"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Segarkan</span>
            </Button>
          </div>
        </div>
      )}

      {/* Filter Bar: Radius, Only-Named Toggle & City Search */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Radius Selector */}
          <div className="md:col-span-5 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-xs font-semibold text-text-secondary shrink-0 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" />
              Radius:
            </span>
            {[1, 3, 5, 10].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRadiusKm(r)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors border ${
                  radiusKm === r
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-text-secondary border-border hover:border-primary'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>

          {/* Manual City Search Bar */}
          <div className="md:col-span-7 relative">
            <form onSubmit={handleCitySearch} className="flex gap-2">
              <SearchBar
                value={searchCityQuery}
                onChange={(e) => setSearchCityQuery(e.target.value)}
                onClear={() => setSearchCityQuery('')}
                placeholder="Pindah area kota (misal: Bandung, Surabaya, Medan)..."
              />
              <Button
                type="submit"
                variant="secondary"
                size="sm"
                disabled={searchingCity}
                className="shrink-0 text-xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline ml-1">Cari</span>
              </Button>
            </form>

            {/* Autocomplete City Dropdown */}
            {citySearchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-12 z-50 bg-surface border border-border rounded-card shadow-elevated overflow-hidden divide-y divide-border">
                {citySearchResults.map((city, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectCityResult(city)}
                    className="w-full text-left p-3 hover:bg-surface-alt transition-colors text-xs flex items-start gap-2"
                  >
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-text-primary leading-tight line-clamp-2">
                      {city.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter Toggle: Hanya yang Bernama vs Tampilkan Semua */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterOnlyNamed(!filterOnlyNamed)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 shadow-sm ${
                filterOnlyNamed
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface text-text-secondary border-border hover:border-primary'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{filterOnlyNamed ? 'Hanya yang Bernama Resmi' : 'Tampilkan Semua Titik'}</span>
              <span className="text-[10px] bg-black/20 text-white px-1.5 py-0.5 rounded-full font-mono">
                {displayedMosques.length}
              </span>
            </button>

            <span className="text-[11px] text-text-secondary hidden sm:inline">
              {filterOnlyNamed
                ? 'Menyembunyikan titik bangunan yang belum diberi nama oleh kontributor peta.'
                : 'Menampilkan seluruh titik bangunan termasuk yang belum bernama.'}
            </span>
          </div>

          {/* Quick Search in List */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Cari nama masjid..."
              className="w-full text-xs px-3 py-1.5 rounded-md border border-border bg-surface text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Active Location Info & Google Maps Discovery Banner */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-text-secondary bg-surface-alt px-3.5 py-2 rounded-card border border-border">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="truncate">
              Area: <strong className="text-text-primary">{locationName}</strong> ({coords.lat.toFixed(4)}, {coords.lng.toFixed(4)})
            </span>
          </div>
          <span className="shrink-0 font-semibold text-text-primary">
            {displayedMosques.length} Tempat Ditampilkan
            {filterOnlyNamed && totalCount > namedCount && (
              <span className="text-text-secondary font-normal ml-1">
                ({namedCount} Bernama dari {totalCount} Titik)
              </span>
            )}
          </span>
        </div>

        {/* Google Maps Info Box (ditampilkan di desktop/tablet, di mobile sudah terintegrasi rapi di kontrol peta) */}
        <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-surface rounded-card border border-border text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="text-base shrink-0">✨</span>
            <span>
              Peta terintegrasi langsung dengan <strong>Google Maps Resmi</strong> (100% gratis &amp; tampilan jernih menyatu tanpa garis kotak).
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.open(
                  `https://www.google.com/maps/search/masjid+terdekat/@${coords.lat},${coords.lng},16z`,
                  '_blank',
                  'noopener,noreferrer'
                );
              }
            }}
            className="shrink-0 text-xs gap-1.5"
          >
            <span>Buka Google Maps Lengkap</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Main View: Split Satellite Map & Mosque List */}
      {error ? (
        <ErrorState
          title="Gagal Memuat Peta Masjid"
          message={error}
          onRetry={() => loadMosques(coords.lat, coords.lng, radiusKm, true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Column (lg: 7 cols) with Satellite Mode */}
          <div className="lg:col-span-7 lg:sticky lg:top-20 space-y-3">
            <MosqueMap
              userLocation={coords}
              mosques={displayedMosques}
              selectedMosque={selectedMosque}
              onSelectMosque={setSelectedMosque}
              radiusKm={radiusKm}
            />
          </div>

          {/* List Column (lg: 5 cols) */}
          <div className="lg:col-span-5 space-y-3 lg:max-h-[520px] lg:overflow-y-auto no-scrollbar pr-0.5">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-card border border-border bg-surface space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="w-16 h-5 rounded-pill" />
                      <Skeleton className="w-12 h-5 rounded" />
                    </div>
                    <Skeleton className="w-3/4 h-5 rounded" />
                    <Skeleton className="w-full h-4 rounded" />
                  </div>
                ))}
              </div>
            ) : displayedMosques.length === 0 ? (
              searchFilter.trim() ? (
                <div className="p-4 rounded-card border border-border bg-surface-alt space-y-3">
                  <div className="flex items-center gap-2 text-text-primary font-semibold text-xs">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>&ldquo;{searchFilter}&rdquo; belum ada di daftar sekitar</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    Masjid yang tertera di label foto satelit Google mungkin belum dimasukkan oleh kontributor OpenStreetMap. Anda dapat mencari online atau menambahkannya langsung ke daftar.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={searchingOnlineName}
                      onClick={async () => {
                        setSearchingOnlineName(true);
                        const results = await searchMosqueByNameOnline(searchFilter, coords.lat, coords.lng);
                        setSearchingOnlineName(false);
                        if (results.length > 0) {
                          setMosques((prev) => [...results, ...prev]);
                          setSelectedMosque(results[0]);
                          alert(`Ditemukan ${results.length} tempat dari pencarian online!`);
                        } else {
                          alert(`Nama "${searchFilter}" belum ditemukan di database online sekitar. Anda dapat membuka Google Maps untuk melihat detail selengkapnya.`);
                        }
                      }}
                      className="text-xs"
                    >
                      <Search className="w-3.5 h-3.5 mr-1" />
                      <span>{searchingOnlineName ? 'Mencari...' : 'Cari di Database Online'}</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title={
                    filterOnlyNamed && totalCount > 0
                      ? 'Tidak Ada Masjid Bernama di Radius Ini'
                      : 'Tidak Ada Masjid di Radius Ini'
                  }
                  description={
                    filterOnlyNamed && totalCount > 0
                      ? `Ditemukan ${totalCount} titik bangunan di peta, namun belum memiliki nama resmi. Anda dapat mematikan filter untuk melihat seluruh titik.`
                      : `Tidak ditemukan masjid dalam radius ${radiusKm} km. Silakan pilih radius yang lebih besar (5 km atau 10 km).`
                  }
                  actionLabel={
                    filterOnlyNamed && totalCount > 0
                      ? 'Tampilkan Seluruh Titik'
                      : 'Perbesar Radius ke 5 km'
                  }
                  onAction={() => {
                    if (filterOnlyNamed && totalCount > 0) {
                      setFilterOnlyNamed(false);
                    } else {
                      setRadiusKm(5);
                    }
                  }}
                />
              )
            ) : (
              displayedMosques.map((mosque) => (
                <MosqueCard
                  key={mosque.id}
                  mosque={mosque}
                  isSelected={selectedMosque?.id === mosque.id}
                  onSelect={setSelectedMosque}
                  onDeleteCustom={handleDeleteCustomMosque}
                />
              ))
            )}
          </div>
        </div>
      )}
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
