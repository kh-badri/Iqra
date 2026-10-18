import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllTajwidLessons, getTajwidLessonBySlug } from '@/features/tajwid/tajwidService';
import { TajwidLessonView } from '@/features/tajwid/components/TajwidLessonView';

export const dynamicParams = false;

interface TajwidPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const lessons = await getAllTajwidLessons();
  return lessons.map((l) => ({
    slug: l.slug,
  }));
}

export async function generateMetadata({ params }: TajwidPageProps): Promise<Metadata> {
  const lesson = await getTajwidLessonBySlug(params.slug);
  if (!lesson) {
    return {
      title: 'Materi Tajwid Tidak Ditemukan - Iqra',
    };
  }

  return {
    title: `${lesson.title} (${lesson.arabicTitle}) - Belajar Tajwid Iqra`,
    description: lesson.summary,
  };
}

export default async function TajwidLessonPage({ params }: TajwidPageProps) {
  const lessons = await getAllTajwidLessons();
  const index = lessons.findIndex((l) => l.slug === params.slug);

  if (index === -1) {
    notFound();
  }

  const lesson = lessons[index];
  const prevLesson = index > 0 ? lessons[index - 1] : null;
  const nextLesson = index < lessons.length - 1 ? lessons[index + 1] : null;

  return (
    <TajwidLessonView
      lesson={lesson}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
    />
  );
}
