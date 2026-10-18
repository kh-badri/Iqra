import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://equran.id/api/v2';
const OUTPUT_DIR = path.resolve('public', 'data', 'quran');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

// 30 Juz standard mapping (Surah & Ayat start and end)
const JUZ_MAPPING = [
  { juz: 1, name: 'Juz 1', startSurah: 1, startAyat: 1, endSurah: 2, endAyat: 141 },
  { juz: 2, name: 'Juz 2', startSurah: 2, startAyat: 142, endSurah: 2, endAyat: 252 },
  { juz: 3, name: 'Juz 3', startSurah: 2, startAyat: 253, endSurah: 3, endAyat: 92 },
  { juz: 4, name: 'Juz 4', startSurah: 3, startAyat: 93, endSurah: 4, endAyat: 23 },
  { juz: 5, name: 'Juz 5', startSurah: 4, startAyat: 24, endSurah: 4, endAyat: 147 },
  { juz: 6, name: 'Juz 6', startSurah: 4, startAyat: 148, endSurah: 5, endAyat: 81 },
  { juz: 7, name: 'Juz 7', startSurah: 5, startAyat: 82, endSurah: 6, endAyat: 110 },
  { juz: 8, name: 'Juz 8', startSurah: 6, startAyat: 111, endSurah: 7, endAyat: 87 },
  { juz: 9, name: 'Juz 9', startSurah: 7, startAyat: 88, endSurah: 8, endAyat: 40 },
  { juz: 10, name: 'Juz 10', startSurah: 8, startAyat: 41, endSurah: 9, endAyat: 92 },
  { juz: 11, name: 'Juz 11', startSurah: 9, startAyat: 93, endSurah: 11, endAyat: 5 },
  { juz: 12, name: 'Juz 12', startSurah: 11, startAyat: 6, endSurah: 12, endAyat: 52 },
  { juz: 13, name: 'Juz 13', startSurah: 12, startAyat: 53, endSurah: 14, endAyat: 52 },
  { juz: 14, name: 'Juz 14', startSurah: 15, startAyat: 1, endSurah: 16, endAyat: 128 },
  { juz: 15, name: 'Juz 15', startSurah: 17, startAyat: 1, endSurah: 18, endAyat: 74 },
  { juz: 16, name: 'Juz 16', startSurah: 18, startAyat: 75, endSurah: 20, endAyat: 135 },
  { juz: 17, name: 'Juz 17', startSurah: 21, startAyat: 1, endSurah: 22, endAyat: 78 },
  { juz: 18, name: 'Juz 18', startSurah: 23, startAyat: 1, endSurah: 25, endAyat: 20 },
  { juz: 19, name: 'Juz 19', startSurah: 25, startAyat: 21, endSurah: 27, endAyat: 55 },
  { juz: 20, name: 'Juz 20', startSurah: 27, startAyat: 56, endSurah: 29, endAyat: 45 },
  { juz: 21, name: 'Juz 21', startSurah: 29, startAyat: 46, endSurah: 33, endAyat: 30 },
  { juz: 22, name: 'Juz 22', startSurah: 33, startAyat: 31, endSurah: 36, endAyat: 27 },
  { juz: 23, name: 'Juz 23', startSurah: 36, startAyat: 28, endSurah: 39, endAyat: 31 },
  { juz: 24, name: 'Juz 24', startSurah: 39, startAyat: 32, endSurah: 41, endAyat: 46 },
  { juz: 25, name: 'Juz 25', startSurah: 41, startAyat: 47, endSurah: 45, endAyat: 37 },
  { juz: 26, name: 'Juz 26', startSurah: 46, startAyat: 1, endSurah: 51, endAyat: 30 },
  { juz: 27, name: 'Juz 27', startSurah: 51, startAyat: 31, endSurah: 57, endAyat: 29 },
  { juz: 28, name: 'Juz 28', startSurah: 58, startAyat: 1, endSurah: 66, endAyat: 12 },
  { juz: 29, name: 'Juz 29', startSurah: 67, startAyat: 1, endSurah: 77, endAyat: 50 },
  { juz: 30, name: 'Juz 30 (Juz \'Amma)', startSurah: 78, startAyat: 1, endSurah: 114, endAyat: 6 },
];

async function main() {
  console.log('Mengunduh daftar 114 surah Al-Qur\'an Kemenag...');
  const surahsRes = await fetchWithRetry(`${BASE_URL}/surat`);
  if (!surahsRes || !surahsRes.data) {
    throw new Error('Gagal mengunduh daftar surah.');
  }

  const surahs = surahsRes.data.map((s) => ({
    number: s.nomor,
    nameLatin: s.namaLatin,
    nameArabic: s.nama,
    meaning: s.arti,
    numberOfAyahs: s.jumlahAyat,
    revelation: s.tempatTurun === 'Mekah' ? 'Makkiyah' : 'Madaniyah',
    description: s.deskripsi,
    audioFull: s.audioFull,
  }));

  fs.writeFileSync(path.join(OUTPUT_DIR, 'surahs.json'), JSON.stringify(surahs, null, 2));
  console.log('Tersimpan: surahs.json');

  // Simpan Juz mapping
  fs.writeFileSync(path.join(OUTPUT_DIR, 'juz.json'), JSON.stringify(JUZ_MAPPING, null, 2));
  console.log('Tersimpan: juz.json');

  console.log('Mengunduh 114 detail surah dan ayat...');
  const concurrency = 6;
  const numbers = Array.from({ length: 114 }, (_, i) => i + 1);

  for (let i = 0; i < numbers.length; i += concurrency) {
    const batch = numbers.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async (num) => {
        const filePath = path.join(OUTPUT_DIR, `surah-${num}.json`);
        if (fs.existsSync(filePath)) {
          return; // Skip if already downloaded
        }
        try {
          const detail = await fetchWithRetry(`${BASE_URL}/surat/${num}`);
          if (detail && detail.data) {
            const data = detail.data;
            const formatted = {
              number: data.nomor,
              nameLatin: data.namaLatin,
              nameArabic: data.nama,
              meaning: data.arti,
              numberOfAyahs: data.jumlahAyat,
              revelation: data.tempatTurun === 'Mekah' ? 'Makkiyah' : 'Madaniyah',
              description: data.deskripsi,
              audioFull: data.audioFull,
              nextSurah: data.suratSelanjutnya ? { number: data.suratSelanjutnya.nomor, name: data.suratSelanjutnya.namaLatin } : null,
              prevSurah: data.suratSebelumnya ? { number: data.suratSebelumnya.nomor, name: data.suratSebelumnya.namaLatin } : null,
              ayahs: data.ayat.map((a) => ({
                numberInSurah: a.nomorAyat,
                arabic: a.teksArab,
                transliteration: a.teksLatin,
                translation: a.teksIndonesia,
                audio: a.audio,
              })),
            };
            fs.writeFileSync(filePath, JSON.stringify(formatted));
            process.stdout.write(`.`);
          }
        } catch (err) {
          console.error(`Gagal mengunduh surah ${num}:`, err.message);
        }
      })
    );
  }

  console.log('\nSelesai mengunduh seluruh 114 surah ke public/data/quran/!');
}

main().catch((err) => {
  console.error('Error saat fetch-quran:', err);
  process.exit(1);
});
