import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllProphets, getProphetBySlug } from '@/features/prophets/prophetService';
import { ProphetDetailView } from '@/features/prophets/components/ProphetDetailView';

export const dynamicParams = false;

interface ProphetPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const prophets = await getAllProphets();
  return prophets.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: ProphetPageProps): Promise<Metadata> {
  const prophet = await getProphetBySlug(params.slug);
  if (!prophet) {
    return {
      title: 'Kisah Nabi Tidak Ditemukan - Iqra',
    };
  }

  return {
    title: `Kisah Singkat ${prophet.name} (${prophet.arabicName}) - Iqra`,
    description: prophet.summary,
  };
}

export default async function ProphetDetailPage({ params }: ProphetPageProps) {
  const prophets = await getAllProphets();
  const index = prophets.findIndex((p) => p.slug === params.slug);

  if (index === -1) {
    notFound();
  }

  const prophet = prophets[index];
  const prevProphet = index > 0 ? prophets[index - 1] : null;
  const nextProphet = index < prophets.length - 1 ? prophets[index + 1] : null;

  return (
    <ProphetDetailView
      prophet={prophet}
      prevProphet={prevProphet}
      nextProphet={nextProphet}
    />
  );
}
