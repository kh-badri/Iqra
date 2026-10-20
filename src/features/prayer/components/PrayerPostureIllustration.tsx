'use client';

import * as React from 'react';

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

export function PrayerPostureIllustration({
  posture,
  className = '',
}: PrayerPostureIllustrationProps) {
  return (
    <div
      className={`relative w-full aspect-[4/3] max-h-64 sm:max-h-72 rounded-2xl bg-gradient-to-b from-emerald-500/10 via-surface-alt/60 to-surface border border-emerald-500/25 flex flex-col items-center justify-center p-3 sm:p-4 select-none overflow-hidden shadow-subtle group hover:border-emerald-500/40 transition-all ${className}`}
    >
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

      {/* SVG Cartoon Character Canvas */}
      <div className="relative w-full h-full max-w-[280px] max-h-[230px] flex items-center justify-center">
        {posture === 'qiyam' && <QiyamCartoonSvg />}
        {posture === 'takbir' && <TakbirCartoonSvg />}
        {posture === 'sedekap' && <SedekapCartoonSvg />}
        {posture === 'ruku' && <RukuCartoonSvg />}
        {posture === 'itidal' && <ItidalCartoonSvg />}
        {posture === 'sujud' && <SujudCartoonSvg />}
        {posture === 'iftirasy' && <IftirasyCartoonSvg />}
        {posture === 'tasyahud' && <TasyahudCartoonSvg />}
        {posture === 'salam' && <SalamCartoonSvg />}
      </div>
    </div>
  );
}

// Komponen Pembantu: Sajadah (Prayer Mat) Kartun Berwarna
interface PrayerMatProps {
  x?: number | string;
  y?: number | string;
  w?: number | string;
  h?: number | string;
}

