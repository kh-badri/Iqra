import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] py-16 px-4 text-center overflow-hidden">
      {/* Organic blob background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10 animate-hero-float-slow" />

      <Card className="max-w-md w-full p-8 space-y-5 rounded-card shadow-card border border-border bg-surface relative z-10">
        <div className="w-16 h-16 rounded-full bg-pastel-green text-[#266308] border border-pastel-green/40 flex items-center justify-center mx-auto text-2xl font-black font-mono shadow-subtle">
          404
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Halaman yang Anda tuju mungkin telah dipindahkan atau tautan yang Anda buka tidak valid.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/" className="block">
            <Button
              variant="primary"
              className="gap-2 w-full h-[52px] rounded-button text-sm font-bold shadow-card active:scale-[0.98]"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
