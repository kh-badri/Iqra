import { create } from 'zustand';
import { type AudioTrackInfo, type RepeatMode, QARI_LIST } from '../types';

interface AudioPlayerStore {
  track: AudioTrackInfo | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  repeatMode: RepeatMode;
  selectedQariId: string;
  isDrawerOpen: boolean;
  sleepTimerMinutes: number;
  sleepTimerRemainingSec: number | null;

  // Actions
  playSurah: (track: AudioTrackInfo, startAyah?: number) => void;
  playAyahOnly: (track: AudioTrackInfo, ayahNumber: number) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  nextAyah: () => void;
  prevAyah: () => void;
  seekToAyah: (ayahNumber: number) => void;
  setPlaybackRate: (rate: number) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setSelectedQariId: (qariId: string) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setSleepTimer: (minutes: number) => void;
  tickSleepTimer: () => void;
  stopAndClose: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
}

const getInitialQariId = (): string => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('iqra_selected_qari');
      if (saved && QARI_LIST.some((q) => q.id === saved)) {
        return saved;
      }
    } catch {}
  }
  return '05';
};

export const useAudioPlayer = create<AudioPlayerStore>((set, get) => ({
  track: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
  repeatMode: 'none',
  selectedQariId: getInitialQariId(),
  isDrawerOpen: false,
  sleepTimerMinutes: 0,
  sleepTimerRemainingSec: null,

  playSurah: (track, startAyah = 1) => {
    const currentTrack = {
      ...track,
      currentAyahNumber: startAyah,
    };
    set({
      track: currentTrack,
      isPlaying: true,
      currentTime: 0,
    });
  },

  playAyahOnly: (track, ayahNumber) => {
    set({
      track: {
        ...track,
        currentAyahNumber: ayahNumber,
      },
      isPlaying: true,
      currentTime: 0,
    });
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  togglePlay: () => {
    const { isPlaying, track } = get();
    if (!track) return;
    set({ isPlaying: !isPlaying });
  },

  nextAyah: () => {
    const { track, repeatMode } = get();
    if (!track) return;

    if (track.currentAyahNumber < track.totalAyahs) {
      set({
        track: {
          ...track,
          currentAyahNumber: track.currentAyahNumber + 1,
        },
        currentTime: 0,
        isPlaying: true,
      });
    } else if (repeatMode === 'surah') {
      // Ulangi dari ayat 1
      set({
        track: {
          ...track,
          currentAyahNumber: 1,
        },
        currentTime: 0,
        isPlaying: true,
      });
    } else {
      // Selesai surah
      set({ isPlaying: false });
    }
  },

  prevAyah: () => {
    const { track } = get();
    if (!track) return;

    if (track.currentAyahNumber > 1) {
      set({
        track: {
          ...track,
          currentAyahNumber: track.currentAyahNumber - 1,
        },
        currentTime: 0,
        isPlaying: true,
      });
    }
  },

  seekToAyah: (ayahNumber) => {
    const { track } = get();
    if (!track) return;

    set({
      track: {
        ...track,
        currentAyahNumber: ayahNumber,
      },
      currentTime: 0,
      isPlaying: true,
    });
  },

  setPlaybackRate: (rate) => set({ playbackRate: rate }),
  setRepeatMode: (mode) => set({ repeatMode: mode }),
  setSelectedQariId: (qariId) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('iqra_selected_qari', qariId);
      } catch {}
    }
    const { track } = get();
    if (track && track.rawAyahs) {
      const updatedAyahs = track.ayahs.map((a) => {
        const originalAyah = track.rawAyahs?.find(
          (raw: any) => raw.numberInSurah === a.numberInSurah
        );
        const url = originalAyah?.audio?.[qariId] || a.audioUrl;
        return { ...a, audioUrl: url };
      });
      const currentAyahObj = track.rawAyahs[track.currentAyahNumber - 1];
      const newAudioUrl = currentAyahObj?.audio?.[qariId] || track.audioUrl;
      set({
        selectedQariId: qariId,
        track: {
          ...track,
          qariId,
          audioUrl: newAudioUrl,
          ayahs: updatedAyahs,
        },
      });
    } else {
      set({ selectedQariId: qariId });
    }
  },
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  setSleepTimer: (minutes) => {
    set({
      sleepTimerMinutes: minutes,
      sleepTimerRemainingSec: minutes > 0 ? minutes * 60 : null,
    });
  },

  tickSleepTimer: () => {
    const { sleepTimerRemainingSec } = get();
    if (sleepTimerRemainingSec === null || sleepTimerRemainingSec <= 0) return;

    const remaining = sleepTimerRemainingSec - 1;
    if (remaining <= 0) {
      set({
        isPlaying: false,
        sleepTimerMinutes: 0,
        sleepTimerRemainingSec: null,
      });
    } else {
      set({ sleepTimerRemainingSec: remaining });
    }
  },

  stopAndClose: () => {
    set({
      track: null,
      isPlaying: false,
      isDrawerOpen: false,
      currentTime: 0,
      duration: 0,
    });
  },

  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
}));
