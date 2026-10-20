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
      className={`relative w-full aspect-[4/3] max-h-56 sm:max-h-64 rounded-xl bg-gradient-to-b from-surface-alt/80 to-surface-alt border border-border/80 flex items-center justify-center p-3 select-none overflow-hidden ${className}`}
    >
      {/* Decorative Subtle Grid & Floor Baseline */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="82%" x2="100%" y2="82%" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
      </svg>

      {/* SVG Posture Renderer */}
      <div className="relative w-full h-full max-w-[240px] max-h-[220px] flex items-center justify-center">
        {posture === 'qiyam' && <QiyamSvg />}
        {posture === 'takbir' && <TakbirSvg />}
        {posture === 'sedekap' && <SedekapSvg />}
        {posture === 'ruku' && <RukuSvg />}
        {posture === 'itidal' && <ItidalSvg />}
        {posture === 'sujud' && <SujudSvg />}
        {posture === 'iftirasy' && <IftirasySvg />}
        {posture === 'tasyahud' && <TasyahudSvg />}
        {posture === 'salam' && <SalamSvg />}
      </div>
    </div>
  );
}

// 1. Qiyam (Berdiri Tegak Pandangan ke Tempat Sujud)
function QiyamSvg() {
  return (
    <svg viewBox="0 0 160 200" className="w-full h-full text-primary drop-shadow-sm" fill="none">
      {/* Floor */}
      <line x1="20" y1="180" x2="140" y2="180" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />
      {/* Sightline toward Sujud spot */}
      <line x1="88" y1="46" x2="125" y2="178" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
      <circle cx="125" cy="178" r="3" fill="#10b981" />
      <text x="100" y="195" fontSize="8" fill="#10b981" fontWeight="bold">Titik Sujud</text>

      {/* Head & Cap */}
      <circle cx="82" cy="40" r="14" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
      <path d="M70 36 C70 28, 94 28, 94 36 Z" fill="currentColor" fillOpacity="0.8" />
      {/* Neck */}
      <path d="M78 54 L78 62 M86 54 L86 62" stroke="currentColor" strokeWidth="2.5" />
      {/* Body / Thobe */}
      <path
        d="M68 62 L96 62 L102 165 L62 165 Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Arms resting naturally at side */}
      <path d="M68 64 L60 115" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M96 64 L102 115" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      {/* Legs & Feet */}
      <path d="M72 165 L70 180 M92 165 L94 180" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// 2. Takbiratul Ihram (Mengangkat Tangan Sejajar Bahu/Telinga)
function TakbirSvg() {
  return (
    <svg viewBox="0 0 160 200" className="w-full h-full text-primary drop-shadow-sm" fill="none">
      {/* Floor */}
      <line x1="20" y1="180" x2="140" y2="180" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />
      {/* Shoulder Height Guideline */}
      <line x1="25" y1="46" x2="135" y2="46" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
      <text x="18" y="38" fontSize="8" fill="#f59e0b" fontWeight="bold">Sejajar Telinga / Bahu</text>

      {/* Head */}
      <circle cx="80" cy="48" r="14" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
      <path d="M68 44 C68 36, 92 36, 92 44 Z" fill="currentColor" fillOpacity="0.8" />
      {/* Body */}
      <path
        d="M66 66 L94 66 L100 165 L60 165 Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Raised Arms (Bent at elbows, palms facing Kiblat) */}
      {/* Left Arm */}
      <path d="M66 70 L48 64 L48 42" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48" cy="40" r="4.5" fill="#10b981" />
      {/* Right Arm */}
      <path d="M94 70 L112 64 L112 42" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="112" cy="40" r="4.5" fill="#10b981" />
      {/* Feet */}
      <path d="M70 165 L68 180 M90 165 L92 180" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// 3. Sedekap (Tangan Kanan Memegang Tangan Kiri di Dada)
function SedekapSvg() {
  return (
    <svg viewBox="0 0 160 200" className="w-full h-full text-primary drop-shadow-sm" fill="none">
      {/* Floor */}
      <line x1="20" y1="180" x2="140" y2="180" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />

      {/* Head & Gaze downward */}
      <circle cx="80" cy="42" r="14" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
      <path d="M68 38 C68 30, 92 30, 92 38 Z" fill="currentColor" fillOpacity="0.8" />
      {/* Body */}
      <path
        d="M66 62 L94 62 L100 165 L60 165 Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Arms crossed over Chest / Epigastrium */}
      <path d="M66 68 L60 90 L98 90" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M94 68 L100 90 L62 90" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Hand Over Wrist Highlight */}
      <rect x="70" y="84" width="20" height="12" rx="4" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="1.5" />
      <text x="64" y="108" fontSize="8" fill="#10b981" fontWeight="bold">Kanan di Atas Kiri</text>
      {/* Feet */}
      <path d="M70 165 L68 180 M90 165 L92 180" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// 4. Ruku' (Membungkuk 90 Derajat Punggung Datar)
function RukuSvg() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full text-primary drop-shadow-sm" fill="none">
      {/* Floor */}
      <line x1="20" y1="140" x2="180" y2="140" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />
      {/* Straight Back Horizontal Alignment Line */}
      <line x1="45" y1="58" x2="160" y2="58" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.9" />
      <text x="55" y="48" fontSize="8" fill="#10b981" fontWeight="bold">Punggung Rata 90° (Datar Lurus)</text>

      {/* Head Level with Back (Not dipping, not looking up) */}
      <circle cx="50" cy="62" r="13" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
      {/* Torso horizontal */}
      <path d="M62 64 L145 64" stroke="currentColor" strokeWidth="18" strokeLinecap="round" strokeOpacity="0.2" />
      <path d="M62 64 L145 64" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Arms Gripping Knees */}
      <path d="M75 64 L95 106" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Grip on Knees Indicator */}
      <circle cx="95" cy="106" r="4.5" fill="#f59e0b" />
      <text x="75" y="122" fontSize="7.5" fill="#f59e0b" fontWeight="bold">Mencengkeram Lutut</text>

      {/* Legs */}
      <path d="M145 64 L140 106 L140 140" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M95 106 L100 140" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  );
}

// 5. I'tidal (Bangkit Tegak dari Ruku')
function ItidalSvg() {
  return (
    <svg viewBox="0 0 160 200" className="w-full h-full text-primary drop-shadow-sm" fill="none">
      {/* Floor */}
      <line x1="20" y1="180" x2="140" y2="180" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />
      {/* Posture balance indicator */}
      <line x1="80" y1="20" x2="80" y2="180" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

      {/* Head */}
      <circle cx="80" cy="40" r="14" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
      <path d="M68 36 C68 28, 92 28, 92 36 Z" fill="currentColor" fillOpacity="0.8" />
      {/* Body upright */}
      <path
        d="M66 60 L94 60 L100 165 L60 165 Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Arms straight down or rising during tasmi' */}
      <path d="M66 64 L56 120" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M94 64 L104 120" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      {/* Text */}
      <rect x="45" y="128" width="70" height="16" rx="8" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1" />
      <text x="50" y="139" fontSize="7.5" fill="#10b981" fontWeight="bold">Thuma&apos;ninah Tenang</text>
      {/* Feet */}
      <path d="M70 165 L68 180 M90 165 L92 180" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// 6. Sujud (7 Titik Anggota Badan Menempel Sempurna)
function SujudSvg() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-full text-primary drop-shadow-sm" fill="none">
      {/* Floor */}
      <line x1="15" y1="120" x2="185" y2="120" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.5" strokeLinecap="round" />

      {/* Prostrating Body */}
      {/* Head + Forehead on Floor */}
      <circle cx="48" cy="110" r="12" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      {/* 1. Forehead point */}
      <circle cx="42" cy="120" r="3.5" fill="#ef4444" />
      <text x="12" y="104" fontSize="7" fill="#ef4444" fontWeight="bold">1. Dahi &amp; Hidung</text>

      {/* Arms & Hands on Floor beside ears/shoulders */}
      <path d="M60 92 L75 80 L65 118" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* 2 & 3. Palms point */}
      <circle cx="65" cy="120" r="3.5" fill="#10b981" />
      <text x="60" y="135" fontSize="7" fill="#10b981" fontWeight="bold">2-3. Telapak</text>

      {/* Torso & Hip raised up high */}
      <path d="M58 92 L115 55 L135 90" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeOpacity="0.2" />
      <path d="M58 92 L115 55 L135 90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Knees on Floor */}
      {/* 4 & 5. Knees point */}
      <circle cx="130" cy="120" r="3.5" fill="#f59e0b" />
      <text x="110" y="135" fontSize="7" fill="#f59e0b" fontWeight="bold">4-5. Lutut</text>

      {/* Feet & Toes curled toward Kiblat */}
      <path d="M130 118 L160 112 L160 120" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* 6 & 7. Toes point */}
      <circle cx="160" cy="120" r="3.5" fill="#3b82f6" />
      <text x="150" y="105" fontSize="7" fill="#3b82f6" fontWeight="bold">6-7. Jari Kaki</text>
    </svg>
  );
}

// 7. Duduk Iftirasy (Duduk di Antara Dua Sujud)
function IftirasySvg() {
  return (
    <svg viewBox="0 0 180 160" className="w-full h-full text-primary drop-shadow-sm" fill="none">
      {/* Floor */}
      <line x1="20" y1="140" x2="160" y2="140" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />

      {/* Head */}
      <circle cx="85" cy="45" r="13" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
      {/* Torso sitting erect */}
      <path d="M85 58 L85 105" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeOpacity="0.2" />
      <path d="M85 58 L85 105" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

      {/* Hands resting on Thighs / Knees */}
      <path d="M85 70 L65 95 L55 110" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="55" cy="110" r="3.5" fill="#10b981" />

      {/* Folded Legs (Iftirasy: Sitting on Left Foot, Right Foot Upright) */}
      <path d="M85 105 L60 125 L120 135" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right foot upright indicator */}
      <path d="M120 135 L125 118 L125 140" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="125" cy="140" r="3.5" fill="#f59e0b" />
      <text x="95" y="152" fontSize="7.5" fill="#f59e0b" fontWeight="bold">Kaki Kanan Ditegakkan</text>
    </svg>
  );
}

