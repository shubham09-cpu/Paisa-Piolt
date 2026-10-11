/**
 * Input validation and data sanitisation.
 * Everything that enters the app (form fields, saved localStorage data) passes through here.
 */
import { TOTAL_DAYS, TX_KINDS } from '../data/constants.js';
import { createInitialState } from '../data/initialState.js';

export const MAX_AMOUNT = 100000;

const isNumber = (v) => typeof v === 'number' && Number.isFinite(v);

/** Validate a money amount. Returns { value } on success or { error } for the UI to show. */
export function parseAmount(input, { max = MAX_AMOUNT } = {}) {
  const number = typeof input === 'number' ? input : Number(String(input ?? '').trim());
  if (!Number.isFinite(number) || number <= 0) return { error: 'Enter an amount greater than 0.' };
  if (number > max) return { error: `Amount can't be more than ₹${max.toLocaleString('en-IN')}.` };
  return { value: Math.round(number * 100) / 100 };
}

/** Strip angle brackets / control characters and cap length. */
export function cleanText(value, fallback = '') {
  if (typeof value !== 'string') return fallback;
  const cleaned = value
    // eslint-disable-next-line no-control-regex
    .replace(/[<>\u0000-\u001f]/g, '')
    .trim()
    .slice(0, 60);
  return cleaned || fallback;
}

const nonNegative = (v, fallback = 0) => (isNumber(v) && v >= 0 ? v : fallback);

/**
 * Rebuild a trusted state object from untrusted saved data.
 * Anything malformed falls back to a fresh month instead of crashing the app.
 */
export function sanitizeState(raw) {
  const base = createInitialState();
  if (!raw || typeof raw !== 'object') return base;
  if (!isNumber(raw.day) || raw.day < 1 || raw.day > TOTAL_DAYS) return base;
  if (!isNumber(raw.balance) || !Array.isArray(raw.history) || !Array.isArray(raw.transactions)) return base;
  if (!Array.isArray(raw.subscriptions) || !Array.isArray(raw.goals)) return base;

  const day = Math.floor(raw.day);

  const transactions = raw.transactions
    .filter((t) => t && TX_KINDS.includes(t.kind) && isNumber(t.amount) && isNumber(t.day))
    .slice(-500)
    .map((t, index) => ({
      id: index + 1,
      day: Math.min(TOTAL_DAYS, Math.max(1, Math.floor(t.day))),
      label: cleanText(t.label, 'Entry'),
      amount: t.amount,
      kind: t.kind,
    }));

  const subscriptions = raw.subscriptions
    .filter((s) => s && isNumber(s.amount) && s.amount >= 0 && isNumber(s.day))
    .slice(0, 30)
    .map((s, index) => ({
      id: cleanText(s.id, `sub-${index + 1}`),
      label: cleanText(s.label, 'Subscription'),
      amount: s.amount,
      day: Math.min(TOTAL_DAYS, Math.max(1, Math.floor(s.day))),
      active: s.active === true,
    }));

  // Goal definitions are fixed; only the saved amount is restored.
  const goals = base.goals.map((goal) => {
    const saved = raw.goals.find((g) => g && g.id === goal.id);
    return { ...goal, saved: nonNegative(saved?.saved) };
  });

  const surprise = raw.pendingSurprise;
  const pendingSurprise =
    surprise && isNumber(surprise.amount) && surprise.amount > 0
      ? { label: cleanText(surprise.label, 'Unexpected expense'), amount: surprise.amount }
      : null;

  return {
    ...base,
    day,
    balance: raw.balance,
    habitPerDay: nonNegative(raw.habitPerDay),
    history: raw.history.filter(isNumber).slice(0, TOTAL_DAYS),
    transactions,
    subscriptions,
    goals,
    pendingSurprise,
  };
}
