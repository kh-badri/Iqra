import type { Prophet } from './types';

let cachedProphets: Prophet[] | null = null;

export async function getAllProphets(): Promise<Prophet[]> {
  if (cachedProphets) return cachedProphets;

  if (typeof window === 'undefined') {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'prophets.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    cachedProphets = JSON.parse(raw);
    return cachedProphets || [];
  }

  const res = await fetch('/data/prophets.json');
  if (!res.ok) {
    throw new Error('Gagal memuat data kisah 25 nabi');
  }
  const data = await res.json();
  cachedProphets = data;
  return data;
}

export async function getProphetBySlug(slug: string): Promise<Prophet | null> {
  const prophets = await getAllProphets();
  return prophets.find((p) => p.slug === slug) || null;
}