function PrayerMatSvg({ x: rawX = 20, y: rawY = 170, w: rawW = 180, h: rawH = 30 }: PrayerMatProps) {
  const x = Number(rawX);
  const y = Number(rawY);
  const w = Number(rawW);
  const h = Number(rawH);
  return (
    <g id="prayer-mat">
      {/* Shadow */}
      <ellipse cx={x + w / 2} cy={y + h / 2 + 3} rx={w / 2 + 5} ry={h / 2 + 2} fill="#000000" fillOpacity="0.12" />
      {/* Mat Base (Rich Teal Emerald) */}
      <rect x={x} y={y} width={w} height={h} rx="8" fill="url(#matGrad)" stroke="#F59E0B" strokeWidth="1.5" />
      {/* Mihrab Arch Motif */}
      <path
        d={`M ${x + 25} ${y + h} L ${x + 25} ${y + 8} Q ${x + w / 2} ${y - 4} ${x + w - 25} ${y + 8} L ${x + w - 25} ${y + h}`}
        fill="#0D9488"
        fillOpacity="0.4"
        stroke="#FCD34D"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      {/* Golden Fringes on Ends */}
      <path d={`M ${x - 4} ${y + 5} L ${x} ${y + 5} M ${x - 4} ${y + 12} L ${x} ${y + 12} M ${x - 4} ${y + 19} L ${x} ${y + 19} M ${x - 4} ${y + 25} L ${x} ${y + 25}`} stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
      <path d={`M ${x + w} ${y + 5} L ${x + w + 4} ${y + 5} M ${x + w} ${y + 12} L ${x + w + 4} ${y + 12} M ${x + w} ${y + 19} L ${x + w + 4} ${y + 19} M ${x + w} ${y + 25} L ${x + w + 4} ${y + 25}`} stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

// Shared Gradients Defs
function CommonDefs() {
  return (
    <defs>
      <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <linearGradient id="kokoGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="pantsGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#E2E8F0" />
        <stop offset="100%" stopColor="#94A3B8" />
      </linearGradient>
      <linearGradient id="matGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#0F766E" />
        <stop offset="50%" stopColor="#115E59" />
        <stop offset="100%" stopColor="#0F766E" />
      </linearGradient>
      <linearGradient id="peciGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F1F5F9" />
      </linearGradient>
      <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.15" />
      </filter>
    </defs>
  );
}

// 1. Qiyam (Berdiri Tegak Menghadap Kiblat)
function QiyamCartoonSvg() {
  return (
    <svg viewBox="0 0 220 220" className="w-full h-full" fill="none">
      <CommonDefs />
      {/* Sajadah */}
      <PrayerMatSvg x="25" y="180" w="170" h="26" />

      {/* Sightline ray to prayer mat */}
      <path d="M 116 52 L 150 185" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
      <circle cx="150" cy="185" r="4" fill="#10B981" />
      <rect x="135" y="193" width="55" height="14" rx="7" fill="#10B981" />
      <text x="142" y="203" fontSize="8" fill="#FFFFFF" fontWeight="bold">Titik Sujud</text>

      {/* Shadow under feet */}
      <ellipse cx="110" cy="182" rx="24" ry="5" fill="#000000" fillOpacity="0.2" />

      {/* Feet with Sandals / Barefoot */}
      <ellipse cx="100" cy="182" rx="7" ry="4" fill="#F59E0B" />
      <ellipse cx="120" cy="182" rx="7" ry="4" fill="#F59E0B" />

      {/* Trousers (Celana Putih/Abu) */}
      <path d="M 94 135 L 98 180 L 105 180 L 109 145 L 113 145 L 116 180 L 124 180 L 128 135 Z" fill="url(#pantsGrad)" />

      {/* Baju Koko Emerald Green */}
      <path
        d="M 88 72 C 85 70, 78 78, 80 140 C 95 144, 125 144, 140 140 C 142 78, 135 70, 132 72 Z"
        fill="url(#kokoGrad)"
        filter="url(#shadowFilter)"
      />
      {/* Gold Center Placket & Buttons */}
      <line x1="110" y1="72" x2="110" y2="128" stroke="#F59E0B" strokeWidth="3" />
      <circle cx="110" cy="85" r="2" fill="#FEF08A" />
      <circle cx="110" cy="100" r="2" fill="#FEF08A" />
      <circle cx="110" cy="115" r="2" fill="#FEF08A" />

      {/* Arms resting naturally at side */}
      <path d="M 88 76 Q 80 100, 84 125" stroke="#047857" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="85" cy="128" rx="4.5" ry="5" fill="#F59E0B" />
      <path d="M 132 76 Q 140 100, 136 125" stroke="#047857" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="135" cy="128" rx="4.5" ry="5" fill="#F59E0B" />

      {/* Neck */}
      <rect x="105" y="60" width="10" height="14" rx="3" fill="#F59E0B" />

      {/* Cartoon Head & Face */}
      <ellipse cx="110" cy="46" rx="15" ry="16" fill="url(#skinGrad)" filter="url(#shadowFilter)" />
      {/* Peaceful Closed Eyes looking down */}
      <path d="M 103 48 Q 106 52, 109 48" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 113 48 Q 116 52, 119 48" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Gentle Smile */}
      <path d="M 108 55 Q 111 58, 114 55" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Cute Blush */}
      <circle cx="102" cy="51" r="2" fill="#F87171" fillOpacity="0.5" />
      <circle cx="119" cy="51" r="2" fill="#F87171" fillOpacity="0.5" />

      {/* White Songkok / Peci with Gold Trim */}
      <path d="M 94 40 C 94 28, 126 28, 126 40 Z" fill="url(#peciGrad)" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="94" y="38" width="32" height="4" rx="1.5" fill="#F59E0B" />
    </svg>
  );
}

// 2. Takbiratul Ihram (Mengangkat Tangan Sejajar Telinga/Bahu)
function TakbirCartoonSvg() {
  return (
    <svg viewBox="0 0 220 220" className="w-full h-full" fill="none">
      <CommonDefs />
      {/* Sajadah */}
      <PrayerMatSvg x="25" y="180" w="170" h="26" />

      {/* Height Indicator for Hands */}
      <line x1="45" y1="46" x2="175" y2="46" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />
      <rect x="58" y="18" width="104" height="16" rx="8" fill="#F59E0B" />
      <text x="65" y="29" fontSize="8.5" fill="#FFFFFF" fontWeight="bold">Sejajar Telinga &amp; Bahu</text>

      {/* Shadow */}
      <ellipse cx="110" cy="182" rx="24" ry="5" fill="#000000" fillOpacity="0.2" />

      {/* Feet */}
      <ellipse cx="100" cy="182" rx="7" ry="4" fill="#F59E0B" />
      <ellipse cx="120" cy="182" rx="7" ry="4" fill="#F59E0B" />

      {/* Trousers */}
      <path d="M 94 135 L 98 180 L 105 180 L 109 145 L 113 145 L 116 180 L 124 180 L 128 135 Z" fill="url(#pantsGrad)" />

      {/* Baju Koko */}
      <path
        d="M 88 72 C 85 70, 78 78, 80 140 C 95 144, 125 144, 140 140 C 142 78, 135 70, 132 72 Z"
        fill="url(#kokoGrad)"
        filter="url(#shadowFilter)"
      />
      <line x1="110" y1="72" x2="110" y2="128" stroke="#F59E0B" strokeWidth="3" />
      <circle cx="110" cy="88" r="2" fill="#FEF08A" />
      <circle cx="110" cy="106" r="2" fill="#FEF08A" />

      {/* Raised Arms with Open Palms Facing Forward */}
      {/* Left Arm (Viewer's Left) */}
      <path d="M 88 78 Q 65 72, 68 48" stroke="#047857" strokeWidth="9" strokeLinecap="round" />
      {/* Open Palm */}
      <ellipse cx="68" cy="42" rx="6" ry="8" fill="url(#skinGrad)" stroke="#D97706" strokeWidth="1" />
      <path d="M 64 36 L 64 42 M 67 35 L 67 42 M 70 36 L 70 42" stroke="#78350F" strokeWidth="1" strokeLinecap="round" />

      {/* Right Arm (Viewer's Right) */}
      <path d="M 132 78 Q 155 72, 152 48" stroke="#047857" strokeWidth="9" strokeLinecap="round" />
      {/* Open Palm */}
      <ellipse cx="152" cy="42" rx="6" ry="8" fill="url(#skinGrad)" stroke="#D97706" strokeWidth="1" />
      <path d="M 148 36 L 148 42 M 151 35 L 151 42 M 154 36 L 154 42" stroke="#78350F" strokeWidth="1" strokeLinecap="round" />

      {/* Neck */}
      <rect x="105" y="60" width="10" height="14" rx="3" fill="#F59E0B" />

      {/* Head */}
      <ellipse cx="110" cy="46" rx="15" ry="16" fill="url(#skinGrad)" filter="url(#shadowFilter)" />
      <path d="M 103 48 Q 106 52, 109 48" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 113 48 Q 116 52, 119 48" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 108 55 Q 111 58, 114 55" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* White & Gold Songkok */}
      <path d="M 94 40 C 94 28, 126 28, 126 40 Z" fill="url(#peciGrad)" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="94" y="38" width="32" height="4" rx="1.5" fill="#F59E0B" />
    </svg>
  );
}

