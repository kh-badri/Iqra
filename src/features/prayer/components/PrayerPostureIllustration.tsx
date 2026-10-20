'use client';

import * as React from 'react';
import { ZoomIn, X, CheckCircle2 } from 'lucide-react';

export type PostureType =
  | 'qiyam'
  | 'takbir'
  | 'sedekap'
  | 'ruku'
  | 'itidal'
  | 'sujud'
  | 'iftirasy'
  | 'tasyahud'
  | 'salam';

interface PrayerPostureIllustrationProps {
  posture: PostureType;
  className?: string;
}

interface PostureMeta {
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  keyPoints: string[];
}

const POSTURE_METAS: Record<PostureType, PostureMeta> = {
  qiyam: {
    title: 'Niat & Qiyam (Berdiri Tegak)',
    badge: 'Fokus ke Titik Sujud',
    badgeColor: 'bg-emerald-500/90 text-white border-emerald-400/30',
    description:
      'Berdiri tegak lurus seimbang menghadap kiblat dengan pandangan mata tertunduk khusyuk ke tempat sujud.',
    keyPoints: [
      'Badan tegak lurus seimbang menghadap kiblat',
      'Kaki dibuka wajar selebar bahu',
      'Pandangan mata tertuju ke tempat sujud',
    ],
  },
  takbir: {
    title: 'Takbiratul Ihram',
    badge: 'Sejajar Telinga & Bahu',
    badgeColor: 'bg-amber-500/90 text-white border-amber-400/30',
    description:
      'Mengangkat kedua tangan hingga sejajar daun telinga atau bahu dengan telapak tangan terbuka menghadap kiblat.',
    keyPoints: [
      'Kedua tangan diangkat sejajar telinga/bahu',
      'Telapak tangan dibuka wajar menghadap kiblat',
      'Jari-jemari tidak terlalu rapat dan tidak terlalu renggang',
    ],
  },
  sedekap: {
    title: 'Sedekap (Tangan di Dada)',
    badge: 'Kanan Dekap Kiri di Dada',
    badgeColor: 'bg-emerald-600/90 text-white border-emerald-400/30',
    description:
      'Meletakkan tangan kanan di atas punggung telapak tangan, pergelangan, atau lengan kiri di atas dada/perut.',
    keyPoints: [
      'Tangan kanan menggenggam atau diletakkan di atas pergelangan kiri',
      'Diletakkan di atas dada atau sedikit di atas pusar',
      'Dada dan tubuh tetap tegap menghadap kiblat',
    ],
  },
  ruku: {
    title: 'Ruku\' Thuma\'ninah',
    badge: 'Punggung Rata & Genggam Lutut',
    badgeColor: 'bg-teal-600/90 text-white border-teal-400/30',
    description:
      'Membungkukkan badan dengan punggung rata horizontal sejajar dan kedua tangan mencengkeram lutut kuat-kuat.',
    keyPoints: [
      'Punggung dan kepala lurus mendatar',
      'Kedua telapak tangan mencengkeram lutut dengan jari merenggang',
      'Kedua siku diluruskan dan thuma\'ninah tenang',
    ],
  },
  itidal: {
    title: 'I\'tidal (Bangkit Tegak)',
    badge: 'Tegak Lurus Thuma\'ninah',
    badgeColor: 'bg-emerald-500/90 text-white border-emerald-400/30',
    description:
      'Bangkit berdiri tegak lurus sempurna dari ruku\' seraya membaca pujian tahmid dengan tenang tanpa terburu-buru.',
    keyPoints: [
      'Berdiri tegak hingga setiap ruas tulang kembali ke posisinya',
      'Kedua tangan lurus rileks di samping tubuh',
      'Thuma\'ninah sejenak sebelum turun sujud',
    ],
  },
  sujud: {
    title: 'Sujud Sempurna',
    badge: '7 Anggota Badan Menempel',
    badgeColor: 'bg-rose-500/90 text-white border-rose-400/30',
    description:
      'Meletakkan 7 anggota badan secara sempurna di atas sajadah dengan kerendahan hati mutlak di hadapan Allah SWT.',
    keyPoints: [
      '1. Dahi dan hidung menempel kuat di lantai/sajadah',
      '2-3. Kedua telapak tangan diletakkan sejajar bahu/telinga',
      '4-5. Kedua lutut menempel kokoh di sajadah',
      '6-7. Ujung jari-jemari kedua kaki ditekuk menghadap kiblat',
    ],
  },
  iftirasy: {
    title: 'Duduk Iftirasy (Antara 2 Sujud)',
    badge: 'Duduk di Atas Kaki Kiri',
    badgeColor: 'bg-amber-600/90 text-white border-amber-400/30',
    description:
      'Duduk tenang di atas telapak kaki kiri yang dihamparkan, sementara kaki kanan ditegakkan dengan jari menghadap kiblat.',
    keyPoints: [
      'Duduk di atas punggung telapak kaki kiri',
      'Telapak kaki kanan ditegakkan bertumpu pada jari-jari kaki',
      'Kedua telapak tangan diletakkan di atas paha/lutut',
    ],
  },
  tasyahud: {
    title: 'Tasyahud & Isyarat Tauhid',
    badge: 'Telunjuk di Atas Lutut',
    badgeColor: 'bg-emerald-600/90 text-white border-emerald-400/30',
    description:
      'Duduk bersimpuh dengan kedua tangan bertumpu di atas lutut. Jari telunjuk tangan kanan diacungkan di atas lutut ke arah kiblat sebagai persaksian tauhid kepada Allah SWT.',
    keyPoints: [
      'Tangan kiri dihamparkan tenang di atas lutut kiri',
      'Tangan kanan diletakkan bertumpu di atas paha/lutut kanan (tidak diangkat melayang)',
      'Jari telunjuk kanan diacungkan di atas lutut mengarah ke kiblat',
      'Pandangan mata tertuju pada isyarat jari telunjuk',
    ],
  },
  salam: {
    title: 'Salam Penutup Sholat',
    badge: 'Menoleh ke Kanan & Kiri',
    badgeColor: 'bg-blue-600/90 text-white border-blue-400/30',
    description:
      'Memalingkan wajah ke arah kanan hingga pipi terlihat dari belakang seraya mengucapkan salam rahmat.',
    keyPoints: [
      'Menoleh ke kanan hingga pipi putih terlihat dari belakang',
      'Mengucapkan salam dengan niat mengakhiri sholat dan mendoakan keselamatan',
      'Menoleh ke kiri dengan gerakan serupa',
    ],
  },
};

