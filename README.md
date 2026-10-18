# Iqra - Aplikasi Web & PWA Belajar Agama Islam

Aplikasi web progresif (PWA) Islami modern, cepat, bersih, dan bebas iklan yang dapat dipasang di layar utama Android & iOS (Safari) serta siap di-deploy ke hosting cPanel melalui **Static Export** (`output: 'export'`).

---

## 🕌 Fitur Utama
1. **Al-Qur'an Al-Karim:** 114 Surah, 30 Juz, Mushaf Standar Kemenag RI, terjemahan, dan audio tilawah qori.
2. **Belajar Hadits:** Hadits shahih dari Shahih Bukhari dan Shahih Muslim beserta perawi dan nomor hadits.
3. **Jadwal Sholat & Pengingat:** Waktu sholat akurat Kemenag, hitung mundur, audio adzan, dan fallback kalkulasi offline.
4. **Masjid Terdekat:** Peta interaktif OpenStreetMap (OSM) dan Overpass API radius fleksibel.
5. **Kajian YouTube:** Kurasi video ceramah ustadz terpopuler dengan pemutar resmi embed.
6. **Kisah 25 Nabi & Rasul:** Sirah nabawiyah dari Nabi Adam AS hingga Muhammad ﷺ dengan rujukan ayat & hikmah.
7. **Belajar Tajwid:** Kurikulum 5 level bertahap dengan visualisasi teks berwarna flat dan kuis interaktif.

---

## 🎨 Aturan Desain & Palet Warna Flat (Zero-Gradient)
Sesuai PRD Bagian 1 & 6, **DILARANG KERAS** menggunakan gradient (`linear-gradient`, `radial-gradient`, Tailwind `bg-gradient-*`, `from-*`, `to-*`). Semua warna merupakan solid flat colors dari CSS Variables:

### Light Mode
- `--background`: `#F6F4EE`
- `--surface`: `#FFFFFF`
- `--surface-alt`: `#EDEAE0`
- `--primary`: `#1E6B57` (Hijau Zamrud)
- `--accent`: `#B38B3A` (Emas Lembut)
- `--text-primary`: `#17302A`
- `--text-secondary`: `#5E726B`
- `--border`: `#E1DDD0`

### Dark Mode
- `--background`: `#0D1613` (Hijau-Hitam Tenang)
- `--surface`: `#15211D`
- `--surface-alt`: `#1D2C27`
- `--primary`: `#4FB596`
- `--accent`: `#D2AE5E`
- `--text-primary`: `#E9F0ED`
- `--text-secondary`: `#9DB0A9`
- `--border`: `#26362F`

---

## 📂 Struktur Folder
```
iqra/
  public/
    icons/               # Ikon PWA (192, 512, maskable, apple-touch 180, favicon)
    data/                # (Fase 1+) JSON statis Qur'an, hadits, tajwid, kisah nabi
    manifest.webmanifest # Web App Manifest PWA
    offline.html         # Fallback offline mandiri
    sw.js                # Service Worker runtime caching
  scripts/
    generate-icons.mjs   # Pembuat ikon PNG flat mandiri
  src/
    app/                 # Next.js App Router (Static Export)
      globals.css        # Design tokens CSS variables & utility classes
      layout.tsx         # Root layout dengan ThemeProvider & Service Worker register
      page.tsx           # Beranda
      quran/             # Al-Qur'an
      belajar/           # Hub Belajar (Hadits, Tajwid, Kisah Nabi)
      sholat/            # Jadwal Sholat
      masjid/            # Peta Masjid
      kajian/            # Kajian Video
      bookmark/          # Bookmark
      pasang/            # Panduan Pasang PWA
      pengaturan/        # Pengaturan Tema & Font
      tentang/           # Profil & Sumber Data Kemenag
      lainnya/           # Menu Lainnya
      not-found.tsx      # Halaman 404 statis
    components/
      layout/            # AppLayout, Sidebar (desktop), BottomNav (mobile), MobileHeader, ThemeToggle
      ui/                # Komponen UI inti (Button, Card, ListItem, Chip, SearchBar, Tabs, BottomSheet, Toast, Skeleton, EmptyState, ErrorState, SectionHeader, Switch, Slider, AudioMiniPlayer, InstallPrompt, IOSInstallGuide, UpdateToast, OfflineBanner)
      pwa/               # ServiceWorkerRegister
    theme/               # ThemeProvider, tokens.ts
    lib/                 # utils (cn), i18n
```

---

## 🚀 Menjalankan & Membangun Proyek

### 1. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka `http://localhost:3000` di peramban.

### 2. Memeriksa Format Kode & Tipe Data
```bash
npm run lint
npm run type-check
```

### 3. Memverifikasi Tidak Ada Gradient
```bash
npm run check-gradient
```

### 4. Membangun Static Export (Build)
```bash
npm run build
```
Hasil build statis akan disimpan di folder `out/`.

### 5. Membuat Arsip Deploy cPanel
```bash
npm run deploy:zip
```
Menghasilkan file `iqra.zip` yang siap di-upload ke `public_html/` hosting cPanel Anda.
