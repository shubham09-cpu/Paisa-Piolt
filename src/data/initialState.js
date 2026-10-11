import { STARTING_BUDGET } from './constants.js';

/** Fresh state for day 1 of the month. */
export function createInitialState() {
  return {
    day: 1,
    balance: STARTING_BUDGET,
    habitPerDay: 0, // extra recurring daily spend from simulated "weekly habits"
    history: [STARTING_BUDGET], // balance at end of each day, index = day - 1
    transactions: [],
    pendingSurprise: null,
    commitments: [
      { id: 'rent', label: 'Rent share', amount: 3000, day: 2 },
      { id: 'recharge', label: 'Phone recharge', amount: 299, day: 8 },
      { id: 'study', label: 'Study material', amount: 500, day: 12 },
    ],
    subscriptions: [
      { id: 'spotify', label: 'Spotify', amount: 119, day: 6, active: true },
      { id: 'netflix', label: 'Netflix', amount: 199, day: 10, active: true },
      { id: 'youtube', label: 'YouTube Premium', amount: 129, day: 14, active: true },
      { id: 'cloud', label: 'Cloud storage', amount: 75, day: 20, active: true },
    ],
    goals: [
      { id: 'emergency', label: 'Emergency fund', icon: '🛟', target: 1500, saved: 0 },
      { id: 'trip', label: 'Goa trip', icon: '🏖️', target: 3000, saved: 0 },
      { id: 'earbuds', label: 'New earbuds', icon: '🎧', target: 2000, saved: 0 },
    ],
  };
}
