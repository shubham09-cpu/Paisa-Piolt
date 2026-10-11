import { useCallback, useEffect, useState } from 'react';
import { VIEWS } from '../data/constants.js';

const isView = (id) => VIEWS.some((view) => view.id === id);

/** `#/goals` → `goals`. Returns `null` for anything that is not a known screen. */
export function parseHash(hash) {
  const id = String(hash).replace(/^#\/?/, '');
  return isView(id) ? id : null;
}

/**
 * Tiny hash router so every screen has a shareable URL and the browser back button works,
 * without adding a routing dependency.
 * @returns {[string, (id: string) => void]} the active screen id and a navigate function
 */
export function useHashRoute() {
  const [view, setView] = useState(() => parseHash(window.location.hash) ?? 'home');

  useEffect(() => {
    // Unknown hashes (e.g. in-page anchors) leave the current screen untouched.
    const onChange = () => setView((current) => parseHash(window.location.hash) ?? current);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  useEffect(() => {
    const label = VIEWS.find((v) => v.id === view)?.label;
    document.title = label && view !== 'home' ? `${label} · Paisa Pilot` : 'Paisa Pilot · Survive the Month on ₹10,000';
  }, [view]);

  const navigate = useCallback((id) => {
    if (!isView(id)) return;
    window.location.hash = `/${id}`;
    setView(id); // update immediately; hashchange then confirms the same value
  }, []);

  return [view, navigate];
}
