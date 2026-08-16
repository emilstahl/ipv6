const test = require('node:test');
const assert = require('node:assert/strict');
const { classifyAddress } = require('../src/utils/ipcheck');

test('a colon means IPv6, and the IPv4 slot stays empty', () => {
  const r = classifyAddress({ address: '2001:db8::1', isp_name: 'Example A/S' });
  assert.deepEqual(r, {
    ispName: 'Example A/S',
    ipv6Address: '2001:db8::1',
    ipv4Address: null,
  });
});

test('no colon means IPv4, and the IPv6 slot stays empty', () => {
  const r = classifyAddress({ address: '192.0.2.1', isp_name: 'Example A/S' });
  assert.deepEqual(r, {
    ispName: 'Example A/S',
    ipv6Address: null,
    ipv4Address: '192.0.2.1',
  });
});

// The endpoint has no documented schema. If it ever answers without an
// address, the service's .catch must kick in — so this has to throw, not
// classify garbage.
test('a payload without an address throws', () => {
  assert.throws(() => classifyAddress({}));
  assert.throws(() => classifyAddress({ isp_name: 'Example A/S' }));
});

test('a missing isp_name is passed through as undefined, not invented', () => {
  assert.equal(classifyAddress({ address: '192.0.2.1' }).ispName, undefined);
});
