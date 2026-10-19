'use client';

import * as React from 'react';
import {
  Smartphone,
  CheckCircle2,
  Download,
  HelpCircle,
  Share,
  PlusSquare,
  Sparkles,
  WifiOff,
  Zap,
} from 'lucide-react';
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
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Info Halaman */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
          Install App Iqra
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Nikmati pengalaman seperti aplikasi native di HP Android &amp; iPhone tanpa app store
        </p>
      </div>

      {/* Status Card */}
      <Card className="p-5 sm:p-6 bg-surface border-border shadow-card rounded-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-pastel-green text-[#266308] border border-pastel-green/40 flex items-center justify-center flex-shrink-0 shadow-subtle">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-text-primary">
                  Status Aplikasi
                </h2>
                {isStandalone ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-pastel-green px-2.5 py-0.5 rounded-full border border-pastel-green/40">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Terpasang
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-[#8A1846] bg-pastel-pink px-2.5 py-0.5 rounded-full border border-pastel-pink/40">
                    Siap Pasang
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
                {isStandalone
                  ? 'Aplikasi Iqra sudah terpasang di Layar Utama HP Anda.'
                  : 'Pasang ke layar utama untuk akses instan dan mode layar penuh.'}
              </p>
            </div>
          </div>

          {!isStandalone && (
            <Button
              variant="primary"
              onClick={handleInstallClick}
              className="gap-2 w-full sm:w-auto h-[52px] rounded-button text-sm font-bold shadow-card active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>{isIOS ? 'Lihat Panduan iPhone' : 'Install Sekarang'}</span>
            </Button>
          )}
        </div>
      </Card>

      {/* Keuntungan Install App */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 px-1">
          Keuntungan Install Aplikasi Iqra
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <Card className="p-5 space-y-3 bg-surface border-border shadow-card rounded-card">
            <div className="w-10 h-10 rounded-full bg-pastel-green text-[#266308] border border-pastel-green/40 flex items-center justify-center font-bold text-sm shadow-subtle">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-text-primary">
              Layar Penuh (Standalone)
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Tampil bersih seperti aplikasi asli tanpa bilah URL atau tab browser yang mengganggu.
            </p>
          </Card>

          <Card className="p-5 space-y-3 bg-surface border-border shadow-card rounded-card">
            <div className="w-10 h-10 rounded-full bg-pastel-cyan text-[#0B5C66] border border-pastel-cyan/40 flex items-center justify-center font-bold text-sm shadow-subtle">
              <WifiOff className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-text-primary">
              Bisa Diakses Offline
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Al-Qur'an, hadits, dan jadwal sholat tetap dapat dibuka meski tanpa koneksi internet.
            </p>
          </Card>

          <Card className="p-5 space-y-3 bg-surface border-border shadow-card rounded-card">
            <div className="w-10 h-10 rounded-full bg-pastel-orange text-[#8C3E00] border border-pastel-orange/40 flex items-center justify-center font-bold text-sm shadow-subtle">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-text-primary">
              Hemat Kuota &amp; Cepat
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Semua aset utama tersimpan di cache memori perangkat dengan loading instan di bawah 1 detik.
            </p>
          </Card>
        </div>
      </div>

      {/* Panduan Cepat iOS & Android */}
      <Card className="p-5 sm:p-6 space-y-4 bg-surface border-border shadow-card rounded-card">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primary-text" />
          <span>Panduan Cara Pasang Manual</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-text-muted">
          {/* iOS Safari */}
          <div className="p-4 bg-surface-2 rounded-card border border-border space-y-2">
            <div className="flex items-center gap-2 font-bold text-text-primary">
              <Share className="w-4 h-4 text-primary-text" />
              <span>Pengguna iPhone (Safari):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-xs">
              <li>Buka website ini di browser Safari</li>
              <li>Ketuk tombol <strong>Share</strong> (ikon kotak panah ke atas)</li>
              <li>Gulir ke bawah, pilih <strong>"Add to Home Screen"</strong></li>
              <li>Ketuk <strong>"Add"</strong> di pojok kanan atas</li>
            </ol>
          </div>

          {/* Android Chrome */}
          <div className="p-4 bg-surface-2 rounded-card border border-border space-y-2">
            <div className="flex items-center gap-2 font-bold text-text-primary">
              <Download className="w-4 h-4 text-primary-text" />
              <span>Pengguna Android (Chrome):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-xs">
              <li>Buka website ini di browser Chrome</li>
              <li>Ketuk tombol menu <strong>tiga titik (⋮)</strong> di kanan atas</li>
              <li>Pilih opsi <strong>"Install app"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong></li>
              <li>Konfirmasi dengan mengetuk <strong>"Install"</strong></li>
            </ol>
          </div>
        </div>
      </Card>

      <IOSInstallGuide isOpen={showIOSGuide} onClose={() => setShowIOSGuide(false)} />
    </div>
  );
}
