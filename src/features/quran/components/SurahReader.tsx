'use client';

import * as React from 'react';
import type { SurahDetail, Ayah } from '../types';
import { SurahHeader } from './SurahHeader';
import { AyahCard } from './AyahCard';
import { AyahActionSheet } from './AyahActionSheet';
import { QuranReaderSettings } from './QuranReaderSettings';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Toast } from '@/components/ui/Toast';
import { useAudioPlayer } from '@/features/audio/store/useAudioPlayer';

export function SurahReader({ surah }: { surah: SurahDetail }) {
  // Pengaturan tampilan
  const [fontSizeArabic, setFontSizeArabic] = React.useState(28);
  const [fontSizeTranslation, setFontSizeTranslation] = React.useState(14);
  const [showTranslation, setShowTranslation] = React.useState(true);
  const [showTransliteration, setShowTransliteration] = React.useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  // Aksi Ayat & State
  const [selectedAyah, setSelectedAyah] = React.useState<Ayah | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Ambil bookmarks dari Dexie IndexedDB
  const bookmarks = useLiveQuery(() => db.bookmarks.where('type').equals('ayah').toArray(), []);

  // Global Audio Player
  const {
    track: currentTrack,
    isPlaying,
    selectedQariId,
    playSurah,
    playAyahOnly,
    togglePlay,
  } = useAudioPlayer();

  const isCurrentSurahPlaying =
    currentTrack?.surahNumber === surah.number && isPlaying;

  const buildTrack = (startAyah: number) => {
    return {
      surahNumber: surah.number,
      surahName: surah.nameLatin,
      surahNameArabic: surah.nameArabic,
      totalAyahs: surah.numberOfAyahs,
      currentAyahNumber: startAyah,
      qariId: selectedQariId,
      audioUrl: surah.ayahs[startAyah - 1]?.audio?.[selectedQariId] || '',
      ayahs: surah.ayahs.map((a) => ({
        numberInSurah: a.numberInSurah,
        arabic: a.arabic,
        translation: a.translation,
        audioUrl: a.audio?.[selectedQariId] || '',
      })),
      rawAyahs: surah.ayahs,
    };
  };

  const handleTogglePlayAll = () => {
    if (isCurrentSurahPlaying) {
      togglePlay();
    } else {
      const track = buildTrack(1);
      playSurah(track as any, 1);
    }
  };

  const handlePlayAyah = (ayahNum: number) => {
    const track = buildTrack(ayahNum);
    playSurah(track as any, ayahNum);

    // Simpan ke terakhir dibaca
    db.lastRead.clear().then(() => {
      db.lastRead.add({
        surahNumber: surah.number,
        surahName: surah.nameLatin,
        ayahNumber: ayahNum,
        timestamp: Date.now(),
      });
    });
  };

  // Simpan Terakhir Dibaca otomatis saat halaman dibuka
  React.useEffect(() => {
    const saveLastRead = async () => {
      try {
        await db.lastRead.clear();
        await db.lastRead.add({
          surahNumber: surah.number,
          surahName: surah.nameLatin,
          ayahNumber: 1,
          timestamp: Date.now(),
        });
      } catch (err) {
        console.warn('Gagal menyimpan terakhir dibaca:', err);
      }
    };
    saveLastRead();
  }, [surah]);

  const isAyahBookmarked = (ayahNum: number) => {
    if (!bookmarks) return false;
    const ref = `quran-${surah.number}-${ayahNum}`;
    return bookmarks.some((b) => b.refId === ref);
  };

  const handleToggleBookmark = async () => {
    if (!selectedAyah) return;
    const ref = `quran-${surah.number}-${selectedAyah.numberInSurah}`;
    const existing = bookmarks?.find((b) => b.refId === ref);

    if (existing && existing.id) {
      await db.bookmarks.delete(existing.id);
      setToastMessage(`Bookmark ayat ${selectedAyah.numberInSurah} dihapus.`);
    } else {
      await db.bookmarks.add({
        type: 'ayah',
        refId: ref,
        title: `QS. ${surah.nameLatin}: ${selectedAyah.numberInSurah}`,
        subtitle: selectedAyah.translation,
        extraData: {
          surahNumber: surah.number,
          ayahNumber: selectedAyah.numberInSurah,
          arabic: selectedAyah.arabic,
        },
        createdAt: Date.now(),
      });
      setToastMessage(`Ayat ${selectedAyah.numberInSurah} disimpan ke bookmark.`);
    }
    setTimeout(() => setToastMessage(null), 3000);
    setSelectedAyah(null);
  };

  return (
    <div className="max-w-reading mx-auto space-y-6">
      {/* Toast notifikasi */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50">
          <Toast
            type="success"
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}

      {/* Header Surah */}
      <SurahHeader
        surah={surah}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isPlaying={isCurrentSurahPlaying}
        onTogglePlayAll={handleTogglePlayAll}
      />

      {/* Daftar Ayat */}
      <div className="space-y-4 pt-2">
        {surah.ayahs.map((ayah) => {
          const isActiveAudio =
            currentTrack?.surahNumber === surah.number &&
            currentTrack?.currentAyahNumber === ayah.numberInSurah &&
            isPlaying;

          return (
            <AyahCard
              key={ayah.numberInSurah}
              ayah={ayah}
              surahNumber={surah.number}
              fontSizeArabic={fontSizeArabic}
              fontSizeTranslation={fontSizeTranslation}
              showTranslation={showTranslation}
              showTransliteration={showTransliteration}
              isBookmarked={isAyahBookmarked(ayah.numberInSurah)}
              isActiveAudio={isActiveAudio}
              onSelectAyah={() => setSelectedAyah(ayah)}
              onPlayAudio={() => handlePlayAyah(ayah.numberInSurah)}
            />
          );
        })}
      </div>

      {/* Sheet Aksi Ayat */}
      <AyahActionSheet
        isOpen={Boolean(selectedAyah)}
        onClose={() => setSelectedAyah(null)}
        surah={surah}
        ayah={selectedAyah}
        isBookmarked={selectedAyah ? isAyahBookmarked(selectedAyah.numberInSurah) : false}
        onToggleBookmark={handleToggleBookmark}
        onPlayAudio={selectedAyah ? () => handlePlayAyah(selectedAyah.numberInSurah) : undefined}
      />

      {/* Sheet Pengaturan Tampilan */}
      <QuranReaderSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        fontSizeArabic={fontSizeArabic}
        setFontSizeArabic={setFontSizeArabic}
        fontSizeTranslation={fontSizeTranslation}
        setFontSizeTranslation={setFontSizeTranslation}
        showTranslation={showTranslation}
        setShowTranslation={setShowTranslation}
        showTransliteration={showTransliteration}
        setShowTransliteration={setShowTransliteration}
      />
    </div>
  );
}
