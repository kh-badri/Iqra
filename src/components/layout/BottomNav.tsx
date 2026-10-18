'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, GraduationCap, Compass, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export const navItems = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/quran/', label: "Al-Qur'an", icon: BookOpen },
  { href: '/sholat/', label: 'Sholat & Kiblat', icon: Compass },
  { href: '/belajar/', label: 'Belajar', icon: GraduationCap },
  { href: '/lainnya/', label: 'Lainnya', icon: MoreHorizontal },
];

export function BottomNav() {
  const pathname = usePathname();

  const isItemActive = (itemHref: string) => {
    if (!pathname) return false;
    if (itemHref === '/') return pathname === '/' || pathname === '';
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
    if (itemHref === '/lainnya/') {
      return (
        pathname.startsWith('/lainnya') ||
        pathname.startsWith('/pengaturan') ||
        pathname.startsWith('/pasang') ||
        pathname.startsWith('/tentang') ||
        pathname.startsWith('/bookmark')
      );
    }
    return pathname.startsWith(itemHref);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border md:hidden safe-bottom shadow-elevated"
      aria-label="Navigasi Utama HP"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center h-full min-h-[48px] transition-all duration-150 select-none py-1 group active:scale-95',
                active
                  ? 'text-primary font-bold'
                  : 'text-text-secondary hover:text-text-primary'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <div
                className={cn(
                  'w-11 h-7 rounded-pill flex items-center justify-center transition-all duration-200',
                  active
                    ? 'bg-primary-soft text-primary shadow-sm scale-105'
                    : 'text-text-secondary group-hover:text-text-primary group-hover:bg-surface-alt'
                )}
              >
                <Icon className={cn('w-5 h-5 transition-transform', active && 'stroke-[2.4]')} />
              </div>
              <span
                className={cn(
                  'text-[10px] tracking-tight mt-1 leading-tight truncate max-w-[68px] text-center transition-colors',
                  active ? 'font-bold text-primary' : 'font-medium'
                )}
              >
                {item.label}
              </span>
              {/* Micro-dot active indicator */}
              <div
                className={cn(
                  'w-1 h-1 rounded-full mt-0.5 transition-all duration-200',
                  active ? 'bg-primary scale-100 opacity-100' : 'bg-transparent scale-0 opacity-0'
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
