# Asumsi Teknis & Keputusan Desain Iqra (ASSUMPTIONS.md)

Dokumen ini mencatat keputusan dan asumsi yang diambil selama pengembangan aplikasi web/PWA **Iqra** agar sesuai dengan batasan teknis PRD v1.0 dan hosting static export cPanel.

---

### 1. Struktur Folder Kerja & File PRD
- **Asumsi:** Direktori aktif `C:\laragon\www\iqra` diperlakukan sebagai root project aplikasi (`iqra/`), di mana file `package.json`, `src/`, `public/`, dan `scripts/` akan ditempatkan langsung di dalamnya.
- **File PRD:** `PRD_Iqra.md` yang berada di root direktori diperlakukan sebagai `iqra/PRD.md` yang dimaksud dalam instruksi.

### 2. PWA & Service Worker pada Static Export
- **Pilihan Tool:** Menggunakan `@serwist/next` (atau Serwist build integration) yang dikonfigurasi untuk menghasilkan `sw.js` ke folder statis `public/` atau direktori build `out/` tanpa membutuhkan runtime server Node.js.
- **Cache Strategy:** Menghormati header `no-cache` untuk `sw.js` dan `manifest.webmanifest`. Runtime caching mengikuti spesifikasi Bagian 9.5 PRD (app shell precache, stale-while-revalidate untuk JSON, cache-first untuk aset statis berversi).

### 3. Arsitektur Data-First Statis (Offline-First)
- **Data Al-Qur'an, Hadits, Kisah Nabi, Tajwid:** Diunduh atau dikompilasi via skrip ke file JSON statis di `public/data/` saat fase pengerjaan masing-masing, sehingga client membaca langsung file JSON statis lokal tanpa ketergantungan runtime ke server eksternal jika offline.
- **Streaming Audio:** URL audio qori dialirkan langsung dari CDN publik resmi (mis. sumber Kemenag/EveryAyah) tanpa di-host di cPanel untuk menghemat kapasitas dan bandwidth hosting.

### 4. Jadwal Sholat & Geolocation
- **API Sholat:** Menggunakan API publik terverifikasi (Kemenag / MyQuran / Aladhan kalkulasi Kemenag) saat online, di-cache 30 hari ke IndexedDB via Dexie.
- **Fallback Offline Sholat:** Menggunakan library `adhan` (adhan-js) dengan parameter Kemenag Indonesia (Fajr 20°, Isha 18° + koreksi waktu sholat/ihtiyath).

### 5. Peta Masjid & Video Kajian
- **Peta Masjid:** Menggunakan OpenStreetMap + Leaflet (dimuat secara dinamis dengan SSR disabled / dynamic import), query Overpass API gratis untuk `amenity=place_of_worship` dan `religion=muslim`.
- **Kajian Video:** Embed resmi YouTube (iframe `youtube-nocookie.com`, atribut `playsinline`). Kurasi channel disimpan di `public/data/channels.json`.

### 6. Keputusan Teknis Fase 0 (Fondasi)
- **Zero-Gradient Enforcement:** Dibuat script `npm run check-gradient` yang memeriksa seluruh file di `src/` untuk memastikan tidak ada class atau style gradient.
- **Service Worker Standalone:** `public/sw.js` ditulis secara mandiri dan diekspor langsung ke root `out/sw.js` agar stabil tanpa ketergantungan pada runtime server Next.js.
- **Generator Ikon PWA:** Dibuat script `scripts/generate-icons.mjs` untuk menghasilkan icon 192, 512, maskable, apple-touch, dan favicon format PNG flat murni.
- **Konfigurasi cPanel .htaccess:** Disertakan di `public/.htaccess` agar otomatis masuk ke `out/.htaccess` saat build dan terkompresi ke `iqra.zip`.

