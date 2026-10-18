'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import {
  Moon,
  Sun,
  Laptop,
  Trash2,
  HardDrive,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { useWakeLock, isWakeLockSupported } from '@/lib/wakeLock';
import { exportBookmarksToJson, importBookmarksFromJson } from '@/lib/bookmarkBackup';

export default function PengaturanPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [wakeLock, setWakeLock] = React.useState(false);
  const [wakeLockAvailable, setWakeLockAvailable] = React.useState(true);
  const [fontSize, setFontSize] = React.useState(28);

  // Storage states
  const [storageUsage, setStorageUsage] = React.useState<{ used: string; quota: string } | null>(null);
  const [isPersisted, setIsPersisted] = React.useState<boolean>(false);
  const [persistRequested, setPersistRequested] = React.useState(false);

  // Bookmark notification
  const [backupNotice, setBackupNotice] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Hook Wake Lock
  useWakeLock(wakeLock);

  React.useEffect(() => {
    setMounted(true);
    setWakeLockAvailable(isWakeLockSupported());

    // Load saved wake lock preference
    const savedWakeLock = localStorage.getItem('iqra_wake_lock') === 'true';
    setWakeLock(savedWakeLock);

    // Load saved font size preference
    const savedFontSize = localStorage.getItem('iqra_font_size');
    if (savedFontSize) {
      setFontSize(Number(savedFontSize));
    }

    // Check storage quota and persistent state
    if (typeof window !== 'undefined' && 'storage' in navigator) {
      if (navigator.storage.estimate) {
        navigator.storage.estimate().then((est) => {
          if (est.usage !== undefined && est.quota !== undefined) {
            const usedMB = (est.usage / (1024 * 1024)).toFixed(1);
            const quotaMB = (est.quota / (1024 * 1024)).toFixed(0);
            setStorageUsage({ used: usedMB, quota: quotaMB });
          }
        }).catch(() => {});
      }

      if (navigator.storage.persisted) {
        navigator.storage.persisted().then((persisted) => {
          setIsPersisted(persisted);
        }).catch(() => {});
      }
    }
  }, []);

  const handleWakeLockChange = (enabled: boolean) => {
    setWakeLock(enabled);
    localStorage.setItem('iqra_wake_lock', String(enabled));
  };

  const handleFontSizeChange = (val: number) => {
    setFontSize(val);
    localStorage.setItem('iqra_font_size', String(val));
    // Emit global event for components listening to font size adjustments
    window.dispatchEvent(new CustomEvent('iqraFontSizeChange', { detail: val }));
  };

  const handleRequestPersist = async () => {
    if (typeof window !== 'undefined' && navigator.storage && navigator.storage.persist) {
      const persisted = await navigator.storage.persist();
      setIsPersisted(persisted);
      setPersistRequested(true);
      setTimeout(() => setPersistRequested(false), 3000);
    }
  };

  const handleExportBackup = async () => {
    try {
      const res = await exportBookmarksToJson();
      setBackupNotice(`File ${res.filename} (${res.count} bookmark) berhasil diekspor.`);
      setTimeout(() => setBackupNotice(null), 4000);
    } catch (err: any) {
      alert('Gagal mengekspor: ' + err.message);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await importBookmarksFromJson(file);
      setBackupNotice(res.message);
      setTimeout(() => setBackupNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Gagal mengimpor file.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          Pengaturan Aplikasi
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
          Sesuaikan tampilan, ukuran teks Arab, penyimpanan offline, dan preferensi kenyamanan ibadah Anda
        </p>
      </div>

      {/* Tema Tampilan */}
      <Card className="p-5 space-y-3">
        <h3 className="text-sm font-bold text-text-primary">Tema Tampilan</h3>
        <p className="text-xs text-text-secondary">
          Pilih tema terang, gelap, atau ikuti preferensi sistem operasi perangkat Anda.
        </p>
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-card border flex flex-col items-center gap-2 transition-all ${
              theme === 'light'
                ? 'bg-primary-soft border-primary text-primary font-semibold'
                : 'bg-surface border-border text-text-secondary hover:bg-surface-alt'
            }`}
          >
            <Sun className="w-5 h-5 text-accent" />
            <span className="text-xs">Terang</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-card border flex flex-col items-center gap-2 transition-all ${
              theme === 'dark'
                ? 'bg-primary-soft border-primary text-primary font-semibold'
                : 'bg-surface border-border text-text-secondary hover:bg-surface-alt'
            }`}
          >
            <Moon className="w-5 h-5 text-primary" />
            <span className="text-xs">Gelap</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-3 rounded-card border flex flex-col items-center gap-2 transition-all ${
              theme === 'system'
                ? 'bg-primary-soft border-primary text-primary font-semibold'
                : 'bg-surface border-border text-text-secondary hover:bg-surface-alt'
            }`}
          >
            <Laptop className="w-5 h-5" />
            <span className="text-xs">Sistem</span>
          </button>
        </div>
      </Card>

      {/* Ukuran Teks Arab */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              Ukuran Font Teks Arab
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Rentang ukuran teks Mushaf Al-Qur'an (22 px - 44 px)
            </p>
          </div>
          <Chip variant="secondary" className="font-mono text-xs">
            {fontSize} px
          </Chip>
        </div>

        <Slider
          min={22}
          max={44}
          step={2}
          value={fontSize}
          onChange={(e) => handleFontSizeChange(Number(e.target.value))}
        />

        {/* Preview Teks Arab */}
        <div className="p-4 bg-surface-alt rounded-card text-center overflow-x-auto">
          <p
            dir="rtl"
            className="font-arabic text-text-primary leading-loose"
            style={{ fontSize: `${fontSize}px` }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      </Card>

      {/* Kenyamanan Baca & Screen Wake Lock */}
      <Card className="p-5 space-y-3">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <span>Kenyamanan Membaca</span>
        </h3>
        <div className="flex items-center justify-between py-2">
          <div className="pr-4">
            <p className="text-sm font-semibold text-text-primary">
              Cegah Layar Padam (Screen Wake Lock)
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              Menjaga layar tetap menyala saat membaca Al-Qur'an atau mendengarkan audio tilawah tanpa perlu menyentuh layar berulang-ulang.
            </p>
            {!wakeLockAvailable && (
              <p className="text-[11px] text-accent mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 inline" />
                Browser ini belum mendukung Screen Wake Lock API secara penuh.
              </p>
            )}
          </div>
          <Switch
            checked={wakeLock}
            onChange={handleWakeLockChange}
            disabled={!wakeLockAvailable}
          />
        </div>
      </Card>

      {/* Cadangan & Pulihkan Bookmark (JSON) */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              Cadangan Data Bookmark (JSON)
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Ekspor koleksi ayat dan hadits favorit Anda ke file JSON untuk dipindahkan ke HP atau browser lain tanpa perlu registrasi akun.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImportBackup}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 text-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Impor Bookmark JSON</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportBackup}
            className="gap-2 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Bookmark JSON</span>
          </Button>
        </div>

        {backupNotice && (
          <div className="p-3 bg-primary-soft text-primary border border-primary/20 rounded-card flex items-center gap-2 text-xs font-medium mt-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-primary" />
            <span>{backupNotice}</span>
          </div>
        )}
      </Card>

      {/* Status Penyimpanan & Cache Offline */}
      <Card className="p-5 space-y-4">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-primary" />
          <span>Status Memori & Cache Offline</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-surface-alt rounded-card space-y-1">
            <span className="text-text-secondary">Pemakaian Memori:</span>
            <p className="text-sm font-bold text-text-primary font-mono">
              {storageUsage ? `${storageUsage.used} MB / ${storageUsage.quota} MB` : 'Memeriksa kuota...'}
            </p>
          </div>

          <div className="p-3 bg-surface-alt rounded-card space-y-1">
            <span className="text-text-secondary">Penyimpanan Persisten (Anti Hapus):</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-bold ${isPersisted ? 'text-success' : 'text-accent'}`}>
                {isPersisted ? 'Aktif (Dilindungi)' : 'Standar Browser'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {!isPersisted && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRequestPersist}
              className="gap-1.5 text-xs text-primary"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{persistRequested ? 'Permintaan Terkirim' : 'Aktifkan Penyimpanan Persisten'}</span>
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5 text-xs text-danger hover:bg-danger/10"
            onClick={() => {
              if (typeof window !== 'undefined' && confirm('Hapus semua cache aset offline? Halaman akan tetap bekerja dengan mengambil data baru.')) {
                caches.keys().then((keys) => {
                  keys.forEach((key) => caches.delete(key));
                  alert('Cache berhasil dibersihkan.');
                });
              }
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan Cache Aset</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