// 3. Sedekap (Tangan Kanan Menggenggam Tangan Kiri di Dada)
function SedekapCartoonSvg() {
  return (
    <svg viewBox="0 0 220 220" className="w-full h-full" fill="none">
      <CommonDefs />
      {/* Sajadah */}
      <PrayerMatSvg x="25" y="180" w="170" h="26" />
      <ellipse cx="110" cy="182" rx="24" ry="5" fill="#000000" fillOpacity="0.2" />

      {/* Feet */}
      <ellipse cx="100" cy="182" rx="7" ry="4" fill="#F59E0B" />
      <ellipse cx="120" cy="182" rx="7" ry="4" fill="#F59E0B" />

      {/* Trousers */}
      <path d="M 94 135 L 98 180 L 105 180 L 109 145 L 113 145 L 116 180 L 124 180 L 128 135 Z" fill="url(#pantsGrad)" />

      {/* Baju Koko */}
      <path
        d="M 88 72 C 85 70, 78 78, 80 140 C 95 144, 125 144, 140 140 C 142 78, 135 70, 132 72 Z"
        fill="url(#kokoGrad)"
        filter="url(#shadowFilter)"
      />

      {/* Arms Crossed at Chest (Sedekap) */}
      <path d="M 88 76 Q 78 100, 102 102" stroke="#047857" strokeWidth="9" strokeLinecap="round" />
      <path d="M 132 76 Q 142 100, 118 102" stroke="#047857" strokeWidth="9" strokeLinecap="round" />

      {/* Hands Clasping on Chest Indicator */}
      <rect x="98" y="96" width="24" height="14" rx="6" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
      <rect x="68" y="116" width="84" height="15" rx="7.5" fill="#10B981" />
      <text x="75" y="127" fontSize="8" fill="#FFFFFF" fontWeight="bold">Kanan di Atas Kiri (Dada)</text>

      {/* Neck */}
      <rect x="105" y="60" width="10" height="14" rx="3" fill="#F59E0B" />

      {/* Head tilted peacefully downward */}
      <ellipse cx="110" cy="46" rx="15" ry="16" fill="url(#skinGrad)" filter="url(#shadowFilter)" />
      <path d="M 103 49 Q 106 53, 109 49" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 113 49 Q 116 53, 119 49" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 108 56 Q 111 59, 114 56" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Songkok */}
      <path d="M 94 40 C 94 28, 126 28, 126 40 Z" fill="url(#peciGrad)" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="94" y="38" width="32" height="4" rx="1.5" fill="#F59E0B" />
    </svg>
  );
}

