'use client';

import React from 'react';
import { X, ExternalLink, Calendar, Clock, Tv, Share2, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import type { VideoItem } from '../types';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !video) return null;

  const youtubeWatchUrl = `https://www.youtube.com/watch?v=${video.id}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `Kajian ${video.title} oleh ${video.ustadz}`,
          url: youtubeWatchUrl,
        });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(youtubeWatchUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-none animate-in fade-in duration-150">
      <Card className="w-full max-w-3xl border border-border bg-surface p-0 shadow-2xl relative overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-3.5 sm:p-4 border-b border-border flex items-center justify-between gap-3 bg-surface">
          <div className="flex items-center gap-2 truncate">
            <span className="w-7 h-7 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <Tv className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-text-primary truncate">
              {video.ustadz}
            </span>
          </div>

          <button
            onClick={onClose}
            type="button"
            aria-label="Tutup pemutar video"
            className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 16:9 Video Embed Player */}
        <div className="w-full aspect-video bg-black shrink-0 relative">
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Video Metadata & Controls */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Chip variant="primary" className="text-[11px]">
                {video.category}
              </Chip>
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {video.duration}
              </span>
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {video.publishedAt}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-xs flex items-center gap-1.5"
                aria-label="Bagikan video"
              >
                {copied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Bagikan'}</span>
              </Button>

              <a
                href={youtubeWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary px-3 py-1.5 rounded-card bg-surface-alt hover:bg-primary-soft transition-colors border border-border"
              >
                <span>Buka di YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-text-primary">
              {video.title}
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
              {video.summary}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
