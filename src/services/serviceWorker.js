/**
 * Registers the offline-cache service worker (`public/sw.js`).
 * Only runs in production builds so it never interferes with the Vite dev server.
 */
export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      /* offline support is a progressive enhancement; ignore failures */
    });
  });
}
