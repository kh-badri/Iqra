'use client';

import React from 'react';
import { Compass, CheckCircle2, RotateCw, RotateCcw, Smartphone } from 'lucide-react';
import { getCardinalDirection } from '../qiblaService';

interface QiblaCompassProps {
  heading: number;
  unwrappedHeading?: number;
  qiblaBearing: number;
  relativeAngle: number;
  isAligned: boolean;
  isFlat: boolean;
  pitch: number;
  roll: number;
  turnInfo: {
    text: string;
    direction: 'left' | 'right' | 'aligned';
    degrees: number;
  };
  isPermissionGranted?: boolean;
  onRequestPermission?: () => void;
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({
  heading,
  unwrappedHeading,
  qiblaBearing,
  relativeAngle,
  isAligned,
  isFlat,
  pitch,
  roll,
  turnInfo,
  isPermissionGranted = true,
  onRequestPermission,
}) => {
  // Rotasi piringan kompas: piringan memutar berlawanan arah hadap HP agar Utara tetap menunjuk Utara
  const effectiveHeading = unwrappedHeading !== undefined ? unwrappedHeading : heading;
  const dialRotation = -effectiveHeading;

  // Rotasi jarum penunjuk Kiblat selalu terkunci presisi menunjuk ikon Ka'bah pada piringan
  const needleRotation = dialRotation + qiblaBearing;

  // Derajat mata angin
  const cardinalPoints = [
    { label: 'U', deg: 0, isNorth: true },
    { label: 'TL', deg: 45, isSub: true },
    { label: 'T', deg: 90 },
    { label: 'TG', deg: 135, isSub: true },
    { label: 'S', deg: 180 },
    { label: 'BD', deg: 225, isSub: true },
    { label: 'B', deg: 270 },
    { label: 'BL', deg: 315, isSub: true },
  ];

  // Garis-garis derajat pada piringan (setiap 15 derajat)
  const ticks = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 select-none animate-fade-in">
      {/* Indikator Status & Panduan Putar */}
      <div className="w-full max-w-sm text-center">
        <div
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-pill font-extrabold text-xs sm:text-sm transition-all shadow-subtle ${
            isAligned
              ? 'bg-primary-gradient text-on-primary shadow-glow animate-pulse-dot'
              : 'bg-surface-alt border border-border text-text-primary'
          }`}
        >
          {isAligned ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-on-primary" />
              <span>{turnInfo.text}</span>
            </>
          ) : turnInfo.direction === 'right' ? (
            <>
              <RotateCw className="w-4 h-4 text-warning" />
              <span>{turnInfo.text}</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4 text-warning" />
              <span>{turnInfo.text}</span>
            </>
          )}
        </div>

        {/* Display Derajat Hadap HP */}
        <div className="mt-3 flex items-baseline justify-center gap-1.5">
          <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-text-primary tabular-nums">
            {heading}°
          </span>
          <span className="text-sm font-bold text-primary-text">
            {getCardinalDirection(heading)}
          </span>
        </div>
      </div>

      {/* Frame Visual Kompas HP */}
      <div className="relative w-72 h-72 sm:w-84 sm:h-84 flex items-center justify-center">
        {/* Indikator Puncak HP (Penunjuk Arah Hadap Atas Layar) */}
        <div className="absolute -top-3 z-30 flex flex-col items-center">
          <div
            className={`w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] transition-colors ${
              isAligned ? 'border-t-primary' : 'border-t-text-primary'
            }`}
          />
          <span className="text-[10px] font-extrabold text-text-secondary mt-0.5 uppercase tracking-wider">
            Hadap HP
          </span>
        </div>

        {/* Lingkaran Luar (Ring Statis) */}
        <div
          className={`w-full h-full rounded-full border-4 transition-colors duration-300 p-2 shadow-elevated bg-surface flex items-center justify-center relative card-highlight ${
            isAligned
              ? 'border-primary ring-4 ring-primary/25'
              : 'border-border'
          }`}
        >
          {/* Piringan Kompas yang Memutar Dinamis Mengikuti Sensor HP */}
          <div
            className="w-full h-full rounded-full relative transition-transform duration-100 ease-out"
            style={{ transform: `rotate(${dialRotation}deg)` }}
          >
            {/* Ticks Garis Derajat */}
            {ticks.map((deg) => {
              const isMajor = deg % 90 === 0;
              const isMedium = deg % 45 === 0;
              return (
                <div
                  key={deg}
                  className="absolute inset-0 flex justify-center items-start pointer-events-none"
                  style={{ transform: `rotate(${deg}deg)` }}
                >
                  <div
                    className={`rounded-full ${
                      isMajor
                        ? 'w-1 h-3.5 bg-primary'
                        : isMedium
                        ? 'w-0.5 h-2.5 bg-text-secondary'
                        : 'w-0.5 h-1.5 bg-border'
                    }`}
                  />
                </div>
              );
            })}

            {/* Label Mata Angin (U, T, S, B, TL, TG, BD, BL) */}
            {cardinalPoints.map((cp) => (
              <div
                key={cp.label}
                className="absolute inset-0 flex justify-center items-start pt-4 pointer-events-none"
                style={{ transform: `rotate(${cp.deg}deg)` }}
              >
                <span
                  className={`text-xs font-bold leading-none ${
                    cp.isNorth
                      ? 'text-primary font-black text-sm'
                      : cp.isSub
                      ? 'text-text-secondary/60 text-[10px]'
                      : 'text-text-secondary text-xs'
                  }`}
                  style={{ transform: `rotate(${-cp.deg}deg)` }}
                >
                  {cp.label}
                </span>
              </div>
            ))}

            {/* Marker Ka'bah pada Derajat Arah Kiblat di Piringan Kompas */}
            <div
              className="absolute inset-0 flex justify-center items-start pt-1 pointer-events-none z-20"
              style={{ transform: `rotate(${qiblaBearing}deg)` }}
            >
              <div
                className="flex flex-col items-center"
                style={{ transform: `rotate(${-qiblaBearing}deg)` }}
                title={`Arah Kiblat: ${qiblaBearing}°`}
              >
                {/* Ikon Ka'bah Flat Geometris */}
                <div
                  className={`w-8 h-8 rounded-button flex items-center justify-center shadow-subtle border transition-all ${
                    isAligned
                      ? 'bg-primary-gradient border-primary scale-110 shadow-glow'
                      : 'bg-surface border-border text-warning'
                  }`}
                >
                  <div className="w-5 h-5 flex flex-col items-center justify-center relative">
                    <div className="w-full h-1 bg-amber-400 rounded-t-sm" />
                    <div className="w-full flex-1 bg-black flex items-center justify-center">
                      <span className="text-[9px] font-bold text-amber-300">🕋</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-extrabold mt-0.5 px-1.5 py-0.2 rounded-pill ${
                    isAligned
                      ? 'bg-primary-gradient text-on-primary font-black'
                      : 'bg-surface text-primary-text border border-border'
                  }`}
                >
                  Kiblat
                </span>
              </div>
            </div>
          </div>

          {/* Jarum Kompas Presisi Vektor (Lime Green Gradient saat selaras) */}
          <svg
            viewBox="0 0 240 240"
            className="w-full h-full absolute inset-0 pointer-events-none z-20"
          >
            <g
              style={{
                transform: `rotate(${needleRotation}deg)`,
                transformOrigin: '120px 120px',
                transition: 'transform 100ms ease-out',
              }}
            >
              {/* Ekor Jarum Penunjuk Arah Lawan / Selatan */}
              <polygon
                points="120,195 113,120 120,120"
                fill="#64748b"
              />
              <polygon
                points="120,195 127,120 120,120"
                fill="#94a3b8"
              />

              {/* Ujung Jarum Penunjuk Kiblat Ka'bah (Lime green saat selaras) */}
              <polygon
                points="120,24 111,120 120,120"
                fill={isAligned ? '#5DB81A' : '#6CC51D'}
              />
              <polygon
                points="120,24 129,120 120,120"
                fill={isAligned ? '#AEDC81' : '#8BD655'}
              />

              {/* Garis Kilau Tulang Tengah Jarum */}
              <line
                x1="120"
                y1="24"
                x2="120"
                y2="195"
                stroke="#ffffff"
                strokeWidth="1.2"
                opacity="0.6"
              />

              {/* Poros Tengah Presisi */}
              <circle
                cx="120"
                cy="120"
                r="18"
                fill={isAligned ? '#0B2A05' : '#1A2118'}
                stroke={isAligned ? '#6CC51D' : '#AEDC81'}
                strokeWidth="3"
              />
              <circle
                cx="120"
                cy="120"
                r="10"
                fill={isAligned ? '#6CC51D' : '#8BD655'}
              />
              <circle
                cx="120"
                cy="120"
                r="4"
                fill="#F5A524"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Indikator Posisi HP Mendatar (Spirit Level) */}
      <div className="w-full max-w-xs bg-surface-alt border border-border rounded-card p-3.5 flex items-center justify-between text-xs shadow-subtle">
        <div className="flex items-center gap-2.5">
          <Smartphone
            className={`w-4 h-4 transition-transform ${
              isFlat ? 'text-primary' : 'text-warning animate-bounce'
            }`}
          />
          <div>
            <div className="font-extrabold text-text-primary">
              {isFlat ? 'Posisi HP Mendatar (Optimal)' : 'Pegang HP Lebih Datar'}
            </div>
            <div className="text-[10px] text-text-secondary font-medium">
              Kemiringan: {Math.max(Math.abs(pitch), Math.abs(roll))}°
            </div>
          </div>
        </div>

        {/* Water Bubble visual */}
        <div className="w-7 h-7 rounded-full border border-border bg-surface relative flex items-center justify-center overflow-hidden">
          <div className="w-2 h-2 rounded-full border border-border/50 absolute" />
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${
              isFlat ? 'bg-primary' : 'bg-warning'
            }`}
            style={{
              transform: `translate(${Math.max(-8, Math.min(8, roll / 3))}px, ${Math.max(
                -8,
                Math.min(8, pitch / 3)
              )}px)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
