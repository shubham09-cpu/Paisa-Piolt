# Testing

There are two layers. Together they run with `npm test` (39 tests, about 3 seconds).

| Layer         | Runner                           | Files               | What it covers                                                                  |
| ------------- | -------------------------------- | ------------------- | ------------------------------------------------------------------------------- |
| Logic         | `node --test` (built into Node)  | `src/**/*.test.js`  | Finance maths, sanitising, reducer, storage service, hash parsing (23 tests)    |
| UI components | Vitest + Testing Library + jsdom | `src/**/*.test.jsx` | QuickLog, Simulator, Subscriptions, Activity, toasts, full App flows (16 tests) |

## Commands

```bash
npm test               # everything
npm run test:unit      # logic only, no dependencies, very fast
npm run test:ui        # component tests
npx vitest             # watch mode while developing
```

## Principles

- **Test behaviour, not implementation.** Query by role and label (`getByRole('button', { name: 'Commit' })`), the way a user or screen reader finds things.
- **Pure logic gets unit tests first.** Anything in `src/lib` and `src/state` must have tests; they need no DOM.
- **Isolate the browser.** Services take their backend as a parameter (`createStorage(() => fakeBackend)`), so tests never touch real storage.
- **Share fixtures.** `src/test/fixtures.js#setup()` returns a day-1 `state`, its `metrics` and spy-able `actions`.
- **Clean up.** `src/test/setup.js` unmounts rendered components after every test.

## Writing a test

Logic (`src/lib/example.test.js`):

```js
import assert from 'node:assert/strict';
import { test } from 'node:test';

test('describes the behaviour in a sentence', () => {
  assert.equal(1 + 1, 2);
});
```

Add the file to `test:unit` in `package.json`.

Component (`src/features/x/X.test.jsx`):

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { setup } from '../../test/fixtures.js';

it('does something when clicked', async () => {
  const { state, actions } = setup();
  render(<X state={state} actions={actions} />);
  await userEvent.click(screen.getByRole('button', { name: 'Go' }));
  expect(actions.doThing).toHaveBeenCalled();
});
```

Vitest picks up every `*.test.jsx` automatically.

## Manual smoke test

1. `npm run build && npm run preview`
2. Log a spend, add income, jump 7 days, trigger a surprise, preview and commit a decision.
3. Reload: progress should persist. Open `#/goals` directly: the Goals screen should load.
4. In dev tools, set the network to offline and reload: the app should still open.
