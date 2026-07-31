const test = require('node:test');
const assert = require('node:assert/strict');
const { safeUrl, safeDate, formatDate } = require('../src/utils/safe');

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

// Replaced date-fns format(d, 'dd/MM/yyyy'). Pin the output so the swap to
// Intl cannot silently change what the table shows.
test('formatDate renders dd/MM/yyyy', () => {
  assert.equal(formatDate(safeDate('2026-07-31')), '31/07/2026');
  assert.equal(formatDate(safeDate('2019-01-05')), '05/01/2019');
  assert.equal(formatDate(safeDate('2020-02-29')), '29/02/2020');
});
