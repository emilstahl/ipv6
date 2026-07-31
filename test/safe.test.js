const test = require('node:test');
const assert = require('node:assert/strict');
const { safeUrl, safeDate, formatDate, parseJsonp } = require('../src/utils/safe');

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

test('parseJsonp unwraps the real endpoint response', () => {
  const body =
    'updateIPData({"address":"2001:db8::1","isp_name":"Example A/S","country":"Denmark"});';
  assert.deepEqual(parseJsonp(body), {
    address: '2001:db8::1',
    isp_name: 'Example A/S',
    country: 'Denmark',
  });
});

// ISP names really do contain parentheses, and the wrapper is found by the
// first "(" and the LAST ")", so inner ones must not confuse it.
test('parseJsonp tolerates parentheses inside string values', () => {
  const body = '__jp0({"address":"192.0.2.1","isp_name":"Foo (Bar) A/S"});';
  assert.equal(parseJsonp(body).isp_name, 'Foo (Bar) A/S');
});

// Documents the contract the service relies on: malformed input throws, and the
// caller turns that into { failed: true } rather than an unhandled rejection.
test('parseJsonp throws on anything that is not JSONP', () => {
  assert.throws(() => parseJsonp('<html>502 Bad Gateway</html>'));
  assert.throws(() => parseJsonp(''));
});
