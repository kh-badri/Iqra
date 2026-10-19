import * as React from 'react';

export interface IslamicIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * 1. Al-Qur'an Icon
 * Mushaf Al-Qur'an bersampul hijau zamrud dengan ornamen emas arabesque,
 * halaman keemasan, dan pita pembatas sutra emas.
 */
export function QuranIcon({ size = 28, className = '', ...props }: IslamicIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Al-Qur'an"
      {...props}
    >
      <defs>
        <linearGradient id="quranCover" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#15803D" />
          <stop offset="50%" stopColor="#166534" />
          <stop offset="100%" stopColor="#052E16" />
        </linearGradient>
        <linearGradient id="quranGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>
        <linearGradient id="quranPages" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="24" cy="43" rx="17" ry="2.5" fill="#000000" fillOpacity="0.18" />

      {/* Back Cover / Edge */}
      <rect x="7" y="7" width="34" height="34" rx="4" fill="url(#quranCover)" stroke="url(#quranGold)" strokeWidth="1.2" />

      {/* Page Thickness (Gold gilded edges) */}
      <path d="M10 9H39C39.5 9 40 9.5 40 10V38C40 38.5 39.5 39 39 39H10C9.5 39 9 38.5 9 38V10C9 9.5 9.5 9 10 9Z" fill="url(#quranPages)" />
      
      {/* Page edge texture lines */}
      <line x1="39.2" y1="11" x2="39.2" y2="37" stroke="#CA8A04" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="38" y1="10" x2="38" y2="38" stroke="#EAB308" strokeWidth="0.8" strokeLinecap="round" />

      {/* Front Leather Cover */}
      <rect x="8" y="7" width="29" height="34" rx="3.5" fill="url(#quranCover)" />

      {/* Spine highlight */}
      <path d="M8 7H11V41H8C6.9 41 6 40.1 6 39V9C6 7.9 6.9 7 8 7Z" fill="#14532D" />
      <line x1="11" y1="7" x2="11" y2="41" stroke="url(#quranGold)" strokeWidth="0.8" />

      {/* Gold Arabesque Corner Ornaments */}
      <path d="M14 11H20C17 11 14 14 14 17V11Z" fill="url(#quranGold)" />
      <path d="M14 37H20C17 37 14 34 14 31V37Z" fill="url(#quranGold)" />
      <path d="M33 11H27C30 11 33 14 33 17V11Z" fill="url(#quranGold)" />
      <path d="M33 37H27C30 37 33 34 33 31V37Z" fill="url(#quranGold)" />

      {/* Gold Inner Border */}
      <rect x="14" y="11" width="19" height="26" rx="2" fill="none" stroke="url(#quranGold)" strokeWidth="0.8" strokeDasharray="2 1" />

      {/* Central Arabesque Medallion */}
      <circle cx="23.5" cy="24" r="6" fill="#14532D" stroke="url(#quranGold)" strokeWidth="1" />
      <path d="M23.5 19.5L25 22.5L28 24L25 25.5L23.5 28.5L22 25.5L19 24L22 22.5Z" fill="url(#quranGold)" />
      <circle cx="23.5" cy="24" r="1.5" fill="#FEF08A" />

      {/* Gold Ribbon Bookmark */}
      <path d="M26 40V44L28.5 42L31 44V40H26Z" fill="url(#quranGold)" />
    </svg>
  );
}

/**
 * 2. Ka'bah Icon (Arah Kiblat)
 * Bangunan suci Ka'bah dengan kain kiswah hitam megah, pita kaligrafi emas (hizam),
 * Pintu Ka'bah (Bab Al-Ka'bah) bersepuh emas, dan pondasi marmer putih (shadharwan).
 */
