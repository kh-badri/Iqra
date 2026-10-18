'use client';

import * as React from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Bookmark, Search } from 'lucide-react';

export function MobileHeader() {
  const handleOpenSearch = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openGlobalSearch'));
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border md:hidden safe-top">
      <div className="flex items-center justify-between h-14 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-card bg-primary text-white flex items-center justify-center font-bold text-sm shadow-subtle">
            <span className="font-arabic text-base leading-none">اقرأ</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-text-primary tracking-tight leading-none">
              Iqra
            </span>
            <span className="text-[10px] text-text-secondary leading-none mt-0.5">
              Belajar Agama Islam
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenSearch}
            className="w-9 h-9 rounded-card bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
            aria-label="Cari di Iqra"
          >
            <Search className="w-4 h-4" />
          </button>
          <Link
            href="/bookmark/"
            className="w-9 h-9 rounded-card bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
            aria-label="Bookmark Tersimpan"
          >
            <Bookmark className="w-4 h-4" />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
