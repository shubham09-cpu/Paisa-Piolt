/**
 * Core finance engine. Pure functions only: every screen reads from
 * computeMetrics(), and the simulator reuses applyDecision() so a preview
 * is guaranteed to match what committing the decision will do.
 */
import { BASELINE_DAILY_SPEND, SMOOTHING_DAYS, STARTING_BUDGET, TOTAL_DAYS } from '../data/constants.js';
import { clamp } from '../utils/format.js';

const sum = (items, pick = (x) => x) => items.reduce((total, item) => total + pick(item), 0);

/** All bills that recur this month: commitments plus active subscriptions. */
export function getAllBills(state) {
  return [...state.commitments, ...state.subscriptions.filter((s) => s.active)];
}

/** Bills that have not been charged yet. */
export function getUpcomingBills(state) {
  return getAllBills(state).filter((bill) => bill.day > state.day);
}

/** Bills that fall due on the current day (charged when a day starts). */
export function getBillsDueToday(state) {
  return getAllBills(state).filter((bill) => bill.day === state.day);
}

/** Map a 0-100 risk score to a label and tone. */
export function riskLevel(score) {
  if (score < 30) return { label: 'Low', tone: 'good' };
  if (score < 60) return { label: 'Medium', tone: 'warn' };
  return { label: 'High', tone: 'bad' };
}

/** Map a 0-100 health score to a label and tone. */
export function healthLevel(score) {
  if (score >= 70) return { label: 'Thriving', tone: 'good' };
  if (score >= 45) return { label: 'Okay', tone: 'warn' };
  return { label: 'Fragile', tone: 'bad' };
}

/**
 * Derive every number the UI shows from the raw state.
 *
 *  freeCash       = balance − bills still to be charged
 *  dailyAllowance = freeCash / days left
 *  avgDaily       = smoothed everyday spend + simulated habits
 *  forecast       = freeCash − avgDaily × days left   (projected balance on day 30)
 *  cover          = freeCash / projected spend        (>1 means you can afford your pace)
 *  risk (0-100)   = how far cover falls below 1.5
 *  health (0-100) = runway 40 + savings 25 + subscription load 15 + forecast 20
 */
export function computeMetrics(state) {
  const daysLeft = TOTAL_DAYS - state.day + 1;
  const upcomingBills = sum(getUpcomingBills(state), (b) => b.amount);
  const everydaySpent = sum(
    state.transactions.filter((t) => t.kind === 'spend'),
    (t) => t.amount,
  );
  const avgDaily =
    (everydaySpent + BASELINE_DAILY_SPEND * SMOOTHING_DAYS) / (state.day + SMOOTHING_DAYS) + state.habitPerDay;

  const freeCash = state.balance - upcomingBills;
  const dailyAllowance = Math.max(0, freeCash) / daysLeft;
  const forecast = freeCash - avgDaily * daysLeft;
  const cover = freeCash / Math.max(1, avgDaily * daysLeft);

  const risk = Math.round(clamp((100 * (1.5 - cover)) / 1.1, 0, 100));
  const subscriptionLoad = sum(
    state.subscriptions.filter((s) => s.active),
    (s) => s.amount,
  );
  const totalSaved = sum(state.goals, (g) => g.saved);

  const healthParts = [
    { id: 'runway', label: 'Cash runway', max: 40, points: (40 * Math.min(cover, 1.5)) / 1.5 },
    { id: 'savings', label: 'Savings progress', max: 25, points: 25 * Math.min(totalSaved / 2000, 1) },
    { id: 'subs', label: 'Subscription load', max: 15, points: 15 * (1 - clamp(subscriptionLoad / 1500, 0, 1)) },
    {
      id: 'forecast',
      label: 'Month-end outlook',
      max: 20,
      points: 20 * (forecast >= 0 ? 1 : clamp(1 + forecast / 2000, 0, 1)),
    },
  ].map((part) => ({ ...part, points: Math.max(0, part.points) }));
  const health = Math.round(sum(healthParts, (p) => p.points));

  const total = (kind) =>
    sum(
      state.transactions.filter((t) => t.kind === kind),
      (t) => t.amount,
    );
  // Where the month's income has gone so far.
  const flow = {
    income: STARTING_BUDGET + total('income'),
    bills: total('bill'),
    everyday: total('spend'),
    oneOff: total('once') + total('surprise'),
    saved: total('saving'),
  };

  return {
    flow,
    daysLeft,
    upcomingBills,
    avgDaily,
    freeCash,
    dailyAllowance,
    forecast,
    cover,
    risk,
    health,
    healthParts,
    subscriptionLoad,
    totalSaved,
    goalSurplus: Math.max(0, forecast),
  };
}