export function KaabaIcon({ size = 28, className = '', ...props }: IslamicIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ka'bah"
      {...props}
    >
      <defs>
        <linearGradient id="kaabaGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
        <linearGradient id="kaabaFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#27272A" />
          <stop offset="100%" stopColor="#09090B" />
        </linearGradient>
        <linearGradient id="kaabaSide" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#18181B" />
          <stop offset="100%" stopColor="#040405" />
        </linearGradient>
        <linearGradient id="kaabaRoof" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3F3F46" />
          <stop offset="100%" stopColor="#18181B" />
        </linearGradient>
      </defs>

      {/* Floor Shadow */}
      <ellipse cx="24" cy="43" rx="18" ry="3" fill="#000000" fillOpacity="0.22" />

      {/* White Marble Base (Shadharwan) */}
      <polygon points="6,39 23,43 42,38 25,35" fill="#E4E4E7" stroke="#D4D4D8" strokeWidth="0.6" />
      <polygon points="6,39 23,43 23,44.5 6,40.5" fill="#D4D4D8" />
      <polygon points="23,43 42,38 42,39.5 23,44.5" fill="#A1A1AA" />

      {/* Ka'bah Body - Front Wall */}
      <polygon points="9,18 24,22 24,40 9,36" fill="url(#kaabaFront)" />

      {/* Ka'bah Body - Right Side Wall */}
      <polygon points="24,22 39,17 39,35 24,40" fill="url(#kaabaSide)" />

      {/* Ka'bah Roof */}
      <polygon points="9,18 24,13 39,17 24,22" fill="url(#kaabaRoof)" stroke="#52525B" strokeWidth="0.5" />

      {/* Front Golden Kiswah Belt (Hizam) */}
      <polygon points="9,23 24,27 24,29 9,25" fill="url(#kaabaGold)" />
      {/* Front Small Lower Calligraphy Badges */}
      <polygon points="11,27.5 15,28.5 15,29.5 11,28.5" fill="#FEF08A" />
      <polygon points="17,29 21,30 21,31 17,30" fill="#FEF08A" />

      {/* Right Side Golden Kiswah Belt (Hizam) */}
      <polygon points="24,27 39,22 39,24 24,29" fill="url(#kaabaGold)" />
      {/* Right Side Small Calligraphy Badges */}
      <polygon points="27,28.5 31,27.2 31,28.2 27,29.5" fill="#FEF08A" />
      <polygon points="33,26.5 37,25.2 37,26.2 33,27.5" fill="#FEF08A" />

      {/* Golden Door (Bab Al-Ka'bah) on Front Face */}
      <polygon points="16,28.5 22,30.1 22,38.5 16,36.9" fill="url(#kaabaGold)" stroke="#A16207" strokeWidth="0.4" />
      <line x1="19" y1="29.3" x2="19" y2="37.7" stroke="#78350F" strokeWidth="0.4" />
      <circle cx="18" cy="34" r="0.6" fill="#78350F" />

      {/* Golden Rain Spout (Mizab ar-Rahmah) on Roof */}
      <line x1="16.5" y1="15.5" x2="14" y2="17" stroke="url(#kaabaGold)" strokeWidth="1.2" strokeLinecap="round" />

      {/* Hajar al-Aswad Corner Indicator */}
      <circle cx="24" cy="40" r="1.2" fill="#FAFAFA" stroke="#71717A" strokeWidth="0.4" />
      <circle cx="24" cy="40" r="0.6" fill="#09090B" />
    </svg>
  );
}

/**
 * 3. Prayer Clock Icon (Jadwal Sholat)
 * Kubah masjid emas & hijau bersanding dengan jam sholat berjarum emas,
 * mencerminkan waktu ibadah 5 waktu yang presisi.
 */
