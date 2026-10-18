# PRD Aplikasi Iqra (Web, Next.js, PWA)

Product Requirements Document · Versi 1.0 · Oktober 2026

Platform: website responsif + PWA yang bisa dipasang di Android dan iOS, dibangun dengan Next.js, di-deploy di hosting cPanel, diakses lewat domain di browser.

## 1. Ringkasan Produk

Iqra adalah aplikasi web untuk mempermudah umat Islam belajar agama: membaca dan mendengarkan Al-Qur'an, belajar hadits shahih, menemukan masjid terdekat, menonton kajian ustadz populer, melihat jadwal sholat dengan pengingat, membaca kisah para nabi, dan belajar tajwid.

Nama aplikasi: **Iqra** (artinya "bacalah"). Bahasa UI: Indonesia (siapkan struktur i18n untuk Inggris dan Arab). Kesan: damai, tentram, bersih, modern, terpercaya.

Iqra dirancang sebagai PWA (Progressive Web App): pengguna cukup membuka domain Iqra di browser, lalu memasangnya ke layar utama HP Android maupun iPhone/iPad sehingga tampil dan terasa seperti aplikasi native (layar penuh, ikon sendiri, bisa offline), tanpa Play Store atau App Store.

### Instruksi Wajib untuk AI / Developer

Dokumen ini ditulis agar bisa dipahami model AI apa pun. Patuhi tanpa pengecualian:

1. DILARANG memakai gradient (linear-gradient, radial-gradient, conic-gradient, kelas Tailwind bg-gradient-*, from-*, via-*, to-*) di mana pun. Semua warna flat (solid).
2. Kedalaman visual hanya dari shadow tipis (token di Bagian 6.3). Tanpa glow, neon, atau efek blur berlebihan.
3. Wajib ada Light Mode dan Dark Mode (ikuti sistem + bisa diubah manual, tanpa kedip saat load).
4. Semua warna, spacing, radius, font, dan shadow harus dari design token (CSS variables), jangan hard-code nilai di komponen.
5. Konten keagamaan (ayat, hadits, kisah, tajwid) tidak boleh dikarang AI. Harus dari API/dataset/file konten yang disebut di dokumen ini. Teks Arab tidak boleh diubah, dipotong, atau diketik ulang. Bila data belum ada, buat placeholder bertanda TODO, bukan isi karangan.
6. Setiap konten keagamaan wajib menampilkan sumber/referensi (kitab, nomor hadits, surah:ayat).
7. WAJIB kompatibel hosting cPanel (static export). DILARANG memakai fitur yang butuh server Node: API Routes, Route Handlers dinamis, Server Actions, Middleware, ISR/revalidate, next/image optimizer, cookies/headers sisi server, SSR dinamis. Semua data diambil di sisi klien atau dari file statis.
8. Mobile-first: rancang untuk layar HP dulu, lalu tablet dan desktop.
9. Gunakan TypeScript strict.
10. WAJIB lolos kriteria instalasi PWA di Android (Chrome) dan iOS (Safari) sesuai Bagian 9. Fitur PWA bukan tambahan opsional.
11. Bila ada yang ambigu, pilih solusi paling sederhana yang sesuai tujuan, lalu catat asumsi di ASSUMPTIONS.md.

## 2. Tujuan dan Metrik

Tujuan: satu website/PWA yang ringan, cepat, indah, bisa dipasang di HP Android dan iOS, nyaman dipakai di HP maupun desktop; konten dari sumber resmi; konten inti tetap bisa dibaca saat offline.

Metrik (3 bulan setelah rilis): Lighthouse Mobile Performance ≥ 90, Accessibility ≥ 95, PWA lolos semua pemeriksaan instalasi; LCP < 2,5 dtk di 4G; error JavaScript < 1% sesi; retensi hari ke-7 ≥ 30%; ≥ 60% pengguna aktif membuka Al-Qur'an atau Jadwal Sholat setiap hari; ≥ 25% pengguna mobile yang aktif memasang Iqra ke layar utama.

## 3. Target Pengguna

Pelajar dan mahasiswa muslim, pekerja muda yang butuh pengingat sholat dan kajian, pemula yang belajar membaca Al-Qur'an dan tajwid, serta orang tua yang mencari kisah nabi untuk anak (ukuran font harus bisa diperbesar).

## 4. Ruang Lingkup

