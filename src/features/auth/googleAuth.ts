/**
 * Google Identity Services (GIS) & OAuth 2.0 API Helper for Iqra
 * 100% Client-side compatible for static Next.js export.
 */

export interface GoogleUserInfo {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export interface GoogleJwtPayload {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  email: string;
  picture?: string;
  email_verified?: boolean;
}

declare global {
  interface Window {
    google?: any;
  }
}

/**
 * Safely parses the JWT token payload returned by Google Sign-In (One Tap / Credential)
 */
export function parseGoogleJwt(token: string): GoogleJwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as GoogleJwtPayload;
  } catch (err) {
    console.error('Gagal mendekode token Google:', err);
    return null;
  }
}

/**
 * Loads the official Google Identity Services script dynamically
 */
export function loadGoogleIdentityScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.google?.accounts?.id || window.google?.accounts?.oauth2) {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById('google-identity-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-identity-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

/**
 * Connect directly via Google OAuth 2.0 Token Client (Popup Account Chooser)
 * Menampilkan pemilih akun Google resmi dari akun-akun yang sedang aktif di browser.
 */
export async function triggerGoogleOAuth(
  clientId: string,
  prompt: 'select_account' | 'consent' | '' = 'select_account'
): Promise<GoogleUserInfo> {
  if (!clientId || !clientId.trim()) {
    throw new Error('Google OAuth Client ID belum diisi. Silakan masukkan Client ID Anda terlebih dahulu.');
  }

  const isLoaded = await loadGoogleIdentityScript();
  if (!isLoaded || !window.google?.accounts?.oauth2) {
    throw new Error('Google Identity Services SDK gagal dimuat. Periksa koneksi internet Anda.');
  }

  return new Promise((resolve, reject) => {
    try {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId.trim(),
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
        prompt: prompt,
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            const err = tokenResponse.error;
            const desc = tokenResponse.error_description || '';
            if (err === 'popup_closed_by_user') {
              reject(new Error('Jendela pemilihan akun Google ditutup.'));
            } else if (err === 'access_denied') {
              reject(new Error('Akses akun Google dibatalkan oleh pengguna.'));
            } else if (desc.includes('origin') || err.includes('origin')) {
              reject(new Error('URL ini belum didaftarkan di "Authorized JavaScript origins" pada Google Cloud Console.'));
            } else {
              reject(new Error(desc || err));
            }
            return;
          }

          if (!tokenResponse.access_token) {
            reject(new Error('Akses token Google tidak diterima.'));
            return;
          }

          try {
            // Ambil data profil & email langsung dari API Google resmi
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });

            if (!res.ok) {
              throw new Error(`Google API userinfo merespons HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            resolve({
              id: data.sub || ('google-' + Date.now()),
              name: data.name || data.given_name || 'Pengguna Google',
              email: data.email || '',
              picture: data.picture || '',
            });
          } catch (fetchErr: any) {
            reject(fetchErr);
          }
        },
      });

      // Buka popup Google untuk memilih akun Google aktif di browser
      tokenClient.requestAccessToken({ prompt: prompt });
    } catch (initErr: any) {
      reject(initErr);
    }
  });
}