export function PrayerClockIcon({ size = 28, className = '', ...props }: IslamicIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Jadwal Sholat"
      {...props}
    >
      <defs>
        <linearGradient id="clockGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>
        <linearGradient id="clockGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
        <linearGradient id="clockDial" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0FDF4" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="24" cy="44" rx="16" ry="2.5" fill="#000000" fillOpacity="0.18" />

      {/* Mosque Dome Top Crest */}
      <path d="M24 3C24 3 21 6 21 9C21 9 22 9.5 24 9.5C26 9.5 27 9 27 9C27 6 24 3 24 3Z" fill="url(#clockGold)" />
      {/* Crescent on Top */}
      <path d="M24 1.5C23.2 1.5 22.5 2.1 22.5 2.9C22.5 3.7 23.2 4.3 24 4.3C24.2 4.3 24.5 4.2 24.7 4.1C24.1 4.5 23.3 4.4 22.8 3.8C22.4 3.3 22.4 2.5 22.9 2C23.2 1.7 23.6 1.5 24 1.5Z" fill="#FDE047" />

      {/* Outer Clock Frame (Golden & Green Accents) */}
      <circle cx="24" cy="26" r="17" fill="url(#clockGreen)" stroke="url(#clockGold)" strokeWidth="1.6" />
      <circle cx="24" cy="26" r="14.5" fill="url(#clockDial)" stroke="#DCFCE7" strokeWidth="1" />

      {/* 12 Hour Markers */}
      <circle cx="24" cy="14" r="1.2" fill="#15803D" />
      <circle cx="36" cy="26" r="1.2" fill="#15803D" />
      <circle cx="24" cy="38" r="1.2" fill="#15803D" />
      <circle cx="12" cy="26" r="1.2" fill="#15803D" />
      
      {/* Minor hour ticks */}
      <circle cx="30" cy="15.6" r="0.7" fill="#86EFAC" />
      <circle cx="34.4" cy="20" r="0.7" fill="#86EFAC" />
      <circle cx="34.4" cy="32" r="0.7" fill="#86EFAC" />
      <circle cx="30" cy="36.4" r="0.7" fill="#86EFAC" />
      <circle cx="18" cy="36.4" r="0.7" fill="#86EFAC" />
      <circle cx="13.6" cy="32" r="0.7" fill="#86EFAC" />
      <circle cx="13.6" cy="20" r="0.7" fill="#86EFAC" />
      <circle cx="18" cy="15.6" r="0.7" fill="#86EFAC" />

      {/* Golden Clock Hands (Time set to 04:30 - Subuh/Ashar) */}
      <line x1="24" y1="26" x2="20" y2="19" stroke="url(#clockGold)" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="24" y1="26" x2="29" y2="28" stroke="url(#clockGold)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="24" y1="26" x2="24" y2="34" stroke="#EF4444" strokeWidth="0.9" strokeLinecap="round" />

      {/* Center Pivot Pin */}
      <circle cx="24" cy="26" r="2" fill="url(#clockGold)" />
      <circle cx="24" cy="26" r="0.8" fill="#15803D" />
    </svg>
  );
}

/**
 * 4. Calendar Icon (Kalender Hijriah)
 * Kalender meja berlembar putih bersih dengan header hijau Islami,
 * cincin spiral perak, bulan sabit emas, dan grid tanggal beraksen puasa sunnah.
 */
export function CalendarIcon({ size = 28, className = '', ...props }: IslamicIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Kalender Hijriah"
      {...props}
    >
      <defs>
        <linearGradient id="calHeader" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
        <linearGradient id="calGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="24" cy="43" rx="16" ry="2.5" fill="#000000" fillOpacity="0.18" />

      {/* Calendar Base Sheet */}
      <rect x="8" y="10" width="32" height="32" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
      {/* Page Curl subtle shadow at bottom right */}
      <path d="M36 42H40V38L36 42Z" fill="#CBD5E1" />

      {/* Top Header Bar */}
      <path d="M8 14C8 11.8 9.8 10 12 10H36C38.2 10 40 11.8 40 14V19H8V14Z" fill="url(#calHeader)" />

      {/* Golden Crescent Moon on Header */}
      <path d="M24 12C23 12 22 13 22 14.5C22 16 23 17 24 17C24.4 17 24.8 16.8 25.1 16.6C24.3 17.1 23.3 17 22.7 16.2C22.2 15.4 22.3 14.3 23 13.7C23.3 13.4 23.6 13.2 24 13.2V12Z" fill="url(#calGold)" />
      <polygon points="25.5,13.2 26,14.2 27,14.4 26.2,15 26.4,16 25.5,15.4 24.6,16 24.8,15 24,14.4 25,14.2" fill="#FEF08A" transform="scale(0.5) translate(25, 12)" />

      {/* Spiral Binder Rings */}
      <rect x="13" y="7" width="2.5" height="6" rx="1.2" fill="#94A3B8" stroke="#475569" strokeWidth="0.5" />
      <rect x="23" y="7" width="2.5" height="6" rx="1.2" fill="#94A3B8" stroke="#475569" strokeWidth="0.5" />
      <rect x="33" y="7" width="2.5" height="6" rx="1.2" fill="#94A3B8" stroke="#475569" strokeWidth="0.5" />

      {/* Calendar Date Grid */}
      {/* Row 1 */}
      <circle cx="14" cy="24" r="1.6" fill="#94A3B8" />
      <circle cx="19" cy="24" r="1.6" fill="#94A3B8" />
      <circle cx="24" cy="24" r="1.6" fill="#94A3B8" />
      <circle cx="29" cy="24" r="1.6" fill="#94A3B8" />
      <circle cx="34" cy="24" r="1.6" fill="#DC2626" /> {/* Jumu'ah in red */}

      {/* Row 2 */}
      <circle cx="14" cy="29" r="1.6" fill="#94A3B8" />
      <circle cx="19" cy="29" r="1.6" fill="#94A3B8" />
      {/* Highlighted Today / Sunnah Fasting in Emerald Pill */}
      <rect x="21.5" y="27" width="5" height="4.5" rx="1.5" fill="#16A34A" />
      <circle cx="24" cy="29.2" r="1.2" fill="#FFFFFF" />
      <circle cx="29" cy="29" r="1.6" fill="#94A3B8" />
      <circle cx="34" cy="29" r="1.6" fill="#DC2626" />

      {/* Row 3 */}
      <circle cx="14" cy="34" r="1.6" fill="#94A3B8" />
      <circle cx="19" cy="34" r="1.6" fill="#94A3B8" />
      <circle cx="24" cy="34" r="1.6" fill="#94A3B8" />
      <circle cx="29" cy="34" r="1.6" fill="#94A3B8" />
      <circle cx="34" cy="34" r="1.6" fill="#DC2626" />

      {/* Row 4 */}
      <circle cx="14" cy="38.5" r="1.4" fill="#CBD5E1" />
      <circle cx="19" cy="38.5" r="1.4" fill="#CBD5E1" />
      <circle cx="24" cy="38.5" r="1.4" fill="#CBD5E1" />
      <circle cx="29" cy="38.5" r="1.4" fill="#CBD5E1" />
    </svg>
  );
}