### 7. Keputusan Teknis Fase 1 (Al-Qur'an)
- **Dataset Statis Kemenag:** Mengunduh 114 surah lengkap via `scripts/fetch-quran.mjs` bersumber standar Kementerian Agama RI. Data disimpan per surah di `public/data/quran/surah-{n}.json` (114 file) + `surahs.json` + `juz.json`.
- **Pre-rendering SSG 114 Surah:** Halaman `/quran/[number]/` menggunakan `generateStaticParams` dan `dynamicParams = false` sehingga 114 halaman ter-generate penuh ke `out/quran/{n}/index.html` saat build.
- **IndexedDB untuk Bookmark & Terakhir Dibaca:** Menggunakan Dexie `db.bookmarks` dan `db.lastRead`. Terakhir dibaca diperbarui otomatis saat membuka surah dan ditampilkan di kartu Beranda (`/`).
- **Nomor Ayat Lingkaran Emas:** Sesuai PRD Bagian 8 Fitur 1, nomor ayat ditampilkan dengan badge lingkaran beraksen token emas (`border-accent bg-accent/10 text-accent`).
- **Aturan Basmalah:** Surah 9 (At-Taubah) tidak diawali Basmalah; pada Surah 1 (Al-Fatihah), Basmalah telah menjadi ayat 1. Pada surah lainnya (2-8, 10-114), teks Basmalah diletakkan di hero card surah sebelum ayat 1.

### 8. Keputusan Teknis Fase 2 (Audio Qori)
- **6 Qori Populer:** Menyediakan pilihan 6 qori populer dari CDN resmi (`05` Misyari Rasyid Al-Afasi sebagai default, `03` Abdurrahman As-Sudais, `01` Abdullah Al-Juhany, `02` Abdul-Muhsin Al-Qasim, `04` Ibrahim Al-Dossari, dan `06` Yasser Al-Dosari).
- **Zustand Global State & Persistent Mini-Player:** Status pemutar dikelola via `useAudioPlayer`. Mini-player tetap mengambang di atas navigasi saat pengguna berpindah halaman tanpa terputus.
- **Media Session API:** Sinkronisasi judul surah, nomor ayat, qori, dan artwork ke lockscreen HP, notifikasi media Android/iOS, dan kontrol headphone.
- **Auto-Scroll & Ayat Highlight:** Ayat yang sedang diputar di-highlight dengan latar `bg-primary-soft/60` dan auto-scroll otomatis ke tengah layar.
- **Cache Audio Offline & Range Request:** Disediakan tombol simpan audio per surah via Cache Storage API. Service Worker `public/sw.js` dilengkapi handler HTTP 206 Partial Content (Range request) agar audio offline dapat di-seek di iOS Safari.

### 9. Keputusan Teknis Fase 3 (Jadwal Sholat & Pengingat)
- **Metode Perhitungan Kemenag RI:** Menggunakan library `adhan` dengan parameter astronomis Kemenag Indonesia: Subuh 20°, Isya 18°, dan penambahan koreksi ihtiyath +2 menit. Waktu Imsak ditetapkan 10 menit sebelum Subuh.
- **Akurasi & Offline-First:** Perhitungan dilakukan di sisi klien sehingga tidak bergantung pada server luar saat offline. Jadwal 30 hari otomatis disinkronisasi ke tabel `prayerDays` di Dexie IndexedDB.
- **Transparansi Pengingat Web:** Batasan background browser di hosting statis dijelaskan secara jujur di UI; pengguna diarahkan memasang PWA agar pengingat berjalan optimal.
- **Dukungan Khusus iOS Safari:** Mengikuti aturan PRD, di iPhone/iPad notifikasi web hanya ditawarkan bila aplikasi telah dibuka dalam mode standalone (iOS 16.4+), dengan tautan ke panduan pasang.
- **Sintesis Audio Pengingat:** Menggunakan Web Audio API oscillator (chime 440 Hz) mandiri tanpa perlu aset MP3 eksternal besar.
- **Arah Kiblat:** Dihitung otomatis menggunakan fungsi `Qibla()` dari koordinat lokasi aktif.

### 10. Keputusan Teknis Fase 4 (Belajar Hadits)
- **Dataset Chunk 100 Hadits:** Mengunduh hadits dari kitab induk Shahih Bukhari dan Shahih Muslim, dibagi per chunk 100 hadits di `public/data/hadith/{kitab}/chunk-{n}.json` untuk efisiensi transfer data dan cache offline.
- **Jaminan Derajat Shahih:** Seluruh hadits yang disajikan memiliki nomor resmi dan perawi sanad awal yang jelas tanpa menampilkan hadits non-shahih di MVP.
- **Halaman Klien Query String:** Menggunakan rute klien `/hadits/baca/?kitab={kitab}&no={no}` sesuai kaidah PRD Bagian 5 untuk membaca hadits spesifik tanpa perlu membuat ribuan halaman statis.
- **Hadits Harian Deterministik:** Dibuat kurasi 30 hadits shahih di `public/data/hadith/daily.json` yang tampil bergantian setiap hari di Beranda berdasarkan tanggal kalender.