/** Add a transaction and refresh today's balance in the history series. */
export function withTransaction(state, { label, amount, kind }) {
  const history = state.history.slice();
  history[state.day - 1] = state.balance;
  return {
    ...state,
    history,
    transactions: [...state.transactions, { id: state.transactions.length + 1, day: state.day, label, amount, kind }],
  };
}

/**
 * Apply a simulated or committed decision and return the new state.
 * decision = { type: 'once' | 'subscription' | 'habit' | 'goal', amount, goalId? }
 */
export function applyDecision(state, { type, amount, goalId }) {
  switch (type) {
    case 'once':
      return withTransaction(
        { ...state, balance: state.balance - amount },
        {
          label: 'One-time purchase',
          amount,
          kind: 'once',
        },
      );
    case 'subscription': {
      const subscription = {
        id: `sub-${state.subscriptions.length + 1}`,
        label: 'New subscription',
        amount,
        day: Math.min(30, state.day + 1),
        active: true,
      };
      return withTransaction(
        { ...state, subscriptions: [...state.subscriptions, subscription] },
        { label: 'Added subscription', amount: 0, kind: 'plan' },
      );
    }
    case 'habit':
      return withTransaction(
        { ...state, habitPerDay: state.habitPerDay + amount / 7 },
        { label: 'New weekly habit', amount: 0, kind: 'plan' },
      );
    case 'goal': {
      const goal = state.goals.find((g) => g.id === goalId);
      const goals = state.goals.map((g) => (g.id === goalId ? { ...g, saved: g.saved + amount } : g));
      return withTransaction(
        { ...state, balance: state.balance - amount, goals },
        {
          label: `Saved → ${goal ? goal.label : 'goal'}`,
          amount,
          kind: 'saving',
        },
      );
    }
    default:
      return state;
  }
}

/** Safe / Tight / Not-now verdict for a set of metrics (used by the simulator). */
export function getVerdict(metrics) {
  if (metrics.risk >= 60 || metrics.forecast < 0)
    return { tone: 'bad', text: 'Not now. This pushes you into the danger zone.' };
  if (metrics.risk >= 30) return { tone: 'warn', text: 'Doable, but your cushion gets thin.' };
  return { tone: 'good', text: 'Safe. You can afford this.' };
}

/** Before/after comparison used by the simulator. */
export function compareDecision(state, decision) {
  const next = applyDecision(state, decision);
  const before = computeMetrics(state);
  const after = computeMetrics(next);
  return { before, after, balanceBefore: state.balance, balanceAfter: next.balance, verdict: getVerdict(after) };
}

/** One actionable sentence for the coach card. */
export function buildCoachTip(metrics) {
  const allowance = Math.round(metrics.dailyAllowance);
  if (metrics.forecast < 0)
    return {
      icon: '🚨',
      tone: 'bad',
      text: `At this pace you'll finish about ₹${Math.abs(Math.round(metrics.forecast))} short. Keep daily spend near ₹${allowance} or pause a subscription.`,
    };
  if (metrics.risk >= 30)
    return { icon: '⚠️', tone: 'warn', text: `Runway is tight. Staying under ₹${allowance} a day keeps a cushion.` };
  if (metrics.totalSaved < 1500)
    return {
      icon: '💡',
      tone: 'good',
      text: `You're on track with about ₹${Math.round(metrics.goalSurplus)} projected spare. Park some in your emergency fund.`,
    };
  return { icon: '🔥', tone: 'good', text: 'Strong month. Your safety net is growing, so keep the streak going.' };
}
