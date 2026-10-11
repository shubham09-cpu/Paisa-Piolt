import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState } from '../data/initialState.js';
import { applyDecision, compareDecision, computeMetrics, riskLevel } from './finance.js';

test('day 1 metrics are sane', () => {
  const m = computeMetrics(createInitialState());
  assert.equal(m.daysLeft, 30);
  assert.equal(m.upcomingBills, 3000 + 299 + 500 + 119 + 199 + 129 + 75);
  assert.ok(m.dailyAllowance > 150 && m.dailyAllowance < 220);
  assert.equal(riskLevel(m.risk).label, 'Low');
});

test('a big purchase lowers allowance, forecast and health', () => {
  const { before, after } = compareDecision(createInitialState(), { type: 'once', amount: 4000 });
  assert.ok(after.dailyAllowance < before.dailyAllowance);
  assert.ok(after.forecast < before.forecast);
  assert.ok(after.health < before.health);
});

test('saving to a goal moves money out of balance into the goal', () => {
  const s = applyDecision(createInitialState(), { type: 'goal', amount: 500, goalId: 'trip' });
  assert.equal(s.balance, 9500);
  assert.equal(s.goals.find((g) => g.id === 'trip').saved, 500);
});

test('simulation never mutates the original state', () => {
  const original = createInitialState();
  compareDecision(original, { type: 'subscription', amount: 400 });
  assert.equal(original.subscriptions.length, 4);
});
