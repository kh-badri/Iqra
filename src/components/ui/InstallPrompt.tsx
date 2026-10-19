/* eslint-disable @next/next/no-img-element */
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Download, Smartphone, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import { IOSInstallGuide } from './IOSInstallGuide';

export interface InstallPromptProps {
  className?: string;
  forceShow?: boolean;
}

export function InstallPrompt({ className, forceShow = false }: InstallPromptProps) {
  const [mounted, setMounted] = React.useState(false);
  const [isStandalone, setIsStandalone] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isIOS, setIsIOS] = React.useState(false);
  const [showIOSGuide, setShowIOSGuide] = React.useState(false);
  const [justInstalled, setJustInstalled] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    // Check standalone mode
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Check 14-day dismissal
    const dismissedUntil = localStorage.getItem('iqra_install_dismissed_until');
    if (dismissedUntil && Number(dismissedUntil) > Date.now() && !forceShow) {
      setIsDismissed(true);
    }

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    // Listen to beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Listen to appinstalled
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setJustInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [forceShow]);

  if (!mounted) return null;
  if (isStandalone && !justInstalled) return null;
  if (isDismissed && !forceShow) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    const fourteenDays = Date.now() + 14 * 24 * 60 * 60 * 1000;
    localStorage.setItem('iqra_install_dismissed_until', String(fourteenDays));
  };

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsStandalone(true);
        setJustInstalled(true);
      } else {
        handleDismiss();
      }
      setDeferredPrompt(null);
    } else {
      setShowIOSGuide(true);
    }
  };

  if (justInstalled) {
    return (
      <div
        className={cn(
          'p-4 bg-success/15 border border-success/30 rounded-card flex items-center gap-3 text-xs sm:text-sm text-success font-semibold',
          className
        )}
      >
        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
        <span>Terima kasih! Aplikasi Iqra telah berhasil terinstall di Layar Utama HP Anda.</span>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'p-4 bg-surface border border-primary/30 rounded-card shadow-elevated flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
          className
        )}
      >
        <div className="flex items-start gap-3.5">
          <img
            src="/icons/icon-192.png?v=lime"
            alt="Logo Iqra"
            className="w-11 h-11 rounded-xl shadow-subtle flex-shrink-0 object-cover ring-1 ring-border/60"
          />
          <div>
            <h4 className="text-sm font-bold text-text-primary">
              Install App Iqra
            </h4>
            <p className="text-xs text-text-secondary mt-0.5 max-w-md">
              Install ke layar utama HP untuk akses cepat tanpa bilah browser, hemat kuota, dan bisa dibuka saat offline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-xs">
            Nanti (14 Hari)
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleInstall}
            className="gap-1.5 w-full sm:w-auto text-xs"
          >
            <Download className="w-4 h-4" />
            <span>{isIOS ? 'Lihat Panduan' : 'Install Sekarang'}</span>
          </Button>
        </div>
      </div>

      <IOSInstallGuide
        isOpen={showIOSGuide}
        onClose={() => setShowIOSGuide(false)}
      />
    </>
  );
}
