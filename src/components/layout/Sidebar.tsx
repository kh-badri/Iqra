/* eslint-disable @next/next/no-img-element */
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  GraduationCap,
  Bookmark,
  Compass,
  Settings,
  Download,
  Info,
  Search,
  Calendar,
  NotebookPen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { UserProfileCard } from '@/features/auth/components/UserProfileCard';

const mainNavItems = [
  { href: '/',         label: 'Beranda',          icon: Home,          exact: true },
  { href: '/quran/',   label: "Al-Qur'an",        icon: BookOpen },
  { href: '/sholat/',  label: 'Sholat & Kiblat',  icon: Compass,       badge: 'Hub' },
  { href: '/kalender/',label: 'Kalender Hijriah',  icon: Calendar,      badge: 'Puasa' },
  { href: '/belajar/', label: 'Pusat Belajar',     icon: GraduationCap, badge: 'Hub' },
  { href: '/catatan/', label: 'Catatan Belajar',   icon: NotebookPen,   badge: 'Baru' },
];

const secondaryNavItems = [
  { href: '/bookmark/',   label: 'Bookmark Tersimpan', icon: Bookmark },
  { href: '/pasang/',     label: 'Install App',        icon: Download },
  { href: '/pengaturan/', label: 'Pengaturan',          icon: Settings },
  { href: '/tentang/',    label: 'Tentang & Sumber',   icon: Info },
];

export function Sidebar() {
  const pathname = usePathname();

  const isItemActive = (itemHref: string, exact?: boolean) => {
    if (!pathname) return false;
    if (exact) return pathname === '/' || pathname === '';
    if (itemHref === '/sholat/') {
      return (
        pathname.startsWith('/sholat') ||
        pathname.startsWith('/kiblat') ||
        pathname.startsWith('/masjid')
      );
    }
    if (itemHref === '/belajar/') {
      return (
        pathname.startsWith('/belajar') ||
        pathname.startsWith('/sirah') ||
        pathname.startsWith('/hadits') ||
        pathname.startsWith('/tajwid') ||
        pathname.startsWith('/kisah-nabi') ||
        pathname.startsWith('/kajian')
      );
    }
    if (itemHref === '/catatan/') {
      return pathname.startsWith('/catatan');
    }
    return pathname.startsWith(itemHref);
  };

  return (
    <>
      {/* Spacer statis untuk menjaga layout flex desktop agar tidak bergeser */}
      <div className="hidden md:block w-64 lg:w-72 flex-shrink-0" aria-hidden="true" />

      {/* Sidebar Desktop Fixed: tetap menempel di layar (tidak terpotong saat scroll) */}
      <aside
        className="hidden md:flex flex-col w-64 lg:w-72 bg-surface border-r border-border fixed inset-y-0 left-0 h-screen h-[100dvh] z-30 select-none card-highlight"
        aria-label="Navigasi Desktop"
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-border flex items-center justify-between flex-shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/icons/icon-192.png?v=lime"
                alt="Logo Iqra"
                className="w-10 h-10 rounded-xl shadow-subtle group-hover:scale-105 transition-transform duration-200 object-cover ring-1 ring-border/50"
              />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-surface flex items-center justify-center animate-pulse-dot" />
            </div>
            <div>
              <div className="text-[15px] font-extrabold text-text-primary tracking-tight leading-snug group-hover:text-primary transition-colors">
                Iqra
              </div>
              <div className="text-[11px] text-text-secondary leading-none mt-0.5 font-medium">
                Belajar Agama Islam
              </div>
            </div>
          </Link>
          <ThemeToggle />
        </div>

        {/* Navigation Links (Scroll Mandiri bila layar pendek) */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {/* Quick Search */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('openGlobalSearch'));
              }
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-input bg-surface-alt border border-border text-xs text-text-secondary hover:text-text-primary hover:border-primary/40 hover:bg-primary-soft/30 transition-all duration-200 group active:scale-[0.98]"
            aria-label="Cari di Iqra"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold">Cari di Iqra...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border rounded-button text-text-secondary">
              ⌘K
            </kbd>
          </button>

          {/* Main Nav */}
          <div>
            <div className="text-[10px] font-extrabold text-text-muted tracking-widest uppercase px-2 mb-2">
              Menu Utama
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.href, item.exact);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-button text-sm font-semibold transition-all duration-150 group active:scale-[0.98]',
                      active
                        ? 'bg-primary-gradient text-on-primary shadow-subtle'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          'w-4 h-4 flex-shrink-0 transition-transform duration-150',
                          !active && 'group-hover:scale-110'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          'text-[10px] font-extrabold px-1.5 py-0.5 rounded-pill',
                          active
                            ? 'bg-on-primary/20 text-on-primary'
                            : 'bg-primary-soft text-primary-text'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Secondary Nav */}
          <div>
            <div className="text-[10px] font-extrabold text-text-muted tracking-widest uppercase px-2 mb-2">
              Lainnya
            </div>
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3.5 py-2.5 rounded-button text-sm font-semibold transition-all duration-150 group active:scale-[0.98]',
                      active
                        ? 'bg-primary-gradient text-on-primary shadow-subtle'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4 flex-shrink-0 transition-transform duration-150',
                        !active && 'group-hover:scale-110'
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Profile Card (Tamu / Google) */}
        <div className="p-3 border-t border-border flex-shrink-0">
          <UserProfileCard variant="compact" />
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border flex-shrink-0">
          <p className="text-[11px] text-text-secondary text-center font-medium">
            Iqra v1.0 · PWA &amp; Modern UI
          </p>
        </div>
      </aside>
    </>
  );
}
