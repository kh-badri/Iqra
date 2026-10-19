'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, BookOpen, User, GraduationCap, FileText } from 'lucide-react';
import searchData from '@/features/search/searchIndex.json';
import { Chip } from '@/components/ui/Chip';

export interface SearchItem {
  type: string;
  badge: string;
  title: string;
  subtitle: string;
  arabic?: string;
  keywords: string;
  href: string;
}

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Filter items based on query
  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default recommended / popular shortcuts
      return (searchData as SearchItem[]).slice(0, 8);
    }
    return (searchData as SearchItem[])
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.keywords.toLowerCase().includes(q) ||
          (item.arabic && item.arabic.includes(q))
      )
      .slice(0, 20);
  }, [query]);

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].href);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'surah':
        return <BookOpen className="w-4 h-4 text-primary" />;
      case 'prophet':
        return <User className="w-4 h-4 text-warning" />;
      case 'tajwid':
        return <GraduationCap className="w-4 h-4 text-primary" />;
      case 'hadith':
      default:
        return <FileText className="w-4 h-4 text-text-secondary" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-surface border border-border rounded-card shadow-elevated overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[70vh] card-highlight animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Pencarian Global Iqra"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-3.5 border-b border-border bg-surface">
          <Search className="w-5 h-5 text-text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Cari surah, kisah nabi, hukum tajwid, hadits..."
            className="flex-1 bg-transparent text-sm sm:text-base text-text-primary placeholder:text-text-secondary/70 outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-text-secondary hover:text-text-primary rounded-full hover:bg-surface-alt active:scale-90"
              aria-label="Hapus kata kunci"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold text-text-secondary bg-surface-alt border border-border rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/60 p-2 space-y-1">
          {results.length > 0 ? (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.href + idx}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-button cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-primary-soft text-text-primary'
                      : 'hover:bg-surface-alt text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-button bg-surface-alt border border-border flex items-center justify-center shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold truncate text-text-primary">
                          {item.title}
                        </span>
                        <Chip variant="outline" className="text-[10px] py-0 px-1.5 shrink-0">
                          {item.badge}
                        </Chip>
                      </div>
                      <p className="text-xs text-text-secondary truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {item.arabic && (
                    <span
                      dir="rtl"
                      className="font-arabic text-base text-primary shrink-0 hidden sm:inline ml-3"
                    >
                      {item.arabic}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-text-secondary">
              <p className="text-sm font-semibold">Tidak ditemukan hasil untuk &quot;{query}&quot;</p>
              <p className="text-xs mt-1 text-text-secondary">
                Coba kata kunci lain seperti nama surah, nabi, atau hukum tajwid.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer / Shortcuts Guide */}
        <div className="p-2.5 bg-surface-alt border-t border-border flex items-center justify-between text-[11px] text-text-secondary">
          <div className="flex items-center gap-2">
            <span>Navigasi:</span>
            <kbd className="px-1 bg-surface border border-border rounded font-mono">↑</kbd>
            <kbd className="px-1 bg-surface border border-border rounded font-mono">↓</kbd>
            <kbd className="px-1 bg-surface border border-border rounded font-mono">Enter</kbd>
          </div>
          <span className="font-semibold text-primary-text">Iqra Pencarian Cepat</span>
        </div>
      </div>
    </div>
  );
}
