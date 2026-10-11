import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState } from '../data/initialState.js';
import { financeReducer as reduce } from './reducer.js';

const fresh = createInitialState;

test('invalid spend amounts are ignored', () => {
  const state = fresh();
  for (const amount of [NaN, -5, 0, '', 'abc', 1e9]) {
    assert.equal(reduce(state, { type: 'LOG_SPEND', amount, category: 'Food' }), state);
  }
});

test('valid spend lowers balance and unknown categories become "Other"', () => {
  const next = reduce(fresh(), { type: 'LOG_SPEND', amount: 200, category: '<script>' });
  assert.equal(next.balance, 9800);
  assert.equal(next.transactions[0].label, 'Other');
});

test('income raises balance and only whitelisted sources are stored', () => {
  const next = reduce(fresh(), { type: 'ADD_INCOME', amount: 500, source: 'Freelance' });
  assert.equal(next.balance, 10500);
  assert.equal(next.transactions[0].label, 'Freelance');
  assert.equal(
    reduce(fresh(), { type: 'ADD_INCOME', amount: 1, source: '<b>x</b>' }).transactions[0].label,
    'Other income',
  );
});

test('advancing a day charges bills due that day', () => {
  const next = reduce(fresh(), { type: 'ADVANCE_DAYS', days: 1 });
  assert.equal(next.day, 2);
  assert.equal(next.balance, 7000); // rent share (₹3000) is due on day 2
});

test('time never goes past day 30', () => {
  const next = reduce(fresh(), { type: 'ADVANCE_DAYS', days: 999 });
  assert.equal(next.day, 30);
});

test('surprise can be paid from the emergency fund', () => {
  let s = reduce(fresh(), { type: 'SAVE_TO_GOAL', goalId: 'emergency', amount: 600 });
  s = reduce(s, { type: 'TRIGGER_SURPRISE', surprise: { label: 'Repair', amount: 500 } });
  s = reduce(s, { type: 'RESOLVE_SURPRISE', fromEmergency: true });
  assert.equal(s.goals.find((g) => g.id === 'emergency').saved, 100);
  assert.equal(s.balance, 9400);
  assert.equal(s.pendingSurprise, null);
});

test('committing an invalid decision does nothing', () => {
  const state = fresh();
  assert.equal(reduce(state, { type: 'COMMIT_DECISION', decision: { type: 'hack', amount: 100 } }), state);
  assert.equal(
    reduce(state, { type: 'COMMIT_DECISION', decision: { type: 'goal', amount: 100, goalId: 'nope' } }),
    state,
  );
});

test('reset returns a fresh month', () => {
  const dirty = reduce(fresh(), { type: 'LOG_SPEND', amount: 100, category: 'Food' });
  assert.deepEqual(reduce(dirty, { type: 'RESET' }), fresh());
});
