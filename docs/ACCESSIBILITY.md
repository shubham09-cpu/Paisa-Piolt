# Accessibility

Target: **WCAG 2.1 AA**. Accessibility is enforced by lint rules, by tests that query the UI the way assistive technology does (by role and label), and by the manual checklist below.

## What is implemented

| Area              | Implementation                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Structure         | `header`, `nav` (labelled "Main"), `main`, one `h1`, then `h2` per card; each card is a region labelled by its heading |
| Keyboard          | Everything is a native `button`, `input` or `select`; skip link; visible 3 px focus ring; no keyboard traps            |
| Focus management  | After navigating, focus moves to `<main>`; the skip link focuses `<main>` directly (it does not change the URL hash)   |
| Forms             | Every input has a label (visible or `sr-only`); errors use `role="alert"`, `aria-invalid` and `aria-describedby`       |
| Custom controls   | Switches use `role="switch"` + `aria-checked`; bars use `role="progressbar"` with `aria-valuenow/min/max`              |
| Non-text content  | The forecast chart and health ring are `role="img"` with a spoken summary; emoji icons are `aria-hidden`               |
| Live updates      | Polite `aria-live` regions for the coach tip, simulator verdict, toasts, and the day/balance announcement              |
| Colour & contrast | Text colours meet 4.5:1 in both themes; status is never colour-only (labels such as "Low", "Tight" accompany colour)   |
| Touch targets     | Buttons, chips and inputs are at least 44 px tall; switches grow on coarse pointers                                    |
| Motion            | `prefers-reduced-motion` disables all transitions and animations                                                       |
| User preferences  | `prefers-color-scheme` + manual theme toggle, `prefers-contrast: more`, `forced-colors: active`                        |
| Zoom / reflow     | Layout reflows without horizontal scrolling from 320 px; text uses `rem` and `clamp()`; viewport allows zooming        |

## Automated checks

- `npm run lint` runs `eslint-plugin-jsx-a11y` on every component.
- UI tests find elements via `getByRole` / `getByLabelText`; if a control loses its accessible name, the test fails.

## Manual checklist (before a release)

1. Tab through every screen using only the keyboard; confirm the order is logical and the focus ring is always visible.
2. Use the skip link and confirm focus lands in the main content.
3. Turn on a screen reader (VoiceOver, TalkBack or NVDA): log a spend with a bad value, confirm the error is announced; log a valid one, confirm the toast and balance are announced.
4. Zoom to 200 % and to 400 % (320 px wide): nothing is cut off and there is no horizontal scrolling.
5. Toggle dark mode and "reduce motion" at the OS level.
6. Run Lighthouse or axe DevTools and fix any reported issue.

## Known limitations

- Toasts disappear after about 3 seconds. Each has a close button and the same information is reflected on screen.
- The chart shows a summary, not a data table; the underlying numbers are available on the Insights and Activity screens.

## Last audit

axe-core 4 (rules: WCAG 2.0/2.1 A and AA plus best practices) was run in Chromium at 390 px against all six screens in light and dark mode: **0 violations**.
