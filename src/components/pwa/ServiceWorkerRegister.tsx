'use client';

import * as React from 'react';

export function ServiceWorkerRegister() {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Tunggu window load agar tidak memperlambat LCP / First Contentful Paint
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            // Cek update worker berkala
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (
                    installingWorker.state === 'installed' &&
                    navigator.serviceWorker.controller
                  ) {
                    // Update baru tersedia
                    window.dispatchEvent(new CustomEvent('swUpdateAvailable'));
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.warn('PWA: Service Worker registration failed:', error);
          });

        // Request storage persistence bila diizinkan
        if (navigator.storage && navigator.storage.persist) {
          navigator.storage.persist().catch(() => {});
        }
      });
    }
  }, []);

  return null;
}
