'use client';

import * as React from 'react';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';
import { MapPinOff, Navigation, RefreshCw, CheckCircle2 } from 'lucide-react';

export interface GpsPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  isLocating?: boolean;
  reason?: 'off' | 'denied' | 'timeout' | null;
}

export function GpsPromptModal({
  isOpen,
  onClose,
  onRetry,
  isLocating = false,
  reason = 'off',
}: GpsPromptModalProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm sm:text-base">
          <MapPinOff className="w-5 h-5 shrink-0" />
          <span>GPS / Layanan Lokasi Belum Aktif</span>
        </div>
      }
    >
      <div className="space-y-4 py-1 select-none">
        {/* Banner Ilustrasi & Pesan */}
        <div className="p-4 rounded-card bg-amber-500/10 border border-amber-500/30 text-text-primary space-y-2">
          <p className="text-xs sm:text-sm leading-relaxed">
            {reason === 'denied'
              ? 'Izin akses lokasi belum diberikan pada browser ini. Untuk akurasi otomatis arah kiblat, jadwal sholat, dan masjid terdekat, silakan izinkan akses lokasi.'
              : 'GPS atau Layanan Lokasi di smartphone Anda saat ini dalam kondisi nonaktif (OFF).'}
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            Aplikasi Iqra dirancang untuk <strong>langsung mendeteksi otomatis lokasi Anda</strong> saat GPS dinyalakan, tanpa perlu memilih kota secara manual.
          </p>
        </div>

        {/* Panduan Cepat Menyalakan GPS */}
        <div className="space-y-2 bg-surface-alt p-3.5 rounded-card border border-border">
          <div className="text-xs font-bold text-text-primary flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Cara Cepat Mengaktifkan GPS:</span>
          </div>
          <ol className="text-xs text-text-secondary space-y-2 list-decimal list-inside leading-relaxed pl-1">
            <li>
              Tarik menu atas layar HP Anda (<strong>Control Center / Panel Notifikasi</strong>).
            </li>
            <li>
              Ketuk ikon <strong>Lokasi / GPS</strong> hingga berwarna aktif.
            </li>
            <li>
              Kembali ke halaman ini atau ketuk tombol <strong>&ldquo;Deteksi Ulang Sekarang&rdquo;</strong> di bawah.
            </li>
          </ol>
        </div>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <Button
            variant="primary"
            onClick={onRetry}
            disabled={isLocating}
            className="w-full gap-2 text-xs h-11"
          >
            <RefreshCw className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Mendeteksi Lokasi...' : 'Deteksi Ulang Sekarang'}</span>
          </Button>

          <Button
            variant="secondary"
            onClick={onClose}
            className="w-full sm:w-auto text-xs h-11 shrink-0"
          >
            Gunakan Lokasi Terakhir
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
