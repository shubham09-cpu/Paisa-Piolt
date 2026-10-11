# Contributing to Paisa Pilot

Thanks for helping! This guide keeps changes easy to review.

## Setup

```bash
npm install
npm run dev
```

Node.js 18+ is required.

## Workflow

1. Create a branch: `git checkout -b feat/short-description`.
2. Make a focused change. Prefer several small pull requests over one large one.
3. Add or update tests (see [docs/TESTING.md](docs/TESTING.md)).
4. Run `npm run check`. It runs lint, the Prettier check, all tests and a production build. A change is ready when it passes.
5. Update `CHANGELOG.md` under an "Unreleased" heading and the docs if behaviour changed.
6. Open a pull request describing **what** changed and **why**, with screenshots for UI changes (phone and desktop width).

## Code conventions

- **Layering:** `features → components/hooks/context → state → lib → data/utils`. Never import upward (for example `lib/` must not import from React or `components/`).
- **Pure logic goes in `src/lib`.** Anything that computes money must be a pure function with unit tests.
- **Every money input** goes through `parseAmount()`. Never trust values from forms or `localStorage`.
- **Components:** function components, one per file, with `propTypes` (shared shapes live in `src/types.js`) and a one-line JSDoc comment saying what the component is for.
- **Styling:** use the design tokens in `src/styles/tokens.css`; no hard-coded colours. Write mobile-first (`min-width`) media queries.
- **Accessibility:** every interactive element needs a visible label or `aria-label`, a visible focus state, and a 44 px touch target. `npm run lint` includes jsx-a11y.
- **Formatting:** Prettier decides (`npm run format`). Do not hand-format.
- **Commits:** short imperative subject, for example `Add goal progress toast`.

## Reporting bugs

Open an issue with: what you did, what you expected, what happened, browser and screen size. If it involves saved data, include the output of `localStorage.getItem('paisa-pilot:v1')` (it contains no personal data).

## Where to add things

| I want to…          | Touch                                                                               |
| ------------------- | ----------------------------------------------------------------------------------- |
| Add a screen        | `src/features/<name>/`, then `VIEWS` in `data/constants.js` and `routes/index.jsx`  |
| Add a decision type | `DECISION_TYPES`, `applyDecision()` in `lib/finance.js`, reducer validation + tests |
| Change a formula    | `computeMetrics()` in `lib/finance.js`, plus `docs/FINANCE_MODEL.md` and tests      |
| Add a user action   | `state/reducer.js`, `hooks/useFinance.js`, optional toast in `useFeedbackActions`   |
