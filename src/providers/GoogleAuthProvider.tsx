'use client';

import React, { useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleOneTapLogin } from '@react-oauth/google';
import { useAuthStore } from '@/features/auth/authStore';
import { parseGoogleJwt } from '@/features/auth/googleAuth';
import { initializeDexieCloudSync } from '@/features/sync/syncService';

const ENV_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

/**
 * Komponen detector otomatis Google One Tap di seluruh aplikasi.
 * Hanya aktif jika pengguna masih berstatus Tamu.
 */
function GlobalOneTapDetector() {
  const { user, loginWithGoogleProfile } = useAuthStore();

  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      if (!credentialResponse.credential) return;

      try {
        // 1. Verifikasi token JWT ke backend endpoint /api/auth/google
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: credentialResponse.credential }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            loginWithGoogleProfile({
              id: data.user.googleId || data.user.sub || 'google-user',
              name: data.user.name || 'Pengguna Google',
              email: data.user.email || '',
              picture: data.user.picture || '',
            });
            return;
          }
        }
      } catch (err) {
        console.warn('Backend verification error, fallback to client-side:', err);
      }

      // 2. Fallback jika offline / host statis
      const clientPayload = parseGoogleJwt(credentialResponse.credential);
      if (clientPayload) {
        loginWithGoogleProfile({
          id: clientPayload.sub,
          name: clientPayload.name,
          email: clientPayload.email,
          picture: clientPayload.picture,
        });
      }
    },
    onError: () => {
      console.log('Google One Tap notice: dismissed or not displayed');
    },
    auto_select: true,
    disabled: !user.isGuest,
  });

  return null;
}

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  const { customClientId, user } = useAuthStore();
  const effectiveClientId = (customClientId || ENV_CLIENT_ID).trim();

  useEffect(() => {
    initializeDexieCloudSync();
  }, []);

  // Jika Google Client ID belum diisi, render children secara aman tanpa crash
  if (!effectiveClientId) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={effectiveClientId}>
      {user.isGuest && <GlobalOneTapDetector />}
      {children}
    </GoogleOAuthProvider>
  );
}
