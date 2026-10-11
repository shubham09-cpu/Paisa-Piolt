/** Static configuration for the 30-day ₹10,000 challenge. */
export const TOTAL_DAYS = 30;
export const STARTING_BUDGET = 10000;

/** Assumed everyday spend (₹/day) used to smooth the forecast on the first days. */
export const BASELINE_DAILY_SPEND = 180;
export const SMOOTHING_DAYS = 2;

/** localStorage keys, versioned so a future data-shape change can migrate or ignore old saves. */
export const STORAGE_KEYS = {
  state: 'paisa-pilot:v1',
  theme: 'paisa-pilot:theme',
  welcome: 'paisa-pilot:welcome-dismissed',
};

/** Delay before progress is written to storage (ms); batches rapid changes into one write. */
export const SAVE_DELAY_MS = 300;
/** How long a toast stays on screen (ms). */
export const TOAST_MS = 3200;
/** Maximum activity rows rendered at once; the rest sit behind a "Show more" button. */
export const ACTIVITY_PAGE_SIZE = 25;

/** Theme choices, in the order the toggle cycles through them. */
export const THEMES = ['auto', 'dark', 'light'];

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
