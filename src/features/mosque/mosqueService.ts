import { db } from '@/lib/db';
import type { Mosque } from './types';

export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

const CUSTOM_MOSQUES_KEY = 'iqra_custom_mosques';

export const COMMUNITY_VERIFIED_MOSQUES: Omit<Mosque, 'distanceM'>[] = [
  {
    id: 'verified-al-mukhlisin-indrapura',
    name: 'Masjid Al-Mukhlisin',
    lat: 3.28975,
    lng: 99.36145,
    address: 'Dusun VI Tanjung Mulia, Titipayung, Kec. Air Putih, Kab. Batu Bara, Sumatera Utara',
    type: 'masjid',
    isNamed: true,
  },
  {
    id: 'verified-al-huda-pasar-lapan',
    name: 'Masjid Al-Huda',
    lat: 3.2842,
    lng: 99.3608,
    address: 'Pasar Lapan, Kec. Air Putih, Kab. Batu Bara, Sumatera Utara',
    type: 'masjid',
    isNamed: true,
  },
  {
    id: 'verified-al-ikhlas-sipare-pare',
    name: 'Masjid Al-Ikhlas',
    lat: 3.2941,
    lng: 99.3629,
    address: 'Sipare-pare, Kec. Air Putih, Kab. Batu Bara, Sumatera Utara',
    type: 'masjid',
    isNamed: true,
  },
  {
    id: 'verified-taqwa-indrapura',
    name: 'Masjid Taqwa Indrapura',
    lat: 3.2858,
    lng: 99.3692,
    address: 'Jl. Lintas Sumatera, Indrapura, Kab. Batu Bara, Sumatera Utara',
    type: 'masjid',
    isNamed: true,
  },
  {
    id: 'verified-jami-indrapura',
    name: 'Masjid Jami\' Indrapura',
    lat: 3.2831,
    lng: 99.3705,
    address: 'Pusat Pasar Kota Indrapura, Kab. Batu Bara, Sumatera Utara',
    type: 'masjid',
    isNamed: true,
  },
  {
    id: 'verified-nurul-huda-indrasakti',
    name: 'Masjid Nurul Huda',
    lat: 3.2895,
    lng: 99.3735,
    address: 'Indrasakti, Kec. Air Putih, Kab. Batu Bara, Sumatera Utara',
    type: 'masjid',
    isNamed: true,
  },
  {
    id: 'verified-istiqlal-jkt',
    name: 'Masjid Istiqlal',
    lat: -6.1702,
    lng: 106.8315,
    address: 'Jl. Taman Wijaya Kusuma, Ps. Baru, Sawah Besar, Jakarta Pusat',
    type: 'masjid',
    isNamed: true,
  },
  {
    id: 'verified-raya-medan',
    name: 'Masjid Raya Al-Mashun Medan',
    lat: 3.5753,
    lng: 98.6872,
    address: 'Jl. Mahkamah No.74C, Mesjid, Kota Medan, Sumatera Utara',
    type: 'masjid',
    isNamed: true,
  },
];

