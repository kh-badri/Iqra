'use client';

import * as React from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type BookmarkItem } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Bookmark, Trash2, ArrowRight, Download, Upload, CheckCircle2 } from 'lucide-react';
import { exportBookmarksToJson, importBookmarksFromJson } from '@/lib/bookmarkBackup';

export function BookmarkView() {
  const [filterType, setFilterType] = React.useState<string>('all');
  const [notification, setNotification] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const bookmarks = useLiveQuery(() => db.bookmarks.orderBy('createdAt').reverse().toArray(), []);

  const filteredBookmarks = React.useMemo(() => {
    if (!bookmarks) return [];
    if (filterType === 'all') return bookmarks;
    return bookmarks.filter((b) => b.type === filterType);
  }, [bookmarks, filterType]);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    await db.bookmarks.delete(id);
  };

  const handleExport = async () => {
    try {
      const res = await exportBookmarksToJson();
      setNotification(`File ${res.filename} (${res.count} bookmark) berhasil diunduh.`);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert('Gagal mengekspor bookmark: ' + err.message);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await importBookmarksFromJson(file);
      setNotification(res.message);
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Gagal mengimpor file.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getHref = (item: BookmarkItem) => {
    if (item.type === 'ayah' && item.extraData) {
      return `/quran/${item.extraData.surahNumber}/#ayah-${item.extraData.ayahNumber}`;
    }
    if (item.type === 'hadith' && item.extraData) {
      return `/hadits/baca/?kitab=${item.extraData.bookId}&no=${item.extraData.number}`;
    }
    if (item.type === 'prophet' && item.extraData) {
      return `/kisah-nabi/${item.extraData.slug}/`;
    }
    if (item.type === 'tajwid' && item.extraData) {
      return `/tajwid/${item.extraData.slug}/`;
    }
    return '/belajar/';
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
            Bookmark Tersimpan
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Koleksi ayat, hadits, kisah nabi, dan materi tajwid yang Anda simpan di perangkat ini
          </p>
        </div>

        {/* Export / Import Actions */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleImportFile}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-1.5 text-xs min-h-[44px] rounded-button font-bold"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Impor JSON</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            className="gap-1.5 text-xs min-h-[44px] rounded-button font-bold"
            disabled={!bookmarks || bookmarks.length === 0}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor JSON</span>
          </Button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-3.5 bg-pastel-green/50 text-[#266308] dark:text-[#9BE35B] border border-pastel-green/60 rounded-card flex items-center gap-2.5 text-xs sm:text-sm font-bold shadow-subtle animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <Chip
          active={filterType === 'all'}
          clickable
          onClick={() => setFilterType('all')}
          className="text-xs"
        >
          Semua ({bookmarks?.length || 0})
        </Chip>
        <Chip
          active={filterType === 'ayah'}
          clickable
          onClick={() => setFilterType('ayah')}
          className="text-xs"
        >
          Al-Qur&apos;an ({bookmarks?.filter((b) => b.type === 'ayah').length || 0})
        </Chip>
        <Chip
          active={filterType === 'hadith'}
          clickable
          onClick={() => setFilterType('hadith')}
          className="text-xs"
        >
          Hadits ({bookmarks?.filter((b) => b.type === 'hadith').length || 0})
        </Chip>
        <Chip
          active={filterType === 'prophet'}
          clickable
          onClick={() => setFilterType('prophet')}
          className="text-xs"
        >
          Kisah Nabi ({bookmarks?.filter((b) => b.type === 'prophet').length || 0})
        </Chip>
        <Chip
          active={filterType === 'tajwid'}
          clickable
          onClick={() => setFilterType('tajwid')}
          className="text-xs"
        >
          Tajwid ({bookmarks?.filter((b) => b.type === 'tajwid').length || 0})
        </Chip>
      </div>

      {/* List Bookmark */}
      {filteredBookmarks.length > 0 ? (
        <div className="space-y-3.5">
          {filteredBookmarks.map((item) => (
            <Card key={item.id} className="p-5 flex items-start justify-between gap-3 rounded-card shadow-card border-border hover:border-primary/40 transition-all">
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary-text">{item.title}</span>
                  <Chip variant="secondary" className="text-[10px] py-0 px-2 uppercase font-bold">
                    {item.type}
                  </Chip>
                </div>
                {item.extraData?.arabic && (
                  <p dir="rtl" className="font-arabic text-base sm:text-lg text-text-primary leading-loose pt-1">
                    {item.extraData.arabic}
                  </p>
                )}
                {item.subtitle && (
                  <p className="text-xs text-text-muted line-clamp-2 italic leading-relaxed">
                    "{item.subtitle}"
                  </p>
                )}
                <div className="pt-2">
                  <Link
                    href={getHref(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-text hover:underline min-h-[44px]"
                  >
                    <span>Buka Rujukan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="w-10 h-10 rounded-full text-text-muted hover:text-danger hover:bg-danger/10 flex items-center justify-center transition-colors active:scale-90"
                aria-label="Hapus bookmark"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bookmark className="w-7 h-7 text-primary" />}
          title="Belum Ada Bookmark Tersimpan"
          description="Saat membaca Al-Qur'an, hadits, atau kisah nabi, ketuk tombol simpan untuk menyimpannya ke daftar bookmark ini."
        />
      )}
    </div>
  );
}
