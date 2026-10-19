'use client';

import React, { useEffect } from 'react';
import { User, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/features/auth/authStore';

export function HomeGreeting() {
  const { user, isLoaded, initFromStorage, openAuthModal } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) {
      initFromStorage();
    }
  }, [isLoaded, initFromStorage]);

  const firstName = user.isGuest ? 'Tamu' : user.name.split(' ')[0];

  return (
    <div className="border-b border-border/80 pb-3 sm:pb-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-pill bg-pastel-green text-primary-text">
            Assalamu'alaikum
          </span>

          <button
            type="button"
            onClick={openAuthModal}
            className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-pill bg-surface border border-border hover:border-primary/40 text-text-secondary hover:text-text-primary transition-all duration-150 active:scale-95 shadow-subtle"
            title="Kelola status profil akun"
          >
            {user.isGuest ? (
              <>
                <User className="w-3 h-3 text-primary-text" />
                <span>Tamu</span>
                <span className="text-[10px] text-primary-text font-normal hidden xs:inline">· Hubungkan Google</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="text-text-primary">{firstName}</span>
              </>
            )}
          </button>
        </div>

        <span
          dir="rtl"
          className="font-arabic text-xs sm:text-sm text-primary-text font-bold bg-pastel-green/60 dark:bg-pastel-green/20 px-2.5 py-0.5 rounded-pill border border-primary/20 inline-block shadow-subtle"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mt-1.5">
        {user.isGuest ? 'Selamat Datang di Iqra' : `Selamat Datang, ${firstName}`}
      </h1>
      <p className="text-xs sm:text-sm text-text-secondary mt-0.5 leading-relaxed">
        Perdalam ilmu Al-Qur'an, hadits, dan jaga waktu ibadah setiap hari.
      </p>
    </div>
  );
}
