import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Amiri } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { GoogleAuthProvider } from '@/providers/GoogleAuthProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import { ServiceWorkerRegister } from '@/components/pwa/ServiceWorkerRegister';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F6F8F5' },
    { media: '(prefers-color-scheme: dark)', color: '#0E140F' },
  ],
};

export const metadata: Metadata = {
  title: 'Iqra - Belajar Agama Islam',
  description:
    "Aplikasi web dan PWA untuk membaca Al-Qur'an, hadits shahih, jadwal sholat, masjid terdekat, kajian ustadz, kisah nabi, dan tajwid.",
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Iqra',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Iqra - Belajar Agama Islam',
    description: "Belajar Al-Qur'an, hadits, jadwal sholat, dan ilmu Islam kapan saja.",
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={`${plusJakarta.variable} ${amiri.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <GoogleAuthProvider>
            <ServiceWorkerRegister />
            <AppLayout>{children}</AppLayout>
          </GoogleAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
