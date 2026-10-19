'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, GraduationCap, Compass, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export const navItems = [
  { href: '/',        label: 'Beranda',   icon: Home },
  { href: '/quran/',  label: "Al-Qur'an", icon: BookOpen },
  { href: '/sholat/', label: 'Sholat',    icon: Compass },
  { href: '/belajar/',label: 'Belajar',   icon: GraduationCap },
  { href: '/lainnya/',label: 'Lainnya',   icon: MoreHorizontal },
];

export function BottomNav() {
  const pathname = usePathname();
  const [isKeyboardOpen, setIsKeyboardOpen] = React.useState(false);

  // Deteksi keyboard virtual terbuka di Android / iOS untuk menyembunyikan bottom nav
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = () => {
      setIsKeyboardOpen(false);
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);

    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

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

  if (isKeyboardOpen) return null;

  return (
    <nav
      className="fixed bottom-3 left-3 right-3 z-40 md:hidden safe-bottom max-w-md mx-auto select-none pointer-events-none"
      aria-label="Navigasi Utama HP"
    >
      {/* Floating glass/surface container with 24px radius & soft shadow */}
      <div className="bg-surface/98 backdrop-blur-md border border-border/80 shadow-elevated rounded-[24px] px-2 py-1.5 pointer-events-auto card-highlight transform-gpu">
        <div className="grid grid-cols-5 h-[58px] items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center justify-center transition-all duration-200 active:scale-90 group',
                  active ? 'text-primary-text' : 'text-text-secondary hover:text-text-primary'
                )}
                aria-current={active ? 'page' : undefined}
              >
                {/* Active circle indicator with lime-green gradient */}
                <div
                  className={cn(
                    'flex items-center justify-center transition-all duration-250',
                    active
                      ? 'w-10 h-10 rounded-full bg-primary-gradient text-on-primary shadow-glow animate-spring-bounce'
                      : 'w-8 h-8 rounded-full bg-transparent group-hover:bg-surface-alt text-text-secondary'
                  )}
                >
                  <Icon
                    className={cn(
                      'transition-transform duration-200',
                      active ? 'w-5 h-5 stroke-[2.3]' : 'w-5 h-5 stroke-[1.8]'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'text-[10px] leading-none mt-1 transition-all duration-150',
                    active ? 'font-extrabold text-primary-text' : 'font-medium'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
