/**
 * Shared PropTypes shapes. Keeping them in one place documents the data model
 * and keeps component prop declarations short.
 */
import PropTypes from 'prop-types';

const bill = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  day: PropTypes.number.isRequired,
};

export const billShape = PropTypes.shape(bill);
export const subscriptionShape = PropTypes.shape({ ...bill, active: PropTypes.bool.isRequired });

export const goalShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  target: PropTypes.number.isRequired,
  saved: PropTypes.number.isRequired,
});

export const transactionShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  day: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  kind: PropTypes.string.isRequired,
});

export const stateShape = PropTypes.shape({
  day: PropTypes.number.isRequired,
  balance: PropTypes.number.isRequired,
  habitPerDay: PropTypes.number.isRequired,
  history: PropTypes.arrayOf(PropTypes.number).isRequired,
  transactions: PropTypes.arrayOf(transactionShape).isRequired,
  pendingSurprise: PropTypes.shape({ label: PropTypes.string, amount: PropTypes.number }),
  commitments: PropTypes.arrayOf(billShape).isRequired,
  subscriptions: PropTypes.arrayOf(subscriptionShape).isRequired,
  goals: PropTypes.arrayOf(goalShape).isRequired,
});

export const metricsShape = PropTypes.shape({
  daysLeft: PropTypes.number.isRequired,
  upcomingBills: PropTypes.number.isRequired,
  avgDaily: PropTypes.number.isRequired,
  freeCash: PropTypes.number.isRequired,
  dailyAllowance: PropTypes.number.isRequired,
  forecast: PropTypes.number.isRequired,
  cover: PropTypes.number.isRequired,
  risk: PropTypes.number.isRequired,
  health: PropTypes.number.isRequired,
  subscriptionLoad: PropTypes.number.isRequired,
  totalSaved: PropTypes.number.isRequired,
  goalSurplus: PropTypes.number.isRequired,
});

/** Object of action functions returned by `useFinance`. */
export const actionsShape = PropTypes.objectOf(PropTypes.func);

export const toneType = PropTypes.oneOf(['good', 'warn', 'bad', 'info', 'brand', 'neutral']);
