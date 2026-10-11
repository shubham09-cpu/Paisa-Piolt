import {
  DECISION_TYPES,
  EMERGENCY_GOAL_ID,
  INCOME_SOURCES,
  SPEND_CATEGORIES,
  TOTAL_DAYS,
} from '../data/constants.js';
import { createInitialState } from '../data/initialState.js';
import { applyDecision, getBillsDueToday, withTransaction } from '../lib/finance.js';
import { parseAmount } from '../lib/sanitize.js';

/** Validated amount or null. Reducers never trust the caller. */
const amountOf = (value) => parseAmount(value).value ?? null;

/** Central state machine. Every balance change goes through withTransaction. */
export function financeReducer(state, action) {
  switch (action.type) {
    case 'LOG_SPEND': {
      const amount = amountOf(action.amount);
      if (amount === null) return state;
      const category = SPEND_CATEGORIES.includes(action.category) ? action.category : 'Other';
      return withTransaction({ ...state, balance: state.balance - amount }, { label: category, amount, kind: 'spend' });
    }

    case 'ADD_INCOME': {
      const amount = amountOf(action.amount);
      if (amount === null) return state;
      const label = INCOME_SOURCES.includes(action.source) ? action.source : 'Other income';
      return withTransaction({ ...state, balance: state.balance + amount }, { label, amount, kind: 'income' });
    }

    case 'ADVANCE_DAYS': {
      const days = Math.min(TOTAL_DAYS, Math.max(0, Math.floor(Number(action.days) || 0)));
      let next = state;
      for (let i = 0; i < days && next.day < TOTAL_DAYS; i += 1) {
        next = { ...next, day: next.day + 1 };
        // Charge each bill that falls due on the new day.
        getBillsDueToday(next).forEach((bill) => {
          next = withTransaction({ ...next, balance: next.balance - bill.amount }, {
            label: bill.label,
            amount: bill.amount,
            kind: 'bill',
          });
        });
        const history = next.history.slice();
        history[next.day - 1] = next.balance;
        next = { ...next, history };
      }
      return next;
    }

    case 'TRIGGER_SURPRISE': {
      const amount = amountOf(action.surprise?.amount);
      if (amount === null) return state;
      return { ...state, pendingSurprise: { label: String(action.surprise.label).slice(0, 60), amount } };
    }

    case 'RESOLVE_SURPRISE': {
      const surprise = state.pendingSurprise;
      if (!surprise) return state;
      let next = { ...state, pendingSurprise: null };
      let remaining = surprise.amount;

      if (action.fromEmergency) {
        const fund = next.goals.find((g) => g.id === EMERGENCY_GOAL_ID);
        const used = Math.min(remaining, fund ? fund.saved : 0);
        if (used > 0) {
          next = {
            ...next,
            goals: next.goals.map((g) => (g.id === EMERGENCY_GOAL_ID ? { ...g, saved: g.saved - used } : g)),
          };
          next = withTransaction(next, { label: `${surprise.label} (emergency fund)`, amount: used, kind: 'surprise' });
          remaining -= used;
        }
      }
      if (remaining > 0) {
        next = withTransaction({ ...next, balance: next.balance - remaining }, {
          label: surprise.label,
          amount: remaining,
          kind: 'surprise',
        });
      }
      return next;
    }

    case 'TOGGLE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.map((s) => (s.id === action.id ? { ...s, active: !s.active } : s)),
      };

    case 'SAVE_TO_GOAL': {
      const amount = amountOf(action.amount);
      if (amount === null || !state.goals.some((g) => g.id === action.goalId)) return state;
      return applyDecision(state, { type: 'goal', amount, goalId: action.goalId });
    }

    case 'COMMIT_DECISION': {
      const { type, goalId } = action.decision ?? {};
      const amount = amountOf(action.decision?.amount);
      if (!Object.hasOwn(DECISION_TYPES, type) || amount === null) return state;
      if (type === 'goal' && !state.goals.some((g) => g.id === goalId)) return state;
      return applyDecision(state, { type, amount, goalId });
    }

    case 'RESET':
      return createInitialState();

    default:
      return state;
  }
}
