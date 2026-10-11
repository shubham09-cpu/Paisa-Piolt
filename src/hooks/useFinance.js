import { useEffect, useMemo, useReducer } from 'react';
import { SURPRISES } from '../data/constants.js';
import { createInitialState } from '../data/initialState.js';
import { computeMetrics } from '../lib/finance.js';
import { sanitizeState } from '../lib/sanitize.js';
import { financeReducer } from '../state/reducer.js';

const STORAGE_KEY = 'paisa-pilot:v1';

/** Restore saved progress. Saved data is untrusted, so it is sanitised first. */
function loadState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? sanitizeState(JSON.parse(saved)) : createInitialState();
  } catch {
    return createInitialState();
  }
}

/** Single entry point for app state, derived metrics and actions. */
export function useFinance() {
  const [state, dispatch] = useReducer(financeReducer, undefined, loadState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: the app still works in memory */
    }
  }, [state]);

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

  return { state, metrics, actions };
}
