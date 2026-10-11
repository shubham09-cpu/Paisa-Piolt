# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/).

## [1.1.0] - 2026-10-11

### Added

- **Architecture:** `FinanceContext` and `ToastContext` providers, `services/` (safe storage, service worker registration), `routes/` table with idle prefetching, hooks `useTheme`, `useHashRoute` and `useFeedbackActions`, and `utils/format.js`.
- **UI/UX:** toast confirmations, first-run welcome card, skeleton loading state, empty state, inline reset confirmation, hover / active / touch states, card entrance animation, sticky blurred header, remembered theme.
- **Responsive:** breakpoints at 360, 480, 640, 768, 900, 1024, 1200 and 1440 px, landscape-phone rules, `pointer: coarse` sizing, container query, safe-area insets, print styles.
- **Performance:** offline service worker and web manifest, debounced persistence, paged activity list with `content-visibility`, route prefetch on idle, chunk-size budget.
- **Code quality:** ESLint (React, hooks, jsx-a11y), Prettier, EditorConfig, PropTypes on every component, shared `types.js`.
- **Documentation:** rewritten README with screenshots, `docs/` (architecture, finance model, accessibility, testing, performance), CONTRIBUTING, LICENSE, `.env.example`.
- **Tests:** storage service, router, toasts, activity screen, App toast and routing flows (39 tests in total).

### Changed

- Screens are chosen by a hash route (`#/goals`) instead of component state; the skip link focuses `<main>` directly.
- Cards are labelled regions (`aria-labelledby`); warning colour darkened to meet 4.5:1 contrast on light backgrounds.
- Test setup now cleans up the DOM after each test.

## [1.0.0]

- Initial release: dashboard, decision simulator, bills, goals, insights, activity log, unexpected expenses and time travel.
