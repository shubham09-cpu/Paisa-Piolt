# Architecture

Paisa Pilot is a single-page, frontend-only React app. This document explains how it is organised and why.

## Layers

```
 features/  ──►  components/ · hooks/ · context/  ──►  state/  ──►  lib/  ──►  data/ · utils/
 (screens)       (UI kit, wiring)                      (reducer)    (pure      (constants,
                                                                    domain)    formatting)
```

Dependencies only point to the right. The rule keeps the finance logic testable without React and lets screens be rearranged freely.

| Layer                | Responsibility                                                                                           | Knows about React? |
| -------------------- | -------------------------------------------------------------------------------------------------------- | :----------------: |
| `data/`              | Static configuration (budget, categories, views) and the initial month state                             |         No         |
| `utils/`             | Small helpers (`formatINR`, `clamp`)                                                                     |         No         |
| `lib/`               | **Domain logic.** `finance.js` (metrics, decisions, verdicts) and `sanitize.js` (validation)             |         No         |
| `state/reducer.js`   | The state machine. Validates every action and delegates money maths to `lib/`                            |         No         |
| `services/`          | Browser integrations behind small interfaces: `storage.js`, `serviceWorker.js`                           |         No         |
| `hooks/`             | `useFinance` (state + metrics + actions + persistence), `useTheme`, `useHashRoute`, `useFeedbackActions` |        Yes         |
| `context/`           | `FinanceProvider` and `ToastProvider` share hooks' output with the tree                                  |        Yes         |
| `components/`        | Reusable, feature-agnostic UI (`Card`, `AmountForm`, `ProgressBar`…) and the `AppShell`                  |        Yes         |
| `features/<screen>/` | One folder per screen; presentational, receive data via props                                            |        Yes         |
| `routes/`            | Maps a screen id to its component and decides what is lazy-loaded                                        |        Yes         |

## Data flow

```
 user input ─► AmountForm (parseAmount) ─► feature component
                                              │ calls
                                              ▼
                                  useFeedbackActions (adds toast)
                                              │
                                              ▼
                                  useFinance.actions ─► dispatch(action)
                                                              │
                                                              ▼
                                      financeReducer (re-validates, uses lib/applyDecision)
                                                              │ new state
                                                              ▼
                       computeMetrics(state) ─► { state, metrics, actions } ─► FinanceContext
                                                              │
                              ┌───────────────────────────────┴────────────┐
                              ▼                                            ▼
                       screens re-render                      debounced write to localStorage
```

Key properties:

- **One source of truth.** All state lives in one reducer; every number on screen is derived by `computeMetrics()`.
- **Previews equal outcomes.** The simulator calls `applyDecision()` on a copy of the state. The reducer calls the same function on commit.
- **Untrusted input everywhere.** Forms use `parseAmount()`, the reducer re-validates, and saved data goes through `sanitizeState()` on load.
- **Screens are dumb on purpose.** They take `state`, `metrics` and `actions` as props, which makes them trivial to test with fixtures (`src/test/fixtures.js`).

## Routing

`useHashRoute` keeps the active screen in `location.hash` (`#/goals`). Reasons for a hash router rather than a library:

- zero dependencies and no server configuration (works on any static host);
- back button, reload and deep links work;
- unknown hashes (such as in-page anchors) are ignored instead of breaking the screen.

`routes/index.jsx` is the single place that knows which screens are lazy. Home is part of the entry chunk; others load on demand and are prefetched when the browser is idle.

## State shape

```js
{
  day: 1..30, balance: number, habitPerDay: number,
  history: number[],                 // balance at the end of each day
  transactions: [{ id, day, label, amount, kind }],
  pendingSurprise: { label, amount } | null,
  commitments:   [{ id, label, amount, day }],
  subscriptions: [{ id, label, amount, day, active }],
  goals:         [{ id, label, icon, target, saved }],
}
```

`kind` is one of `spend | bill | once | saving | surprise | income | plan`.

## Persistence

`services/storage.js` wraps `localStorage` so a blocked or full store never throws. `useFinance` writes after a 300 ms pause and again on `pagehide`. Keys are versioned (`paisa-pilot:v1`) so a future data-shape change can migrate or discard old saves.

## Error handling

- Invalid input is rejected with a visible, accessible message (`AmountForm`).
- Invalid actions are ignored by the reducer (state is returned unchanged).
- Corrupt saved data falls back to a fresh month.
- Unexpected render errors are caught by `ErrorBoundary`, which offers a reset.

## Design decisions

| Decision                                | Why                                                                                 |
| --------------------------------------- | ----------------------------------------------------------------------------------- |
| `useReducer` + Context instead of Redux | Single reducer, small state; no extra dependency and no boilerplate                 |
| Context holds one memoised object       | Avoids re-creating the value each render; screens re-render only when state changes |
| Toasts wrap actions, not the reducer    | The reducer stays pure and testable; feedback is a UI concern                       |
| Plain CSS with tokens                   | Small bundle, no runtime cost, dark mode through variables                          |
| Hand-written service worker             | One small file, no build plugin needed                                              |

## Extending

See the "Where to add things" table in [CONTRIBUTING.md](../CONTRIBUTING.md).
