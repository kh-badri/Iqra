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
  Type,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { useWakeLock, isWakeLockSupported } from '@/lib/wakeLock';
import { exportBookmarksToJson, importBookmarksFromJson } from '@/lib/bookmarkBackup';
import { UserProfileCard } from '@/features/auth/components/UserProfileCard';

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
      setBackupNotice(`Cadangan (${res.count} bookmark) berhasil diekspor.`);
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
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Info Halaman */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
          Pengaturan Aplikasi
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Sesuaikan tema, profil akun, ukuran teks Mushaf, dan preferensi kenyamanan ibadah Anda
        </p>
      </div>

      {/* Profil & Akun Pengguna (Tamu / Google) */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-bold text-text-muted tracking-widest uppercase px-1">
          Profil &amp; Akun
        </h2>
        <UserProfileCard variant="full" />
      </div>

      {/* Tema Tampilan */}
      <Card className="p-5 sm:p-6 space-y-3.5 bg-surface border-border shadow-card rounded-card">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-primary-text" />
          <h3 className="text-sm font-bold text-text-primary">Tema Tampilan</h3>
        </div>
        <p className="text-xs text-text-muted leading-relaxed">
          Pilih tema terang, gelap, atau ikuti preferensi sistem operasi perangkat Anda.
        </p>
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-button border flex flex-col items-center gap-2 transition-all duration-200 active:scale-95 min-h-[56px] ${
              theme === 'light'
                ? 'bg-primary-gradient text-on-primary font-bold shadow-card border-transparent ring-2 ring-primary/30'
                : 'bg-surface-2 border-border text-text-muted hover:text-text-primary'
            }`}
          >
            <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-on-primary' : 'text-amber-500'}`} />
            <span className="text-xs font-bold">Terang</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-button border flex flex-col items-center gap-2 transition-all duration-200 active:scale-95 min-h-[56px] ${
              theme === 'dark'
                ? 'bg-primary-gradient text-on-primary font-bold shadow-card border-transparent ring-2 ring-primary/30'
                : 'bg-surface-2 border-border text-text-muted hover:text-text-primary'
            }`}
          >
            <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-on-primary' : 'text-primary'}`} />
            <span className="text-xs font-bold">Gelap</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-3.5 rounded-button border flex flex-col items-center gap-2 transition-all duration-200 active:scale-95 min-h-[56px] ${
              theme === 'system'
                ? 'bg-primary-gradient text-on-primary font-bold shadow-card border-transparent ring-2 ring-primary/30'
                : 'bg-surface-2 border-border text-text-muted hover:text-text-primary'
            }`}
          >
            <Laptop className="w-5 h-5" />
            <span className="text-xs font-bold">Sistem</span>
          </button>
        </div>
      </Card>

      {/* Ukuran Teks Arab */}
      <Card className="p-5 sm:p-6 space-y-4 bg-surface border-border shadow-card rounded-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-primary-text" />
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                Ukuran Font Teks Arab
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Rentang ukuran font Mushaf Al-Qur'an (22 px – 44 px)
              </p>
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-[#266308] dark:text-[#9BE35B] bg-pastel-green px-2.5 py-1 rounded-full border border-pastel-green/40 tabular-nums">
            {fontSize} px
          </span>
        </div>

        <Slider
          min={22}
          max={44}
          step={2}
          value={fontSize}
          onChange={(e) => handleFontSizeChange(Number(e.target.value))}
        />

        {/* Preview Teks Arab */}
        <div className="p-5 bg-surface-2 rounded-card text-center border border-border shadow-subtle">
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
      <Card className="p-5 sm:p-6 space-y-3 bg-surface border-border shadow-card rounded-card">
        <div className="flex items-center gap-2 text-text-primary">
          <Eye className="w-4 h-4 text-primary-text" />
          <h3 className="text-sm font-bold">Kenyamanan Membaca</h3>
        </div>
        <div className="flex items-center justify-between py-1">
          <div className="pr-4">
            <p className="text-sm font-semibold text-text-primary">
              Cegah Layar Padam (Screen Wake Lock)
            </p>
            <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
              Menjaga layar tetap aktif menyala saat membaca Al-Qur'an atau mendengarkan audio tilawah.
            </p>
            {!wakeLockAvailable && (
              <p className="text-[11px] text-warning mt-1 flex items-center gap-1 font-medium">
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
      <Card className="p-5 sm:p-6 space-y-3.5 bg-surface border-border shadow-card rounded-card">
        <div>
          <h3 className="text-sm font-bold text-text-primary">
            Cadangan Data Bookmark (JSON)
          </h3>
          <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
            Ekspor bookmark ayat dan hadits favorit Anda ke file JSON untuk dipindahkan ke HP lain tanpa akun.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
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
            className="gap-2 text-xs min-h-[44px] rounded-button font-bold"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Impor Bookmark JSON</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportBackup}
            className="gap-2 text-xs min-h-[44px] rounded-button font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Bookmark JSON</span>
          </Button>
        </div>

        {backupNotice && (
          <div className="p-3.5 bg-pastel-green/50 text-[#266308] dark:text-[#9BE35B] border border-pastel-green/60 rounded-card flex items-center gap-2.5 text-xs sm:text-sm font-bold mt-2 shadow-subtle animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-success" />
            <span>{backupNotice}</span>
          </div>
        )}
      </Card>

      {/* Status Penyimpanan & Cache Offline */}
      <Card className="p-5 sm:p-6 space-y-4 bg-surface border-border shadow-card rounded-card">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-primary-text" />
          <span>Status Memori &amp; Cache Offline</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-surface-2 rounded-card space-y-1 border border-border shadow-subtle">
            <span className="text-text-muted font-medium">Pemakaian Memori:</span>
            <p className="text-sm font-bold text-text-primary font-mono tabular-nums">
              {storageUsage ? `${storageUsage.used} MB / ${storageUsage.quota} MB` : 'Memeriksa kuota...'}
            </p>
          </div>

          <div className="p-3.5 bg-surface-2 rounded-card space-y-1 border border-border shadow-subtle">
            <span className="text-text-muted font-medium">Penyimpanan Persisten:</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-bold ${isPersisted ? 'text-success' : 'text-amber-500'}`}>
                {isPersisted ? 'Aktif (Dilindungi)' : 'Standar Browser'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {!isPersisted && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRequestPersist}
              className="gap-1.5 text-xs text-primary-text min-h-[44px] rounded-button font-bold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{persistRequested ? 'Permintaan Terkirim' : 'Aktifkan Penyimpanan Persisten'}</span>
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5 text-xs text-danger hover:bg-danger/10 min-h-[44px] rounded-button font-bold"
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
