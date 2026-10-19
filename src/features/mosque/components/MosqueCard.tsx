'use client';

import React, { useState } from 'react';
import { MapPin, Share2, Check, ExternalLink, Trash2, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import type { Mosque } from '../types';

interface MosqueCardProps {
  mosque: Mosque;
  isSelected?: boolean;
  onSelect?: (mosque: Mosque) => void;
  onDeleteCustom?: (id: string) => void;
}

export const MosqueCard: React.FC<MosqueCardProps> = ({
  mosque,
  isSelected = false,
  onSelect,
  onDeleteCustom,
}) => {
  const [copied, setCopied] = useState(false);
  const isCustom = mosque.id.startsWith('custom-');

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mosque.lat},${mosque.lng}`;
    const shareText = `${mosque.name} (${formatDistance(mosque.distanceM)}): ${mapUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: mosque.name,
          text: `Lokasi ${mosque.name}`,
          url: mapUrl,
        });
        return;
      } catch {}
    }

    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lng}`;

  return (
    <Card
      hoverable
      onClick={() => onSelect?.(mosque)}
      className={`p-4 transition-all duration-200 border shadow-card ${
        isSelected
          ? 'border-primary bg-pastel-green/30 ring-2 ring-primary/20 shadow-glow'
          : isCustom
          ? 'border-warning/40 bg-surface'
          : 'border-border bg-surface'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <Chip
              variant={mosque.type === 'masjid' ? 'pastel-blue' : 'pastel-green'}
              className="text-[10px] py-0.5 px-2 font-bold"
            >
              {mosque.type === 'masjid' ? 'Masjid' : 'Musholla'}
            </Chip>

            {isCustom ? (
              <span className="text-[10px] font-extrabold text-warning bg-pastel-yellow px-2 py-0.5 rounded-pill flex items-center gap-1">
                <Star className="w-3 h-3 fill-warning" />
                <span>Tersimpan</span>
              </span>
            ) : mosque.isNamed ? (
              <span className="text-[10px] font-extrabold text-primary-text bg-pastel-green px-1.5 py-0.5 rounded-pill">
                ✓ Terverifikasi
              </span>
            ) : (
              <span className="text-[10px] text-text-secondary bg-surface-alt px-1.5 py-0.5 rounded-pill border border-border">
                Titik Bangunan
              </span>
            )}

            <span className="text-xs font-black text-primary-text font-mono ml-auto tabular-nums">
              {formatDistance(mosque.distanceM)}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-extrabold text-text-primary leading-snug line-clamp-1 tracking-tight">
            {mosque.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isCustom && onDeleteCustom && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Hapus "${mosque.name}" dari daftar masjid tersimpan?`)) {
                  onDeleteCustom(mosque.id);
                }
              }}
              title="Hapus masjid ini"
              aria-label="Hapus masjid tersimpan"
              className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-danger hover:bg-surface-alt transition-colors active:scale-90"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleShare}
            aria-label="Bagikan lokasi masjid"
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors active:scale-90"
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {mosque.address && (
        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-3 flex items-start gap-1">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-text-muted" />
          <span>{mosque.address}</span>
        </p>
      )}

      <div className="pt-2.5 border-t border-border flex items-center justify-between">
        <span className="text-[11px] text-text-muted font-mono">
          {mosque.lat.toFixed(4)}, {mosque.lng.toFixed(4)}
        </span>

        <a
          href={directionUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-primary-text hover:text-primary transition-colors py-1 px-2.5 rounded-pill hover:bg-pastel-green/50 active:scale-95"
        >
          <span>Petunjuk Arah</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </Card>
  );
};
