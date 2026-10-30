// PWA Service Worker Registration Utility
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
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
