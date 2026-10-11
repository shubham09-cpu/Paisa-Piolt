import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS, THEMES } from '../data/constants.js';
import { storage } from '../services/storage.js';

/**
 * Theme preference: `auto` follows the OS, `light` / `dark` force a theme.
 * The choice is persisted and mirrored to `<html data-theme>` (CSS reads that attribute).
 * @returns {{ theme: 'auto' | 'light' | 'dark', cycleTheme: () => void }}
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = storage.read(STORAGE_KEYS.theme, 'auto');
    return THEMES.includes(saved) ? saved : 'auto';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    storage.write(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const cycleTheme = useCallback(() => setTheme((t) => THEMES[(THEMES.indexOf(t) + 1) % THEMES.length]), []);

  return { theme, cycleTheme };
}