// 8. Tasyahud (Duduk & Jari Telunjuk Menunjuk)
function TasyahudSvg() {
  return (
    <svg viewBox="0 0 180 160" className="w-full h-full text-primary drop-shadow-sm" fill="none">
      {/* Floor */}
      <line x1="20" y1="140" x2="160" y2="140" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />

      {/* Head */}
      <circle cx="85" cy="45" r="13" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
      {/* Torso */}
      <path d="M85 58 L85 105" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeOpacity="0.2" />
      <path d="M85 58 L85 105" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

      {/* Hands on knees with Index Finger Extended */}
      <path d="M85 70 L60 95 L45 108" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Extended Index Finger Glowing Indicator */}
      <line x1="45" y1="108" x2="32" y2="108" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="108" r="3" fill="#10b981" />
      <text x="18" y="98" fontSize="7.5" fill="#10b981" fontWeight="bold">Isyarat Telunjuk Tauhid</text>

      {/* Legs in Tawarruk / Iftirasy */}
      <path d="M85 105 L60 125 L120 135" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="125" cy="140" r="3.5" fill="#f59e0b" />
    </svg>
  );
}

// 9. Salam (Menoleh ke Kanan)
function SalamSvg() {
  return (
    <svg viewBox="0 0 180 160" className="w-full h-full text-primary drop-shadow-sm" fill="none">
      {/* Floor */}
      <line x1="20" y1="140" x2="160" y2="140" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" strokeLinecap="round" />

      {/* Head turned to the Right side (60° turn) */}
      <circle cx="80" cy="45" r="13" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2.5" />
      {/* Head Turn Indicator Arrow */}
      <path d="M72 32 C82 25, 96 28, 102 36" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" markerEnd="url(#arrow)" />
      <circle cx="95" cy="45" r="3" fill="#10b981" />
      <text x="98" y="42" fontSize="7.5" fill="#10b981" fontWeight="bold">Pipi Kanan Terlihat</text>

      {/* Torso stays facing forward */}
      <path d="M80 58 L80 105" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeOpacity="0.2" />
      <path d="M80 58 L80 105" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

      {/* Hands on knees */}
      <path d="M80 70 L60 95 L50 110" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 70 L100 95 L110 110" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

      {/* Legs */}
      <path d="M80 105 L55 125 L115 135" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
