'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  GraduationCap,
  Clock,
  MoreHorizontal,
  Bookmark,
  Compass,
  Tv,
  Settings,
  Download,
  Info,
  Search,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

const mainNavItems = [
  { href: '/', label: 'Beranda', icon: Home, exact: true },
  { href: '/quran/', label: "Al-Qur'an", icon: BookOpen },
  { href: '/sholat/', label: 'Sholat & Kiblat', icon: Compass, badge: 'Hub' },
  { href: '/kalender/', label: 'Kalender Hijriah', icon: Calendar, badge: 'Puasa' },
  { href: '/belajar/', label: 'Pusat Belajar', icon: GraduationCap, badge: 'Hub' },
];

const secondaryNavItems = [
  { href: '/bookmark/', label: 'Bookmark Tersimpan', icon: Bookmark },
  { href: '/pasang/', label: 'Install App', icon: Download },
  { href: '/pengaturan/', label: 'Pengaturan', icon: Settings },
  { href: '/tentang/', label: 'Tentang & Sumber', icon: Info },
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
    return pathname.startsWith(itemHref);
  };

  return (
    <aside
      className="hidden md:flex flex-col w-64 lg:w-72 bg-surface border-r border-border h-screen sticky top-0 flex-shrink-0 z-30 select-none"
      aria-label="Navigasi Desktop"
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-card bg-primary text-white flex items-center justify-center font-bold text-lg shadow-subtle group-hover:bg-primary-pressed transition-colors">
            {/* Flat 8-point geometric star icon representation */}
            <span className="font-arabic text-xl leading-none">اقرأ</span>
          </div>
          <div>
            <div className="text-base font-bold text-text-primary tracking-tight">
              Iqra
            </div>
            <div className="text-[11px] text-text-secondary leading-none mt-0.5">
              Belajar Agama Islam
            </div>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* Quick Search Button */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('openGlobalSearch'));
            }
          }}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-card bg-surface-alt border border-border text-xs text-text-secondary hover:text-text-primary hover:border-primary/40 transition-colors"
          aria-label="Cari di Iqra"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-primary" />
            <span>Cari di Iqra...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface border border-border rounded text-text-secondary">
            Ctrl+K
          </kbd>
        </button>

        <div>
          <div className="text-[11px] font-semibold text-text-secondary tracking-wider uppercase px-3 mb-2">
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
                    'flex items-center justify-between px-3.5 py-2.5 rounded-card text-sm font-medium transition-colors duration-150',
                    active
                      ? 'bg-primary text-white shadow-subtle'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                        active ? 'bg-white/20 text-white' : 'bg-primary-soft text-primary'
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

        <div>
          <div className="text-[11px] font-semibold text-text-secondary tracking-wider uppercase px-3 mb-2">
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
                    'flex items-center gap-3.5 px-3.5 py-2.5 rounded-card text-sm font-medium transition-colors duration-150',
                    active
                      ? 'bg-primary text-white shadow-subtle'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-border text-center">
        <p className="text-[11px] text-text-secondary">
          Iqra v1.0 · PWA & Static Export
        </p>
      </div>
    </aside>
  );
}