// 4. Ruku' (Membungkuk 90 Derajat Punggung Datar Sempurna)
function RukuCartoonSvg() {
  return (
    <svg viewBox="0 0 240 180" className="w-full h-full" fill="none">
      <CommonDefs />
      {/* Sajadah */}
      <PrayerMatSvg x="20" y="150" w="200" h="24" />

      {/* Level 90 Degree Alignment Guide */}
      <line x1="55" y1="62" x2="190" y2="62" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" />
      <rect x="75" y="38" width="105" height="16" rx="8" fill="#10B981" />
      <text x="82" y="49" fontSize="8" fill="#FFFFFF" fontWeight="bold">Punggung Rata 90° (Lurus Datar)</text>

      {/* Shadow */}
      <ellipse cx="170" cy="155" rx="20" ry="4" fill="#000000" fillOpacity="0.2" />

      {/* Legs & Trousers (Standing upright at hip) */}
      <path d="M 160 70 L 165 152 L 178 152 L 182 70 Z" fill="url(#pantsGrad)" />
      <ellipse cx="170" cy="154" rx="8" ry="4" fill="#F59E0B" />

      {/* Horizontal Torso (Baju Koko Hijau) */}
      <path
        d="M 68 70 C 65 65, 80 58, 175 58 C 182 62, 175 88, 160 88 C 105 88, 72 82, 68 70 Z"
        fill="url(#kokoGrad)"
        filter="url(#shadowFilter)"
      />

      {/* Arms firmly gripping knees */}
      <path d="M 85 70 L 125 118" stroke="#047857" strokeWidth="10" strokeLinecap="round" />
      {/* Hands Cupping Knees Indicator */}
      <circle cx="125" cy="118" r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
      <rect x="90" y="128" width="80" height="14" rx="7" fill="#F59E0B" />
      <text x="96" y="138" fontSize="7.5" fill="#FFFFFF" fontWeight="bold">Mencengkeram Lutut</text>

      {/* Head Level with Spine (Not dipping, not lifting) */}
      <ellipse cx="56" cy="65" rx="14" ry="15" fill="url(#skinGrad)" filter="url(#shadowFilter)" />
      {/* Eye looking at prayer mat */}
      <path d="M 50 67 Q 53 71, 56 67" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Songkok */}
      <path d="M 52 52 C 44 54, 44 76, 52 78 Z" fill="url(#peciGrad)" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="52" y="52" width="3" height="26" rx="1" fill="#F59E0B" />
    </svg>
  );
}

