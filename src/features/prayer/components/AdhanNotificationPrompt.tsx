'use client';

import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, Info, CheckCircle2, Smartphone, Volume2, AlertCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { testAdhanNotification } from '../services/prayerNotifierService';
import { triggerCpanelPushTest } from '../services/webPushService';

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
  const [isTesting, setIsTesting] = React.useState(false);
  const [isPushTesting, setIsPushTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ success: boolean; message: string } | null>(null);

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

  const handleTestNotification = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testAdhanNotification();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Gagal menjalankan uji coba notifikasi.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestCpanelPush = async () => {
    setIsPushTesting(true);
    setTestResult(null);
    try {
      const res = await triggerCpanelPushTest();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Gagal mengirim Web Push dari cPanel.',
      });
    } finally {
      setIsPushTesting(false);
    }
  };

  return (
    <Card className="p-4 sm:p-5 border-border space-y-3 bg-surface shadow-card">
      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-full bg-pastel-green text-primary-text flex items-center justify-center flex-shrink-0 mt-0.5 shadow-subtle">
          <Bell className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-extrabold text-text-primary tracking-tight">
              Pengingat Adzan &amp; Waktu Sholat Otomatis
            </h4>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-pill bg-primary/10 text-primary-text border border-primary/20">
              Cron Job cPanel Siap
            </span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Dapatkan notifikasi layar HP dan lantunan adzan saat waktu sholat telah masuk, didukung Cron Job cPanel di latar belakang.
          </p>
        </div>
      </div>

      {/* Catatan Transparansi Mekanisme Web Push */}
      <div className="p-3.5 bg-surface-alt rounded-button text-xs text-text-secondary space-y-1 border border-border">
        <div className="flex items-center gap-1.5 font-bold text-text-primary">
          <Info className="w-3.5 h-3.5 text-primary-text flex-shrink-0" />
          <span>Cara Kerja Web Push cPanel:</span>
        </div>
        <p className="leading-relaxed text-[11px]">
          Server cPanel mengecek jadwal setiap menit via Cron Job dan mengirimkan sinyal Web Push ke HP Anda saat adzan tiba. Notifikasi berdering dan bergetar di layar kunci HP meski aplikasi telah ditutup.
        </p>
      </div>

      {/* Status Uji Coba */}
      {testResult && (
        <div
          className={`p-3 rounded-button text-xs flex items-center gap-2 border transition-all ${
            testResult.success
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500/40 text-rose-800 dark:text-rose-200'
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="leading-snug">{testResult.message}</span>
        </div>
      )}

      {/* Kontrol Notifikasi Berdasarkan Platform */}
      <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {permission === 'granted' ? (
          <div className="flex flex-wrap items-center justify-between gap-2.5 w-full">
            <div className="inline-flex items-center gap-1.5 text-xs text-success font-extrabold bg-pastel-green px-3 py-1.5 rounded-pill">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Notifikasi &amp; Web Push Aktif</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNotification}
                disabled={isTesting}
                className="gap-1.5 text-xs rounded-pill font-bold border-primary/40 text-primary-text hover:bg-pastel-green active:scale-95 shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isTesting ? 'Menguji...' : 'Uji Suara & Notif'}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleTestCpanelPush}
                disabled={isPushTesting}
                className="gap-1.5 text-xs rounded-pill font-bold border-emerald-500/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 active:scale-95 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isPushTesting ? 'Mengirim...' : 'Uji Push cPanel'}</span>
              </Button>
            </div>
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
          <div className="flex flex-wrap items-center justify-between gap-2.5 w-full">
            <Button
              variant="primary"
              size="sm"
              onClick={onRequestPermission}
              className="gap-1.5 text-xs w-full sm:w-auto rounded-pill font-extrabold shadow-subtle"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Aktifkan Pengingat Sholat</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleTestNotification}
              disabled={isTesting}
              className="gap-1.5 text-xs rounded-pill font-bold border-border hover:bg-surface-alt active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Uji Coba Suara</span>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
