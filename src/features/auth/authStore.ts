import { create } from 'zustand';
import { type UserProfile, DEFAULT_GUEST_USER } from './types';

const STORAGE_KEY = 'iqra_user_profile';
const CLIENT_ID_KEY = 'iqra_google_client_id';

interface AuthStore {
  user: UserProfile;
  isLoaded: boolean;
  isAuthModalOpen: boolean;
  customClientId: string;

  // Actions
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithGoogleProfile: (profile: {
    id: string;
    name: string;
    email: string;
    picture?: string;
  }) => void;
  logoutToGuest: () => void;
  setCustomClientId: (id: string) => void;
  initFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: DEFAULT_GUEST_USER,
  isLoaded: false,
  isAuthModalOpen: false,
  customClientId: '',

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  loginWithGoogleProfile: (profile) => {
    const newUser: UserProfile = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
      isGuest: false,
      provider: 'google',
      connectedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        window.dispatchEvent(new CustomEvent('iqraUserChanged', { detail: newUser }));
      } catch (err) {
        console.error('Gagal menyimpan profil pengguna:', err);
      }
    }

    set({ user: newUser });
  },

  logoutToGuest: () => {
    const guestUser = { ...DEFAULT_GUEST_USER };

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new CustomEvent('iqraUserChanged', { detail: guestUser }));
      } catch (err) {
        console.error('Gagal menghapus sesi akun:', err);
      }
    }

    set({ user: guestUser });
  },

  setCustomClientId: (clientId: string) => {
    if (typeof window !== 'undefined') {
      try {
        if (clientId) {
          localStorage.setItem(CLIENT_ID_KEY, clientId.trim());
        } else {
          localStorage.removeItem(CLIENT_ID_KEY);
        }
      } catch {}
    }
    set({ customClientId: clientId.trim() });
  },

  initFromStorage: () => {
    if (typeof window === 'undefined') return;

    try {
      const savedUserStr = localStorage.getItem(STORAGE_KEY);
      const savedClientId = localStorage.getItem(CLIENT_ID_KEY) || '';

      let loadedUser = DEFAULT_GUEST_USER;
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (parsed && parsed.name && !parsed.isGuest) {
          // Bersihkan data dummy fallback sebelumnya jika tersimpan
          if (
            parsed.email === 'user.google@gmail.com' ||
            (parsed.id && String(parsed.id).startsWith('google-detected-'))
          ) {
            localStorage.removeItem(STORAGE_KEY);
            loadedUser = DEFAULT_GUEST_USER;
          } else {
            loadedUser = parsed;
          }
        }
      }

      set({
        user: loadedUser,
        customClientId: savedClientId,
        isLoaded: true,
      });
    } catch {
      set({ isLoaded: true });
    }
  },
}));
