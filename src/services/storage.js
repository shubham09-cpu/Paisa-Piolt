/**
 * Thin, failure-tolerant wrapper around Web Storage.
 *
 * Storage can be missing or throw (private mode, blocked cookies, quota full), so every
 * call is wrapped: callers get a fallback / `false` instead of an exception.
 * The backend is injectable so the logic can be unit-tested without a browser.
 */

/**
 * @typedef {Object} StorageService
 * @property {(key: string, fallback?: any) => any} read   Parsed JSON value, or `fallback`.
 * @property {(key: string, value: any) => boolean} write  Returns `false` when the write failed.
 * @property {(key: string) => boolean} remove             Returns `false` when the removal failed.
 */

/**
 * Build a storage service on top of any Storage-like backend.
 * @param {() => Storage} [getBackend] Lazily resolves the backend (so a missing `window` never throws at import time).
 * @returns {StorageService}
 */
export function createStorage(getBackend = () => window.localStorage) {
  return {
    read(key, fallback = null) {
      try {
        const raw = getBackend().getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    write(key, value) {
      try {
        getBackend().setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    remove(key) {
      try {
        getBackend().removeItem(key);
        return true;
      } catch {
        return false;
      }
    },
  };
}

/** Default service used by the app (browser localStorage). */
export const storage = createStorage();
