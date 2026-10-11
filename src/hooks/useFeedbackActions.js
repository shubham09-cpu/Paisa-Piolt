import { useMemo } from 'react';
import { formatINR } from '../utils/format.js';

/**
 * Wraps the raw finance actions so every user action also produces a toast confirmation.
 * Keeps UI feedback out of the reducer and out of the individual screens.
 *
 * @param {Record<string, Function>} actions raw actions from `useFinance`
 * @param {(message: string, tone?: string) => void} notify toast function
 */
export function useFeedbackActions(actions, notify) {
  return useMemo(
    () => ({
      ...actions,
      logSpend: (amount, category) => {
        actions.logSpend(amount, category);
        notify(`Logged ${formatINR(amount)} on ${category}`);
      },
      addIncome: (amount, source) => {
        actions.addIncome(amount, source);
        notify(`Added ${formatINR(amount)} from ${source}`);
      },
      advanceDays: (days) => {
        actions.advanceDays(days);
        notify(days === 1 ? 'Moved to the next day' : `Moved ${days} days ahead`, 'info');
      },
      resolveSurprise: (fromEmergency) => {
        actions.resolveSurprise(fromEmergency);
        notify(fromEmergency ? 'Paid using your emergency fund' : 'Surprise expense paid', 'warn');
      },
      toggleSubscription: (id) => {
        actions.toggleSubscription(id);
        notify('Subscription updated', 'info');
      },
      saveToGoal: (goalId, amount) => {
        actions.saveToGoal(goalId, amount);
        notify(`Saved ${formatINR(amount)} to your goal`);
      },
      commitDecision: (decision) => {
        actions.commitDecision(decision);
        notify('Decision committed', 'info');
      },
      reset: () => {
        actions.reset();
        notify('Month reset. Fresh start!', 'info');
      },
    }),
    [actions, notify],
  );
}
