'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn('w-9 h-9 rounded-button bg-surface-alt border border-border animate-shimmer-wave', className)} />
    );
  }

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        'w-9 h-9 rounded-button bg-surface-alt border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-border/40 transition-all duration-150 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className
      )}
      aria-label={`Ganti tema. Saat ini: ${theme || 'sistem'}`}
      title={`Tema: ${theme || 'sistem'}`}
    >
      {theme === 'dark' ? (
        <Moon className="w-4 h-4 text-primary" />
      ) : theme === 'light' ? (
        <Sun className="w-4 h-4 text-warning" />
      ) : (
        <Laptop className="w-4 h-4 text-text-secondary" />
      )}
    </button>
  );
}
