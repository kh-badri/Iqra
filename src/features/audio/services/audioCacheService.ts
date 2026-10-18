const AUDIO_CACHE_NAME = 'iqra-audio-cache-v1';

export async function isSurahAudioCached(
  audioUrls: string[]
): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) return false;
  try {
    const cache = await caches.open(AUDIO_CACHE_NAME);
    if (audioUrls.length === 0) return false;
    // Cek sampel awal dan akhir untuk verifikasi cepat
    const firstCached = await cache.match(audioUrls[0]);
    const lastCached = await cache.match(audioUrls[audioUrls.length - 1]);
    return Boolean(firstCached && lastCached);
  } catch (err) {
    console.warn('Gagal memeriksa cache audio:', err);
    return false;
  }
}

export async function cacheSurahAudio(
  audioUrls: string[],
  onProgress?: (progress: number) => void
): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) return false;
  try {
    const cache = await caches.open(AUDIO_CACHE_NAME);
    let completed = 0;
    const total = audioUrls.length;

    // Unduh dalam batch (3 concurrent) agar hemat memori & network
    const concurrency = 3;
    for (let i = 0; i < audioUrls.length; i += concurrency) {
      const batch = audioUrls.slice(i, i + concurrency);
      await Promise.all(
        batch.map(async (url) => {
          try {
            const existing = await cache.match(url);
            if (!existing) {
              const res = await fetch(url);
              if (res.ok) {
                await cache.put(url, res);
              }
            }
          } catch (e) {
            console.warn(`Gagal mengunduh audio ayat: ${url}`, e);
          } finally {
            completed++;
            if (onProgress) {
              onProgress(Math.round((completed / total) * 100));
            }
          }
        })
      );
    }
    return true;
  } catch (err) {
    console.error('Error saat caching audio surah:', err);
    return false;
  }
}

export async function deleteSurahAudioCache(
  audioUrls: string[]
): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) return false;
  try {
    const cache = await caches.open(AUDIO_CACHE_NAME);
    await Promise.all(audioUrls.map((url) => cache.delete(url)));
    return true;
  } catch (err) {
    console.error('Gagal menghapus cache audio:', err);
    return false;
  }
}

export function formatEstimatedAudioSize(numberOfAyahs: number): string {
  // Rata-rata 1 ayat berdurasi 10-15 detik berukuran ~120 KB
  const totalKB = numberOfAyahs * 120;
  if (totalKB < 1024) {
    return `~${totalKB} KB`;
  }
  return `~${(totalKB / 1024).toFixed(1)} MB`;
}
