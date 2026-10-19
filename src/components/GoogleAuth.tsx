'use client';

import React from 'react';
import { useGoogleOneTapLogin, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/authStore';
import { parseGoogleJwt } from '@/features/auth/googleAuth';

interface GoogleAuthProps {
  onSuccessCallback?: () => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  width?: string | number;
}

export default function GoogleAuth({
  onSuccessCallback,
  text = 'continue_with',
  shape = 'pill',
  theme = 'outline',
  width = 320,
}: GoogleAuthProps) {
  const router = useRouter();
  const { user, loginWithGoogleProfile, closeAuthModal } = useAuthStore();

  const handleSuccess = async (credential?: string) => {
    if (!credential) return;

    try {
      // 1. Kirim token ID JWT ke endpoint backend /api/auth/google untuk verifikasi
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
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
          closeAuthModal();
          if (onSuccessCallback) onSuccessCallback();
          return;
        }
      }
    } catch (err) {
      console.warn('Backend verification error, running client-side fallback:', err);
    }

    // Fallback: Jika backend offline / static host, decode token di client
    const clientPayload = parseGoogleJwt(credential);
    if (clientPayload) {
      loginWithGoogleProfile({
        id: clientPayload.sub,
        name: clientPayload.name,
        email: clientPayload.email,
        picture: clientPayload.picture,
      });
      closeAuthModal();
      if (onSuccessCallback) onSuccessCallback();
    }
  };

  // Otomatis mendeteksi akun Google aktif di browser (Pop-up Google One Tap di pojok layar)
  useGoogleOneTapLogin({
    onSuccess: (res) => handleSuccess(res.credential),
    onError: () => {
      console.log('Google One Tap notice: dismissed or not displayed');
    },
    auto_select: true,
    disabled: !user.isGuest, // Hanya aktif saat pengguna masih berstatus tamu
  });

  // Tombol fallback manual Google Login resmi
  return (
    <div className="flex justify-center w-full">
      <GoogleLogin
        onSuccess={(res) => handleSuccess(res.credential)}
        onError={() => console.error('Manual Google Login Failed')}
        text={text}
        shape={shape}
        theme={theme}
        width={width}
        size="large"
      />
    </div>
  );
}

export { GoogleAuth };
