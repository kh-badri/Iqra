'use client';

import React, { useState, useEffect } from 'react';
import { Tv, Search, WifiOff, ExternalLink, User, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/ui/SearchBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Chip } from '@/components/ui/Chip';
import { VideoCard } from './VideoCard';
import type { ChannelsData, VideoItem, YouTubeChannel } from '../types';
import { getChannelsData } from '../videoService';
import { cn } from '@/lib/utils';

import { YouTubeIcon } from './YouTubeIcon';

interface VideoListViewProps {
  embedded?: boolean;
}

export const VideoListView: React.FC<VideoListViewProps> = ({ embedded = false }) => {
  const [channelsData, setChannelsData] = useState<ChannelsData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedChannelId, setSelectedChannelId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    getChannelsData()
      .then((data) => setChannelsData(data))
      .catch((err) => console.error('Failed to load video lectures', err))
      .finally(() => setLoading(false));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const videos = channelsData?.videos || [];
  const channels = channelsData?.channels || [];
  const categories = channelsData?.categories || ['Semua'];

  const filteredVideos = videos.filter((v) => {
    const matchesCat =
      selectedCategory === 'Semua' || v.category === selectedCategory;
    const matchesChannel =
      selectedChannelId === 'all' || v.channelId === selectedChannelId;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      v.title.toLowerCase().includes(q) ||
      v.ustadz.toLowerCase().includes(q) ||
      v.summary.toLowerCase().includes(q);

    return matchesCat && matchesChannel && matchesQuery;
  });

  const handleOpenChannel = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-8">
      {!embedded && (
        <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                <Tv className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                Kajian YouTube Ustadz Populer
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary">
              Kumpulan ceramah dan channel YouTube resmi para ustadz terpercaya di Indonesia. Klik untuk langsung menuju channel atau video di YouTube.
            </p>
          </div>

          <span className="text-xs text-text-secondary shrink-0">
            {filteredVideos.length} Kajian Tersedia
          </span>
        </div>
      )}

      {/* Offline Notice Banner */}
      {!isOnline && (
        <Card className="p-4 border border-warning/40 bg-warning/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <WifiOff className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Anda Sedang Dalam Mode Offline
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Kajian YouTube memerlukan koneksi internet aktif untuk memutar video di aplikasi YouTube.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Channel Resmi Ustadz Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3.5 sm:p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-subtle">
              <YouTubeIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-text-primary tracking-tight">
                  Channel YouTube Resmi Asatidz
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600/10 text-red-600 border border-red-200 dark:border-red-900/40 flex items-center gap-1">
                  <YouTubeIcon className="w-2.5 h-2.5 text-red-600" />
                  <span>Resmi &amp; Terverifikasi</span>
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Pilih ustadz untuk menyaring kajian di aplikasi, atau buka channel langsung di YouTube.
              </p>
            </div>
          </div>

          {selectedChannelId !== 'all' && (
            <button
              onClick={() => setSelectedChannelId('all')}
              className="text-xs font-bold text-primary hover:underline px-3 py-1.5 rounded-lg bg-primary-soft shrink-0 self-start sm:self-auto transition-colors"
            >
              ✕ Tampilkan Semua Ustadz
            </button>
          )}
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {channels.map((ch) => {
            const isSelected = selectedChannelId === ch.id;
            const channelVideosCount = videos.filter((v) => v.channelId === ch.id).length;

            return (
              <div
                key={ch.id}
                onClick={() => {
                  setSelectedChannelId(isSelected ? 'all' : ch.id);
                }}
                className={cn(
                  'relative rounded-xl border p-3.5 sm:p-4.5 transition-all duration-200 cursor-pointer flex flex-col justify-between group select-none',
                  isSelected
                    ? 'bg-primary-soft/40 border-primary shadow-subtle ring-2 ring-primary/40'
                    : 'bg-surface border-border hover:border-primary/50 hover:bg-surface-alt'
                )}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
              >
                <div className="space-y-3">
                  {/* Top Row: Avatar + Names + YouTube Button */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Avatar with Initials & YouTube badge */}
                      <div className="relative shrink-0">
                        <div
                          className={cn(
                            'w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm tracking-wider border transition-colors shadow-xs',
                            isSelected
                              ? 'bg-primary text-white border-primary shadow-subtle'
                              : 'bg-primary-soft text-primary border-primary/20 group-hover:border-primary/40'
                          )}
                        >
                          {ch.initials || ch.name.substring(0, 3).toUpperCase()}
                        </div>
                        {/* Official YouTube Red badge */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs border-2 border-surface">
                          <YouTubeIcon className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>

                      {/* Name & Handle */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                            {ch.name}
                          </h3>
                          <CheckCircle2
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500 shrink-0"
                            aria-label="Official Verified Channel"
                          />
                        </div>
                        <p className="text-xs text-text-secondary truncate mt-0.5 font-medium">
                          {ch.ustadz}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="text-[10px] text-text-secondary font-mono bg-surface-alt px-1.5 py-0.5 rounded border border-border">
                            {ch.handle}
                          </span>
                          {ch.subscribers && (
                            <span className="text-[10px] font-semibold text-text-secondary">
                              {ch.subscribers} sub
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Official YouTube Red Action Button */}
                    <a
                      href={ch.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-subtle active:scale-95"
                      title={`Buka ${ch.name} di YouTube`}
                      aria-label={`Buka channel ${ch.name} di YouTube`}
                    >
                      <YouTubeIcon className="w-3.5 h-3.5 text-white" />
                      <span className="text-[11px] hidden sm:inline">YouTube</span>
                      <ExternalLink className="w-3 h-3 text-white/90" />
                    </a>
                  </div>

                  {/* Specialty Tag */}
                  {ch.specialty && (
                    <div>
                      <span className="inline-block text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md bg-surface-alt border border-border text-text-secondary">
                        {ch.specialty}
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {ch.description}
                  </p>
                </div>

                {/* Footer Action Bar */}
                <div className="mt-3.5 pt-3 border-t border-border/80 flex items-center justify-between text-xs">
                  <span className="text-text-secondary font-medium text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/70 inline-block" />
                    {channelVideosCount} Kajian di Iqra
                  </span>

                  <span
                    className={cn(
                      'text-[11px] font-bold px-2.5 py-1 rounded-full transition-all flex items-center gap-1',
                      isSelected
                        ? 'bg-primary text-white shadow-subtle'
                        : 'bg-primary-soft text-primary group-hover:bg-primary group-hover:text-white'
                    )}
                  >
                    {isSelected ? '✓ Sedang Dipilih' : 'Filter Kajian →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="space-y-4">
        {/* Modern Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-red-600/10 text-red-600 border border-red-200 dark:border-red-900/30 flex items-center justify-center shrink-0">
              <YouTubeIcon className="w-4 h-4 text-red-600" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
                  Kajian Video Pilihan
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-soft text-primary">
                  {filteredVideos.length} Kajian
                </span>
              </div>
            </div>
          </div>

          {(selectedCategory !== 'Semua' || selectedChannelId !== 'all' || searchQuery.trim() !== '') && (
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSelectedChannelId('all');
                setSearchQuery('');
              }}
              className="text-xs text-primary font-bold hover:underline self-start sm:self-auto flex items-center gap-1 transition-colors"
            >
              <span>✕ Reset Semua Filter</span>
            </button>
          )}
        </div>

        {/* Search Bar & Category Controls */}
        <div className="space-y-3">
          <div className="max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Cari tema kajian, judul, atau nama ustadz..."
            />
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <Chip
                key={cat}
                active={selectedCategory === cat}
                clickable
                onClick={() => setSelectedCategory(cat)}
                className="text-xs shrink-0"
              >
                {cat}
              </Chip>
            ))}
          </div>

          {/* Active Filter Indicators on mobile/desktop */}
          {(selectedChannelId !== 'all' || selectedCategory !== 'Semua' || searchQuery) && (
            <div className="flex items-center gap-2 flex-wrap text-xs text-text-secondary pt-1">
              <span className="font-semibold text-text-primary">Filter Aktif:</span>
              {selectedChannelId !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-white font-bold text-[11px] shadow-subtle">
                  <span>Ustadz: {channels.find((c) => c.id === selectedChannelId)?.ustadz.split(',')[0]}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedChannelId('all')}
                    className="hover:text-red-200 text-white font-bold ml-0.5"
                    aria-label="Hapus filter ustadz"
                  >
                    ✕
                  </button>
                </span>
              )}
              {selectedCategory !== 'Semua' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-alt border border-border text-text-primary font-semibold text-[11px]">
                  <span>Kategori: {selectedCategory}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('Semua')}
                    className="hover:text-red-500 font-bold ml-0.5"
                    aria-label="Hapus filter kategori"
                  >
                    ✕
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-alt border border-border text-text-primary font-semibold text-[11px]">
                  <span>Pencarian: &ldquo;{searchQuery}&rdquo;</span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="hover:text-red-500 font-bold ml-0.5"
                    aria-label="Hapus pencarian"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-3.5 sm:p-4.5 rounded-xl border border-border bg-surface space-y-3"
              >
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="flex justify-between items-center pt-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between pt-2 border-t border-border">
                  <Skeleton className="h-8 w-24 rounded-lg" />
                  <Skeleton className="h-8 w-28 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-in fade-in duration-200">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<YouTubeIcon className="w-12 h-12 text-red-600" />}
            title="Tidak Ada Kajian yang Sesuai"
            description="Coba ubah kata kunci pencarian atau reset filter untuk menampilkan semua video kajian ilmiah."
            actionLabel="Reset Semua Filter"
            onAction={() => {
              setSelectedCategory('Semua');
              setSelectedChannelId('all');
              setSearchQuery('');
            }}
          />
        )}
      </section>
    </div>
  );
};
