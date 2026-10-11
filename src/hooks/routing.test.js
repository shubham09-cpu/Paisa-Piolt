import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseHash } from './useHashRoute.js';

test('parseHash accepts known screens with or without the slash', () => {
  assert.equal(parseHash('#/goals'), 'goals');
  assert.equal(parseHash('#simulate'), 'simulate');
});

test('parseHash returns null for unknown or empty hashes', () => {
  assert.equal(parseHash('#/nope'), null);
  assert.equal(parseHash('#main'), null);
  assert.equal(parseHash(''), null);
});