// 5. I'tidal (Bangkit Tegak dari Ruku')
function ItidalCartoonSvg() {
  return (
    <svg viewBox="0 0 220 220" className="w-full h-full" fill="none">
      <CommonDefs />
      {/* Sajadah */}
      <PrayerMatSvg x="25" y="180" w="170" h="26" />
      <ellipse cx="110" cy="182" rx="24" ry="5" fill="#000000" fillOpacity="0.2" />

      {/* Feet */}
      <ellipse cx="100" cy="182" rx="7" ry="4" fill="#F59E0B" />
      <ellipse cx="120" cy="182" rx="7" ry="4" fill="#F59E0B" />

      {/* Trousers */}
      <path d="M 94 135 L 98 180 L 105 180 L 109 145 L 113 145 L 116 180 L 124 180 L 128 135 Z" fill="url(#pantsGrad)" />

      {/* Baju Koko */}
      <path
        d="M 88 72 C 85 70, 78 78, 80 140 C 95 144, 125 144, 140 140 C 142 78, 135 70, 132 72 Z"
        fill="url(#kokoGrad)"
        filter="url(#shadowFilter)"
      />
      <line x1="110" y1="72" x2="110" y2="128" stroke="#F59E0B" strokeWidth="3" />

      {/* Arms straight / peaceful */}
      <path d="M 88 76 Q 82 100, 84 125" stroke="#047857" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="85" cy="128" rx="4.5" ry="5" fill="#F59E0B" />
      <path d="M 132 76 Q 138 100, 136 125" stroke="#047857" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="135" cy="128" rx="4.5" ry="5" fill="#F59E0B" />

      {/* Balance Indicator */}
      <rect x="75" y="98" width="70" height="15" rx="7.5" fill="#10B981" />
      <text x="82" y="109" fontSize="8" fill="#FFFFFF" fontWeight="bold">Thuma&apos;ninah Tenang</text>

      {/* Neck */}
      <rect x="105" y="60" width="10" height="14" rx="3" fill="#F59E0B" />

      {/* Head */}
      <ellipse cx="110" cy="46" rx="15" ry="16" fill="url(#skinGrad)" filter="url(#shadowFilter)" />
      <path d="M 103 48 Q 106 52, 109 48" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 113 48 Q 116 52, 119 48" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 108 55 Q 111 58, 114 55" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Songkok */}
      <path d="M 94 40 C 94 28, 126 28, 126 40 Z" fill="url(#peciGrad)" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="94" y="38" width="32" height="4" rx="1.5" fill="#F59E0B" />
    </svg>
  );
}

// 6. Sujud (7 Anggota Badan Menempel Sempurna pada Sajadah)
function SujudCartoonSvg() {
  return (
    <svg viewBox="0 0 250 170" className="w-full h-full" fill="none">
      <CommonDefs />
      {/* Sajadah */}
      <PrayerMatSvg x="15" y="135" w="220" h="26" />

      {/* 7 Contact Points Badges Callout */}
      <rect x="70" y="15" width="110" height="17" rx="8.5" fill="#EF4444" />
      <text x="77" y="27" fontSize="8" fill="#FFFFFF" fontWeight="bold">7 Titik Sujud Menyentuh Lantai</text>

      {/* Sujud Figure */}
      {/* 1. Forehead & Nose on mat */}
      <ellipse cx="58" cy="126" rx="13" ry="14" fill="url(#skinGrad)" />
      {/* White Songkok on mat */}
      <path d="M 52 114 C 44 116, 44 136, 52 138 Z" fill="url(#peciGrad)" stroke="#E2E8F0" strokeWidth="1" />
      <circle cx="52" cy="138" r="4.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
      <text x="25" y="108" fontSize="7" fill="#EF4444" fontWeight="bold">1. Dahi &amp; Hidung</text>

      {/* 2 & 3. Hands / Palms beside head on mat */}
      <path d="M 75 105 Q 88 95, 78 135" stroke="#047857" strokeWidth="9" strokeLinecap="round" />
      <circle cx="78" cy="138" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
      <text x="65" y="156" fontSize="7" fill="#10B981" fontWeight="bold">2-3. Telapak</text>

      {/* Raised Back & Torso (Baju Koko Hijau terangkat tinggi) */}
      <path
        d="M 68 110 C 72 90, 130 55, 155 90 C 158 100, 155 125, 150 135 C 130 135, 75 125, 68 110 Z"
        fill="url(#kokoGrad)"
        filter="url(#shadowFilter)"
      />

      {/* 4 & 5. Knees on mat */}
      <path d="M 155 90 L 165 135" stroke="#94A3B8" strokeWidth="10" strokeLinecap="round" />
      <circle cx="165" cy="138" r="4.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
      <text x="145" y="156" fontSize="7" fill="#F59E0B" fontWeight="bold">4-5. Lutut</text>

      {/* 6 & 7. Feet with curled toes touching floor */}
      <path d="M 165 135 L 205 130" stroke="#CBD5E1" strokeWidth="8" strokeLinecap="round" />
      <circle cx="205" cy="138" r="4.5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
      <text x="190" y="118" fontSize="7" fill="#3B82F6" fontWeight="bold">6-7. Jari Kaki</text>
    </svg>
  );
}

