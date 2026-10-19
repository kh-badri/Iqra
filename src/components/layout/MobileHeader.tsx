/* eslint-disable @next/next/no-img-element */
'use client';

import * as React from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Bookmark, Search, Bell } from 'lucide-react';
import { UserAvatarButton } from '@/features/auth/components/UserAvatarButton';
import { cn } from '@/lib/utils';

export function MobileHeader() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenSearch = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openGlobalSearch'));
    }
  };

  return (
    <header className="sticky top-0 z-40 md:hidden safe-top transition-all duration-200">
      <div
        className={cn(
          'glass-surface border-b border-border/60 transition-all duration-250',
          scrolled ? 'py-1 shadow-subtle' : 'py-2'
        )}
      >
        <div className="flex items-center justify-between h-13 px-4 max-w-2xl mx-auto">
          {/* Sapaan & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              {/* Brand Modern App Icon */}
              <img
                src="/icons/icon-192.png?v=lime"
                alt="Logo Iqra"
                className="w-9 h-9 rounded-xl shadow-subtle group-active:scale-95 transition-transform duration-150 object-cover ring-1 ring-border/50"
              />
              {/* Subtle accent dot indicator */}
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-surface flex items-center justify-center animate-pulse-dot" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-extrabold text-text-primary tracking-tight leading-none group-hover:text-primary transition-colors">
                Iqra
              </span>
              <span className="text-[10px] text-text-secondary leading-none mt-0.5 font-medium">
                Belajar Agama Islam
              </span>
            </div>
          </Link>

          {/* Action Buttons: Search, Bookmark, Theme Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleOpenSearch}
              className="w-9 h-9 rounded-button bg-surface-alt flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-border/40 transition-all duration-150 active:scale-90"
              aria-label="Cari di Iqra"
            >
              <Search className="w-4 h-4" />
            </button>
            <Link
              href="/bookmark/"
              className="w-9 h-9 rounded-button bg-surface-alt flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-border/40 transition-all duration-150 active:scale-90"
              aria-label="Bookmark Tersimpan"
            >
              <Bookmark className="w-4 h-4" />
            </Link>
            <UserAvatarButton />
            <ThemeToggle className="w-9 h-9 rounded-button" />
          </div>
        </div>
      </div>
    </header>
  );
}