/**
 * 5. Hadith Book Icon (Hadits Shahih)
 * Kitab Hadits tebal bersampul kulit merah marun (royal crimson/burgundy) klasik
 * dengan ornamen emas bercahaya dan pita sutra pembatas.
 */
export function HadithBookIcon({ size = 28, className = '', ...props }: IslamicIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Hadits Shahih"
      {...props}
    >
      <defs>
        <linearGradient id="hadithCover" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9F1239" />
          <stop offset="60%" stopColor="#881337" />
          <stop offset="100%" stopColor="#4C0519" />
        </linearGradient>
        <linearGradient id="hadithGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="hadithPages" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="24" cy="43" rx="16" ry="2.5" fill="#000000" fillOpacity="0.2" />

      {/* Back Cover & Page Edges */}
      <rect x="7" y="8" width="34" height="33" rx="4" fill="url(#hadithCover)" />
      <path d="M10 10H39C39.5 10 40 10.5 40 11V38C40 38.5 39.5 39 39 39H10V10Z" fill="url(#hadithPages)" />

      {/* Front Leather Cover */}
      <rect x="8" y="8" width="29" height="33" rx="3.5" fill="url(#hadithCover)" stroke="#9F1239" strokeWidth="0.5" />

      {/* Spine Binding */}
      <path d="M8 8H12V41H8C6.9 41 6 40.1 6 39V10C6 8.9 6.9 8 8 8Z" fill="#4C0519" />
      {/* Spine Gold Ribs */}
      <line x1="7" y1="14" x2="12" y2="14" stroke="url(#hadithGold)" strokeWidth="0.8" />
      <line x1="7" y1="20" x2="12" y2="20" stroke="url(#hadithGold)" strokeWidth="0.8" />
      <line x1="7" y1="29" x2="12" y2="29" stroke="url(#hadithGold)" strokeWidth="0.8" />
      <line x1="7" y1="35" x2="12" y2="35" stroke="url(#hadithGold)" strokeWidth="0.8" />

      {/* Gold Arch Frame on Cover */}
      <rect x="15" y="12" width="18" height="25" rx="2" fill="none" stroke="url(#hadithGold)" strokeWidth="1" />
      <path d="M15 17C15 14 18 13 24 13C30 13 33 14 33 17" fill="none" stroke="url(#hadithGold)" strokeWidth="0.8" />

      {/* Central Arabic Calligraphy Title Plate */}
      <rect x="17.5" y="20" width="13" height="9" rx="1.5" fill="#4C0519" stroke="url(#hadithGold)" strokeWidth="0.8" />
      {/* Abstracted Calligraphy "حديث" */}
      <path d="M19.5 24C21 23 23 23.5 24.5 24C26 24.5 27.5 24 28.5 23.5" stroke="url(#hadithGold)" strokeWidth="1" strokeLinecap="round" />
      <circle cx="21" cy="22" r="0.6" fill="#FEF08A" />
      <circle cx="27" cy="22" r="0.6" fill="#FEF08A" />
      <circle cx="24" cy="26" r="0.6" fill="#FEF08A" />

      {/* Hanging Golden Ribbon Bookmark */}
      <path d="M25 39V44L27 42.5L29 44V39H25Z" fill="url(#hadithGold)" />
    </svg>
  );
}