// 7. Duduk Iftirasy (Duduk di Antara Dua Sujud)
function IftirasyCartoonSvg() {
  return (
    <svg viewBox="0 0 220 200" className="w-full h-full" fill="none">
      <CommonDefs />
      {/* Sajadah */}
      <PrayerMatSvg x="25" y="165" w="170" h="25" />
      <ellipse cx="110" cy="168" rx="28" ry="6" fill="#000000" fillOpacity="0.2" />

      {/* Sitting Body (Baju Koko & Trousers) */}
      <path d="M 85 120 L 70 166 L 150 166 L 140 120 Z" fill="url(#pantsGrad)" />

      {/* Upright Right Foot Indicator */}
      <path d="M 145 166 L 152 148 L 152 168" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
      <circle cx="152" cy="168" r="4" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
      <rect x="95" y="178" width="95" height="15" rx="7.5" fill="#F59E0B" />
      <text x="101" y="189" fontSize="7.5" fill="#FFFFFF" fontWeight="bold">Kaki Kanan Ditegakkan</text>

      {/* Torso */}
      <path
        d="M 90 75 C 86 72, 80 82, 82 135 C 95 138, 125 138, 138 135 C 140 82, 134 72, 130 75 Z"
        fill="url(#kokoGrad)"
        filter="url(#shadowFilter)"
      />
      <line x1="110" y1="75" x2="110" y2="128" stroke="#F59E0B" strokeWidth="3" />

      {/* Arms resting on thighs near knees */}
      <path d="M 90 80 Q 75 110, 88 128" stroke="#047857" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="88" cy="130" rx="5" ry="6" fill="#F59E0B" />

      <path d="M 130 80 Q 145 110, 132 128" stroke="#047857" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="132" cy="130" rx="5" ry="6" fill="#F59E0B" />

      {/* Neck */}
      <rect x="105" y="62" width="10" height="14" rx="3" fill="#F59E0B" />

      {/* Head */}
      <ellipse cx="110" cy="48" rx="15" ry="16" fill="url(#skinGrad)" filter="url(#shadowFilter)" />
      <path d="M 103 50 Q 106 54, 109 50" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 113 50 Q 116 54, 119 50" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 108 57 Q 111 60, 114 57" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* White Songkok */}
      <path d="M 94 42 C 94 30, 126 30, 126 42 Z" fill="url(#peciGrad)" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="94" y="40" width="32" height="4" rx="1.5" fill="#F59E0B" />
    </svg>
  );
}

