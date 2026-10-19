/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  User,
  LogOut,
  Mail,
  Sparkles,
  CheckCircle2,
  Settings,
  AlertCircle,
  Loader2,
  BookOpen,
  Compass,
  Calendar,
  Clock,
  GraduationCap,
  ScrollText,
  ExternalLink,
  Key,
  RefreshCw,
  Cloud,
} from 'lucide-react';
import { useAuthStore } from '../authStore';
import {
  loadGoogleIdentityScript,
  parseGoogleJwt,
  triggerGoogleOAuth,
} from '../googleAuth';
import { Button } from '@/components/ui/Button';
import GoogleAuth from '@/components/GoogleAuth';
import { isFirebaseReady, saveFirebaseConfig } from '@/lib/firebase';
import { syncAllUserData } from '@/features/sync/syncService';

const ENV_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export const UserProfileModal: React.FC = () => {
  const {
    user,
    isAuthModalOpen,
    closeAuthModal,
    loginWithGoogleProfile,
    logoutToGuest,
    customClientId,
    setCustomClientId,
  } = useAuthStore();

  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [tempClientId, setTempClientId] = useState('');

  // Sinkronisasi Cloud (Firebase) states
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [showFirebaseSetup, setShowFirebaseSetup] = useState(false);
  const [firebaseApiKey, setFirebaseApiKey] = useState('');
  const [firebaseProjectId, setFirebaseProjectId] = useState('');

  const isFirebaseConfigured = isFirebaseReady();

  const googleBtnRef = useRef<HTMLDivElement>(null);
  const effectiveClientId = (customClientId || ENV_CLIENT_ID).trim();

  // Inisialisasi Google Identity Services & One Tap otomatis saat modal terbuka jika Client ID tersedia
  useEffect(() => {
    if (!isAuthModalOpen) {
      setErrorMessage(null);
      setIsConnecting(false);
      return;
    }

    setTempClientId(customClientId || ENV_CLIENT_ID);

    if (effectiveClientId && user.isGuest) {
      loadGoogleIdentityScript().then((loaded) => {
        if (loaded && window.google?.accounts?.id) {
          try {
            window.google.accounts.id.initialize({
              client_id: effectiveClientId,
              auto_select: true, // Otomatis mendeteksi akun Google aktif di browser
              callback: (response: any) => {
                if (response?.credential) {
                  const payload = parseGoogleJwt(response.credential);
                  if (payload) {
                    loginWithGoogleProfile({
                      id: payload.sub,
                      name: payload.name,
                      email: payload.email,
                      picture: payload.picture,
                    });
                    closeAuthModal();
                  }
                }
              },
            });

            // Tampilkan tombol Google resmi di div kontainer jika tersedia
            if (googleBtnRef.current) {
              googleBtnRef.current.innerHTML = '';
              window.google.accounts.id.renderButton(googleBtnRef.current, {
                theme: 'outline',
                size: 'large',
                text: 'continue_with',
                shape: 'pill',
                logo_alignment: 'left',
                width: 320,
              });
            }

            // Prompt One Tap untuk mendeteksi akun aktif secara native
            window.google.accounts.id.prompt((notification: any) => {
              if (notification.isNotDisplayed()) {
                console.log('Google One Tap notice:', notification.getNotDisplayedReason());
              }
            });
          } catch (err) {
            console.error('Google One Tap init error:', err);
          }
        }
      });
    }
  }, [isAuthModalOpen, effectiveClientId, user.isGuest, loginWithGoogleProfile, closeAuthModal, customClientId]);

  if (!isAuthModalOpen) return null;

  // Handler: Buka popup resmi Google untuk memilih akun aktif
  const handleConnectWithGoogle = async (overrideClientId?: string) => {
    setErrorMessage(null);
    const activeClientId = (overrideClientId || effectiveClientId).trim();

    // Jika Client ID belum diisi, tampilkan form konfigurasi dengan panduan lengkap
    if (!activeClientId) {
      setShowConfig(true);
      setErrorMessage(
        'Google Client ID belum diatur. Google mewajibkan OAuth Client ID dari Google Cloud Console agar browser dapat membuka pemilih akun Google asli Anda secara aman.'
      );
      return;
    }

    try {
      setIsConnecting(true);
      // Memanggil Google Identity Services OAuth popup resmi
      const googleUser = await triggerGoogleOAuth(activeClientId, 'select_account');

      // Simpan data asli yang dikembalikan oleh API resmi Google
      loginWithGoogleProfile({
        id: googleUser.id,
        name: googleUser.name,
        email: googleUser.email,
        picture: googleUser.picture,
      });

      closeAuthModal();
    } catch (err: any) {
      console.warn('Google Sign-In error:', err);
      const msg = err?.message || 'Gagal mendeteksi akun Google.';
      setErrorMessage(msg);
    } finally {
      setIsConnecting(false);
    }
  };

  // Simpan Client ID dan langsung buka popup autentikasi Google
  const handleSaveAndConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = tempClientId.trim();
    if (!cleanId) {
      setErrorMessage('Silakan masukkan Google Client ID Anda terlebih dahulu.');
      return;
    }

    setCustomClientId(cleanId);
    setShowConfig(false);
    setErrorMessage(null);
    await handleConnectWithGoogle(cleanId);
  };

  const handleManualSync = async () => {
    if (!user.id || user.isGuest) return;
    setIsSyncing(true);
    setSyncStatus(null);
    const res = await syncAllUserData(user.id);
    setIsSyncing(false);
    if (res.success) {
      setSyncStatus(`Sinkronisasi sukses! (${res.syncedBookmarks} item diperbarui)`);
    } else {
      setSyncStatus(res.message || 'Gagal sinkronisasi');
    }
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseApiKey.trim() || !firebaseProjectId.trim()) {
      setSyncStatus('API Key dan Project ID wajib diisi.');
      return;
    }
    saveFirebaseConfig({
      apiKey: firebaseApiKey.trim(),
      projectId: firebaseProjectId.trim(),
    });
    setShowFirebaseSetup(false);
    setSyncStatus('Konfigurasi Firebase disimpan! Memulai sinkronisasi...');
    syncAllUserData(user.id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-md animate-fade-in"
      onClick={closeAuthModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="canva-auth-title"
    >
      {/* ── Dialog Card (Canva Style: 2 Kolom di Desktop, Responsif di Mobile) ── */}
      <div
        className="relative w-full max-w-3xl bg-surface border border-border rounded-sheet shadow-elevated overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-scale-up text-text-primary max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup (X) Melayang */}
        <button
          onClick={closeAuthModal}
          className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-surface-alt/90 hover:bg-surface border border-border text-text-secondary hover:text-text-primary flex items-center justify-center shadow-subtle transition-all active:scale-95"
          aria-label="Tutup dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── KOLOM KIRI: Form Masuk / Akun Google (Canva Style) ── */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Header / Judul */}
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-2.5 py-0.5 rounded-pill bg-pastel-green text-primary-text mb-2.5">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>Masuk dalam hitungan detik</span>
              </div>

              <h2 id="canva-auth-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary leading-tight">
                {user.isGuest ? 'Log in or sign up in seconds' : 'Akun Google Terhubung'}
              </h2>

              <p className="text-xs sm:text-sm text-text-secondary mt-1.5 leading-relaxed">
                {user.isGuest
                  ? 'Gunakan akun Google aktif di browser Anda untuk mendeteksi profil nama & email secara otomatis, atau tetap lanjut sebagai Tamu.'
                  : `Anda saat ini terhubung sebagai ${user.name} (${user.email || 'Akun Google'}).`}
              </p>
            </div>

            {/* Error Message jika ada */}
            {errorMessage && (
              <div className="p-3.5 rounded-card bg-danger/10 border border-danger/25 text-danger text-xs flex items-start gap-2.5 animate-fade-in leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* ── KONTEN JIKA MASIH STATUS TAMU ── */}
            {user.isGuest ? (
              <div className="space-y-3 pt-1">
                {/* 1. Tombol Utama: Continue with Google (Persis Canva) */}
                <button
                  type="button"
                  disabled={isConnecting}
                  onClick={() => handleConnectWithGoogle()}
                  className="w-full h-12 px-4 rounded-button bg-surface hover:bg-surface-alt border border-border hover:border-primary/50 text-text-primary font-bold text-sm shadow-subtle transition-all duration-150 flex items-center justify-between group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    {/* Google Official 'G' Icon */}
                    <div className="w-6 h-6 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </div>
                    <span>{isConnecting ? 'Membuka Google Sign-In...' : 'Continue with Google'}</span>
                  </div>

                  {isConnecting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <span className="text-xs text-text-muted group-hover:text-primary transition-colors">→</span>
                  )}
                </button>

                {/* 2. Tombol: Tetap Akses sebagai Tamu */}
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="w-full h-12 px-4 rounded-button bg-surface-alt/70 hover:bg-surface-alt border border-border/80 text-text-secondary hover:text-text-primary font-bold text-sm shadow-subtle transition-all duration-150 flex items-center justify-between group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-pastel-green text-primary-text flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span>Continue as Guest (Akses Tamu)</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-pill bg-border text-text-muted">
                    Aktif
                  </span>
                </button>

                {/* Google One Tap & GoogleLogin Button resmi */}
                {effectiveClientId && (
                  <div className="pt-2 flex justify-center w-full">
                    <GoogleAuth />
                  </div>
                )}
              </div>
            ) : (
              /* ── KONTEN JIKA SUDAH TERHUBUNG DENGAN AKUN GOOGLE ASLI ── */
              <div className="space-y-4 pt-1">
                <div className="p-4 rounded-card bg-pastel-green/30 border border-pastel-green flex items-center gap-3.5 shadow-subtle">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-13 h-13 rounded-full object-cover border-2 border-primary shadow-subtle shrink-0"
                    />
                  ) : (
                    <div className="w-13 h-13 rounded-full bg-primary-gradient text-on-primary font-extrabold text-xl flex items-center justify-center shrink-0 shadow-subtle">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-extrabold text-text-primary truncate">
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary truncate mt-0.5">
                      <Mail className="w-3 h-3 text-text-muted shrink-0" />
                      <span className="truncate">{user.email || 'Akun Google'}</span>
                    </div>
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-extrabold text-primary-text bg-pastel-green px-2 py-0.5 rounded-pill">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      <span>Akun Google Terhubung</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="text-xs font-bold border-border hover:bg-surface-alt flex items-center justify-center gap-1.5 h-10"
                    onClick={() => handleConnectWithGoogle()}
                    disabled={isConnecting}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Ganti Akun</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="text-xs font-bold text-danger border-danger/30 hover:bg-danger/10 hover:border-danger flex items-center justify-center gap-1.5 h-10"
                    onClick={() => {
                      if (window.confirm('Beralih kembali ke status Tamu? Data bookmark dan pengaturan Anda tetap aman.')) {
                        logoutToGuest();
                        closeAuthModal();
                      }
                    }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Putuskan Akun</span>
                  </Button>
                </div>

                {/* ── Status Sinkronisasi Cloud (Firebase) ── */}
                <div className="p-3.5 rounded-card bg-surface-alt border border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-text-primary">
                      <Cloud className="w-4 h-4 text-primary" />
                      <span>Sinkronisasi Multi-Device</span>
                    </div>
                    {isFirebaseConfigured ? (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-pill bg-pastel-green text-primary-text">
                        Aktif (Firebase)
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-pill bg-surface border border-border text-text-muted">
                        Lokal Browser
                      </span>
                    )}
                  </div>

                  {isFirebaseConfigured ? (
                    <div className="space-y-2">
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Data bookmark dan riwayat baca Anda otomatis tersinkronisasi ke Cloud secara real-time.
                      </p>
                      {syncStatus && (
                        <p className="text-[11px] font-semibold text-primary">{syncStatus}</p>
                      )}
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full text-xs font-bold h-9"
                        onClick={handleManualSync}
                        disabled={isSyncing}
                      >
                        {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                        <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-0.5">
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Data Anda saat ini tersimpan aman di browser ini. Hubungkan database Firebase Firestore agar otomatis tersinkron ke HP atau perangkat lain.
                      </p>
                      {syncStatus && (
                        <p className="text-[11px] font-semibold text-primary">{syncStatus}</p>
                      )}
                      {!showFirebaseSetup ? (
                        <button
                          type="button"
                          onClick={() => setShowFirebaseSetup(true)}
                          className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          <span>+ Konfigurasi Firebase Firestore</span>
                        </button>
                      ) : (
                        <form onSubmit={handleSaveFirebaseConfig} className="space-y-2 pt-1 border-t border-border/60">
                          <p className="text-[10px] text-text-muted">
                            Salin API Key &amp; Project ID dari Firebase Console:
                          </p>
                          <input
                            type="text"
                            placeholder="Firebase API Key (AIzaSy...)"
                            value={firebaseApiKey}
                            onChange={(e) => setFirebaseApiKey(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-input bg-surface border border-border font-mono text-text-primary"
                          />
                          <input
                            type="text"
                            placeholder="Firebase Project ID"
                            value={firebaseProjectId}
                            onChange={(e) => setFirebaseProjectId(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 rounded-input bg-surface border border-border font-mono text-text-primary"
                          />
                          <div className="flex justify-end gap-2 pt-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              onClick={() => setShowFirebaseSetup(false)}
                            >
                              Batal
                            </Button>
                            <Button type="submit" variant="primary" size="sm" className="text-xs font-bold">
                              Simpan &amp; Aktifkan
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── FORM KONFIGURASI GOOGLE CLIENT ID (JIKA BELUM ADA ATAU INGIN MENGUBAH) ── */}
            {(showConfig || !effectiveClientId) && user.isGuest && (
              <div className="p-4 rounded-card bg-surface-alt border border-border space-y-3 animate-fade-in text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-text-primary">
                    <Key className="w-4 h-4 text-primary" />
                    <span>Konfigurasi Google Client ID</span>
                  </div>
                  {effectiveClientId && (
                    <button
                      type="button"
                      onClick={() => setShowConfig(false)}
                      className="text-[11px] text-text-muted hover:text-text-primary"
                    >
                      Tutup
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Browser Google hanya mengizinkan deteksi akun asli melalui <strong>OAuth Client ID</strong> dari Google Cloud demi alasan keamanan privasi.
                </p>

                <form onSubmit={handleSaveAndConnect} className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-text-secondary mb-1">
                      Google OAuth 2.0 Client ID:
                    </label>
                    <input
                      type="text"
                      value={tempClientId}
                      onChange={(e) => setTempClientId(e.target.value)}
                      placeholder="contoh: 123456789-xxx.apps.googleusercontent.com"
                      className="w-full text-xs px-3 py-2 rounded-input bg-surface border border-border focus:outline-none focus:ring-1 focus:ring-primary font-mono text-text-primary placeholder:text-text-muted/60"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-primary hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <span>Google Cloud Console</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={isConnecting}
                      className="text-xs font-bold"
                    >
                      {isConnecting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                      Simpan &amp; Deteksi Akun
                    </Button>
                  </div>
                </form>

                {/* Panduan Cepat 3 Langkah */}
                <div className="pt-2 border-t border-border/60 text-[10px] text-text-muted space-y-1">
                  <p className="font-bold text-text-secondary">Cara membuat Client ID gratis (1 menit):</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Buka Google Cloud Console &gt; Credentials.</li>
                    <li>Klik <strong>Create Credentials</strong> &gt; <strong>OAuth client ID</strong> &gt; <strong>Web application</strong>.</li>
                    <li>Tambahkan <code className="bg-surface px-1 py-0.5 rounded font-mono text-text-primary">http://localhost:3000</code> pada <em>Authorized JavaScript origins</em>.</li>
                    <li>Salin Client ID dan tempelkan di kotak atas.</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* Footer Kolom Kiri: Disclaimer */}
          <div className="pt-3 border-t border-border space-y-1.5">
            <p className="text-[11px] text-text-muted leading-relaxed">
              Dengan menghubungkan akun, Anda menyetujui pembacaan data publik nama profil dan email dari Google. Tidak ada kata sandi atau data sensitif yang diakses.
            </p>

            {effectiveClientId && !showConfig && user.isGuest && (
              <button
                type="button"
                onClick={() => setShowConfig(true)}
                className="text-[11px] font-medium text-text-muted hover:text-text-primary flex items-center gap-1 transition-colors"
              >
                <Settings className="w-3 h-3" />
                <span>Ubah Google Client ID</span>
              </button>
            )}
          </div>
        </div>

        {/* ── KOLOM KANAN: Visual Artwork Seni Islami Iqra (Persis Canva Right Banner) ── */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-br from-[#16A34A] via-[#15803D] to-[#14532D] relative overflow-hidden flex-col items-center justify-center p-8 text-white select-none">
          {/* Latar Belakang Cahaya & Lingkaran Ambient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-black/20 blur-2xl pointer-events-none" />

          {/* Twinkling Stars (✦) */}
          <div className="absolute top-6 left-8 text-amber-300 text-xs animate-pulse">✦</div>
          <div className="absolute top-12 right-10 text-white/70 text-sm animate-pulse delay-100">✨</div>
          <div className="absolute bottom-12 left-10 text-emerald-200 text-xs animate-pulse delay-200">✦</div>
          <div className="absolute bottom-8 right-8 text-amber-200 text-sm animate-pulse delay-300">✨</div>

          {/* Central Artwork: Logo Iqra Tengah dengan Ikon-Ikon Fitur Melingkar Orbit (Canva-style) */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Lingkaran Orbit Halus */}
            <div className="absolute inset-4 rounded-full border border-white/20 animate-spin-slow pointer-events-none" />
            <div className="absolute inset-10 rounded-full border border-white/15 pointer-events-none" />

            {/* Logo Pusat Iqra (Glow) */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-[0_0_35px_rgba(255,255,255,0.4)] animate-spring-bounce">
              <span className="font-arabic text-3xl font-extrabold text-white drop-shadow-md select-none">
                اقرأ
              </span>
            </div>

            {/* Ikon-Ikon Orbit Berwarna-Warni (Al-Qur'an, Sholat, Kiblat, Hadits, dsb) */}
            {/* 1. Al-Qur'an (Atas) */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#E8F6DA] text-[#2B6B0E] flex items-center justify-center shadow-elevated border border-white/60">
              <BookOpen className="w-5 h-5" />
            </div>

            {/* 2. Jadwal Sholat (Kanan Atas) */}
            <div className="absolute top-6 right-3 w-10 h-10 rounded-full bg-[#E1EEFF] text-[#19529E] flex items-center justify-center shadow-elevated border border-white/60">
              <Clock className="w-5 h-5" />
            </div>

            {/* 3. Arah Kiblat (Kanan Bawah) */}
            <div className="absolute bottom-6 right-3 w-10 h-10 rounded-full bg-[#DDF4F8] text-[#0E6B82] flex items-center justify-center shadow-elevated border border-white/60">
              <Compass className="w-5 h-5" />
            </div>

            {/* 4. Kalender Hijriah (Bawah) */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#FFF4D6] text-[#8A5E06] flex items-center justify-center shadow-elevated border border-white/60">
              <Calendar className="w-5 h-5" />
            </div>

            {/* 5. Tajwid & Belajar (Kiri Bawah) */}
            <div className="absolute bottom-6 left-3 w-10 h-10 rounded-full bg-[#EFE7FB] text-[#5A2FA3] flex items-center justify-center shadow-elevated border border-white/60">
              <GraduationCap className="w-5 h-5" />
            </div>

            {/* 6. Hadits & Sirah (Kiri Atas) */}
            <div className="absolute top-6 left-3 w-10 h-10 rounded-full bg-[#FFE9E4] text-[#A8381A] flex items-center justify-center shadow-elevated border border-white/60">
              <ScrollText className="w-5 h-5" />
            </div>
          </div>

          {/* Slogan Banner Kanan */}
          <div className="text-center mt-4 relative z-10">
            <h4 className="text-base font-extrabold text-white tracking-tight">
              Aplikasi Ibadah &amp; Belajar Islam
            </h4>
            <p className="text-[11px] text-white/80 mt-1 max-w-[200px] leading-relaxed">
              Bebas akses kapan saja dengan kenyamanan membaca modern
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
