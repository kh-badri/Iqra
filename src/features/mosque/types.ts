export interface Mosque {
  id: string;
  name: string;
  lat: number;
  lng: number;
  distanceM: number;
  address?: string;
  type?: 'masjid' | 'musholla';
  isNamed?: boolean;
  tags?: Record<string, string>;
}

export interface MosqueAreaCache {
  areaKey: string;
  lat: number;
  lng: number;
  radiusKm: number;
  mosques: Mosque[];
  timestamp: number;
}
