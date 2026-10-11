/** Static configuration for the 30-day ₹10,000 challenge. */
export const TOTAL_DAYS = 30;
export const STARTING_BUDGET = 10000;

/** Assumed everyday spend (₹/day) used to smooth the forecast on the first days. */
export const BASELINE_DAILY_SPEND = 180;
export const SMOOTHING_DAYS = 2;

export const SPEND_CATEGORIES = ['Food', 'Transport', 'Fun', 'Shopping', 'Other'];
/** Where extra income can come from (whitelisted; free text is never stored). */
export const INCOME_SOURCES = ['Gig work', 'Pocket money', 'Freelance', 'Cashback / refund', 'Other income'];

/** Every transaction kind the app can record. */
export const TX_KINDS = ['spend', 'bill', 'once', 'saving', 'surprise', 'income', 'plan'];
export const EMERGENCY_GOAL_ID = 'emergency';

/** Random unexpected expenses. */
export const SURPRISES = [
  { label: 'Cracked phone screen', amount: 1200 },
  { label: 'Friend’s birthday dinner', amount: 600 },
  { label: 'Bike puncture + repair', amount: 450 },
  { label: 'Urgent doctor visit', amount: 800 },
  { label: 'Laptop charger died', amount: 900 },
];

/** Decision types the simulator can preview. */
export const DECISION_TYPES = {
  once: { label: 'One-time purchase', unit: '' },
  subscription: { label: 'New subscription', unit: '/mo' },
  habit: { label: 'Weekly habit', unit: '/wk' },
  goal: { label: 'Save to goal', unit: '' },
};

export const VIEWS = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'simulate', label: 'Simulate', icon: '🧪' },
  { id: 'subscriptions', label: 'Bills', icon: '🔁' },
  { id: 'goals', label: 'Goals', icon: '🎯' },
  { id: 'insights', label: 'Insights', icon: '📊' },
  { id: 'activity', label: 'Activity', icon: '🧾' },
];