// 8. Tasyahud (Duduk & Jari Telunjuk Menunjuk Tegak)
function TasyahudCartoonSvg() {
  return (
    <svg viewBox="0 0 220 200" className="w-full h-full" fill="none">
      <CommonDefs />
      {/* Sajadah */}
      <PrayerMatSvg x="25" y="165" w="170" h="25" />
      <ellipse cx="110" cy="168" rx="28" ry="6" fill="#000000" fillOpacity="0.2" />

      {/* Legs & Trousers */}
      <path d="M 85 120 L 70 166 L 150 166 L 140 120 Z" fill="url(#pantsGrad)" />

      {/* Torso */}
      <path
        d="M 90 75 C 86 72, 80 82, 82 135 C 95 138, 125 138, 138 135 C 140 82, 134 72, 130 75 Z"
        fill="url(#kokoGrad)"
        filter="url(#shadowFilter)"
      />
      <line x1="110" y1="75" x2="110" y2="128" stroke="#F59E0B" strokeWidth="3" />

      {/* Left Hand Flat on Knee */}
      <path d="M 90 80 Q 75 110, 85 128" stroke="#047857" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="85" cy="130" rx="5" ry="6" fill="#F59E0B" />

      {/* Right Hand with Extended Index Finger (Isyarat Telunjuk) */}
      <path d="M 130 80 Q 142 105, 128 126" stroke="#047857" strokeWidth="9" strokeLinecap="round" />
      {/* Extended Finger Glowing */}
      <path d="M 128 126 L 142 118" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
      <circle cx="142" cy="118" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
      <rect x="75" y="142" width="105" height="15" rx="7.5" fill="#10B981" />
      <text x="82" y="153" fontSize="8" fill="#FFFFFF" fontWeight="bold">Isyarat Telunjuk Tauhid</text>

      {/* Neck */}
      <rect x="105" y="62" width="10" height="14" rx="3" fill="#F59E0B" />

      {/* Head with eyes focused on the Index finger */}
      <ellipse cx="110" cy="48" rx="15" ry="16" fill="url(#skinGrad)" filter="url(#shadowFilter)" />
      {/* Eye gazing toward the right finger */}
      <path d="M 105 51 Q 108 55, 111 51" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="110" cy="52" r="1.5" fill="#78350F" />
      <path d="M 115 50 Q 118 54, 121 50" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="120" cy="51" r="1.5" fill="#78350F" />

      {/* Songkok */}
      <path d="M 94 42 C 94 30, 126 30, 126 42 Z" fill="url(#peciGrad)" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="94" y="40" width="32" height="4" rx="1.5" fill="#F59E0B" />
    </svg>
  );
}

// 9. Salam (Menolehkan Kepala ke Kanan)
function SalamCartoonSvg() {
  return (
    <svg viewBox="0 0 220 200" className="w-full h-full" fill="none">
      <CommonDefs />
      {/* Sajadah */}
      <PrayerMatSvg x="25" y="165" w="170" h="25" />
      <ellipse cx="110" cy="168" rx="28" ry="6" fill="#000000" fillOpacity="0.2" />

      {/* Turn Arrow Callout */}
      <path d="M 115 28 C 128 24, 145 28, 155 38" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 156 34 L 156 40 L 150 40" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="80" y="8" width="98" height="15" rx="7.5" fill="#F59E0B" />
      <text x="86" y="19" fontSize="8" fill="#FFFFFF" fontWeight="bold">Menoleh Hingga Pipi Terlihat</text>

      {/* Legs & Trousers */}
      <path d="M 85 120 L 70 166 L 150 166 L 140 120 Z" fill="url(#pantsGrad)" />

      {/* Torso stays facing forward */}
      <path
        d="M 90 75 C 86 72, 80 82, 82 135 C 95 138, 125 138, 138 135 C 140 82, 134 72, 130 75 Z"
        fill="url(#kokoGrad)"
        filter="url(#shadowFilter)"
      />
      <line x1="110" y1="75" x2="110" y2="128" stroke="#F59E0B" strokeWidth="3" />

      {/* Hands on knees */}
      <path d="M 90 80 Q 75 110, 88 128" stroke="#047857" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="88" cy="130" rx="5" ry="6" fill="#F59E0B" />
      <path d="M 130 80 Q 145 110, 132 128" stroke="#047857" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="132" cy="130" rx="5" ry="6" fill="#F59E0B" />

      {/* Neck */}
      <rect x="105" y="62" width="10" height="14" rx="3" fill="#F59E0B" />

      {/* Head Turned to the Right Side (Profile View) */}
      <ellipse cx="118" cy="48" rx="16" ry="16" fill="url(#skinGrad)" filter="url(#shadowFilter)" />
      {/* Side Profile Smile & Eye */}
      <path d="M 123 48 Q 127 52, 131 48" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 125 56 Q 128 59, 132 56" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="126" cy="52" r="2" fill="#F87171" fillOpacity="0.5" />

      {/* Songkok turned */}
      <path d="M 102 42 C 102 30, 132 30, 132 42 Z" fill="url(#peciGrad)" stroke="#E2E8F0" strokeWidth="1" />
      <rect x="102" y="40" width="30" height="4" rx="1.5" fill="#F59E0B" />
    </svg>
  );
}
