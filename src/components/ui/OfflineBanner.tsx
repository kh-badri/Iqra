'use client';

import * as React from 'react';
import { WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OfflineBanner({ className }: { className?: string }) {
  const [isOffline, setIsOffline] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      className={cn(
        'w-full bg-warning text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 safe-top transition-all duration-200 z-50',
        className
      )}
    >
      <WifiOff className="w-3.5 h-3.5 flex-shrink-0" />
      <span>Mode offline aktif. Anda tetap dapat membaca konten yang telah disimpan di cache.</span>
    </div>
  );
}
