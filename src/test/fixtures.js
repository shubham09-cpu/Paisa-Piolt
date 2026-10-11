import { vi } from 'vitest';
import { createInitialState } from '../data/initialState.js';
import { computeMetrics } from '../lib/finance.js';

/** Shared test helper: a day-1 state, its metrics and spy-able actions. */
export function setup(overrides = {}) {
  const state = { ...createInitialState(), ...overrides };
  const actions = {
    logSpend: vi.fn(), addIncome: vi.fn(), advanceDays: vi.fn(), triggerSurprise: vi.fn(),
    resolveSurprise: vi.fn(), toggleSubscription: vi.fn(), saveToGoal: vi.fn(), commitDecision: vi.fn(), reset: vi.fn(),
  };
  return { state, metrics: computeMetrics(state), actions };
}