export function getCustomMosques(): Mosque[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_MOSQUES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomMosque(mosque: Mosque): Mosque[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getCustomMosques().filter((m) => m.id !== mosque.id);
    const updated = [mosque, ...existing];
    localStorage.setItem(CUSTOM_MOSQUES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function deleteCustomMosque(id: string): Mosque[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getCustomMosques().filter((m) => m.id !== id);
    localStorage.setItem(CUSTOM_MOSQUES_KEY, JSON.stringify(existing));
    return existing;
  } catch {
    return [];
  }
}

export async function searchMosqueByNameOnline(
  nameQuery: string,
  userLat?: number,
  userLng?: number
): Promise<Mosque[]> {
  if (!nameQuery || !nameQuery.trim()) return [];
  try {
    let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      nameQuery.trim()
    )}&countrycodes=id&limit=10`;

    if (userLat !== undefined && userLng !== undefined) {
      const latDelta = 0.5;
      const lngDelta = 0.5;
      const minLng = (userLng - lngDelta).toFixed(4);
      const maxLng = (userLng + lngDelta).toFixed(4);
      const minLat = (userLat - latDelta).toFixed(4);
      const maxLat = (userLat + latDelta).toFixed(4);
      url += `&viewbox=${minLng},${maxLat},${maxLng},${minLat}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      headers: { 'Accept-Language': 'id' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const items = await res.json();
    if (!Array.isArray(items)) return [];

    return items.map((item: any) => {
      const mLat = parseFloat(item.lat);
      const mLng = parseFloat(item.lon);
      const fullName = item.display_name || '';
      const parts = fullName.split(',').map((p: string) => p.trim());
      const name = item.name || parts[0] || nameQuery.trim();
      const address = parts.slice(1, 4).join(', ');

      const dist =
        userLat !== undefined && userLng !== undefined
          ? calculateDistanceMeters(userLat, userLng, mLat, mLng)
          : 0;

      const isMusholla =
        name.toLowerCase().includes('musholla') ||
        name.toLowerCase().includes('mushola') ||
        name.toLowerCase().includes('surau');

      return {
        id: `nominatim-search-${item.place_id || item.osm_id}`,
        name,
        lat: mLat,
        lng: mLng,
        distanceM: dist,
        address: address || undefined,
        type: isMusholla ? ('musholla' as const) : ('masjid' as const),
        isNamed: true,
      };
    });
  } catch {
    return [];
  }
}

export async function reverseGeocodePoint(
  lat: number,
  lng: number
): Promise<{ name?: string; address?: string }> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'id' } });
    if (!res.ok) return {};
    const data = await res.json();
    const name = data.name || (data.display_name ? data.display_name.split(',')[0] : undefined);
    return {
      name,
      address: data.display_name || undefined,
    };
  } catch {
    return {};
  }
}

async function fetchNominatimMosques(
  lat: number,
  lng: number,
  radiusKm: number
): Promise<Mosque[]> {
  try {
    const latDelta = (radiusKm * 1.3) / 111;
    const lngDelta = (radiusKm * 1.3) / (111 * Math.cos((lat * Math.PI) / 180));
    const minLng = (lng - lngDelta).toFixed(5);
    const maxLng = (lng + lngDelta).toFixed(5);
    const minLat = (lat - latDelta).toFixed(5);
    const maxLat = (lat + latDelta).toFixed(5);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const url = `https://nominatim.openstreetmap.org/search?format=json&amenity=place_of_worship&bounded=1&viewbox=${minLng},${maxLat},${maxLng},${minLat}&limit=50`;

    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'id',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const items = await res.json();
    if (!Array.isArray(items)) return [];

    return items.map((item: any) => {
      const mLat = parseFloat(item.lat);
      const mLng = parseFloat(item.lon);
      const fullName = item.display_name || '';
      const parts = fullName.split(',').map((p: string) => p.trim());
      let name = item.name;
      if (!name) {
        if (parts[0] && !parts[0].toLowerCase().startsWith('jalan') && !parts[0].toLowerCase().startsWith('jl.')) {
          name = parts[0];
        } else if (parts[0]) {
          name = `Masjid (${parts[0]})`;
        } else {
          name = 'Masjid/Musholla';
        }
      }
      const address = parts.slice(1, 4).join(', ');

      const isMusholla =
        name.toLowerCase().includes('musholla') ||
        name.toLowerCase().includes('mushola') ||
        name.toLowerCase().includes('surau') ||
        name.toLowerCase().includes('langgar');

      return {
        id: `nominatim-${item.place_id || item.osm_id}`,
        name,
        lat: mLat,
        lng: mLng,
        distanceM: calculateDistanceMeters(lat, lng, mLat, mLng),
        address: address || undefined,
        type: isMusholla ? ('musholla' as const) : ('masjid' as const),
        isNamed: true,
      };
    });
  } catch {
    return [];
  }
}

