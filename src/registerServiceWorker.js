// PWA Service Worker Registration Utility
export function registerServiceWorker() {
  if (typeof window === 'undefined') return;

  // Di mode pengembangan (development / localhost), jangan pernah pasang Service Worker!
  // Unregister service worker yang ada dan hapus cache agar Vite HMR tidak bentrok.
  const isDevHost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('172.');

  if (import.meta.env.DEV || isDevHost) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister().then(() => {
            console.log('[PWA] Service Worker berhasil dicabut dari mode development.');
          });
        }
      });
    }
    if ('caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => caches.delete(key));
      });
    }
    return;
  }

  // Hanya daftarkan Service Worker di production build pada domain live
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/sw.js';

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('[PWA] Service Worker terdaftar dengan scope:', registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (!installingWorker) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('[PWA] Versi konten baru tersedia. Siap dimuat ulang.');
                  window.dispatchEvent(new CustomEvent('pwa-update-available', { detail: registration }));
                } else {
                  console.log('[PWA] Konten siap digunakan secara offline.');
                  window.dispatchEvent(new CustomEvent('pwa-installed'));
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('[PWA] Gagal mendaftarkan Service Worker:', error);
        });
    });
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
