import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Card className="max-w-md w-full p-8 space-y-4">
        <div className="w-16 h-16 rounded-card bg-surface-alt text-primary flex items-center justify-center mx-auto text-2xl font-bold font-mono">
          404
        </div>
        <h1 className="text-xl font-bold text-text-primary">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          Halaman yang Anda tuju mungkin telah dipindahkan atau belum tersedia.
        </p>
        <div className="pt-2">
          <Link href="/">
            <Button variant="primary" className="gap-2 w-full">
              <Home className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