### 11. Keputusan Teknis Fase 5 (Tajwid Interaktif & Kisah 25 Nabi)
- **Dataset 25 Nabi & Rasul Lengkap:** Data 25 nabi disusun kronologis dari Nabi Adam AS hingga Nabi Muhammad ﷺ di `public/data/prophets.json` berdasarkan rujukan mu'tabar (*Qashashul Anbiya'* Ibnu Katsir, Tafsir Kemenag RI, dan *Ar-Rahiqul Makhtum*).
- **Larangan Rupa Nabi:** Menghormati syariat secara mutlak dengan tidak menampilkan rupa atau gambar wajah nabi; visualisasi menggunakan badge nomor emas flat dan tipografi nama Arab (font Amiri).
- **Struktur Halaman Kisah Nabi:** Setiap halaman `/kisah-nabi/[slug]/` menyajikan 4 babak terstruktur (Penciptaan/Latar Belakang, Dakwah Tauhid, Ujian/Mukjizat, Keteladanan), referensi ayat Al-Qur'an yang tertaut langsung ke halaman surah, kotak Hikmah di akhir, estimasi waktu baca, navigasi nabi sebelumnya/sesudahnya, serta sumber referensi otentik.
- **Kurikulum Tajwid 5 Level:** Disusun 22 materi terstruktur dalam 5 level standar Mushaf Kemenag RI di `public/data/tajwid/` (Makharijul Huruf, Nun Sukun & Tanwin, Mim Sukun, Mad, serta Qalqalah/Waqaf).
- **Pewarnaan Tajwid Flat & Aksesibel:** Menggunakan token warna flat tanpa gradient yang konsisten dan kontras tinggi di Light Mode maupun Dark Mode, senantiasa disertai teks nama hukum untuk aksesibilitas.
- **Audio Contoh Tajwid:** Dilengkapi pemutar nada isyarat Web Audio API mandiri yang berjalan offline tanpa memerlukan dependensi file audio eksternal besar.
- **Latihan Kuis & IndexedDB:** Setiap materi memiliki 3-5 kuis pilihan ganda dengan pembahasan seketika. Skor kuis dan status kelulusan tersimpan di tabel `tajwidProgress` Dexie IndexedDB.
- **SSG Pra-render Statis Penuh:** Seluruh 25 rute kisah nabi dan 22 rute materi tajwid di-render penuh saat build (`generateStaticParams`, `dynamicParams = false`), menghasilkan 181 halaman HTML statis tanpa server runtime.

### 12. Keputusan Teknis Fase 6 (Masjid Terdekat & Kajian YouTube)
- **Peta Leaflet Tanpa SSR:** Komponen peta dimuat secara dinamis (`next/dynamic` dengan `ssr: false`) agar kompatibel 100% dengan static export Next.js tanpa error referensi `window`/`document`.
- **Penanda Peta Flat Murni:** Semua pin lokasi pengguna dan masjid menggunakan Leaflet `divIcon` berbasis HTML/CSS dengan warna flat dari token Iqra (hijau `#1E6B57` dan aksen emas `#B38B3A`) tanpa gradient atau glow.
- **Overpass API & Multi-Mirror:** Query data masjid dilakukan ke server Overpass API dengan batas waktu (timeout 20 detik) dan fallback mirror jika server utama sibuk.
- **Pencarian Kota Manual Nominatim:** Disediakan pencarian kota manual menggunakan Nominatim OpenStreetMap sebagai alternatif ramah privasi bila pengguna menolak izin GPS browser.
- **Cache 24 Jam di Dexie IndexedDB:** Data masjid di-cache per area koordinat selama 24 jam di tabel `cachedMosques` untuk mempercepat pemuatan dan mengurangi beban request ke server OpenStreetMap.
- **Petunjuk Arah Eksternal:** Tombol "Petunjuk Arah" membuka navigasi langsung ke Google Maps (`target="_blank" rel="noopener noreferrer"`) tanpa memerlukan Google Maps SDK berbayar.
- **Kajian Video YouTube Terkurasi:** Menghimpun channel resmi ustadz populer dan ceramah terverifikasi di `public/data/channels.json`.
- **Embed Aman & Ramah Privasi:** Memutar video melalui domain `youtube-nocookie.com` dengan atribut `playsinline=1` dan rasio responsif 16:9.
- **Notifikasi Mode Offline:** Bila `navigator.onLine` mendeteksi perangkat offline, ditampilkan kartu peringatan informatif beserta pintasan ke fitur Al-Qur'an dan Hadits yang offline-first.

