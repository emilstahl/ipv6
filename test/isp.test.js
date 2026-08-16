const test = require('node:test');
const assert = require('node:assert/strict');
const {
  ispState, compareState, comparePrefix, newestDate, ispStats,
} = require('../src/utils/isp');

test('ispState maps the ipv6/partial flags to label and color', () => {
  assert.deepEqual(ispState({ ipv6: true, partial: false }), { state: 'Ja', color: '#a5d6a7' });
  assert.deepEqual(ispState({ ipv6: true, partial: true }), { state: 'Delvist', color: '#ffe082' });
  assert.deepEqual(ispState({ ipv6: false, partial: false }), { state: 'Nej', color: '#ef9a9a' });
});

// A stale partial flag must not upgrade an ISP without IPv6
test('ispState ignores partial when ipv6 is false', () => {
  assert.equal(ispState({ ipv6: false, partial: true }).state, 'Nej');
});

test('compareState orders Ja before Delvist before Nej', () => {
  assert.deepEqual(
    ['Nej', 'Ja', 'Delvist'].sort(compareState),
    ['Ja', 'Delvist', 'Nej']
  );
});

// compareState only knows the labels ispState produces. This pins the
// coupling: if a label is renamed in one place but not the other, sorting
// silently degrades to NaN comparisons.
test('compareState covers exactly the labels ispState can produce', () => {
  for (const flags of [
    { ipv6: true, partial: false },
    { ipv6: true, partial: true },
    { ipv6: false, partial: false },
  ]) {
    const { state } = ispState(flags);
    assert.ok(Number.isFinite(compareState(state, 'Ja')), `no sort priority for "${state}"`);
  }
});

// null, not undefined: sort() skips the comparator entirely for undefined
// elements, and null is what gridjs hands over for a missing cell.
test('comparePrefix sorts numerically and puts missing prefixes last', () => {
  assert.deepEqual(
    ['/56', null, '/48', '/64'].sort(comparePrefix),
    ['/48', '/56', '/64', null]
  );
  assert.ok(comparePrefix('/128', null) <= 0, 'missing sorts with the largest real prefix');
});

test('newestDate picks the newest valid date regardless of order', () => {
  const d = newestDate([
    { date: '2018-06-17' },
    { date: '2021-08-09' },
    { date: '2017-06-06' },
  ]);
  assert.equal(d.toISOString().slice(0, 10), '2021-08-09');
});

test('newestDate skips invalid dates and returns null when none are valid', () => {
  assert.equal(
    newestDate([{ date: 'nope' }, { date: '2020-01-01' }]).toISOString().slice(0, 10),
    '2020-01-01'
  );
  assert.equal(newestDate([{ date: 'nope' }]), null);
  assert.equal(newestDate([]), null);
});

test('ispStats splits the list into full/partial/none and they add up', () => {
  const stats = ispStats([
    { ipv6: true, partial: false },
    { ipv6: true, partial: false },
    { ipv6: true, partial: true },
    { ipv6: false, partial: false },
    { ipv6: false, partial: true }, // stale flag — counts as none
  ]);
  assert.deepEqual(stats, { total: 5, full: 2, partial: 1, none: 2 });
});
