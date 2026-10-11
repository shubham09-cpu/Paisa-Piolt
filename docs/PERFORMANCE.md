# Performance

## Current build (`npm run build`)

| Asset              |     Size (gzip) | Loaded                          |
| ------------------ | --------------: | ------------------------------- |
| `index-*.js` (app) |       ≈ 11.7 kB | First load                      |
| `react-*.js`       |       ≈ 45.3 kB | First load, cached long-term    |
| `index-*.css`      |        ≈ 4.2 kB | First load                      |
| Screen chunks (5)  | 0.7–1.6 kB each | On demand, prefetched when idle |

No web fonts, images or third-party scripts, so there is nothing to block rendering. `chunkSizeWarningLimit` is set to 150 kB so the build warns when a chunk grows.

## Techniques

| Technique                                                   | Where                                        | Benefit                                              |
| ----------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------- |
| Route-level code splitting                                  | `routes/index.jsx` (`React.lazy`)            | Smaller first load                                   |
| Idle prefetch of other screens                              | `prefetchRoutes()` via `requestIdleCallback` | Instant navigation                                   |
| Vendor chunk                                                | `vite.config.js` `manualChunks`              | React stays cached across deploys                    |
| Immutable caching of hashed assets                          | `vercel.json`, `public/sw.js`                | Repeat visits need no network                        |
| Offline service worker + manifest                           | `public/sw.js`, `manifest.webmanifest`       | Works offline; installable                           |
| Memoised derived data                                       | `useMemo` in `useFinance`, `Simulator`       | Metrics recomputed only when state changes           |
| `React.memo` on dashboard cards, bars, ring                 | `features/dashboard/*`, `components/ui/*`    | Skip re-renders when props are unchanged             |
| `useDeferredValue` on the slider                            | `Simulator.jsx`                              | Slider stays responsive while the table recalculates |
| Debounced persistence + `pagehide` flush                    | `useFinance`                                 | One storage write per burst of changes               |
| Paged list + `content-visibility: auto`                     | `Activity.jsx`, `components.css`             | Long histories stay cheap to render                  |
| Reserved space (skeleton, chart aspect-ratio, `min-height`) | `Skeleton.jsx`, CSS                          | Low Cumulative Layout Shift                          |
| System font stack                                           | `tokens.css`                                 | No font download, no text swap                       |

## Measuring

```bash
npm run build && npm run preview
# Chrome DevTools → Lighthouse (mobile) against http://localhost:4173
```

Budgets to keep: first-load JS under 70 kB gzip, any lazy screen under 10 kB gzip, no layout shift on screen change.

## Tips when adding features

- Prefer a new lazy route to growing the entry chunk.
- Keep heavy calculations in `lib/` and memoise their results at the hook or screen level.
- Do not add a UI or chart library for a single component; the forecast chart is about 30 lines of SVG.
