import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState } from '../data/initialState.js';
import { parseAmount, sanitizeState } from './sanitize.js';

test('parseAmount accepts normal amounts and rounds to paise', () => {
  assert.equal(parseAmount('250').value, 250);
  assert.equal(parseAmount(10.456).value, 10.46);
});

test('parseAmount rejects empty, zero, negative, text, Infinity and huge values', () => {
  for (const bad of ['', '   ', 0, -5, 'abc', NaN, Infinity, 1e9, null, undefined]) {
    assert.ok(parseAmount(bad).error, `should reject ${String(bad)}`);
  }
});

test('sanitizeState falls back to a fresh month for garbage input', () => {
  for (const bad of [null, 'x', 42, {}, { day: 99 }, { day: 3, balance: 'lots' }]) {
    assert.deepEqual(sanitizeState(bad), createInitialState());
  }
});

test('sanitizeState strips markup from saved labels', () => {
  const dirty = createInitialState();
  dirty.transactions = [{ id: 1, day: 1, label: '<img src=x onerror=alert(1)>', amount: 50, kind: 'spend' }];
  const clean = sanitizeState(JSON.parse(JSON.stringify(dirty)));
  assert.ok(!/[<>]/.test(clean.transactions[0].label));
});

test('sanitizeState drops unknown transaction kinds and keeps valid progress', () => {
  const saved = createInitialState();
  saved.day = 5;
  saved.balance = 7000;
  saved.transactions = [
    { id: 1, day: 2, label: 'Food', amount: 100, kind: 'spend' },
    { id: 2, day: 2, label: 'Hack', amount: 100, kind: 'drop-table' },
  ];
  const restored = sanitizeState(saved);
  assert.equal(restored.day, 5);
  assert.equal(restored.balance, 7000);
  assert.equal(restored.transactions.length, 1);
});
