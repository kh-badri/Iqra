'use client';

import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, Info, CheckCircle2, Smartphone } from 'lucide-react';
import Link from 'next/link';

export interface AdhanNotificationPromptProps {
  permission: NotificationPermission;
  onRequestPermission: () => Promise<boolean>;
}

export function AdhanNotificationPrompt({
  permission,
  onRequestPermission,
}: AdhanNotificationPromptProps) {
  const [isIOS, setIsIOS] = React.useState(false);
  const [isStandalone, setIsStandalone] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(ua));
      setIsStandalone(
        window.matchMedia('(display-mode: standalone)').matches ||
          (window.navigator as any).standalone === true
      );
    }
  }, []);

  return (
    <Card className="p-4 sm:p-5 border-border space-y-3 bg-surface shadow-card">
      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-full bg-pastel-green text-primary-text flex items-center justify-center flex-shrink-0 mt-0.5 shadow-subtle">
          <Bell className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-text-primary tracking-tight">
            Pengingat Adzan &amp; Waktu Sholat
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            Dapatkan notifikasi dan lantunan pengingat saat waktu sholat telah masuk.
          </p>
        </div>
      </div>

      {/* Catatan Transparansi Keterbatasan Hosting Statis */}
      <div className="p-3.5 bg-surface-alt rounded-button text-xs text-text-secondary space-y-1 border border-border">
        <div className="flex items-center gap-1.5 font-bold text-text-primary">
          <Info className="w-3.5 h-3.5 text-primary-text flex-shrink-0" />
          <span>Cara Kerja Pengingat Web:</span>
        </div>
        <p className="leading-relaxed text-[11px]">
          Karena aplikasi disajikan secara statis tanpa server background, pengingat bekerja optimal selama website/PWA terbuka di tab atau diminimalkan. Agar pengingat selalu tepat waktu, pasang Iqra sebagai aplikasi di layar utama HP Anda.
        </p>
      </div>

      {/* Kontrol Notifikasi Berdasarkan Platform */}
      <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {permission === 'granted' ? (
          <div className="inline-flex items-center gap-1.5 text-xs text-success font-extrabold bg-pastel-green px-3 py-1.5 rounded-pill">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>Notifikasi web aktif</span>
          </div>
        ) : isIOS && !isStandalone ? (
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-xs text-text-secondary font-medium">
              Di iPhone/iPad, notifikasi web memerlukan pemasangan ke Layar Utama terlebih dahulu.
            </span>
            <Link href="/pasang/">
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs rounded-pill font-bold">
                <Smartphone className="w-3.5 h-3.5 text-primary-text" />
                <span>Panduan Pasang</span>
              </Button>
            </Link>
          </div>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={onRequestPermission}
            className="gap-1.5 text-xs w-full sm:w-auto rounded-pill font-extrabold shadow-subtle"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Aktifkan Pengingat Sholat</span>
          </Button>
        )}
      </div>
    </Card>
  );
}
