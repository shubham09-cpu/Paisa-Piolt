import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createStorage } from './storage.js';

const fakeBackend = (initial = {}) => {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => void data.set(k, String(v)),
    removeItem: (k) => void data.delete(k),
  };
};

test('write then read round-trips JSON values', () => {
  const backend = fakeBackend();
  const store = createStorage(() => backend);
  assert.equal(store.write('a', { x: 1 }), true);
  assert.deepEqual(store.read('a'), { x: 1 });
});

test('read returns the fallback for missing keys and corrupt JSON', () => {
  const bad = fakeBackend({ bad: '{nope' });
  const store = createStorage(() => bad);
  assert.equal(store.read('missing', 'fb'), 'fb');
  assert.equal(store.read('bad', 'fb'), 'fb');
});

test('never throws when the backend is unavailable', () => {
  const store = createStorage(() => {
    throw new Error('blocked');
  });
  assert.equal(store.read('a', 7), 7);
  assert.equal(store.write('a', 1), false);
  assert.equal(store.remove('a'), false);
});

test('remove deletes a stored value', () => {
  const backend = fakeBackend({ a: '1' });
  const store = createStorage(() => backend);
  assert.equal(store.remove('a'), true);
  assert.equal(store.read('a', null), null);
});
