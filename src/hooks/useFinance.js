import { useEffect, useMemo, useReducer, useRef } from 'react';
import { SAVE_DELAY_MS, STORAGE_KEYS, SURPRISES } from '../data/constants.js';
import { createInitialState } from '../data/initialState.js';
import { computeMetrics } from '../lib/finance.js';
import { sanitizeState } from '../lib/sanitize.js';
import { storage } from '../services/storage.js';
import { financeReducer } from '../state/reducer.js';

/** Restore saved progress. Saved data is untrusted, so it is sanitised first. */
function loadState() {
  const saved = storage.read(STORAGE_KEYS.state);
  return saved ? sanitizeState(saved) : createInitialState();
}

/**
 * Single entry point for app state, derived metrics and actions.
 *
 * - State lives in one reducer (`state/reducer.js`).
 * - Metrics are derived with `computeMetrics` and memoised.
 * - Persistence is debounced so rapid interactions (e.g. dragging a slider that dispatches) cause one write,
 *   and the latest state is flushed when the tab is hidden or closed.
 *
 * @returns {{ state: object, metrics: object, actions: Record<string, Function> }}
 */
export function useFinance() {
  const [state, dispatch] = useReducer(financeReducer, undefined, loadState);
  const latest = useRef(state);
  latest.current = state;

  useEffect(() => {
    const timer = setTimeout(() => storage.write(STORAGE_KEYS.state, state), SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    const flush = () => storage.write(STORAGE_KEYS.state, latest.current);
    window.addEventListener('pagehide', flush);
    return () => window.removeEventListener('pagehide', flush);
  }, []);

  const metrics = useMemo(() => computeMetrics(state), [state]);

  const actions = useMemo(
    () => ({
      logSpend: (amount, category) => dispatch({ type: 'LOG_SPEND', amount, category }),
      addIncome: (amount, source) => dispatch({ type: 'ADD_INCOME', amount, source }),
      advanceDays: (days) => dispatch({ type: 'ADVANCE_DAYS', days }),
      triggerSurprise: () =>
        dispatch({ type: 'TRIGGER_SURPRISE', surprise: SURPRISES[Math.floor(Math.random() * SURPRISES.length)] }),
      resolveSurprise: (fromEmergency) => dispatch({ type: 'RESOLVE_SURPRISE', fromEmergency }),
      toggleSubscription: (id) => dispatch({ type: 'TOGGLE_SUBSCRIPTION', id }),
      saveToGoal: (goalId, amount) => dispatch({ type: 'SAVE_TO_GOAL', goalId, amount }),
      commitDecision: (decision) => dispatch({ type: 'COMMIT_DECISION', decision }),
      reset: () => dispatch({ type: 'RESET' }),
    }),
    [],
  );

  return useMemo(() => ({ state, metrics, actions }), [state, metrics, actions]);
}
