/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect } from 'react';
import { User, Sparkles, CheckCircle2, ChevronRight, LogOut } from 'lucide-react';
import { useAuthStore } from '../authStore';
import { Card } from '@/components/ui/Card';

interface UserProfileCardProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { user, isLoaded, initFromStorage, openAuthModal } = useAuthStore();

  useEffect(() => {
    if (!isLoaded) {
      initFromStorage();
    }
  }, [isLoaded, initFromStorage]);

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={openAuthModal}
        className={`w-full flex items-center justify-between p-2.5 rounded-card bg-surface-alt border border-border hover:border-primary/40 hover:bg-primary-soft/20 transition-all duration-150 active:scale-[0.98] text-left group shadow-subtle ${className}`}
        aria-label="Kelola Profil Pengguna"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {!user.isGuest && user.picture ? (
            <img
              src={user.picture}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-primary shrink-0 shadow-subtle"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-pastel-green text-primary-text flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
              <User className="w-4 h-4" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-text-primary truncate">
                {user.name}
              </span>
              <span
                className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-pill leading-none ${
                  user.isGuest
                    ? 'bg-border text-text-secondary'
                    : 'bg-primary/20 text-primary-text'
                }`}
              >
                {user.isGuest ? 'Tamu' : 'Google'}
              </span>
            </div>
            <p className="text-[10px] text-text-secondary truncate mt-0.5">
              {user.isGuest ? 'Klik untuk hubungkan Google' : user.email}
            </p>
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors shrink-0 ml-1" />
      </button>
    );
  }

  // Variant Full: Untuk Pengaturan & Menu Lainnya
  return (
    <Card
      hoverable
      onClick={openAuthModal}
      className={`p-4 sm:p-5 border transition-all duration-150 cursor-pointer shadow-card ${
        user.isGuest
          ? 'border-border bg-surface hover:border-primary/40'
          : 'border-primary/40 bg-pastel-green/20'
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3.5 min-w-0">
          {!user.isGuest && user.picture ? (
            <div className="relative shrink-0">
              <img
                src={user.picture}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-subtle"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success ring-2 ring-surface" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-pastel-green text-primary-text flex items-center justify-center font-extrabold text-base shrink-0 border border-primary/25 shadow-subtle">
              <User className="w-6 h-6" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-extrabold text-text-primary truncate">
                {user.name}
              </h3>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-pill leading-none ${
                  user.isGuest
                    ? 'bg-border text-text-secondary'
                    : 'bg-primary/20 text-primary-text'
                }`}
              >
                {user.isGuest ? 'Akun Tamu' : '✓ Terhubung Google'}
              </span>
            </div>

            <p className="text-xs text-text-secondary mt-1 truncate">
              {user.isGuest
                ? 'Mode offline aktif tanpa login · Klik untuk menghubungkan Google'
                : user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-pill bg-surface border border-border text-primary-text hover:bg-surface-alt transition-colors shadow-subtle">
            {user.isGuest ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Hubungkan Google</span>
              </>
            ) : (
              <span>Kelola Akun</span>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          </span>
        </div>
      </div>
    </Card>
  );
};