/**
 * 6. Tajwid Icon (Tajwid Interaktif)
 * Rehal kayu ukir jati asli menopang Al-Qur'an terbuka dengan tanda tajwid berwarna
 * (merah untuk mad, hijau untuk ikhfa/idgham, biru untuk qolqolah).
 */
export function TajwidIcon({ size = 28, className = '', ...props }: IslamicIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Tajwid Interaktif"
      {...props}
    >
      <defs>
        <linearGradient id="woodGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#92400E" />
          <stop offset="50%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="24" cy="43" rx="17" ry="2.5" fill="#000000" fillOpacity="0.2" />

      {/* Wooden Rehal (X-shaped Stand) */}
      {/* Left-to-Right Leg */}
      <polygon points="9,41 13,42 39,26 35,25" fill="url(#woodGrad)" />
      {/* Right-to-Left Leg */}
      <polygon points="39,41 35,42 9,26 13,25" fill="#78350F" stroke="#451A03" strokeWidth="0.5" />
      {/* Carved Rehal Center Notch */}
      <polygon points="21,34 24,32 27,34 24,36" fill="#FEF3C7" />

      {/* Open Book Resting on Stand */}
      {/* Left Open Page */}
      <path d="M24 23C20 21 13 20 8 23V11C13 8 20 9 24 11V23Z" fill="#FFFBEB" stroke="#D1D5DB" strokeWidth="0.8" />
      {/* Right Open Page */}
      <path d="M24 23C28 21 35 20 40 23V11C35 8 28 9 24 11V23Z" fill="#FEF9C3" stroke="#D1D5DB" strokeWidth="0.8" />

      {/* Green Leather Outer Cover Visible Below Pages */}
      <path d="M7 23.5L24 24.5L41 23.5L40 24.5L24 25.5L8 24.5Z" fill="#15803D" />

      {/* Color-Coded Tajwid Rules Lines on Left Page */}
      <line x1="10" y1="12" x2="21" y2="12" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" /> {/* Hijau: Ikhfa */}
      <line x1="10" y1="15" x2="16" y2="15" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" /> {/* Biru: Qolqolah */}
      <line x1="17.5" y1="15" x2="21" y2="15" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="10" y1="18" x2="21" y2="18" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round" /> {/* Merah: Mad */}

      {/* Color-Coded Tajwid Rules Lines on Right Page */}
      <line x1="27" y1="12" x2="38" y2="12" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round" /> {/* Merah: Mad */}
      <line x1="27" y1="15" x2="32" y2="15" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" /> {/* Hijau: Ghunnah */}
      <line x1="33.5" y1="15" x2="38" y2="15" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" /> {/* Biru */}
      <line x1="27" y1="18" x2="38" y2="18" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" /> {/* Oranye: Idgham */}
    </svg>
  );
}

/**
 * 7. Sirah Scroll Icon (Sirah Nabawiyah)
 * Gulungan naskah perkamen kuno bersegel lilin merah dan poros kayu,
 * merefleksikan sejarah autentik perjalanan hidup Rasulullah ﷺ & sahabat.
 */
