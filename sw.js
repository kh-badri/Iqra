/**
 * Iqra Service Worker
 * Versi Cache: v1.1.0
 * Strategi:
 * - App Shell & Offline: Cache-first
 * - Halaman Navigasi: Network-first dengan fallback ke cache dan /offline.html
 * - Static Assets (JS, CSS, Icons): Stale-While-Revalidate / Cache-First
 * - Audio Qori: Range Request handler untuk Safari/iOS dari Cache Storage
 */

const CACHE_NAME = 'iqra-static-v1.4.1';
const DATA_CACHE_NAME = 'iqra-data-v1.3.0';
const AUDIO_CACHE_NAME = 'iqra-audio-cache-v1';

const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/offline.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32.png',
  '/favicon.ico',
];

// Install: Precache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME && key !== AUDIO_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Message listener for skipWaiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Push event listener: menerima sinyal Web Push dari server cPanel via Google FCM saat aplikasi ditutup
self.addEventListener('push', (event) => {
  let title = '🕌 Waktu Sholat Telah Masuk!';
  let body = 'Mari bersiap dan segera menunaikan ibadah sholat.';
  let prayerId = 'sholat';

  if (event.data) {
    try {
      const json = event.data.json();
      if (json.title) title = json.title;
      if (json.body) body = json.body;
      if (json.prayerId) prayerId = json.prayerId;
    } catch (e) {
      body = event.data.text() || body;
    }
  }

  // Jika payload kosong (standar Web Push Apple iOS tickle push), deteksi waktu sholat dari jam lokal HP
  if (!event.data || prayerId === 'sholat') {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeTotal = hours * 60 + minutes;

    // Subuh (03:45 - 05:45), Dzuhur (11:45 - 14:30), Ashar (14:30 - 17:30), Maghrib (17:30 - 18:45), Isya (18:45 - 23:59 & 00:00 - 03:45)
    if (timeTotal >= 225 && timeTotal < 345) {
      prayerId = 'fajr';
      title = '🕌 Waktu Sholat Subuh Telah Masuk!';
      body = 'الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ. Waktu Subuh telah tiba. Mari raih keberkahan fajar.';
    } else if (timeTotal >= 705 && timeTotal < 870) {
      prayerId = 'dhuhr';
      title = '🕌 Waktu Sholat Dzuhur Telah Masuk!';
      body = "Waktu sholat Dzuhur telah tiba. Hayya 'alash Shalah.";
    } else if (timeTotal >= 870 && timeTotal < 1050) {
      prayerId = 'asr';
      title = '🕌 Waktu Sholat Ashar Telah Masuk!';
      body = "Waktu sholat Ashar telah tiba. Hayya 'alash Shalah.";
    } else if (timeTotal >= 1050 && timeTotal < 1125) {
      prayerId = 'maghrib';
      title = '🕌 Waktu Sholat Maghrib Telah Masuk!';
      body = "Waktu sholat Maghrib telah tiba. Hayya 'alash Shalah.";
    } else {
      prayerId = 'isha';
      title = '🕌 Waktu Sholat Isya Telah Masuk!';
      body = "Waktu sholat Isya telah tiba. Hayya 'alash Shalah.";
    }
  }

  const options = {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [500, 250, 500, 250, 500],
    tag: 'iqra-adhan-' + prayerId + '-' + new Date().toISOString().slice(0, 10),
    renotify: true,
    requireInteraction: true,
    data: {
      url: '/sholat/?adzan=' + prayerId,
      prayerId,
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click listener: buka / fokuskan aplikasi ketika user mengetuk notifikasi di HP
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = (event.notification.data && event.notification.data.url) || '/sholat/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            data: event.notification.data,
          });
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Helper: Handle Range Request untuk Audio Safari / iOS
async function handleRangeAudioRequest(request) {
  const cache = await caches.open(AUDIO_CACHE_NAME);
  const cachedResponse = await cache.match(request.url);

  if (!cachedResponse) {
    return fetch(request);
  }

  const rangeHeader = request.headers.get('range');
  if (!rangeHeader) {
    return cachedResponse;
  }

  const arrayBuffer = await cachedResponse.arrayBuffer();
  const bytes = /^bytes\=(\d+)\-(\d+)?$/g.exec(rangeHeader);
  if (bytes) {
    const start = Number(bytes[1]);
    const end = Number(bytes[2]) || arrayBuffer.byteLength - 1;
    const sliced = arrayBuffer.slice(start, end + 1);

    return new Response(sliced, {
      status: 206,
      statusText: 'Partial Content',
      headers: [
        ['Content-Type', cachedResponse.headers.get('Content-Type') || 'audio/mpeg'],
        ['Content-Range', `bytes ${start}-${end}/${arrayBuffer.byteLength}`],
        ['Content-Length', String(sliced.byteLength)],
        ['Accept-Ranges', 'bytes'],
      ],
    });
  }

  return cachedResponse;
}

// Fetch: Strategy dispatcher
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle Audio CDN requests (.mp3)
  if (url.pathname.endsWith('.mp3')) {
    event.respondWith(handleRangeAudioRequest(request));
    return;
  }

  // Handle Navigation (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // Handle public/data/ (JSON Content) -> Stale While Revalidate
  if (url.origin === self.location.origin && url.pathname.startsWith('/data/')) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const networkPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => null);

        return cachedResponse || networkPromise || caches.match('/offline.html');
      })
    );
    return;
  }

  // Handle Static Assets (Next.js _next/static, icons, fonts)
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/_next/static/') ||
      url.pathname.startsWith('/icons/') ||
      url.pathname.endsWith('.woff2') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js'))
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
