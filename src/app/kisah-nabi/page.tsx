'use client';

import React, { useState, useEffect } from 'react';
import { Search, Users, CheckCircle2, BookOpen, AlertCircle } from 'lucide-react';
import { ProphetCard } from '@/features/prophets/components/ProphetCard';
import type { Prophet } from '@/features/prophets/types';
import { getAllProphets } from '@/features/prophets/prophetService';
import { SearchBar } from '@/components/ui/SearchBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function KisahNabiListPage() {
  const [prophets, setProphets] = useState<Prophet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const completedList = useLiveQuery(
    () => db.prophetProgress.where('read').equals(1).toArray(),
    []
  );

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllProphets();
      setProphets(data);
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat kisah para nabi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const completedCount = completedList?.length || 0;

  const filteredProphets = prophets.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.place.toLowerCase().includes(q) ||
      p.era.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.order.toString() === q
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Kisah Singkat 25 Nabi
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary">
            Ringkasan sejarah, keteladanan agung, dan hikmah 25 nabi dan rasul dari Adam AS hingga Muhammad ﷺ yang wajib diimani.
          </p>
        </div>

        {/* Progress Counter Pill */}
        <div className="flex items-center gap-2 bg-surface-alt px-3 py-1.5 rounded-full border border-border text-xs text-text-secondary self-start sm:self-auto shrink-0">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span>
            <strong className="text-text-primary">{completedCount}</strong> dari 25 selesai dibaca
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Cari nabi (misal: Ibrahim, Yunus, Makkah)..."
        />
      </div>

      {/* Content State Handling */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-5 rounded-card border border-border bg-surface space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-20 h-5 rounded-pill" />
              </div>
              <Skeleton className="w-3/4 h-6 rounded" />
              <Skeleton className="w-full h-14 rounded" />
              <div className="pt-3 border-t border-border flex justify-between">
                <Skeleton className="w-24 h-4 rounded" />
                <Skeleton className="w-16 h-4 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Terjadi Kesalahan"
          message={error}
          onRetry={loadData}
        />
      ) : filteredProphets.length === 0 ? (
        <EmptyState
          title="Kisah Nabi Tidak Ditemukan"
          description={`Tidak ada nabi yang cocok dengan kata kunci "${searchQuery}".`}
          actionLabel="Hapus Pencarian"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProphets.map((prophet) => (
            <ProphetCard key={prophet.slug} prophet={prophet} />
          ))}
        </div>
      )}
    </div>
  );
}