export function SirahScrollIcon({ size = 28, className = '', ...props }: IslamicIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sirah Nabawiyah"
      {...props}
    >
      <defs>
        <linearGradient id="parchment" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="50%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
        <linearGradient id="waxSeal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="24" cy="43" rx="16" ry="2.5" fill="#000000" fillOpacity="0.18" />

      {/* Top Scroll Wooden Roller */}
      <rect x="7" y="6" width="34" height="4" rx="2" fill="#78350F" />
      <circle cx="7" cy="8" r="3" fill="#B45309" />
      <circle cx="41" cy="8" r="3" fill="#B45309" />

      {/* Unrolled Parchment Sheet */}
      <path d="M10 8H38V38C38 38 34 36 24 36C14 36 10 38 10 38V8Z" fill="url(#parchment)" stroke="#D97706" strokeWidth="0.8" />

      {/* Bottom Scroll Rolled Paper */}
      <ellipse cx="24" cy="38" rx="14" ry="3.5" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
      <rect x="8" y="38" width="32" height="3" rx="1.5" fill="#78350F" />

      {/* Ancient Chronicle Text Lines */}
      <line x1="14" y1="13" x2="34" y2="13" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="17" x2="34" y2="17" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="21" x2="30" y2="21" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="25" x2="34" y2="25" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="29" x2="26" y2="29" stroke="#B45309" strokeWidth="1.2" strokeLinecap="round" />

      {/* Royal Red Wax Seal */}
      <circle cx="32" cy="30" r="5" fill="url(#waxSeal)" stroke="#7F1D1D" strokeWidth="0.8" />
      <circle cx="32" cy="30" r="3.2" fill="none" stroke="#FEE2E2" strokeWidth="0.6" strokeDasharray="1.5 1" />
      <path d="M32 28L32.8 29.5L34.5 29.8L33.2 31L33.5 32.5L32 31.8L30.5 32.5L30.8 31L29.5 29.8L31.2 29.5Z" fill="#FEE2E2" />

      {/* Hanging Seal Ribbon */}
      <path d="M31 34L30 38L32 37L34 38L33 34" fill="#991B1B" />
    </svg>
  );
}

/**
 * 8. Prophets Star Icon (Kisah 25 Nabi)
 * Bintang 8 sudut Islami (Rub El Hizb) bersepuh emas berkilau dengan cahaya lentera kenabian,
 * melambangkan petunjuk dan hikmah para Nabi & Rasul Allah.
 */
export function ProphetsStarIcon({ size = 28, className = '', ...props }: IslamicIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Kisah 25 Nabi"
      {...props}
    >
      <defs>
        <linearGradient id="starGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#FACC15" />
          <stop offset="80%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="70%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </radialGradient>
      </defs>

      {/* Glow Aura Shadow */}
      <ellipse cx="24" cy="43" rx="15" ry="2.5" fill="#000000" fillOpacity="0.18" />

      {/* Outer 8-Pointed Star (First Square) */}
      <rect
        x="10"
        y="10"
        width="28"
        height="28"
        rx="2"
        fill="url(#starGold)"
        stroke="#CA8A04"
        strokeWidth="1"
      />

      {/* Outer 8-Pointed Star (Second Square rotated 45 deg) */}
      <rect
        x="10"
        y="10"
        width="28"
        height="28"
        rx="2"
        transform="rotate(45 24 24)"
        fill="url(#starGold)"
        stroke="#CA8A04"
        strokeWidth="1"
      />

      {/* Inner Inset Ring */}
      <circle cx="24" cy="24" r="11" fill="#064E3B" stroke="url(#starGold)" strokeWidth="1.2" />

      {/* Radiant Lantern / Flame (Nuur Nubuwwah) */}
      <path
        d="M24 15C24 15 20 20 20 24C20 26.2 21.8 28 24 28C26.2 28 28 26.2 28 24C28 20 24 15 24 15Z"
        fill="url(#starGlow)"
      />
      <path
        d="M24 19C24 19 22 22 22 24C22 25.1 22.9 26 24 26C25.1 26 26 25.1 26 24C26 22 24 19 24 19Z"
        fill="#FFFFFF"
      />

      {/* Mini Star Rays */}
      <circle cx="24" cy="10" r="1" fill="#FEF08A" />
      <circle cx="38" cy="24" r="1" fill="#FEF08A" />
      <circle cx="24" cy="38" r="1" fill="#FEF08A" />
      <circle cx="10" cy="24" r="1" fill="#FEF08A" />
    </svg>
  );
}

/**
 * 9. Masjid Icon (Masjid Terdekat)
 * Masjid agung berkubah hijau zamrud, menara tinggi dengan bulan sabit emas,
 * dan pintu gerbang mihrab yang megah.
 */
