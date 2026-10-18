import { Coordinates, Qibla } from 'adhan';

export const KAABA_COORDS = {
  lat: 21.422487,
  lng: 39.826206,
};

/**
 * Menghitung derajat arah Kiblat dari koordinat pengguna (0 - 360° dari arah Utara)
 */
export function calculateQiblaBearing(lat: number, lng: number): number {
  try {
    const coords = new Coordinates(lat, lng);
    const bearing = Qibla(coords);
    return ((bearing % 360) + 360) % 360;
  } catch {
    // Rumus trigonometri bola manual jika adhan gagal
    const phi1 = (lat * Math.PI) / 180;
    const phi2 = (KAABA_COORDS.lat * Math.PI) / 180;
    const deltaLambda = ((KAABA_COORDS.lng - lng) * Math.PI) / 180;

    const y = Math.sin(deltaLambda);
    const x =
      Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

    let qiblaRad = Math.atan2(y, x);
    let qiblaDeg = (qiblaRad * 180) / Math.PI;
    return ((qiblaDeg % 360) + 360) % 360;
  }
}

/**
 * Menghitung jarak lurus ke Ka'bah di Makkah dalam kilometer (Haversine formula)
 */
export function calculateDistanceToKaabaKm(lat: number, lng: number): number {
  const R = 6371; // Radius bumi dalam km
  const dLat = ((KAABA_COORDS.lat - lat) * Math.PI) / 180;
  const dLng = ((KAABA_COORDS.lng - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((KAABA_COORDS.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Mengubah derajat kompas menjadi nama mata angin bahasa Indonesia
 */
export function getCardinalDirection(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return 'Utara (U)';
  if (normalized >= 22.5 && normalized < 67.5) return 'Timur Laut (TL)';
  if (normalized >= 67.5 && normalized < 112.5) return 'Timur (T)';
  if (normalized >= 112.5 && normalized < 157.5) return 'Tenggara (TG)';
  if (normalized >= 157.5 && normalized < 202.5) return 'Selatan (S)';
  if (normalized >= 202.5 && normalized < 247.5) return 'Barat Daya (BD)';
  if (normalized >= 247.5 && normalized < 292.5) return 'Barat (B)';
  return 'Barat Laut (BL)';
}

/**
 * Mencegah lonjakan putaran 360 derajat saat jarum melewati angka 0/360
 */
export function unwrapAngle(currentAngle: number, targetAngle: number): number {
  const normalizedCurrent = ((currentAngle % 360) + 360) % 360;
  const diff = ((targetAngle - normalizedCurrent + 540) % 360) - 180;
  return currentAngle + diff;
}

/**
 * Menghitung petunjuk arah putar HP untuk mencapai arah Kiblat
 */
export function getTurnInstruction(relativeAngle: number): {
  text: string;
  direction: 'left' | 'right' | 'aligned';
  degrees: number;
} {
  // Selisih antara arah hadap HP dan arah Kiblat
  // -180..180
  const absDiff = Math.abs(relativeAngle);
  if (absDiff <= 3) {
    return {
      text: 'Tepat Mengarah ke Ka\'bah!',
      direction: 'aligned',
      degrees: 0,
    };
  }

  if (relativeAngle > 0) {
    return {
      text: `Putar HP ke kanan ${Math.round(relativeAngle)}°`,
      direction: 'right',
      degrees: Math.round(relativeAngle),
    };
  }

  return {
    text: `Putar HP ke kiri ${Math.round(absDiff)}°`,
    direction: 'left',
    degrees: Math.round(absDiff),
  };
}