async function fetchOverpassMosques(
  lat: number,
  lng: number,
  radiusKm: number
): Promise<Mosque[]> {
  const radiusMeters = radiusKm * 1000;
  const query = `[out:json][timeout:15];(
    node["amenity"="place_of_worship"](around:${radiusMeters},${lat},${lng});
    way["amenity"="place_of_worship"](around:${radiusMeters},${lat},${lng});
    relation["amenity"="place_of_worship"](around:${radiusMeters},${lat},${lng});
    node["religion"="muslim"](around:${radiusMeters},${lat},${lng});
    way["religion"="muslim"](around:${radiusMeters},${lat},${lng});
    node["building"~"mosque|religious|place_of_worship|musholla|mushola",i](around:${radiusMeters},${lat},${lng});
    way["building"~"mosque|religious|place_of_worship|musholla|mushola",i](around:${radiusMeters},${lat},${lng});
    node["name"~"Masjid|Mesjid|Musholla|Mushola|Surau|Langgar|Jami|Al-|Al |Mukhlisin|Baitul|Baitur|Nurul|Darul|At-Ta",i](around:${radiusMeters},${lat},${lng});
    way["name"~"Masjid|Mesjid|Musholla|Mushola|Surau|Langgar|Jami|Al-|Al |Mukhlisin|Baitul|Baitur|Nurul|Darul|At-Ta",i](around:${radiusMeters},${lat},${lng});
  );out center 120;`;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) continue;

      const data = await res.json();
      const elements: any[] = data.elements || [];

      return elements
        .filter((elem) => {
          const tags = elem.tags || {};
          const religion = (tags.religion || '').toLowerCase();
          const name = (tags.name || '').toLowerCase();
          // Exclude explicitly non-Islamic unless name has masjid/musholla
          if (
            ['christian', 'hindu', 'buddhist', 'jewish', 'sikh'].includes(religion) &&
            !name.includes('masjid') &&
            !name.includes('musholla') &&
            !name.includes('mushola')
          ) {
            return false;
          }
          return true;
        })
        .map((elem) => {
          const mLat = elem.lat || elem.center?.lat || 0;
          const mLng = elem.lon || elem.center?.lon || 0;
          const tags = elem.tags || {};

          // Comprehensive name resolution
          const explicitName = (
            tags.name ||
            tags['name:id'] ||
            tags.official_name ||
            tags.alt_name ||
            tags.loc_name ||
            tags['name:en'] ||
            tags.operator ||
            tags.description ||
            ''
          ).trim();

          const isMusholla =
            explicitName.toLowerCase().includes('musholla') ||
            explicitName.toLowerCase().includes('mushola') ||
            explicitName.toLowerCase().includes('surau') ||
            explicitName.toLowerCase().includes('langgar') ||
            tags.building === 'musholla' ||
            tags.amenity === 'musholla';

          // Address parts
          const street = tags['addr:street'] ? `Jl. ${tags['addr:street']}` : '';
          const suburb = tags['addr:suburb'] || tags['addr:village'] || '';
          const city = tags['addr:city'] || '';
          const address = [street, suburb, city].filter(Boolean).join(', ') || undefined;

          let name = explicitName;
          const isNamed = Boolean(explicitName);

          if (!name) {
            if (street) {
              name = `${isMusholla ? 'Musholla' : 'Masjid'} (${street})`;
            } else if (suburb) {
              name = `${isMusholla ? 'Musholla' : 'Masjid'} (Wilayah ${suburb})`;
            } else {
              name = `${isMusholla ? 'Musholla' : 'Masjid'} (Belum Dinamai di Peta)`;
            }
          }

          return {
            id: `${elem.type}-${elem.id}`,
            name,
            lat: mLat,
            lng: mLng,
            distanceM: calculateDistanceMeters(lat, lng, mLat, mLng),
            address,
            type: isMusholla ? ('musholla' as const) : ('masjid' as const),
            isNamed,
            tags,
          };
        });
    } catch {
      clearTimeout(timeoutId);
    }
  }

  return [];
}

