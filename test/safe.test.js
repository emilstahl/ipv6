const test = require('node:test');
const assert = require('node:assert/strict');
const { safeUrl, safeDate } = require('../src/utils/safe');

test('safeUrl rejects non-http(s) and malformed input', () => {
  assert.equal(safeUrl('javascript:alert(1)'), null);
  assert.equal(safeUrl('data:text/html,x'), null);
  assert.equal(safeUrl('not a url'), null);
  assert.equal(safeUrl(null), null);
});

test('safeUrl accepts http(s)', () => {
  assert.equal(safeUrl('https://x.dk').hostname, 'x.dk');
  assert.equal(safeUrl('http://x.dk').protocol, 'http:');
});

test('safeDate', () => {
  assert.equal(safeDate('not-a-date'), null);
  assert.equal(safeDate(undefined), null);
  assert.equal(safeDate('2026-07-31').getUTCFullYear(), 2026);
});
