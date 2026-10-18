import type { ChannelsData } from './types';

let cachedChannelsData: ChannelsData | null = null;

export async function getChannelsData(): Promise<ChannelsData> {
  if (cachedChannelsData) return cachedChannelsData;

  if (typeof window === 'undefined') {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'channels.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    cachedChannelsData = JSON.parse(raw);
    return cachedChannelsData!;
  }

  const res = await fetch('/data/channels.json');
  if (!res.ok) throw new Error('Gagal memuat daftar kajian ustadz');
  const data = await res.json();
  cachedChannelsData = data;
  return data;
}
