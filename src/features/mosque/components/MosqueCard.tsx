'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Share2, Check, ExternalLink, Trash2, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
      className={`p-4 transition-all duration-200 border ${
        isSelected
          ? 'border-primary bg-primary-soft/20 shadow-elevated'
          : isCustom
          ? 'border-accent/40 bg-accent/5'
          : 'border-border bg-surface'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <Chip
              variant={mosque.type === 'masjid' ? 'primary' : 'secondary'}
              className="text-[10px] py-0.5 px-2"
            >
              {mosque.type === 'masjid' ? 'Masjid' : 'Musholla'}
            </Chip>

            {isCustom ? (
              <span className="text-[10px] font-bold text-accent bg-accent/20 px-2 py-0.5 rounded flex items-center gap-1">
                <Star className="w-3 h-3 fill-accent" />
                <span>Pilihan Anda</span>
              </span>
            ) : mosque.isNamed ? (
              <span className="text-[10px] font-semibold text-primary bg-primary-soft/40 px-1.5 py-0.5 rounded">
                ✓ Terverifikasi
              </span>
            ) : (
              <span className="text-[10px] text-text-secondary bg-surface-alt px-1.5 py-0.5 rounded border border-border">
                Titik Bangunan
              </span>
            )}

            <span className="text-xs font-bold text-accent ml-auto">
              {formatDistance(mosque.distanceM)}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-text-primary leading-snug line-clamp-1">
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
              className="p-1.5 rounded-full text-text-secondary hover:text-red-400 hover:bg-surface-alt transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleShare}
            aria-label="Bagikan lokasi masjid"
            className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {mosque.address && (
        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-3 flex items-start gap-1">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-text-secondary" />
          <span>{mosque.address}</span>
        </p>
      )}

      <div className="pt-2 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-secondary">
            {mosque.lat.toFixed(4)}, {mosque.lng.toFixed(4)}
          </span>
        </div>

        <a
          href={directionUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-pressed transition-colors"
        >
          <span>Petunjuk Arah</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </Card>
  );
};
