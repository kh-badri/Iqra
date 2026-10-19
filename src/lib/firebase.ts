import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const FIREBASE_CONFIG_KEY = 'iqra_firebase_config';

/**
 * Mendapatkan konfigurasi Firebase dari environment variable atau localStorage
 */
export function getFirebaseConfig(): FirebaseConfig | null {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(FIREBASE_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.apiKey && parsed?.projectId) {
          return parsed;
        }
      }
    } catch {}
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '';
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';

  if (apiKey && projectId) {
    return {
      apiKey,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    };
  }

  return null;
}

export function saveFirebaseConfig(config: FirebaseConfig) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('iqraFirebaseConfigChanged'));
  } catch (err) {
    console.error('Gagal menyimpan konfigurasi Firebase:', err);
  }
}

let app: FirebaseApp | null = null;
let dbInstance: Firestore | null = null;

export function getFirebaseFirestore(): Firestore | null {
  const config = getFirebaseConfig();
  if (!config) return null;

  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    if (!dbInstance && app) {
      dbInstance = getFirestore(app);
    }
    return dbInstance;
  } catch (err) {
    console.warn('Inisialisasi Firebase Firestore gagal:', err);
    return null;
  }
}

export function isFirebaseReady(): boolean {
  return getFirebaseConfig() !== null;
}
