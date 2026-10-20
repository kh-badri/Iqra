'use client';

import type { CityLocation } from '../types';

export const VAPID_PUBLIC_KEY =
  'BPEumoDK1izI0grVyqkZhRrm2FEDluvC_lLQVz2XlpE7CbzH6_FvS_nRoQavBDZbIw0fPb9jcSkFiR5O9fMIy6A';

/**
 * Konversi URL-safe Base64 ke Uint8Array (standar Web Push API)
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Daftarkan browser/HP ke sistem Web Push cPanel
 */
export async function registerWebPushSubscription(
  city?: CityLocation,
  todaySchedule?: Record<string, string>
): Promise<{ success: boolean; message: string }> {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Browser tidak didukung.' };
  }

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return {
      success: false,
      message: 'Browser Anda tidak mendukung Web Push API.',
    };
  }

  try {
    const reg = await navigator.serviceWorker.ready;

    // Cek apakah sudah berlangganan
    let subscription = await reg.pushManager.getSubscription();

    if (!subscription) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as any,
      });
    }

    if (!subscription) {
      return { success: false, message: 'Gagal membuat Push Subscription di browser.' };
    }

    // Kirim subscription ke cPanel backend
    const subJson = subscription.toJSON();
    const payload = {
      endpoint: subJson.endpoint,
      keys: subJson.keys,
      city: city || {
        name: 'Lokasi Anda',
        lat: -6.2088,
        lng: 106.8456,
        timezone: 7,
      },
      todaySchedule: todaySchedule || null,
    };

    const res = await fetch('/api/push-subscribe.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      localStorage.setItem('iqra_web_push_active', '1');
      return {
        success: true,
        message: 'Web Push cPanel aktif! Notifikasi akan otomatis masuk walau aplikasi ditutup.',
      };
    } else {
      return {
        success: true, // Masih fallback lokal di browser
        message: 'Izin browser aktif (Server push akan tersinkron saat cPanel online).',
      };
    }
  } catch (err: any) {
    console.warn('Gagal mendaftar Web Push:', err);
    return {
      success: false,
      message: err.message || 'Gagal mendaftar ke server Web Push.',
    };
  }
}

/**
 * Uji coba panggil cron-push dari cPanel langsung ke HP
 */
export async function triggerCpanelPushTest(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/push-test.php');
    const data = await res.json();
    return {
      success: !!data.success,
      message: data.message || 'Respons server diterima.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Gagal menghubungi endpoint /api/push-test.php di cPanel.',
    };
  }
}