export function MasjidIcon({ size = 28, className = '', ...props }: IslamicIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Masjid Terdekat"
      {...props}
    >
      <defs>
        <linearGradient id="domeGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="50%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#14532D" />
        </linearGradient>
        <linearGradient id="masjidGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="24" cy="43" rx="17" ry="2.5" fill="#000000" fillOpacity="0.2" />

      {/* Main White Mosque Structure */}
      <rect x="12" y="24" width="24" height="17" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.8" />

      {/* Central Emerald Green Dome */}
      <path
        d="M24 8C17 14 16 24 16 24H32C32 24 31 14 24 8Z"
        fill="url(#domeGreen)"
        stroke="#14532D"
        strokeWidth="0.8"
      />
      {/* Dome Crescent Moon & Spire */}
      <line x1="24" y1="8" x2="24" y2="4" stroke="url(#masjidGold)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M24 2.5C23.2 2.5 22.5 3.2 22.5 4C22.5 4.8 23.2 5.5 24 5.5C24.3 5.5 24.6 5.4 24.8 5.2C24.2 5.6 23.4 5.5 22.9 4.9C22.5 4.4 22.5 3.6 23 3.1C23.3 2.7 23.7 2.5 24 2.5Z" fill="url(#masjidGold)" />

      {/* Left Minaret */}
      <rect x="6" y="14" width="5" height="27" rx="1" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="0.6" />
      <path d="M8.5 8L6 14H11L8.5 8Z" fill="url(#domeGreen)" />
      <line x1="8.5" y1="8" x2="8.5" y2="5" stroke="url(#masjidGold)" strokeWidth="0.8" />
      <circle cx="8.5" cy="5" r="0.8" fill="url(#masjidGold)" />
      <rect x="5.5" y="18" width="6" height="2" rx="0.5" fill="url(#masjidGold)" />

      {/* Right Minaret */}
      <rect x="37" y="14" width="5" height="27" rx="1" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="0.6" />
      <path d="M39.5 8L37 14H42L39.5 8Z" fill="url(#domeGreen)" />
      <line x1="39.5" y1="8" x2="39.5" y2="5" stroke="url(#masjidGold)" strokeWidth="0.8" />
      <circle cx="39.5" cy="5" r="0.8" fill="url(#masjidGold)" />
      <rect x="36.5" y="18" width="6" height="2" rx="0.5" fill="url(#masjidGold)" />

      {/* Grand Arched Mihrab Door */}
      <path d="M20 41V31C20 28.8 21.8 27 24 27C26.2 27 28 28.8 28 31V41H20Z" fill="#1E293B" />
      <path d="M21 41V32C21 30.3 22.3 29 24 29C25.7 29 27 30.3 27 32V41H21Z" fill="#FDE047" fillOpacity="0.3" />

      {/* Side Arched Windows */}
      <path d="M14 34V30C14 28.9 14.9 28 16 28C17.1 28 18 28.9 18 30V34H14Z" fill="#14532D" />
      <path d="M30 34V30C30 28.9 30.9 28 32 28C33.1 28 34 28.9 34 30V34H30Z" fill="#14532D" />
    </svg>
  );
}

/**
 * 10. Kajian Icon (Kajian YouTube)
 * Layar streaming merah menyala dengan mimbar & kubah Islami bersepuh emas
 * dan tombol putar (play button) yang megah.
 */
export function KajianIcon({ size = 28, className = '', ...props }: IslamicIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Kajian YouTube"
      {...props}
    >
      <defs>
        <linearGradient id="ytRed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="60%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <linearGradient id="ytGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="60%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="24" cy="43" rx="16" ry="2.5" fill="#000000" fillOpacity="0.2" />

      {/* Video Screen Body (YouTube Red Rounded TV Shape) */}
      <rect x="6" y="9" width="36" height="30" rx="8" fill="url(#ytRed)" stroke="#B91C1C" strokeWidth="0.8" />
      {/* Screen Gloss Highlight */}
      <path d="M6 17C6 12.6 9.6 9 14 9H34C38.4 9 42 12.6 42 17V20C42 20 28 22 6 20V17Z" fill="#FFFFFF" fillOpacity="0.15" />

      {/* Mosque Dome Silhouette Inside Top */}
      <path d="M24 13C21 15 20 18 20 19H28C28 18 27 15 24 13Z" fill="url(#ytGold)" fillOpacity="0.9" />
      <circle cx="24" cy="12.2" r="0.7" fill="#FEF08A" />

      {/* Golden Play Button Triangle in Center */}
      <polygon points="21,19 31,25 21,31" fill="#FFFFFF" />
      <polygon points="21,19 31,25 21,31" fill="url(#ytGold)" fillOpacity="0.9" />

      {/* Sound / Live Wave Bars */}
      <line x1="10" y1="23" x2="10" y2="27" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="13" y1="20" x2="13" y2="30" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="35" y1="20" x2="35" y2="30" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="38" y1="23" x2="38" y2="27" stroke="#FEF08A" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
