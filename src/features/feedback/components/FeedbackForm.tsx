/* eslint-disable @next/next/no-img-element */
'use client';

import * as React from 'react';
import {
  MessageSquarePlus,
  Send,
  Star,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Sparkles,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  MessageCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/features/auth/authStore';
import { getFirebaseFirestore } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export type FeedbackCategory = 'saran' | 'kritik' | 'koreksi' | 'lainnya';

const CATEGORIES: {
  id: FeedbackCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  { id: 'saran', label: 'Saran & Ide Fitur', icon: Lightbulb, color: 'text-amber-500' },
  { id: 'kritik', label: 'Kritik & Masukan', icon: AlertTriangle, color: 'text-rose-500' },
  { id: 'koreksi', label: 'Koreksi Bacaan/Hadits', icon: BookOpen, color: 'text-emerald-500' },
  { id: 'lainnya', label: 'Lainnya', icon: MessageCircle, color: 'text-blue-500' },
];

export function FeedbackForm() {
  const { user, isLoaded, openAuthModal } = useAuthStore();

  const [category, setCategory] = React.useState<FeedbackCategory>('saran');
  const [rating, setRating] = React.useState<number>(5);
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.isGuest) {
      openAuthModal();
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      setErrorMessage('Mohon tuliskan kritik atau saran minimal 5 karakter.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      userId: user.id,
      name: user.name || 'Pengguna Iqra',
      email: user.email || '',
      picture: user.picture || '',
      category,
      rating,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
    };

    let serverSuccess = false;

    // 1. Kirim ke Server PHP cPanel (/api/feedback.php)
    try {
      const res = await fetch('/api/feedback.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        serverSuccess = true;
      }
    } catch (err) {
      console.warn('Gagal kirim feedback ke server cPanel:', err);
    }

    // 2. Simpan juga ke Firebase Firestore jika terhubung
    try {
      const firestore = getFirebaseFirestore();
      if (firestore) {
        await addDoc(collection(firestore, 'feedbacks'), payload);
        serverSuccess = true;
      }
    } catch (err) {
      console.warn('Gagal kirim feedback ke Firestore:', err);
    }

    setIsSubmitting(false);

    if (serverSuccess) {
      setSubmitSuccess(true);
      setMessage('');
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 6000);
    } else {
      setErrorMessage('Maaf, terjadi kendala saat mengirimkan pesan. Silakan coba kembali.');
    }
  };

  return (
    <Card className="p-6 sm:p-7 bg-surface border-border shadow-card rounded-card space-y-5">
      {/* Header Form */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-gradient text-on-primary flex items-center justify-center shadow-subtle shrink-0">
            <MessageSquarePlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
              Kolom Kritik &amp; Saran Pengguna
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Sampaikan usulan fitur, koreksi data, atau masukan berharga Anda untuk kemajuan aplikasi Iqra
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-pastel-green text-primary-text text-[11px] font-bold self-start sm:self-auto border border-primary/20">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Ditinjau oleh Admin</span>
        </div>
      </div>

      {/* Syarat: Harus Login Google Dahulu */}
      {isLoaded && user.isGuest ? (
        <div className="p-5 sm:p-6 rounded-card bg-surface-alt/70 border border-border text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center mx-auto shadow-xs">
            <LogIn className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="text-sm font-bold text-text-primary">
              Masuk dengan Google Diperlukan
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Untuk mencegah spam dan memastikan setiap masukan berasal dari pengguna aktif, Anda wajib terhubung dengan akun Google terlebih dahulu sebelum mengirim kritik &amp; saran.
            </p>
          </div>
          <Button
            type="button"
            onClick={openAuthModal}
            className="text-xs font-bold px-5 py-2.5 shadow-subtle"
          >
            <LogIn className="w-4 h-4 mr-1.5" />
            <span>Masuk dengan Akun Google</span>
          </Button>
        </div>
      ) : (
        /* Form Aktif Ketika Sudah Login Google */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info Bar */}
          <div className="flex items-center justify-between p-3 rounded-card bg-surface-alt/60 border border-border flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || 'User'}
                  className="w-8 h-8 rounded-full border border-border object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center text-xs">
                  {user.name ? user.name[0] : 'U'}
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-text-primary leading-tight">
                  {user.name}
                </p>
                <p className="text-[11px] text-text-muted leading-tight mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>

            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-pill bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Akun Google Terverifikasi</span>
            </span>
          </div>

          {/* Kategori Pilihan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary block">
              Pilih Kategori Masukan:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-button text-xs font-semibold flex items-center gap-2 transition-all border text-left ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-text-primary shadow-xs font-bold'
                        : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${cat.color}`} />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating Kepuasan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary block">
              Tingkat Kepuasan terhadap Aplikasi:
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 rounded-full hover:scale-110 active:scale-95 transition-all"
                  title={`${star} Bintang`}
                  aria-label={`Beri nilai ${star} dari 5 bintang`}
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-border hover:text-amber-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-text-muted font-medium ml-2">
                {rating === 5 && '🌟 Sangat Puas'}
                {rating === 4 && '👍 Bagus & Bermanfaat'}
                {rating === 3 && '👌 Cukup Baik'}
                {rating === 2 && '⚠️ Perlu Banyak Ditingkatkan'}
                {rating === 1 && '❌ Kurang Memuaskan'}
              </span>
            </div>
          </div>

          {/* Textarea Pesan */}
          <div className="space-y-1.5">
            <label htmlFor="feedback-message" className="text-xs font-bold text-text-secondary block">
              Isi Kritik, Saran, atau Koreksi:
            </label>
            <textarea
              id="feedback-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan saran penambahan fitur, kritik untuk performa aplikasi, atau koreksi pengetikan ayat/hadits secara jelas..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-card bg-surface-alt/70 border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
              required
            />
            <div className="flex items-center justify-between text-[11px] text-text-muted">
              <span>Minimal 5 karakter. Masukan Anda akan langsung masuk ke panel admin domain/admin.</span>
              <span>{message.length} karakter</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-card bg-danger/10 border border-danger/20 text-danger text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {submitSuccess && (
            <div className="p-3.5 rounded-card bg-success/10 border border-success/20 text-success text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold">Jazakallahu Khairan!</p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  Kritik dan saran Anda telah tersimpan dan dapat ditinjau oleh pengelola melalui panel admin.
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="text-xs font-bold px-6 py-2.5 shadow-subtle flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Mengirimkan Masukan...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Kritik &amp; Saran</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