export async function fetchNearbyMosques(
  lat: number,
  lng: number,
  radiusKm: number = 3,
  forceRefresh: boolean = false
): Promise<Mosque[]> {
  const areaKey = `${lat.toFixed(2)}_${lng.toFixed(2)}_${radiusKm}km`;
  const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
  const radiusMeters = radiusKm * 1000;

  // 1. Custom user-pinned mosques
  const customMosques = getCustomMosques()
    .map((m) => ({
      ...m,
      distanceM: calculateDistanceMeters(lat, lng, m.lat, m.lng),
    }))
    .filter((m) => m.distanceM <= radiusMeters);

  // 2. Verified community mosques (always immediate & reliable)
  const verifiedNearby: Mosque[] = COMMUNITY_VERIFIED_MOSQUES.map((m) => ({
    ...m,
    distanceM: calculateDistanceMeters(lat, lng, m.lat, m.lng),
  })).filter((m) => m.distanceM <= radiusMeters);

  // 3. Check Dexie Cache
  if (!forceRefresh) {
    try {
      const cached = await db.cachedMosques.where('areaKey').equals(areaKey).first();
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
        const cachedList = (cached.mosques as Mosque[]).map((m) => ({
          ...m,
          distanceM: calculateDistanceMeters(lat, lng, m.lat, m.lng),
        }));

        const merged = [
          ...customMosques,
          ...verifiedNearby.filter((v) => !customMosques.some((cm) => cm.id === v.id)),
          ...cachedList.filter(
            (c) =>
              !customMosques.some((cm) => cm.id === c.id) &&
              !verifiedNearby.some((v) => v.id === c.id)
          ),
        ];

        return merged.sort((a, b) => {
          const aCustom = a.id.startsWith('custom-');
          const bCustom = b.id.startsWith('custom-');
          if (aCustom && !bCustom) return -1;
          if (!aCustom && bCustom) return 1;
          if (a.isNamed !== b.isNamed) return a.isNamed ? -1 : 1;
          return a.distanceM - b.distanceM;
        });
      }
    } catch (err) {
      console.warn('Failed to read mosque cache from Dexie', err);
    }
  }

  // 4. Query both Nominatim & Overpass in parallel with fast timeouts
  const [nominatimList, overpassList] = await Promise.all([
    fetchNominatimMosques(lat, lng, radiusKm),
    fetchOverpassMosques(lat, lng, radiusKm),
  ]);

  const rawCombined = [...nominatimList, ...overpassList];

  // 5. Proximity Deduplication (merge items within 30m)
  const deduplicated: Mosque[] = [];
  for (const m of rawCombined) {
    const existing = deduplicated.find(
      (d) => calculateDistanceMeters(d.lat, d.lng, m.lat, m.lng) < 30
    );
    if (!existing) {
      deduplicated.push(m);
    } else {
      if (!existing.isNamed && m.isNamed) {
        existing.name = m.name;
        existing.isNamed = true;
      }
    }
  }

  // 6. Merge: Custom pinned first, then verified mosques, then OSM deduplicated
  const allMosques = [
    ...customMosques,
    ...verifiedNearby.filter((v) => !customMosques.some((cm) => cm.id === v.id)),
    ...deduplicated.filter(
      (d) =>
        !customMosques.some((cm) => cm.id === d.id) &&
        !verifiedNearby.some((vm) => calculateDistanceMeters(vm.lat, vm.lng, d.lat, d.lng) < 60)
    ),
  ];

  // Sort: Custom user-pinned mosques first, then named mosques, then closest distance
  allMosques.sort((a, b) => {
    const aCustom = a.id.startsWith('custom-');
    const bCustom = b.id.startsWith('custom-');
    if (aCustom && !bCustom) return -1;
    if (!aCustom && bCustom) return 1;
    if (a.isNamed !== b.isNamed) {
      return a.isNamed ? -1 : 1;
    }
    return a.distanceM - b.distanceM;
  });

  // Save to Dexie cache if we found data
  if (deduplicated.length > 0) {
    try {
      const existing = await db.cachedMosques.where('areaKey').equals(areaKey).first();
      if (existing && existing.id) {
        await db.cachedMosques.update(existing.id, {
          mosques: deduplicated,
          timestamp: Date.now(),
        });
      } else {
        await db.cachedMosques.add({
          areaKey,
          mosques: deduplicated,
          timestamp: Date.now(),
        });
      }
    } catch (cacheErr) {
      console.warn('Failed to save mosques to Dexie cache', cacheErr);
    }
  }

  return allMosques;
}

export async function searchCityNominatim(
  cityName: string
): Promise<{ name: string; lat: number; lng: number }[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    cityName
  )}&countrycodes=id&limit=5`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'id',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Gagal mencari kota');
    const data = await res.json();

    return data.map((item: any) => ({
      name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}