### 13. Keputusan Teknis Fase 7 (PWA Penuh & Polesan)
- **Screenshot PWA Kaya (Rich Install Dialog):** Dibuat 3 screenshot flat beresolusi tinggi (2 ponsel format `narrow` 540x960 dan 1 desktop format `wide` 1280x720) di `public/screenshots/` via script Node murni `scripts/generate-screenshots.mjs` dan didaftarkan ke `public/manifest.webmanifest` agar dialog instalasi Android tampil kaya.
- **Pintasan Cepat (PWA Shortcuts):** Didaftarkan 3 shortcut di `manifest.webmanifest` untuk Al-Qur'an (`/quran/`), Jadwal Sholat (`/sholat/`), dan Lanjut Membaca (`/quran/?lanjut=1`).
- **Penanganan Otomatis "Lanjut Membaca":** Rute `/quran/?lanjut=1` secara otomatis membaca data ayat terakhir dibaca dari Dexie IndexedDB (`db.lastRead`) dan mengalihkan pembaca langsung ke surah dan nomor ayat terkait tanpa jeda.
- **Pengalaman Pemasangan Multi-Platform:**
  - **Android:** Mengintersepsi event `beforeinstallprompt`, menampilkan kartu ajakan ramah setelah kunjungan, menghormati penolakan selama 14 hari via `localStorage`, dan merayakan keberhasilan instalasi melalui event `appinstalled`.
  - **iOS Safari:** Mendeteksi lingkungan Safari non-standalone dan menyediakan `IOSInstallGuide` modal langkah bergambar flat (Bagikan → Tambah ke Layar Utama → Tambah) sesuai pedoman PRD Bagian 9.3.
- **Screen Wake Lock API:** Mengimplementasikan helper dan custom hook `useWakeLock` (`src/lib/wakeLock.ts`) yang menjaga layar HP tetap menyala saat membaca Al-Qur'an atau mendengarkan audio tilawah, dengan re-akuisisi otomatis saat tab kembali aktif (`visibilitychange`) serta sakelar pengaturan tersimpan di `localStorage`.
- **Status Memori & Penyimpanan Persisten:** Halaman Pengaturan menyediakan pemantauan kuota penyimpanan perangkat (`navigator.storage.estimate()`) dan tombol permintaan penyimpanan persisten (`navigator.storage.persist()`) untuk mencegah browser membersihkan cache secara sepihak.
- **Pencadangan & Pemindahan Bookmark (JSON):** Menyediakan fitur Ekspor dan Impor JSON untuk bookmark di `BookmarkView.tsx` dan `PengaturanPage` sehingga pengguna dapat memindahkan ayat/hadits tersimpan ke perangkat lain tanpa perlu mendaftar akun atau bergantung pada cloud.
- **Pencarian Global Instan (Ctrl+K):** Dibuat modal pencarian global (`GlobalSearchModal.tsx`) yang mengindeks 165 entri (114 Surah, 25 Kisah Nabi, 22 Materi Tajwid, dan Hadits Kitab Induk) dengan navigasi keyboard (`↑`, `↓`, `Enter`, `ESC`), tombol pintas di Mobile Header dan Sidebar, serta kecepatan pencarian instan tanpa latensi jaringan.
- **SEO & Sitemaps Otomatis:** Script `scripts/generate-sitemap.mjs` otomatis dijalankan sebelum proses build (`npm run build`), menghasilkan `public/sitemap.xml` berisi 177 URL kanonikal beserta `public/robots.txt`.

