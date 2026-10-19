import {
  ShieldCheck,
  BookOpen,
  Clock,
  Compass,
  Calendar,
  Bookmark,
  GraduationCap,
  Users,
  MapPin,
  Tv,
  CheckCircle2,
  Lock,
  HeartHandshake,
  Sparkles,
  Scroll,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';

export default function TentangPage() {
  const verifiedSources = [
    {
      feature: "Al-Qur'an & Terjemahan",
      icon: BookOpen,
      source: "Kementerian Agama RI (Lajnah Pentashihan Mushaf Al-Qur'an - LPMQ)",
      badge: "Mushaf Standar RI",
      description:
        "Teks Arab menggunakan Rasm Utsmani Standar Indonesia yang telah ditashih secara resmi oleh Kemenag RI. Terjemahan bahasa Indonesia dan penjelasan ringkas bersumber langsung dari edisi penyempurnaan resmi Kemenag RI.",
      audioSource:
        "Audio murottal tilawah bersumber dari arsip audio qari internasional terverifikasi (Syaikh Mishary Rashid Alafasy, Syaikh Mahmoud Khalil Al-Husary, dan Syaikh Abdul Rahman As-Sudais).",
    },
    {
      feature: "Hadits Shahih",
      icon: Bookmark,
      source: "Kitab Induk Shahih Al-Bukhari & Shahih Muslim (Ash-Shahihain)",
      badge: "100% Shahih",
      description:
        "Koleksi hadits disaring ketat hanya dari dua kitab hadits paling shahih rujukan umat Islam sedunia. Setiap hadits dilengkapi nomor hadits standar, nama perawi (sanad), matan bahasa Arab asli, dan terjemahan resmi tanpa pemotongan makna.",
    },
    {
      feature: "Jadwal Sholat & Adzan",
      icon: Clock,
      source: "Kementerian Agama RI (Bimas Islam) & Algoritma Astronomis Resmi",
      badge: "Hisab Kemenag RI",
      description:
        "Perhitungan waktu sholat mengacu pada parameter resmi Kemenag RI (sudut Subuh 20°, sudut Isya 18°, serta koreksi waktu ihtiyath 2-3 menit). Dihitung berdasarkan koordinat garis lintang dan bujur lokasi perangkat Anda secara akurat.",
    },
    {
      feature: "Arah Kiblat",
      icon: Compass,
      source: "Perhitungan Trigonometri Bola (Great Circle Distance) ke Ka'bah",
      badge: "Koordinat Presisi",
      description:
        "Menghitung sudut azimuth langsung menuju Ka'bah di Masjidil Haram, Makkah Al-Mukarramah (21.4225° LU, 39.8262° BT). Sensor kompas membaca magnetometer perangkat secara real-time tanpa manipulasi.",
    },
    {
      feature: "Kalender Hijriah & Puasa Sunnah",
      icon: Calendar,
      source: "Sistem Penanggalan Umm al-Qura & Hadits Rujukan Puasa",
      badge: "Hisab Umm al-Qura",
      description:
        "Konversi penanggalan Hijriah menggunakan hisab Umm al-Qura yang diakui secara global. Panduan puasa sunnah (Senin-Kamis, Ayyamul Bidh, Asyura, Arafah, dsb.) disertai lafaz niat, terjemahan, dan dalil hadits shahih (HR. Muslim, Tirmidzi, An-Nasa'i).",
    },
    {
      feature: "Pusat Belajar Tajwid",
      icon: GraduationCap,
      source: "Kitab Matan Tuhfatul Athfal & Al-Muqaddimah Al-Jazariyyah",
      badge: "Rujukan Mu'tamad",
      description:
        "Materi hukum tajwid (Nun Sukun/Tanwin, Mim Sukun, Mad, Makharijul Huruf, dan Sifat Huruf) disusun mengacu pada kitab-kitab induk tajwid yang diajarkan di madrasah dan pesantren Ahlussunnah wal Jama'ah.",
    },
    {
      feature: "Sirah Nabawiyyah",
      icon: Scroll,
      source: "Kitab Ar-Rahiq Al-Makhtum (Syaikh Al-Mubarakfuri) & Shahihain",
      badge: "Induk Tarikh Shahih",
      description:
        "Kronologi 17 bab perjalanan hidup Rasulullah Muhammad ﷺ dari kelahiran di Tahun Gajah, masa muda Al-Amin, bi'tsah kenabian di Gua Hira, dakwah Makkah, hijrah Madinah, hingga wafatnya beliau. Merujuk pada kitab sirah pemenang penghargaan Liga Dunia Islam.",
    },
    {
      feature: "Kisah 25 Nabi & Rasul",
      icon: Users,
      source: "Al-Qur'an Al-Karim & Kitab Qashash Al-Anbiya' (Al-Hafizh Ibnu Katsir)",
      badge: "Bebas Israiliyyat",
      description:
        "Kisah 25 Nabi dan Rasul dirangkum murni dari nash ayat Al-Qur'an dan kitab tarikh karya Ibnu Katsir. Disaring ketat agar bebas dari riwayat israiliyyat yang bathil/munkar, serta mematuhi syariat untuk tidak menggambarkan ilustrasi wajah nabi.",
    },
    {
      feature: "Masjid Terdekat",
      icon: MapPin,
      source: "OpenStreetMap (OSM) & Overpass API Publik",
      badge: "Data Tempat Ibadah",
      description:
        "Pencarian masjid dan musholla memanfaatkan data geospasial publik tempat ibadah muslim (amenity=place_of_worship, religion=muslim). Titik koordinat hanya dihitung di perangkat Anda tanpa pernah dikirim atau disimpan ke server eksternal.",
    },
    {
      feature: "Kajian YouTube Terpilih",
      icon: Tv,
      source: "Kanal YouTube Resmi Asatidzah Ahlussunnah wal Jama'ah",
      badge: "Kanal Terverifikasi",
      description:
        "Menampilkan ceramah dari kanal YouTube resmi ustadz terpercaya di Indonesia (seperti Adi Hidayat Official, Khalid Basalamah Official, Firanda Andirja, Ustadz Abdul Somad Official, Buya Yahya/Al-Bahjah). Ditayangkan via pemutar resmi YouTube tanpa re-upload ilegal.",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Halaman */}
      <div className="border-b border-border pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
          Tentang Iqra &amp; Sumber Data Resmi
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-0.5">
          Komitmen integritas ilmiah, transparansi rujukan keagamaan, dan amanah syar'i
        </p>
      </div>

      {/* Pernyataan Amanah Keagamaan */}
      <Card className="p-6 sm:p-7 bg-surface border-border shadow-card rounded-card relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-pastel-green text-[#266308] border border-pastel-green/40 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-subtle">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-text-primary">
                Pernyataan Amanah &amp; Keaslian Sumber
              </h2>
              <Chip variant="primary" className="text-[10px] font-bold py-0.5 px-2.5">
                Dijamin Sahih &amp; Resmi
              </Chip>
            </div>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              <strong>Bismillahir Rahmanir Rahim.</strong> Kami memahami sepenuhnya bahwa aplikasi keagamaan menyangkut keselamatan aqidah dan ibadah umat, yang akan dipertanggungjawabkan di hadapan Allah ﷻ.
            </p>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Oleh karena itu, kami menegaskan dengan penuh amanah bahwa <strong>seluruh data di aplikasi Iqra TIDAK PERNAH dikarang, dipalsukan, atau dimanipulasi</strong>. Semua ayat Al-Qur'an, matan hadits, jadwal sholat, panduan puasa, dan materi belajar bersumber dari rujukan resmi Kementerian Agama RI, kitab induk hadits shahih, dan literatur ulama mu'tamad (terpercaya).
            </p>
          </div>
        </div>
      </Card>

      {/* Profil Singkat Aplikasi */}
      <Card className="p-6 bg-surface border-border shadow-card rounded-card">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-card bg-primary-gradient text-on-primary flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-subtle">
            <span className="font-arabic">اقرأ</span>
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-text-primary">
              Iqra · Belajar Agama Islam
            </h3>
            <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
              Iqra (artinya <em>"bacalah"</em>) adalah platform aplikasi web progresif (PWA) modern, bebas iklan, dan ramah privasi yang dirancang untuk menemani umat Islam dalam membaca Al-Qur'an, menuntut ilmu hadits, menjaga waktu sholat, dan mempelajari khazanah Islam setiap hari.
            </p>
            <div className="flex flex-wrap gap-2 mt-3.5">
              <Chip variant="secondary" className="text-[11px] font-bold">Bebas Iklan</Chip>
              <Chip variant="secondary" className="text-[11px] font-bold">Bisa Diakses Offline</Chip>
              <Chip variant="outline" className="text-[11px] font-bold">Data 100% Terverifikasi</Chip>
            </div>
          </div>
        </div>
      </Card>

      {/* Rincian Sumber Data per Fitur */}
      <div>
        <div className="mb-3.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>Rincian Sumber Data Setiap Fitur</span>
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Berikut adalah asal-usul dan dasar rujukan dari setiap fitur di aplikasi Iqra:
          </p>
        </div>

        <div className="space-y-3.5">
          {verifiedSources.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.feature} className="p-5 sm:p-6 bg-surface border-border shadow-card rounded-card space-y-2.5 hover:border-primary/40 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-pastel-green text-[#266308] border border-pastel-green/40 flex items-center justify-center flex-shrink-0 shadow-subtle">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-text-primary">
                      {item.feature}
                    </h4>
                  </div>
                  <Chip variant="secondary" className="text-[10px] font-bold py-0.5 px-2.5">
                    {item.badge}
                  </Chip>
                </div>

                <div className="text-xs space-y-2 pt-1">
                  <div>
                    <span className="font-bold text-text-primary">Sumber Utama: </span>
                    <span className="text-primary-text font-bold">{item.source}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                    {item.description}
                  </p>
                  {item.audioSource && (
                    <p className="text-xs text-text-muted leading-relaxed italic bg-surface-2 p-3 rounded-button border border-border">
                      {item.audioSource}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Komitmen Privasi & Independensi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <Card className="p-5 sm:p-6 bg-surface border-border shadow-card rounded-card space-y-2">
          <div className="flex items-center gap-2 text-text-primary">
            <Lock className="w-4 h-4 text-primary-text" />
            <h4 className="text-sm font-bold">Privasi Penuh &amp; Tanpa Pelacak</h4>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Iqra tidak mewajibkan pendaftaran akun, tidak mengumpulkan data pribadi, dan tidak memuat pelacak (tracker) pihak ketiga. Koordinat GPS Anda hanya diproses lokal di peramban untuk menghitung waktu sholat dan jarak masjid.
          </p>
        </Card>

        <Card className="p-5 sm:p-6 bg-surface border-border shadow-card rounded-card space-y-2">
          <div className="flex items-center gap-2 text-text-primary">
            <HeartHandshake className="w-4 h-4 text-primary-text" />
            <h4 className="text-sm font-bold">Koreksi &amp; Masukan Umat</h4>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Apabila Anda menemukan kekeliruan pengetikan (typo) atau ketidaksesuaian data pada ayat, hadits, atau jadwal sholat, kami sangat terbuka untuk menerima koreksi demi menjaga kemurnian dan kesahihan ilmu agama.
          </p>
        </Card>
      </div>
    </div>
  );
}
