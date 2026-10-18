'use client';

import * as React from 'react';
import { Smartphone, CheckCircle2, Download, HelpCircle, Share, PlusSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IOSInstallGuide } from '@/components/ui/IOSInstallGuide';

export default function PasangPage() {
  const [isIOS, setIsIOS] = React.useState(false);
  const [isStandalone, setIsStandalone] = React.useState(false);
  const [showIOSGuide, setShowIOSGuide] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isIosDevice);

      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);

      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall);
      return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    }
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowIOSGuide(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          Install App Iqra
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Nikmati pengalaman seperti aplikasi native di HP Android & iPhone tanpa melalui app store
        </p>
      </div>

      {/* Status Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-card bg-primary-soft text-primary flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Status Aplikasi di Perangkat Ini
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
                {isStandalone
                  ? 'Aplikasi Iqra sudah terinstall di Layar Utama Anda.'
                  : 'Aplikasi belum terinstall di Layar Utama.'}
              </p>
            </div>
          </div>

          {!isStandalone && (
            <Button variant="primary" onClick={handleInstallClick} className="gap-2">
              <Download className="w-4 h-4" />
              <span>{isIOS ? 'Lihat Panduan iPhone' : 'Install Sekarang'}</span>
            </Button>
          )}
        </div>
      </Card>

      {/* Manfaat Memasang */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-3">
          Keuntungan Install Aplikasi Iqra
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="p-4 space-y-2">
            <div className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-xs">
              ✓
            </div>
            <h4 className="text-sm font-semibold text-text-primary">
              Layar Penuh (Standalone)
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Tampil bersih tanpa bilah URL atau tab browser yang mengganggu pembacaan.
            </p>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-xs">
              ✓
            </div>
            <h4 className="text-sm font-semibold text-text-primary">
              Bisa Diakses Offline
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Al-Qur'an, hadits, dan jadwal sholat tetap dapat dibuka meski tanpa koneksi internet.
            </p>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-xs">
              ✓
            </div>
            <h4 className="text-sm font-semibold text-text-primary">
              Hemat Kuota & Cepat
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              Semua aset utama tersimpan di cache memori perangkat, loading instan.
            </p>
          </Card>
        </div>
      </div>

      {/* FAQ & Panduan Khusus */}
      <Card className="p-5 space-y-4">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-accent" />
          <span>Pertanyaan Umum Install Aplikasi</span>
        </h3>

        <div className="space-y-3 text-xs sm:text-sm text-text-secondary">
          <div className="p-3 bg-surface-alt rounded-card">
            <p className="font-semibold text-text-primary">
              Tidak muncul tombol "Tambah ke Layar Utama" di iPhone?
            </p>
            <p className="mt-1">
              Pastikan Anda membuka website Iqra menggunakan peramban <strong>Safari</strong> bawaan iOS. Chrome di iOS tidak mendukung pemasangan PWA ke layar utama.
            </p>
          </div>

          <div className="p-3 bg-surface-alt rounded-card">
            <p className="font-semibold text-text-primary">
              Apakah aplikasi ini membutuhkan banyak memori HP?
            </p>
            <p className="mt-1">
              Tidak. Iqra sangat ringan (kurang dari 10 MB total untuk app shell dan database teks), jauh lebih hemat dibandingkan aplikasi native dari Play Store.
            </p>
          </div>
        </div>
      </Card>

      <IOSInstallGuide isOpen={showIOSGuide} onClose={() => setShowIOSGuide(false)} />
    </div>
  );
}
