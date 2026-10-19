'use client';

import * as React from 'react';
import { useAudioPlayer } from '../store/useAudioPlayer';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Slider } from '@/components/ui/Slider';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Repeat,
  Repeat1,
  Timer,
  Gauge,
  User,
  Download,
  Trash2,
  Check,
} from 'lucide-react';
import { QARI_LIST } from '../types';
import {
  isSurahAudioCached,
  cacheSurahAudio,
  deleteSurahAudioCache,
  formatEstimatedAudioSize,
} from '../services/audioCacheService';

export function AudioPlayerDrawer() {
  const {
    track,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    repeatMode,
    selectedQariId,
    isDrawerOpen,
    sleepTimerMinutes,
    sleepTimerRemainingSec,
    togglePlay,
    nextAyah,
    prevAyah,
    seekToAyah,
    setPlaybackRate,
    setRepeatMode,
    setSelectedQariId,
    setSleepTimer,
    closeDrawer,
  } = useAudioPlayer();

  const [isCached, setIsCached] = React.useState(false);
  const [downloadProgress, setDownloadProgress] = React.useState<number | null>(null);
  const [showQariModal, setShowQariModal] = React.useState(false);

  const currentAyah = track?.ayahs.find((a) => a.numberInSurah === track.currentAyahNumber);
  const qari = QARI_LIST.find((q) => q.id === selectedQariId) || QARI_LIST[0];

  // Cek apakah audio surah sudah tersimpan di cache
  React.useEffect(() => {
    if (!track) return;
    const urls = track.ayahs.map((a) => a.audioUrl);
    isSurahAudioCached(urls).then(setIsCached);
  }, [track, selectedQariId]);

  if (!track || !currentAyah) return null;

  const allAudioUrls = track.ayahs.map((a) => a.audioUrl);

  const handleDownloadOffline = async () => {
    setDownloadProgress(0);
    const success = await cacheSurahAudio(allAudioUrls, (p) => setDownloadProgress(p));
    setDownloadProgress(null);
    if (success) {
      setIsCached(true);
    }
  };

  const handleDeleteOffline = async () => {
    await deleteSurahAudioCache(allAudioUrls);
    setIsCached(false);
  };

  const cycleRepeat = () => {
    if (repeatMode === 'none') setRepeatMode('ayah');
    else if (repeatMode === 'ayah') setRepeatMode('surah');
    else setRepeatMode('none');
  };

  const cycleSpeed = () => {
    if (playbackRate === 1) setPlaybackRate(1.25);
    else if (playbackRate === 1.25) setPlaybackRate(1.5);
    else if (playbackRate === 1.5) setPlaybackRate(0.75);
    else setPlaybackRate(1);
  };

  const cycleSleepTimer = () => {
    if (sleepTimerMinutes === 0) setSleepTimer(15);
    else if (sleepTimerMinutes === 15) setSleepTimer(30);
    else if (sleepTimerMinutes === 30) setSleepTimer(60);
    else setSleepTimer(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <BottomSheet
      isOpen={isDrawerOpen}
      onClose={closeDrawer}
      title={`Pemutar Tilawah · Surah ${track.surahName}`}
    >
      <div className="space-y-6 py-2">
        {/* Tampilan Ayat Aktif (Card Flat) */}
        <div className="p-5 sm:p-6 bg-surface-2 border border-border rounded-card text-center space-y-3.5 shadow-subtle">
          <div className="flex items-center justify-center gap-2">
            <Chip variant="primary" className="text-xs">
              Ayat {currentAyah.numberInSurah} dari {track.totalAyahs}
            </Chip>
            <Chip variant="outline" className="text-xs">
              {qari.name}
            </Chip>
          </div>

          <p
            dir="rtl"
            className="font-arabic text-2xl sm:text-3xl text-text-primary leading-[2.2] py-2"
          >
            {currentAyah.arabic}
          </p>

          <p className="text-xs text-text-muted italic line-clamp-3 leading-relaxed">
            &ldquo;{currentAyah.translation}&rdquo;
          </p>
        </div>

        {/* Progress Slider Waktu */}
        <div className="space-y-1.5">
          <Slider
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={() => {}}
            disabled
          />
          <div className="flex justify-between text-xs text-text-muted font-mono tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Kontrol Utama: Prev, Play/Pause, Next */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prevAyah}
            disabled={track.currentAyahNumber <= 1}
            className="w-12 h-12 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-2 flex items-center justify-center disabled:opacity-30 transition-colors active:scale-90"
            aria-label="Ayat sebelumnya"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-primary-gradient text-on-primary flex items-center justify-center shadow-card hover:brightness-105 transition-transform active:scale-95"
            aria-label={isPlaying ? 'Jeda' : 'Putar'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={nextAyah}
            disabled={track.currentAyahNumber >= track.totalAyahs}
            className="w-12 h-12 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-2 flex items-center justify-center disabled:opacity-30 transition-colors active:scale-90"
            aria-label="Ayat berikutnya"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Tombol Fitur Tambahan (Repeat, Speed, Timer, Qari) */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border">
          {/* Repeat */}
          <button
            onClick={cycleRepeat}
            className="p-3 rounded-button border border-border bg-surface-2 hover:bg-surface flex flex-col items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary transition-all active:scale-95 min-h-[56px]"
            title="Ulangi"
          >
            {repeatMode === 'ayah' ? (
              <Repeat1 className="w-4 h-4 text-primary-text" />
            ) : (
              <Repeat
                className={`w-4 h-4 ${repeatMode === 'surah' ? 'text-primary-text' : ''}`}
              />
            )}
            <span className="capitalize text-[11px]">
              {repeatMode === 'none' ? 'Loop Off' : repeatMode === 'ayah' ? 'Ulang Ayat' : 'Ulang Surah'}
            </span>
          </button>

          {/* Speed */}
          <button
            onClick={cycleSpeed}
            className="p-3 rounded-button border border-border bg-surface-2 hover:bg-surface flex flex-col items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary transition-all active:scale-95 min-h-[56px]"
            title="Kecepatan"
          >
            <Gauge className="w-4 h-4 text-primary-text" />
            <span className="text-[11px] tabular-nums">{playbackRate}x</span>
          </button>

          {/* Timer */}
          <button
            onClick={cycleSleepTimer}
            className="p-3 rounded-button border border-border bg-surface-2 hover:bg-surface flex flex-col items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary transition-all active:scale-95 min-h-[56px]"
            title="Timer Tidur"
          >
            <Timer
              className={`w-4 h-4 ${sleepTimerMinutes > 0 ? 'text-warning' : 'text-primary-text'}`}
            />
            <span className="text-[11px] tabular-nums">
              {sleepTimerRemainingSec !== null
                ? `${Math.ceil(sleepTimerRemainingSec / 60)} mnt`
                : 'Timer Off'}
            </span>
          </button>

          {/* Qari Selector */}
          <button
            onClick={() => setShowQariModal(true)}
            className="p-3 rounded-button border border-border bg-surface-2 hover:bg-surface flex flex-col items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-primary transition-all active:scale-95 min-h-[56px]"
            title="Pilih Qori"
          >
            <User className="w-4 h-4 text-primary-text" />
            <span className="truncate max-w-[60px] text-[11px]">Qori</span>
          </button>
        </div>

        {/* Simpan Offline Status & Download */}
        <div className="p-4 bg-surface-2 border border-border rounded-card flex items-center justify-between gap-3 shadow-subtle">
          <div>
            <div className="text-xs font-bold text-text-primary">
              Audio Surah Offline
            </div>
            <div className="text-[11px] text-text-muted mt-0.5">
              Ukuran estimasi: {formatEstimatedAudioSize(track.totalAyahs)}
            </div>
          </div>

          {downloadProgress !== null ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-primary-text">
                {downloadProgress}%
              </span>
              <div className="w-16 h-2 bg-surface-alt rounded-pill overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-150"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          ) : isCached ? (
            <div className="flex items-center gap-2">
              <Chip variant="primary" className="text-xs py-0.5">
                <Check className="w-3 h-3 mr-1 inline" /> Tersimpan
              </Chip>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteOffline}
                className="text-danger hover:bg-danger/10 h-8 w-8"
                title="Hapus Audio Offline"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDownloadOffline}
              className="gap-1.5 text-xs h-8"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Simpan Offline</span>
            </Button>
          )}
        </div>
      </div>

      {/* Modal Pilihan Qori */}
      {showQariModal && (
        <div className="pt-4 border-t border-border space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Pilih Qori Tilawah:
            </h4>
            <span className="text-[11px] text-text-secondary">6 Pilihan Qori</span>
          </div>
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {QARI_LIST.map((q) => {
              const active = q.id === selectedQariId;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelectedQariId(q.id);
                    setShowQariModal(false);
                  }}
                  className={`w-full p-2.5 rounded-card text-left text-xs flex items-center justify-between transition-colors border ${
                    active
                      ? 'bg-primary-soft border-primary text-primary font-semibold'
                      : 'bg-surface border-border text-text-primary hover:bg-surface-alt'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold truncate">{q.name}</span>
                      {q.badge && (
                        <Chip
                          variant={active ? 'primary' : 'secondary'}
                          className="text-[10px] py-0 px-1.5 h-4"
                        >
                          {q.badge}
                        </Chip>
                      )}
                    </div>
                    {q.description && (
                      <p className="text-[11px] text-text-secondary truncate mt-0.5">
                        {q.description}
                      </p>
                    )}
                  </div>
                  {active && <Check className="w-4 h-4 text-primary flex-shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
