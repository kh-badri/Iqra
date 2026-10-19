/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect } from 'react';
import { User } from 'lucide-react';
import { useAuthStore } from '../authStore';

interface UserAvatarButtonProps {
  showLabel?: boolean;
  className?: string;
}

export const UserAvatarButton: React.FC<UserAvatarButtonProps> = ({
  showLabel = false,
  className = '',
}) => {
  const { user, isLoaded, initFromStorage, openAuthModal } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) {
      initFromStorage();
    }
  }, [isLoaded, initFromStorage]);

  if (!user.isGuest) {
    return (
      <button
        type="button"
        onClick={openAuthModal}
        className={`inline-flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-pill bg-pastel-green/60 hover:bg-pastel-green text-primary-text border border-primary/20 transition-all duration-150 active:scale-95 shadow-subtle ${className}`}
        title={`Akun: ${user.name} (${user.email || 'Google'})`}
        aria-label="Profil Akun Google"
      >
        <div className="relative">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-primary"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary-gradient text-on-primary font-bold text-xs flex items-center justify-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success ring-1.5 ring-surface" />
        </div>

        {showLabel && (
          <span className="text-xs font-bold truncate max-w-[100px] sm:max-w-[140px] text-text-primary">
            {user.name.split(' ')[0]}
          </span>
        )}
      </button>
    );
  }

  // Tampilan Default: Pengguna Tamu
  return (
    <button
      type="button"
      onClick={openAuthModal}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-pill bg-surface-alt hover:bg-border/50 text-text-secondary hover:text-text-primary border border-border transition-all duration-150 active:scale-95 shadow-subtle ${className}`}
      title="Akun: Tamu (Klik untuk menghubungkan Akun Google)"
      aria-label="Status Pengguna: Tamu"
    >
      <div className="w-6 h-6 rounded-full bg-pastel-green text-primary-text flex items-center justify-center font-bold text-xs shrink-0">
        <User className="w-3.5 h-3.5" />
      </div>
      <span className="text-[11px] font-extrabold text-text-secondary tracking-tight">
        Tamu
      </span>
    </button>
  );
};