**Masuk (MVP):** 7 fitur utama (Al-Qur'an + audio qori, Hadits, Masjid terdekat, Kajian YouTube, Jadwal sholat + pengingat, Kisah Nabi, Tajwid) dan fitur pendukung (beranda, pencarian, bookmark dan terakhir dibaca, pengaturan, PWA yang bisa dipasang di Android dan iOS).

**Tidak masuk:** login dan sinkronisasi cloud, forum, e-commerce, donasi, AI chat, iklan, publikasi ke Play Store/App Store.

## 5. Teknologi dan Arsitektur

| Kebutuhan | Pilihan |
| --- | --- |
| Framework | Next.js (App Router) versi stabil terbaru + React + TypeScript strict |
| Mode output | Static export: output: 'export', trailingSlash: true, images: { unoptimized: true } |
| Styling | Tailwind CSS + design token via CSS variables |
| Tema | next-themes (class strategy, default: sistem) |
| Animasi | Motion (Framer Motion) + CSS transitions; hormati prefers-reduced-motion |
| Data fetching | TanStack Query (cache, retry, stale-while-revalidate) + Zod untuk validasi respons |
| State | Zustand (tema, pengaturan, player) |
| Penyimpanan lokal | localStorage (pengaturan kecil) + IndexedDB via Dexie (bookmark, terakhir dibaca, cache konten, jadwal sholat) |
| Audio | HTML5 Audio + Media Session API (kontrol media di notifikasi/lockscreen) |
| Peta (gratis) | Leaflet + react-leaflet, tile OpenStreetMap; data masjid dari Overpass API; geocoding Nominatim |
| Video | Embed resmi YouTube (iframe, youtube-nocookie.com bila memungkinkan) |
| Perhitungan sholat | adhan (adhan-js) sebagai fallback offline |
| PWA | Serwist (atau setara): service worker, manifest, ikon, cache offline, update flow (detail Bagian 9) |
| Daftar panjang | @tanstack/react-virtual |
| Font | next/font self-hosted (tanpa CDN saat runtime) |
| Ikon | lucide-react |
| Kualitas | ESLint, Prettier, Vitest/Jest + Testing Library, Playwright (E2E) |

### Prinsip arsitektur

- Feature-based folder. Lapisan: components → hooks → services (API) → storage.
- Satu API client (timeout, retry, error mapping, validasi Zod).
- Data-first statis: teks Al-Qur'an, dataset hadits, kisah nabi, dan materi tajwid diunduh saat build/skrip persiapan menjadi file JSON di public/data/, sehingga situs tidak bergantung pada API pihak ketiga saat runtime dan tetap bisa offline.
- Audio qori di-stream dari URL CDN sumber API, tidak di-host di cPanel (hemat bandwidth).
- Halaman dinamis memakai generateStaticParams dan dynamicParams = false.
- Untuk daftar sangat besar (hadits ribuan), jangan membuat satu halaman statis per hadits. Pakai satu halaman klien dengan query string (mis. /hadits/baca/?kitab=bukhari&no=1) yang membaca JSON per bagian (chunk 100 hadits).

### Struktur folder yang disarankan

```
iqra/
  public/
    data/               # quran/, hadith/, prophets.json, tajwid/ (JSON statis)
    icons/              # ikon PWA (192, 512, maskable, apple-touch 180, favicon)
    splash/             # (opsional) gambar splash iOS
    manifest.webmanifest
    offline.html
    api/                # (opsional) proxy PHP untuk cPanel
  scripts/              # fetch-data.ts, generate-icons.ts
  src/
    app/                # route (App Router)
    features/
      quran/ hadith/ mosque/ video/ prayer/ prophets/ tajwid/ home/ settings/ pwa/
        components/ hooks/ services/ types.ts
    components/         # UI umum (Button, Card, Sheet, Skeleton, dll)
    theme/              # tokens.css, ThemeProvider
    lib/                # apiClient, db (Dexie), i18n, utils
```

### Rute utama

/ Beranda · /quran/ · /quran/\[nomor-surah\]/ · /hadits/ · /hadits/\[kitab\]/ · /hadits/baca/ · /sholat/ · /masjid/ · /kajian/ · /kisah-nabi/ · /kisah-nabi/\[slug\]/ · /tajwid/ · /tajwid/\[slug\]/ · /bookmark/ · /pengaturan/ · /pasang/ · /tentang/

## 6. Design System

### 6.1 Karakter Visual

Clean dan lega, hierarki jelas, satu aksi utama per layar. Flat color + shadow tipis. Sudut membulat lembut (kartu 16–20 px), ikon garis tipis, ornamen geometris Islami (bintang 8 sisi/arabesque) hanya sebagai bentuk flat satu warna dengan opasitas rendah, bukan gradient. Nuansa: hijau zamrud (damai), krem hangat (tenang), emas lembut (aksen mulia).

### 6.2 Palet Warna (Flat) sebagai CSS Variables

**Light Mode**

| Token | Hex | Penggunaan |
| --- | --- | --- |
| --background | #F6F4EE | Latar halaman |
| --surface | #FFFFFF | Kartu, sheet |
| --surface-alt | #EDEAE0 | Chip, input |
| --primary | #1E6B57 | Tombol utama, nav aktif, link |
| --primary-pressed | #175846 | Hover/ditekan |
| --primary-soft | #DCEBE4 | Latar badge, highlight |
| --accent | #B38B3A | Aksen kecil (nomor ayat, ornamen) |
| --text-primary | #17302A | Teks utama |
| --text-secondary | #5E726B | Teks pendukung |
| --border | #E1DDD0 | Garis pemisah |
| --success | #2E8B57 | Berhasil |
| --warning | #C98A1B | Peringatan |
| --danger | #C0483D | Error |

**Dark Mode** (hijau-hitam tenang, bukan hitam pekat)

| Token | Hex | Penggunaan |
| --- | --- | --- |
| --background | #0D1613 | Latar halaman |
| --surface | #15211D | Kartu, sheet |
| --surface-alt | #1D2C27 | Chip, input |
| --primary | #4FB596 | Tombol utama, nav aktif |
| --primary-pressed | #3E9A7E | Hover/ditekan |
| --primary-soft | #1E3A31 | Latar badge |
| --accent | #D2AE5E | Aksen kecil |
| --text-primary | #E9F0ED | Teks utama |
| --text-secondary | #9DB0A9 | Teks pendukung |
| --border | #26362F | Garis pemisah |
| --success | #4CC38A | Berhasil |
| --warning | #E0A93B | Peringatan |
| --danger | #E36B5F | Error |

Semua pasangan teks/latar harus lolos kontras WCAG AA (≥ 4,5:1). Atur color-scheme dan meta theme-color sesuai tema. Cegah flash tema saat load (skrip inline next-themes).

### 6.3 Shadow Tipis (Token)

- Light: 0 2px 8px rgba(23,48,42,0.06). Untuk popover, sheet, dan mini-player: 0 8px 24px rgba(23,48,42,0.10).
- Dark: shadow hampir tak terlihat (0 2px 6px rgba(0,0,0,0.25)); pembeda kartu utama adalah border 1px (--border).

### 6.4 Tipografi

- UI: Plus Jakarta Sans (alternatif Inter), bobot 400, 500, 600, 700.
- Arab Al-Qur'an: Amiri Quran atau LPMQ Isep Misbah (font standar Kemenag, bila lisensi mengizinkan). Default 28 px, bisa 22–44 px, line-height ≥ 2.
- Skala: Display 32/40, Title 22/30, Subtitle 17/26, Body 15/24, Caption 12/16.

### 6.5 Layout dan Responsif (Mobile-First)

- Spacing kelipatan 4. Radius: kecil 10, kartu 16, sheet 24, pill 999. Area klik minimal 44x44 px.
- < 768 px (HP): bottom navigation 5 tab, konten 1 kolom, padding horizontal 20.
- 768–1199 px (tablet): bottom nav atau rail ikon di kiri, grid 2 kolom.
- ≥ 1200 px (desktop): sidebar kiri tetap, konten maksimal lebar 1120 px, grid 3–4 kolom, layar baca Qur'an maksimal 760 px.
- Hormati safe-area (env(safe-area-inset-\*)) untuk notch, Dynamic Island, dan home indicator saat berjalan sebagai PWA (viewport-fit=cover).

### 6.6 Animasi dan Interaksi

Durasi 150–350 ms, easing lembut, hanya animasikan transform dan opacity agar 60 fps.

- Transisi halaman: fade + slide tipis.
- Hover/tekan kartu dan tombol: naik 2 px atau scale 0,98 + perubahan warna.
- Daftar muncul bertahap (stagger 30–50 ms, maksimal 8 item pertama).
- Skeleton loading warna flat dengan animasi opasitas (bukan shimmer gradient).
- Pergantian tema: transisi warna halus.
- Audio player: progres dan highlight ayat aktif berpindah mulus; mini-player naik dari bawah dengan spring.
- Nonaktifkan animasi non-esensial saat prefers-reduced-motion: reduce.
- Jangan menganimasikan teks pada layar baca agar fokus tidak terganggu.

### 6.7 Komponen UI Inti

Button (primary, secondary, ghost), Card, ListItem, Chip, SearchBar, Tabs/Segmented, BottomSheet/Dialog, Toast, Skeleton, EmptyState, ErrorState (tombol coba lagi), AudioMiniPlayer, SectionHeader, Switch, Slider, Navbar/Sidebar, InstallPrompt, IOSInstallGuide, UpdateToast, OfflineBanner. Semua mendukung kedua tema, keyboard (fokus terlihat jelas), dan screen reader.

## 7. Navigasi dan Struktur Halaman

Navigasi utama (5 item): Beranda · Al-Qur'an · Belajar · Sholat · Lainnya. Di HP berupa bottom nav, di desktop berupa sidebar.

- **Beranda:** salam, tanggal Hijriah dan Masehi, kartu waktu sholat berikutnya (hitung mundur), lanjutkan membaca terakhir, pintasan 7 fitur, ayat/hadits harian, rekomendasi kajian.
- **Al-Qur'an:** daftar surah/juz, baca, audio.
- **Belajar:** Hadits, Tajwid, Kisah Nabi.
- **Sholat:** tab Jadwal | Masjid.
- **Lainnya:** Kajian, Bookmark, Pengaturan, Pasang Aplikasi, Tentang dan sumber data.

**Alur pertama kali:** Splash ringan → onboarding 3 slide (dapat dilewati) → minta izin lokasi dengan penjelasan manfaat (hanya saat pengguna menekan tombol) → Beranda. Ajakan memasang aplikasi mengikuti aturan Bagian 9.3, bukan di onboarding.

## 8. Spesifikasi Fitur

### Fitur 1: Membaca Al-Qur'an dan Mendengarkan Qori

**Sumber data:** data Al-Qur'an Kementerian Agama RI (teks Arab, terjemahan Indonesia, tafsir, transliterasi). Utama: layanan Qur'an Kemenag (web-api.qurankemenag.net). Fallback: API komunitas bersumber data Kemenag (mis. equran.id API v2). Developer wajib memverifikasi endpoint dan lisensi terbaru, lalu mengunduh data lewat scripts/fetch-data.ts menjadi JSON statis di public/data/quran/. Cantumkan sumber di halaman Tentang.

**Kebutuhan fungsional**

1. Daftar surah: 114 surah dan 30 juz; nama Latin, Arab, arti, jumlah ayat, Makkiyah/Madaniyah; pencarian nama atau nomor.
2. Halaman baca (/quran/\[nomor\]/, dibuat statis untuk 114 surah): header lengket (nama surah, tombol audio, pengaturan), basmalah di awal surah (kecuali At-Taubah), nomor ayat berbentuk lingkaran beraksen emas. Toggle tampilan: Arab saja / + terjemahan / + transliterasi. Klik ayat membuka menu: Putar, Tafsir, Bookmark, Salin, Bagikan.
3. Pengaturan baca: ukuran font Arab dan terjemahan, toggle terjemahan dan transliterasi, tajwid berwarna (bila data ada).
4. Audio: minimal 5 qori populer (mis. Mishary Rashid Alafasy, Abdurrahman As-Sudais, Saad Al-Ghamidi, Maher Al-Muaiqly, Muhammad Ayyub; daftar final sesuai ketersediaan audio API). Kontrol: play/pause, ayat sebelum/berikut, kecepatan 0,75x–1,5x, ulangi ayat/surah, timer tidur. Ayat aktif ter-highlight dan auto-scroll. Integrasi Media Session API (judul, qori, kontrol di notifikasi media dan layar kunci). Mini-player tetap muncul saat berpindah halaman.
5. Offline: teks Al-Qur'an di-cache service worker dan IndexedDB; audio per surah dapat di-cache opsional lewat tombol "Simpan untuk offline" (tampilkan ukuran dan progres).
6. Pencarian: surah dan kata pada terjemahan (di sisi klien).
7. Terakhir dibaca tersimpan otomatis (surah, ayat) dan tampil di Beranda.

**Kriteria penerimaan:** teks Arab identik dengan sumber; scroll mulus pada Al-Baqarah (286 ayat, gunakan virtualisasi bila perlu); halaman baca bisa dibuka offline setelah kunjungan pertama; audio berpindah ayat tanpa jeda panjang; audio bisa diputar di iOS Safari dan PWA iOS setelah interaksi pengguna.

### Fitur 2: Belajar Hadits

**Sumber data:** tidak ada satu API "resmi" tunggal untuk hadits. Gunakan dataset/API terbuka berbahasa Indonesia dari kitab induk: Shahih Bukhari dan Shahih Muslim (prioritas MVP, derajat shahih), kemudian Abu Dawud, Tirmidzi, Nasa'i, Ibnu Majah, Muwatha' Malik. Developer wajib memverifikasi lisensi dataset, mengubahnya menjadi JSON per kitab dan per chunk (100 hadits) di public/data/hadith/.

**Kebutuhan fungsional**

1. Alur: daftar kitab → daftar bab → daftar hadits → detail.
2. Detail: teks Arab, terjemahan Indonesia, perawi, nomor hadits, nama kitab, label derajat. Sumber lengkap wajib tampil.
3. Pencarian kata pada terjemahan dan nomor hadits (indeks ringan di sisi klien).
4. Bookmark, salin, bagikan (format teks rapi dengan sumber, isi tidak diubah).
5. Hadits harian di Beranda (dipilih deterministik berdasarkan tanggal dari daftar shahih).
6. Pemuatan bertahap (infinite scroll/virtual list) dengan skeleton.

**Kriteria penerimaan:** tidak ada hadits tanpa nomor dan perawi; hadits non-shahih tidak ditampilkan di MVP.

### Fitur 3: Masjid Terdekat

**Sumber (gratis):** peta OpenStreetMap, data masjid dari Overpass API (amenity=place\_of\_worship + religion=muslim), radius default 3 km (pilihan 1/3/5/10 km). Tanpa Google Maps berbayar.

**Kebutuhan fungsional**

1. Minta izin lokasi lewat navigator.geolocation hanya setelah pengguna menekan tombol (butuh HTTPS). Jika ditolak/gagal, sediakan pencarian kota manual (Nominatim).
2. Peta Leaflet (dimuat dinamis, tanpa SSR) dengan penanda lokasi pengguna dan masjid. Daftar di samping (desktop) atau panel tarik (HP), diurutkan jarak: nama, jarak, alamat bila ada.
3. Klik masjid → detail ringkas + tombol Petunjuk Arah (membuka Google Maps/OSM lewat tautan) dan Bagikan.
4. Cache hasil per area 24 jam di IndexedDB; tombol refresh.
5. Tangani: izin ditolak, tidak ada hasil (saran perbesar radius), Overpass lambat/timeout (retry dan pesan ramah), data tanpa nama ("Masjid/Musholla (tanpa nama)").
6. Patuhi kebijakan penggunaan Overpass dan Nominatim (rate limit, atribusi "© OpenStreetMap contributors" wajib tampil di peta).

### Fitur 4: Tontonan Channel YouTube Ustadz Populer

**Sumber:** YouTube Data API v3 (kuota gratis). Pemutaran memakai embed resmi YouTube.

**Kebutuhan fungsional**

1. Daftar channel dikurasi di public/data/channels.json (mis. Ustadz Abdul Somad/UAS, Ustadz Adi Hidayat/UAH, Ustadz Hanan Attaki/UHA, dan ustadz lain yang ditambah pemilik produk). Developer mengisi channel ID resmi yang diverifikasi dari halaman channel.
2. Halaman Kajian: carousel channel (avatar bulat), chip filter, daftar video terbaru per channel, tab Terbaru | Populer.
3. Detail video: pemutar embed (playsinline agar tidak memaksa layar penuh di iPhone), judul, tanggal, channel, tombol buka di YouTube, bagikan.
4. API key tidak boleh terekspos sembarangan. Pilihan (urut prioritas): (a) skrip PHP + cron di cPanel yang mengambil data YouTube berkala dan menulis public/api/videos.json (key disimpan di server, tidak di klien); (b) key khusus klien yang dibatasi HTTP referrer domain Iqra dan hanya aktif untuk YouTube Data API v3. Pilihan (a) sangat disarankan.
5. Cache daftar video 6 jam; fallback ke cache saat offline.
6. Cantumkan catatan bahwa konten milik channel masing-masing.

### Fitur 5: Jadwal Sholat dan Pengingat (Sesuai Lokasi)

**Sumber:** data Kemenag RI/Bimas Islam melalui API yang menyajikan data Kemenag (mis. MyQuran API v2) atau Aladhan API dengan metode Kemenag Indonesia. Fallback offline: perhitungan lokal adhan-js (Subuh 20°, Isya 18°, dengan koreksi ihtiyath).

**Kebutuhan fungsional**

1. Lokasi otomatis (geolocation) dan pilihan kota manual; tampilkan nama kota/kabupaten.
2. Waktu: Imsak, Subuh, Terbit, Dzuhur, Ashar, Maghrib, Isya. Highlight waktu aktif dan hitung mundur ke sholat berikutnya (satu timer efisien).
3. Tanggal Hijriah dan Masehi.
4. Cache jadwal 30 hari ke depan di IndexedDB; muat ulang saat lokasi berubah signifikan (> 10 km) atau awal bulan.
5. Pengingat adzan di web (batasan harus ditulis jujur di UI): karena hosting statis tidak bisa mengirim push dari server, pengingat bekerja selama situs/PWA terbuka (tab aktif atau latar belakang yang masih hidup). Fitur: izin Notification API, notifikasi lewat service worker, suara adzan (adzan penuh/pendek/bip lembut/senyap), pengingat X menit sebelum waktu masuk (5/10/15), banner di aplikasi saat waktu masuk. Teks bantuan: "Agar pengingat akurat, biarkan Iqra terbuka atau pasang sebagai aplikasi."
6. **Aturan platform:** di Android (Chrome), notifikasi bisa diminta dari tab biasa maupun PWA terpasang. Di iPhone/iPad, notifikasi web HANYA tersedia setelah Iqra dipasang ke Layar Utama dan dibuka dari ikonnya (iOS 16.4+); sebelum itu, tampilkan panduan pasang, bukan tombol izin yang akan gagal. Izin notifikasi hanya diminta setelah pengguna menekan tombol.
7. Opsional fase lanjutan (v1.1): Web Push sungguhan memakai VAPID + PHP + cron per menit di cPanel untuk pengguna yang berlangganan. Tidak termasuk MVP.
8. Pengaturan Sholat: metode perhitungan, koreksi menit manual per waktu, pilihan suara adzan.

**Kriteria penerimaan:** selisih dengan jadwal Kemenag ≤ 1 menit; jadwal tampil offline dari cache; notifikasi muncul saat PWA/tab terbuka dan izin diberikan (Android dan iOS terpasang).

### Fitur 6: Kisah Nabi

**Sumber:** konten dikurasi dari sumber terpercaya: ayat Al-Qur'an terkait (data Kemenag), hadits shahih, dan rujukan kitab seperti Qashashul Anbiya (Ibnu Katsir). Disimpan di public/data/prophets.json (terversi). Konten harus ditinjau ustadz/ahli sebelum rilis. AI tidak boleh mengarang kisah.

**Kebutuhan fungsional**

1. Daftar 25 nabi dan rasul (urut kronologis: Adam, Idris, Nuh, Hud, Shalih, Ibrahim, Luth, Ismail, Ishaq, Ya'qub, Yusuf, Ayyub, Syu'aib, Musa, Harun, Dzulkifli, Dawud, Sulaiman, Ilyas, Ilyasa', Yunus, Zakariya, Yahya, Isa, Muhammad ﷺ) dalam grid kartu dengan ornamen flat (tanpa menggambar wajah nabi).
2. Halaman kisah (/kisah-nabi/\[slug\]/, statis): bagian pendek (pendahuluan, dakwah, ujian, hikmah), referensi ayat yang bisa diklik ke halaman Qur'an, kotak Hikmah di akhir, estimasi waktu baca, progres baca, bookmark.
3. Wajib ada bagian Sumber/Referensi di setiap kisah.
4. Larangan: tidak menampilkan rupa/wajah nabi; hindari israiliyat yang tidak shahih.

### Fitur 7: Belajar Tajwid

**Sumber:** rujukan resmi dan terpercaya: panduan Mushaf Standar Indonesia / Al-Qur'an Tajwid Kemenag (Lajnah Pentashih Mushaf) dan kitab tajwid standar (mis. Tuhfatul Athfal, Hidayatus Shibyan). Konten dikurasi dan ditinjau ahli tajwid sebelum rilis. Disimpan di public/data/tajwid/.

**Kebutuhan fungsional**

1. Kurikulum bertahap: Level 1 Makharijul Huruf dan sifat huruf dasar · Level 2 Nun Sukun dan Tanwin (Izhar, Idgham bighunnah, Idgham bilaghunnah, Iqlab, Ikhfa) · Level 3 Mim Sukun · Level 4 Mad (thabi'i, wajib muttasil, jaiz munfasil, dst.) · Level 5 Qalqalah, Ghunnah, Lam Jalalah, Waqaf dan Ibtida'.
2. Tiap materi: penjelasan singkat, contoh ayat (Arab dari data Kemenag, bagian hukum tajwid diberi warna flat sesuai legenda dan label teks), audio contoh, tips.
3. Legenda warna tajwid konsisten dan bisa dipakai di halaman baca (toggle "Tajwid berwarna"), terbaca di light dan dark mode.
4. Latihan: kuis pilihan ganda (3–5 soal per materi) dengan umpan balik dan penjelasan; skor dan progres tersimpan di IndexedDB; lencana flat penyelesaian level.
5. Roadmap belajar vertikal dengan node terkunci/terbuka yang beranimasi halus.
6. Pencarian istilah dan glosarium.

## 9. PWA dan Instalasi di HP (Android dan iOS)

Tujuan: pengguna bisa memasang Iqra ke layar utama HP Android dan iPhone/iPad, lalu membukanya seperti aplikasi biasa (layar penuh tanpa bilah browser, ikon dan splash sendiri, jalan offline).

### 9.1 Kriteria Instalasi (wajib lolos)

- Disajikan lewat HTTPS (AutoSSL cPanel).
- manifest.webmanifest valid, ditautkan di setiap halaman.
- Service worker terdaftar dengan scope "/" dan menyediakan fallback offline.
- Ikon 192 px dan 512 px, plus ikon maskable.
- Lolos audit PWA/installability di Chrome DevTools dan Lighthouse.

### 9.2 Web App Manifest (public/manifest.webmanifest)

| Properti | Nilai |
| --- | --- |
| id | "/" |
| name / short\_name | "Iqra" / "Iqra" |
| description | Belajar Al-Qur'an, hadits, jadwal sholat, masjid, kajian, kisah nabi, dan tajwid |
| start\_url | "/?source=pwa" |
| scope | "/" (sesuaikan bila situs di subfolder) |
| display | "standalone" (display\_override: \["standalone", "minimal-ui"\]) |
| orientation | "portrait" (tablet dan desktop tidak dikunci) |
| theme\_color / background\_color | warna flat dari token (hijau #1E6B57 / krem #F6F4EE untuk light) |
| lang / dir | "id" / "ltr" |
| categories | \["education", "lifestyle"\] |
| icons | 192x192, 512x512 (purpose any) dan 512x512 (purpose maskable); semua flat tanpa gradient |
| shortcuts | Al-Qur'an (/quran/), Jadwal Sholat (/sholat/), Lanjut Membaca (/quran/?lanjut=1) |
| screenshots | 2 layar HP (narrow) dan 1 layar lebar (wide) agar dialog instal di Android tampil kaya |

Tema gelap: atur meta theme-color dengan media query prefers-color-scheme agar bilah status mengikuti tema.

### 9.3 Pengalaman Memasang

**Android (Chrome, Edge, Samsung Internet):**

1. Tangkap event beforeinstallprompt, simpan, dan jangan tampilkan dialog otomatis.
2. Tampilkan kartu "Pasang Iqra" (InstallPrompt) setelah pengguna aktif minimal 2 kunjungan atau 3 menit; juga tersedia permanen di Lainnya → Pasang Aplikasi dan halaman /pasang/.
3. Saat tombol ditekan, panggil prompt(); tangani hasil diterima/ditolak. Jika ditolak, jangan tampilkan lagi selama 14 hari.
4. Setelah terpasang (event appinstalled), sembunyikan ajakan dan tampilkan ucapan singkat.

**iPhone/iPad (Safari):** iOS tidak punya dialog instal otomatis, jadi sediakan panduan visual (IOSInstallGuide, bottom sheet):

1. Deteksi iOS Safari yang belum standalone (navigator.standalone atau display-mode: standalone bernilai false).
2. Tampilkan langkah bergambar flat: ketuk tombol Bagikan → gulir → "Tambah ke Layar Utama" → "Tambah".
3. Jika dibuka dari browser lain di iOS (mis. Chrome iOS, in-app browser), sarankan membuka lewat Safari terlebih dahulu.
4. Setelah terpasang dan dibuka dari ikon, sembunyikan ajakan.

**Desktop (Chrome/Edge):** tombol "Pasang" yang sama lewat beforeinstallprompt; pemasangan bersifat opsional.

### 9.4 Kebutuhan Khusus iOS

Tambahkan di head (lewat metadata Next.js):

- apple-touch-icon 180x180 (PNG, tanpa transparansi, flat).
- apple-mobile-web-app-capable = yes; apple-mobile-web-app-title = "Iqra"; apple-mobile-web-app-status-bar-style = "default" (atau black-translucent dengan safe-area dihormati).
- viewport: width=device-width, initial-scale=1, viewport-fit=cover. Jangan mengunci zoom (aksesibilitas).
- (Opsional) apple-touch-startup-image untuk ukuran perangkat umum; warna latar flat dengan logo Iqra.
- Format audio yang didukung Safari (MP3/AAC); pemutaran hanya setelah gestur pengguna; kendali Media Session diuji di iOS.
- Gunakan satuan viewport dinamis (dvh/svh) agar tinggi layar benar saat bilah Safari muncul/hilang.
- Izin notifikasi iOS hanya tersedia untuk PWA terpasang (iOS 16.4+), sesuai Fitur 5.
- Hindari ketergantungan pada API yang tidak didukung iOS (mis. beforeinstallprompt, Background Sync, Background Fetch); sediakan fallback.

### 9.5 Service Worker dan Offline

- **Build:** gunakan Serwist; karena static export tidak punya server, hasilkan sw.js ke root out/ saat build (plugin Serwist untuk Next.js, atau Serwist CLI dijalankan setelah next build bila plugin tidak kompatibel; catat pilihan di ASSUMPTIONS.md).
- **Precache:** app shell (HTML rute utama, JS/CSS, font, ikon, halaman offline.html).
- **Strategi runtime:**
  - Aset statis berversi (JS, CSS, font): cache-first.
  - JSON konten (public/data/): stale-while-revalidate dengan versi data di nama file.
  - Navigasi halaman: network-first dengan fallback ke cache lalu offline.html.
  - API pihak ketiga (jadwal, Overpass, YouTube): network-first dengan timeout, fallback ke cache IndexedDB.
  - Audio qori: cache hanya bila pengguna menekan "Simpan untuk offline"; tangani permintaan Range agar audio bisa di-seek dari cache (wajib untuk Safari).
- **Pembaruan:** deteksi service worker baru, tampilkan UpdateToast "Versi baru tersedia · Muat ulang"; tidak memaksa reload saat pengguna sedang membaca atau memutar audio.
- **Penyimpanan:** panggil navigator.storage.persist() setelah pengguna memasang atau mengunduh konten offline; tampilkan pemakaian penyimpanan di Pengaturan. Catatan iOS: Safari dapat menghapus data situs yang lama tidak dibuka bila tidak terpasang; PWA terpasang lebih aman.
- **Status jaringan:** OfflineBanner ringan saat offline; fitur yang butuh internet (peta, video) menampilkan keterangan jelas.

### 9.6 Rasa Seperti Aplikasi (App-like)

- Layar penuh (standalone) dengan bottom nav yang menghormati safe-area dan home indicator.
- Matikan highlight ketuk bawaan, seleksi teks pada elemen UI (bukan pada teks ayat/hadits), dan overscroll yang mengganggu (overscroll-behavior) pada area tertentu; teks konten tetap bisa disalin.
- Tombol kembali Android dan gestur geser iOS berjalan wajar; navigasi memakai riwayat browser (tidak ada jebakan back).
- Mencegah layar mati saat membaca/audio (Screen Wake Lock API, opsional dengan sakelar di Pengaturan, fallback diam-diam bila tidak didukung).
- Badge ikon (Badging API) opsional untuk tanda sholat berikutnya; abaikan bila tidak didukung.
- Bagikan memakai Web Share API; menjadi target berbagi (Web Share Target) tidak termasuk MVP.
- Buka tautan eksternal (YouTube, peta) lewat tab/aplikasi sistem dengan rel noopener.

### 9.7 Halaman /pasang/

Halaman panduan memasang: deteksi perangkat (Android/iOS/desktop) dan tampilkan langkah yang sesuai, manfaat memasang (offline, pengingat, layar penuh), status (belum terpasang / sudah terpasang), serta jawaban untuk masalah umum (mis. "Tidak ada tombol Tambah ke Layar Utama di iPhone" → buka lewat Safari).

### 9.8 Kriteria Penerimaan PWA

- Lighthouse PWA/installability tanpa kegagalan; manifest dan service worker valid.
- Android Chrome: dialog instal muncul dan ikon terpasang di layar utama dengan ikon maskable yang benar, terbuka tanpa bilah browser.
- iOS Safari: bisa ditambahkan ke Layar Utama, ikon dan nama "Iqra" benar, terbuka standalone, safe-area benar di iPhone ber-notch.
- Mode pesawat: Beranda, Al-Qur'an yang sudah dibuka, jadwal sholat tersimpan, bookmark, dan halaman offline tampil.
- Pembaruan versi baru muncul lewat UpdateToast tanpa merusak data pengguna.

## 10. Fitur Pendukung

- Bookmark terpadu (ayat, hadits, kisah) dengan filter tipe; ekspor/impor JSON agar data bisa dipindah antarperangkat (karena tanpa akun).
- Pencarian global: surah, hadits, nabi, materi tajwid.
- Pengaturan: tema (Sistem/Terang/Gelap), bahasa, ukuran font global, lokasi dan metode sholat, pengingat, kelola cache offline, pasang aplikasi, tentang aplikasi dan sumber data, kebijakan privasi, kirim masukan.
- Bagikan: ayat/hadits sebagai teks (Web Share API, fallback salin) beserta sumber.
- SEO: metadata per halaman, sitemap.xml, robots.txt, Open Graph (gambar flat tanpa gradient), bahasa id.

## 11. Model Data Ringkas

- Surah {id, nameLatin, nameArabic, meaning, ayahCount, revelationPlace}
- Ayah {surahId, number, arabic, transliteration, translationId, tafsirShort, juz, audio: {qariId: url}}
- Qari {id, name, audioBaseUrl}
- Hadith {id, book, chapter, number, arabic, translationId, narrator, grade, sourceRef}
- PrayerDay {date, city, imsak, fajr, sunrise, dhuhr, asr, maghrib, isha}
- Mosque {osmId, name, lat, lng, distanceM, address?}
- Channel {id, name, handle, avatarUrl} · Video {id, channelId, title, publishedAt, thumbnail}
- Prophet {slug, name, order, summary, sections\[\], verseRefs\[\], lessons\[\], sources\[\]}
- TajwidLesson {slug, level, title, content, examples\[{surah, ayah, segments\[{text, ruleId?}\]}\], audioUrl?, quiz\[\]}
- Bookmark {type, refId, createdAt} · Settings {theme, lang, fontScale, qariId, prayerMethod, adhanPrefs, wakeLock, installDismissedAt}

## 12. Kebutuhan Non-Fungsional

- **Performa:** Lighthouse Mobile ≥ 90; JS awal kecil (code-splitting per rute, Leaflet dan player dimuat dinamis); font di-subset dan di-preload; gambar WebP/SVG.
- **Offline:** konten inti dan jadwal sholat tersedia offline setelah kunjungan pertama (service worker + IndexedDB).
- **Privasi:** lokasi hanya diproses di browser dan dikirim ke API publik sebatas koordinat; tanpa akun, tanpa pelacak iklan; sediakan kebijakan privasi dan banner izin hanya bila diperlukan.
- **Aksesibilitas:** semantik HTML, label ARIA, navigasi keyboard, kontras AA, ukuran font bisa diubah, warna tajwid selalu disertai label teks.
- **Keamanan:** HTTPS wajib, header keamanan dasar lewat .htaccess, validasi respons API, tidak menyimpan data sensitif, tidak ada secret di kode klien.
- **Browser:** dua versi terbaru Chrome, Edge, Firefox, Safari; Android 8+ (Chrome) dan iOS/iPadOS 16.4+ (Safari) untuk pengalaman PWA penuh (iOS lebih lama tetap bisa memakai situs dan memasang ke layar utama, tanpa notifikasi).
- **Keandalan:** error boundary, halaman 404 statis, state loading/kosong/error ramah di setiap halaman, retry dengan backoff.
- **Analitik:** opsional, ringan dan ramah privasi (mis. Plausible/Umami), tanpa data pribadi.

## 13. Deployment di Hosting cPanel

**Mode utama (wajib didukung):** Static Export. Berjalan di hosting cPanel apa pun, tanpa Node.js.

1. Persiapan data dan ikon: npm run fetch-data dan npm run generate-icons.
2. Build: npm run build → menghasilkan folder out/ (termasuk sw.js, manifest.webmanifest, offline.html).
3. Kompres isi out/ menjadi iqra.zip, unggah ke public\_html/ (atau subfolder/subdomain) lewat File Manager cPanel, lalu Extract.
4. Aktifkan AutoSSL untuk domain, lalu paksa HTTPS.
5. Taruh .htaccess di public\_html/ (contoh minimal):

```
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
ErrorDocument 404 /404.html
AddType application/manifest+json .webmanifest
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>
<FilesMatch "^(sw\.js|manifest\.webmanifest|offline\.html)$">
  Header set Cache-Control "no-cache"
</FilesMatch>
<Files "sw.js">
  Header set Service-Worker-Allowed "/"
</Files>
```

6. Jika situs di subfolder, atur basePath dan assetPrefix di next.config, serta scope, start\_url, dan path ikon di manifest.
7. Sertakan skrip npm run deploy:zip yang membuat iqra.zip otomatis, serta DEPLOY.md berisi langkah di atas.

**Mode alternatif (opsional, hanya bila hosting mendukung):** fitur Setup Node.js App cPanel dengan output: 'standalone'. Tidak boleh menjadi syarat agar aplikasi berfungsi.

**Pemeriksaan wajib sebelum rilis:** buka rute langsung (refresh di /quran/2/ tidak boleh 404), uji HTTPS, uji instal PWA di Android Chrome dan iOS Safari (perangkat nyata), uji notifikasi, uji mode offline, uji pembaruan service worker, uji safe-area di iPhone ber-notch.

## 14. Roadmap Pengerjaan

| Fase | Cakupan | Estimasi |
| --- | --- | --- |
| 0. Fondasi | Setup Next.js static export, TypeScript strict, Tailwind, token light/dark, ThemeProvider, komponen inti, layout responsif (bottom nav + sidebar), i18n, PWA dasar (manifest, ikon, service worker, offline.html, meta iOS) | 1–1,5 minggu |
| 1. Al-Qur'an | Skrip fetch-data, daftar surah, halaman baca statis, bookmark, terakhir dibaca | 2 minggu |
| 2. Audio qori | Player, Media Session, mini-player, cache audio opsional (Range request) | 1,5 minggu |
| 3. Jadwal sholat | Lokasi, jadwal, hitung mundur, pengingat adzan (web) | 2 minggu |
| 4. Hadits | Dataset chunk, daftar, detail, pencarian | 1,5 minggu |
| 5. Tajwid dan Kisah Nabi | Konten JSON, halaman belajar, kuis, tajwid berwarna | 2 minggu |
| 6. Masjid dan Kajian | Peta Leaflet/OSM, Overpass, YouTube embed + skrip PHP/cron | 1,5 minggu |
| 7. PWA penuh dan polesan | Alur instal Android dan panduan iOS, halaman /pasang/, update flow, wake lock, animasi, aksesibilitas, performa, SEO, QA di perangkat nyata, review konten | 2 minggu |
| 8. Rilis | DEPLOY.md, build produksi, upload cPanel, SSL, uji akhir | 1 minggu |

## 15. Risiko dan Mitigasi

- Pengingat adzan tidak bisa di latar belakang penuh pada hosting statis: komunikasikan batasan di UI, dorong pemasangan PWA, siapkan Web Push (VAPID + PHP + cron) di v1.1.
- iOS membatasi fitur PWA (tanpa dialog instal otomatis, notifikasi hanya untuk PWA terpasang, kuota penyimpanan, audio latar belakang kurang andal): sediakan panduan pasang, fallback, dan uji di perangkat iOS nyata.
- CORS/API pihak ketiga berubah atau tidak stabil: gunakan data statis hasil unduh, service layer dengan fallback, proxy PHP bila perlu.
- API key YouTube bocor/kuota habis: pakai skrip PHP + cron, batasi key per domain, cache agresif.
- Tidak ada API hadits resmi tunggal: dataset kitab induk terverifikasi, tampilkan sumber dan derajat, review ahli.
- Akurasi konten agama: semua konten ditinjau ustadz/pentashih; sediakan tombol "Laporkan kesalahan".
- Service worker salah konfigurasi menyebabkan konten usang: versi cache, UpdateToast, header no-cache untuk sw.js dan manifest.
- Static export membatasi fitur Next.js: patuhi Instruksi Wajib no. 7; jangan memakai fitur server.
- Ukuran dataset besar: chunking, lazy-load, kompresi gzip/brotli di server, cache service worker.
- Lisensi audio, font, dan dataset: verifikasi sebelum rilis dan cantumkan atribusi.

## 16. Definition of Done

Fitur selesai jika: (1) kriteria penerimaan terpenuhi, (2) benar di light dan dark mode, (3) tidak ada gradient (cek dengan pencarian gradient di seluruh src/, hasilnya harus nol) dan semua warna dari token, (4) responsif di 360 px, 768 px, dan 1280 px, (5) state loading, kosong, dan error tersedia, (6) lulus lint, type-check, dan test inti, (7) npm run build sukses menghasilkan out/ tanpa error, (8) sumber konten tercantum, (9) animasi halus dan menghormati reduced motion, (10) Lighthouse Mobile Performance ≥ 90 pada halaman terkait, (11) berfungsi saat dipasang sebagai PWA di Android dan iOS (Bagian 9.8).

## 17. Prompt Singkat untuk AI Coding Assistant

Bangun aplikasi web Iqra memakai Next.js (App Router, static export) + TypeScript + Tailwind sesuai PRD ini, agar bisa di-deploy ke hosting cPanel dan dipasang sebagai PWA di HP Android dan iOS. Mulai dari Fase 0 (token light/dark flat tanpa gradient, shadow tipis, komponen inti, layout responsif, PWA dasar termasuk manifest, ikon, service worker, dan meta iOS), lalu kerjakan fase berikutnya satu per satu. Jangan mengarang konten agama; ambil dari sumber yang tertera dan tampilkan referensinya. Jangan memakai fitur Next.js yang butuh server. Setelah tiap fase, laporkan hasil, asumsi, dan cara menjalankannya.