export function PrayerPostureIllustration({
  posture,
  className = '',
}: PrayerPostureIllustrationProps) {
  const [isZoomed, setIsZoomed] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const meta = POSTURE_METAS[posture] || POSTURE_METAS.qiyam;

  const imageSrcWebp = `/images/prayer/${posture}.webp?v=1.4.1`;
  const imageSrcJpg = `/images/prayer/${posture}.jpg?v=1.4.1`;

  return (
    <>
      <div
        className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-b from-surface-alt via-surface to-surface-alt border border-emerald-500/20 shadow-subtle group hover:border-emerald-500/50 hover:shadow-card transition-all cursor-pointer ${className}`}
        onClick={() => setIsZoomed(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsZoomed(true);
          }
        }}
        aria-label={`Lihat detail gerakan ${meta.title}`}
      >
        {/* Loading skeleton placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-surface-alt/80 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/40 border-t-emerald-500 animate-spin" />
          </div>
        )}

        {/* Modern 3D Muslim Character Image */}
        <picture>
          <source srcSet={imageSrcWebp} type="image/webp" />
          <img
            src={imageSrcJpg}
            alt={`Ilustrasi 3D Gerakan Sholat: ${meta.title}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </picture>

        {/* Ambient Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

        {/* Top-Right Zoom Button */}
        <div className="absolute top-2.5 right-2.5 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all pointer-events-none">
          <span className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xs">
            <ZoomIn className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Bottom Badge Info */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between gap-2 pointer-events-none">
          <span
            className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-pill backdrop-blur-md border shadow-xs tracking-tight ${meta.badgeColor}`}
          >
            {meta.badge}
          </span>
          <span className="text-[9px] font-semibold text-white/80 bg-black/40 px-2 py-0.5 rounded-pill backdrop-blur-sm">
            3D Karakter
          </span>
        </div>
      </div>

      {/* High-Resolution Zoom Lightbox Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative w-full max-w-lg bg-surface border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl space-y-0 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-surface-alt/60">
              <div>
                <h4 className="text-base font-bold text-text-primary tracking-tight">
                  {meta.title}
                </h4>
                <p className="text-xs text-primary font-medium mt-0.5">{meta.badge}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="w-8 h-8 rounded-full bg-surface-alt border border-border text-text-secondary hover:text-text-primary hover:bg-surface active:scale-95 transition-all flex items-center justify-center"
                aria-label="Tutup preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* High-Res Image View */}
            <div className="relative w-full aspect-[4/3] bg-black/40 overflow-hidden">
              <picture>
                <source srcSet={imageSrcWebp} type="image/webp" />
                <img
                  src={imageSrcJpg}
                  alt={meta.title}
                  className="w-full h-full object-cover object-center"
                />
              </picture>
            </div>

            {/* Posture Keypoints Checklist */}
            <div className="p-4 sm:p-5 space-y-3 bg-surface">
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                {meta.description}
              </p>
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider block">
                  Ketentuan Gerakan Sesuai Sunnah:
                </span>
                {meta.keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-text-secondary">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
