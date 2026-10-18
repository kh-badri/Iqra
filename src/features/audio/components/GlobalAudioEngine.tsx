'use client';

import * as React from 'react';
import { useAudioPlayer } from '../store/useAudioPlayer';
import { QARI_LIST } from '../types';

export function GlobalAudioEngine() {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const {
    track,
    isPlaying,
    playbackRate,
    repeatMode,
    selectedQariId,
    nextAyah,
    prevAyah,
    pause,
    resume,
    setCurrentTime,
    setDuration,
    tickSleepTimer,
    sleepTimerRemainingSec,
  } = useAudioPlayer();

  const currentAyah = React.useMemo(() => {
    if (!track) return null;
    return track.ayahs.find((a) => a.numberInSurah === track.currentAyahNumber) || null;
  }, [track]);

  const qari = React.useMemo(() => {
    return QARI_LIST.find((q) => q.id === selectedQariId) || QARI_LIST[0];
  }, [selectedQariId]);

  // Inisialisasi Audio Element
  React.useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      const state = useAudioPlayer.getState();
      if (state.repeatMode === 'ayah') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        state.nextAyah();
      }
    };

    const handleError = (e: ErrorEvent) => {
      console.warn('Audio playback error:', e);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError as any);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as any);
      audioRef.current = null;
    };
  }, [setCurrentTime, setDuration]);

  // Load and play when currentAyah changes
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAyah) return;

    const currentSrc = audio.src;
    if (currentSrc !== currentAyah.audioUrl) {
      audio.src = currentAyah.audioUrl;
      audio.playbackRate = playbackRate;
      if (isPlaying) {
        audio.play().catch((err) => {
          console.warn('Browser menahan autoplay audio:', err);
          pause();
        });
      }
    }

    // Auto-scroll ke ayat yang sedang diputar di layar
    if (typeof window !== 'undefined') {
      const el = document.getElementById(`ayah-${currentAyah.numberInSurah}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentAyah, isPlaying, playbackRate, pause]);

  // Play / Pause sync
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAyah) return;

    if (isPlaying && audio.paused) {
      audio.play().catch(() => pause());
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [isPlaying, currentAyah, pause]);

  // Playback Rate sync
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Media Session API Integration (Lockscreen, Notification, Watch)
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'mediaSession' in navigator && track && currentAyah) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `QS. ${track.surahName}: Ayat ${currentAyah.numberInSurah}`,
        artist: qari.name,
        album: `Al-Qur'an Al-Karim - Surah ${track.surahName}`,
        artwork: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => resume());
      navigator.mediaSession.setActionHandler('pause', () => pause());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevAyah());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextAyah());
    }
  }, [track, currentAyah, qari, resume, pause, prevAyah, nextAyah]);

  // Sleep Timer countdown
  React.useEffect(() => {
    if (sleepTimerRemainingSec === null || sleepTimerRemainingSec <= 0) return;

    const interval = setInterval(() => {
      tickSleepTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerRemainingSec, tickSleepTimer]);

  return null;
}
