import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://iqra.app'; // Production canonical domain
const today = new Date().toISOString().split('T')[0];

const staticRoutes = [
  '',
  '/quran/',
  '/hadits/',
  '/hadits/bukhari/',
  '/hadits/muslim/',
  '/hadits/baca/',
  '/sholat/',
  '/kiblat/',
  '/masjid/',
  '/kalender/',
  '/kajian/',
  '/belajar/',
  '/sirah/',
  '/kisah-nabi/',
  '/tajwid/',
  '/bookmark/',
  '/pengaturan/',
  '/pasang/',
  '/tentang/',
];

// 1. Quran Surahs 1 to 114
const quranRoutes = Array.from({ length: 114 }, (_, i) => `/quran/${i + 1}/`);

// 2. 25 Prophets
let prophetRoutes = [];
const prophetsPath = path.join(process.cwd(), 'public', 'data', 'prophets.json');
if (fs.existsSync(prophetsPath)) {
  const prophets = JSON.parse(fs.readFileSync(prophetsPath, 'utf-8'));
  prophetRoutes = prophets.map((p) => `/kisah-nabi/${p.slug}/`);
}

// 3. Tajwid Lessons
let tajwidRoutes = [];
const tajwidPath = path.join(process.cwd(), 'public', 'data', 'tajwid', 'lessons.json');
if (fs.existsSync(tajwidPath)) {
  const lessons = JSON.parse(fs.readFileSync(tajwidPath, 'utf-8'));
  tajwidRoutes = lessons.map((l) => `/tajwid/${l.slug}/`);
}

const allRoutes = [...staticRoutes, ...quranRoutes, ...prophetRoutes, ...tajwidRoutes];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route === '' || route.startsWith('/quran/') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '' ? '1.0' : route.startsWith('/quran/') ? '0.9' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const robotsContent = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemapContent, 'utf-8');
fs.writeFileSync(path.join(process.cwd(), 'public', 'robots.txt'), robotsContent, 'utf-8');

console.log(`Generated sitemap.xml with ${allRoutes.length} URLs and robots.txt in public/`);
