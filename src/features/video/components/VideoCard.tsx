'use client';

import React, { useState } from 'react';
import { ExternalLink, Clock, User, Play, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { YouTubeIcon } from './YouTubeIcon';
import type { VideoItem } from '../types';

interface VideoCardProps {
  video: VideoItem;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);

  const thumbUrl = video.thumbnailUrl || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;

  const handleOpenYouTube = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      window.open(video.youtubeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlaying((prev) => !prev);
  };

  return (
    <Card
      hoverable={!isPlaying}
      className="p-4 sm:p-5 border border-border bg-surface flex flex-col justify-between group transition-all duration-200 rounded-card shadow-card"
    >
      <div className="space-y-3">
        {/* Interactive Video Embed / Thumbnail Container */}
        <div className="relative aspect-video w-full rounded-card overflow-hidden bg-surface-2 border border-border">
          {isPlaying ? (
            <div className="relative w-full h-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
                title={video.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="absolute top-2.5 right-2.5 z-20 px-3 py-1.5 bg-black/85 hover:bg-black text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-md border border-white/20 transition-all active:scale-95"
                aria-label="Tutup pemutar video"
              >
                <X className="w-4 h-4" />
                <span>Tutup</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="relative w-full h-full block text-left group/thumb cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={`Putar video ${video.title} langsung di dalam kartu`}
            >
              {!imgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300 ease-out"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-surface-2 text-center">
                  <YouTubeIcon className="w-10 h-10 text-red-600 mb-1" />
                  <p className="text-xs text-text-muted font-medium">Video Kajian YouTube</p>
                </div>
              )}

              {/* Backdrop Tint & Big Play Button */}
              <div className="absolute inset-0 bg-black/25 group-hover/thumb:bg-black/15 flex items-center justify-center transition-colors">
                <div className="w-13 h-13 rounded-full bg-red-600 text-white flex items-center justify-center shadow-card group-hover/thumb:scale-110 group-hover/thumb:bg-red-700 transition-all duration-200">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </div>

              {/* Category Pill Tag (Top Left) */}
              <div className="absolute top-2.5 left-2.5 bg-surface/90 backdrop-blur-md text-text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-border/80 shadow-xs">
                {video.category}
              </div>

              {/* Duration Badge (Bottom Right) */}
              <div className="absolute bottom-2.5 right-2.5 bg-black/85 text-white text-[10px] font-mono font-medium px-2 py-0.5 rounded-md shadow-xs">
                {video.duration}
              </div>
            </button>
          )}
        </div>

        {/* Ustadz & Published Date Meta */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-2 text-xs font-bold text-primary-text truncate">
            <span className="w-6 h-6 rounded-full bg-pastel-green text-[#266308] border border-pastel-green/40 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5" />
            </span>
            <span className="truncate">{video.ustadz}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-text-muted shrink-0 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{video.publishedAt}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-text-primary leading-snug group-hover:text-primary-text transition-colors line-clamp-2">
          {video.title}
        </h3>

        {/* Summary Description */}
        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
          {video.summary}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-3.5 mt-3.5 border-t border-border flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleTogglePlay}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-button text-xs font-bold transition-all min-h-[44px] active:scale-95 ${
            isPlaying
              ? 'bg-primary-gradient text-on-primary shadow-subtle'
              : 'bg-surface-2 text-text-primary border border-border hover:border-primary/50'
          }`}
        >
          {isPlaying ? (
            <>
              <X className="w-3.5 h-3.5" />
              <span>Tutup Pemutar</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Putar di Sini</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleOpenYouTube}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-button bg-surface-2 hover:bg-surface border border-border text-xs font-bold text-text-muted hover:text-red-600 transition-colors min-h-[44px]"
          title="Buka langsung video di aplikasi atau situs YouTube"
        >
          <YouTubeIcon className="w-4 h-4 text-red-600" />
          <span className="hidden sm:inline">YouTube</span>
          <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
        </button>
      </div>
    </Card>
  );
};
