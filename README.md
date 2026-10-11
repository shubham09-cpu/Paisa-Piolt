# ✈️ Paisa Pilot: Survive the Month on ₹10,000

A frontend-only personal finance simulator for Gen Z. You get a ₹10,000 budget for 30 days. Every decision (a purchase, a subscription, a new habit, a savings top-up, an unexpected bill) visibly changes your **balance, daily allowance, goals, month forecast, risk and financial health**, and you can **preview any decision before committing** to it.

Problem statement: *Broke But Functional — Survive the Month*.

## Features

| Area | What it does |
|---|---|
| **Home** | Balance, safe-to-spend-today, bills ahead, forecast chart, health ring, risk level, coach tip, quick spend logging, day controls |
| **Decision simulator** | Preview a one-time purchase, new subscription, weekly habit or goal contribution. Shows before/after for balance, allowance, forecast, risk and health, plus a Safe / Tight / Not-now verdict |
| **Bills & subscriptions** | Fixed commitments plus subscription switches with monthly and yearly cost |
| **Goals** | Emergency fund, Goa trip and new earbuds with progress bars and quick or custom contributions |
| **Insights** | Explains *why* the risk and health numbers are what they are |
| **Activity** | Filterable transaction log and a month reset |
| **Income tracking** | Add income by source; a "Where your income went" card links income to bills, everyday spend, one-offs and savings |
| **Unexpected expenses** | Random surprise bills; pay from balance or the emergency fund, with a live impact preview |
| **Time travel** | Move forward 1 or 7 days; bills are charged automatically on their due day |

Progress is saved in `localStorage`. Light, dark and automatic themes.

## How the numbers connect

All screens read from one pure function, `computeMetrics()` in `src/lib/finance.js`.

```
freeCash        = balance − bills not yet charged
dailyAllowance  = freeCash ÷ days left
avgDaily        = smoothed everyday spend + simulated weekly habits ÷ 7
forecast        = freeCash − avgDaily × days left       (projected day-30 balance)
cover           = freeCash ÷ (avgDaily × days left)
risk   (0–100)  = clamp(100 × (1.5 − cover) ÷ 1.1)
health (0–100)  = runway 40 + savings 25 + subscription load 15 + outlook 20
```

The simulator calls the same `applyDecision()` the reducer uses when you commit, so a preview always matches the real outcome.

## Project structure

```
src/
├── App.jsx                  # view routing + lazy-loaded screens
├── main.jsx                 # entry point
├── data/                    # constants and the initial month state
├── lib/
│   ├── finance.js           # pure finance engine (metrics, decisions, verdicts)
│   ├── sanitize.js          # input validation + saved-data sanitiser
│   ├── *.test.js            # unit tests (node:test, no extra deps)
│   └── format.js            # ₹ formatting and clamp helper
├── state/reducer.js         # validated state machine (+ reducer.test.js)
├── hooks/useFinance.js      # state + derived metrics + actions + persistence
├── components/
│   ├── layout/AppShell.jsx  # header, responsive nav, main landmark
│   └── ui/                  # Card, AmountForm, ProgressBar, HealthRing, Badge, Switch, ErrorBoundary
├── features/                # one folder per screen
│   ├── dashboard/  simulator/  subscriptions/  goals/  insights/  activity/
└── styles/                  # tokens, base, layout, components
```

## Quality checklist

**Security & data sanitisation**
- Every amount goes through `parseAmount()` (`src/lib/sanitize.js`): rejects empty, zero, negative, NaN, Infinity and values over ₹1,00,000; rounds to paise.
- Reducers re-validate everything, so a bad action can never corrupt state. Categories, income sources and decision types are whitelisted.
- Saved `localStorage` data is untrusted: `sanitizeState()` rebuilds it, strips `<>`/control characters and falls back to a fresh month if malformed.
- No `dangerouslySetInnerHTML`, `eval` or third-party scripts; React escapes all output.
- `vercel.json` sets a strict Content-Security-Policy, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`.

**Runtime efficiency & Core Web Vitals**
- Secondary screens are code-split with `React.lazy`; React ships in its own cacheable chunk.
- Derived numbers are memoised (`useMemo`), dashboard cards are wrapped in `React.memo`, and the simulator slider uses `useDeferredValue`.
- No web fonts or images; system font stack. Chart SVG and loading state reserve their space to avoid layout shift.

**Component testing & reliability**
- `npm run test:unit`: 17 Node tests for the finance engine, sanitiser and reducer (no extra dependencies).
- `npm run test:ui`: Vitest + Testing Library tests for QuickLog, Simulator, Subscriptions and the App flow.
- An `ErrorBoundary` offers a reset instead of a blank screen if saved data is ever corrupted.

**Accessibility (ARIA & keyboard)**
- Landmarks (`header`, `nav`, `main`), skip link, visible focus rings, focus moves to the new screen on navigation.
- Labelled inputs with `aria-invalid` / `aria-describedby` and `role="alert"` errors; `role="switch"` toggles; `role="progressbar"` bars; text alternatives for the chart and ring.
- `aria-live` regions for the coach tip, simulator verdict and day/balance changes. Respects `prefers-reduced-motion` and `prefers-color-scheme`.
- Mobile tab bar → tablet two-column → desktop sidebar (breakpoints 640 / 900 / 1200 px), 44px touch targets.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests + component tests
npm run build    # production build in /dist
```

## Deploy on Vercel

Push this folder to GitHub, import the repo on vercel.com/new, and click **Deploy**. Vercel detects Vite automatically (build: `npm run build`, output: `dist`).
