import { useEffect, useRef, useState } from 'react';
import { TOTAL_DAYS, VIEWS } from '../../data/constants.js';
import { formatINR } from '../../lib/format.js';

/** Header, responsive navigation (sidebar on desktop, tab bar on mobile) and main landmark. */
export default function AppShell({ view, onNavigate, state, children }) {
  const [theme, setTheme] = useState('auto');
  const mainRef = useRef(null);
  const firstRender = useRef(true);

  // Move keyboard/screen-reader focus to the new screen when navigating.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [view]);

  useEffect(() => {
    if (theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const cycleTheme = () => setTheme((t) => (t === 'auto' ? 'dark' : t === 'dark' ? 'light' : 'auto'));

  return (
    <div className="shell">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="shell__header">
        <div className="brand">
          <span className="brand__logo" aria-hidden="true">✈️</span>
          <div>
            <h1 className="brand__name">Paisa Pilot</h1>
            <p className="muted">Day {state.day} of {TOTAL_DAYS}</p>
          </div>
        </div>
        <button type="button" className="btn btn--ghost" onClick={cycleTheme} aria-label={`Theme: ${theme}. Switch theme`}>
          ◐ <span className="hide-sm">{theme}</span>
        </button>
      </header>

      <nav className="nav" aria-label="Main">
        {VIEWS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav__item ${view === item.id ? 'is-active' : ''}`}
            aria-current={view === item.id ? 'page' : undefined}
            onClick={() => onNavigate(item.id)}
          >
            <span aria-hidden="true" className="nav__icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <p className="sr-only" role="status" aria-live="polite">Day {state.day} of {TOTAL_DAYS}. Balance {formatINR(state.balance)}.</p>
      <main id="main" ref={mainRef} className="shell__main" tabIndex={-1}>{children}</main>
    </div>
  );
}
