import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://hadis-api-id.vercel.app/hadith';
const OUTPUT_DIR = path.resolve('public', 'data', 'hadith');

const BOOKS = [
  {
    id: 'bukhari',
    name: 'Shahih Bukhari',
    arabicName: 'صحيح البخاري',
    author: 'Imam Abu Abdillah Muhammad bin Ismail Al-Bukhari',
    grade: 'Shahih',
    totalChunks: 3,
    totalHadiths: 300,
    description:
      'Kitab hadits paling shahih setelah Al-Qur\'an, memuat kumpulan sabda dan petunjuk Rasulullah ﷺ yang diriwayatkan dengan sanad muttashil bersambung.',
  },
  {
    id: 'muslim',
    name: 'Shahih Muslim',
    arabicName: 'صحيح مسلم',
    author: 'Imam Abul Husain Muslim bin Al-Hajjaj An-Naisaburi',
    grade: 'Shahih',
    totalChunks: 3,
    totalHadiths: 300,
    description:
      'Kitab hadits rujukan induk kedua kaum muslimin dengan sistematika penyusunan bab yang sangat rapi dan teliti oleh Imam Muslim.',
  },
];

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

function extractNarrator(translation) {
  // Mencari nama perawi pertama di kurung siku [Nama Perawi]
  const match = /\[(.*?)\]/.exec(translation);
  if (match && match[1]) {
    return match[1];
  }
  return 'Perawi Shahih';
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Simpan books.json
  fs.writeFileSync(path.join(OUTPUT_DIR, 'books.json'), JSON.stringify(BOOKS, null, 2));
  console.log('Tersimpan: books.json');

  const dailyHadiths = [];

  for (const book of BOOKS) {
    const bookDir = path.join(OUTPUT_DIR, book.id);
    if (!fs.existsSync(bookDir)) {
      fs.mkdirSync(bookDir, { recursive: true });
    }

    console.log(`Mengunduh hadits ${book.name} (3 chunk = 300 hadits)...`);

    for (let page = 1; page <= book.totalChunks; page++) {
      const filePath = path.join(bookDir, `chunk-${page}.json`);
      if (fs.existsSync(filePath)) {
        console.log(`- chunk-${page}.json sudah ada, lewati.`);
        continue;
      }

      const url = `${BASE_URL}/${book.id}?page=${page}&limit=100`;
      const data = await fetchWithRetry(url);

      if (data && data.items && data.items.length > 0) {
        const formatted = data.items.map((item) => {
          const narrator = extractNarrator(item.id);
          return {
            id: `${book.id}-${item.number}`,
            book: book.id,
            bookName: book.name,
            number: item.number,
            arabic: item.arab,
            translation: item.id,
            narrator,
            grade: 'Shahih',
            sourceRef: `${book.name} No. ${item.number}`,
          };
        });

        fs.writeFileSync(filePath, JSON.stringify(formatted, null, 2));
        console.log(`- Tersimpan: ${book.id}/chunk-${page}.json (${formatted.length} hadits)`);

        // Kumpulkan 15 hadits pertama tiap kitab untuk daily pool
        if (page === 1) {
          dailyHadiths.push(...formatted.slice(0, 15));
        }
      }
    }
  }

  // Simpan daily.json (30 hadits shahih pilihan untuk setiap hari dalam sebulan)
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'daily.json'),
    JSON.stringify(dailyHadiths, null, 2)
  );
  console.log(`Tersimpan: daily.json (${dailyHadiths.length} hadits harian)`);

  console.log('\nSelesai mengunduh dataset hadits ke public/data/hadith/!');
}

main().catch((err) => {
  console.error('Error saat fetch-hadith:', err);
  process.exit(1);
});
