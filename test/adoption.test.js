const test = require('node:test');
const assert = require('node:assert/strict');
const { adoptionEvents } = require('../src/utils/adoption');

const isp = (name, ipv6, sources) => ({ name, ipv6, sources });
const src = date => ({ name: 'Kilde', url: null, date });

test('only ISPs with ipv6 and at least one source make the chart', () => {
  const events = adoptionEvents([
    isp('A', true, [src('2020-01-01')]),
    isp('No IPv6', false, [src('2019-01-01')]),
    isp('No sources', true, []),
    isp('Sources missing', true, undefined),
  ]);
  assert.deepEqual(events.map(e => e.name), ['A']);
});

test('the earliest source date wins, regardless of array order', () => {
  const [e] = adoptionEvents([
    isp('A', true, [src('2021-06-01'), src('2018-03-15'), src('2020-01-01')]),
  ]);
  assert.equal(e.date.toISOString().slice(0, 10), '2018-03-15');
});

test('invalid dates are skipped; an ISP with only invalid dates is dropped', () => {
  const events = adoptionEvents([
    isp('Mixed', true, [src('not-a-date'), src('2020-05-05')]),
    isp('All bad', true, [src('nope'), src('')]),
  ]);
  assert.deepEqual(events.map(e => e.name), ['Mixed']);
  assert.equal(events[0].date.toISOString().slice(0, 10), '2020-05-05');
});

test('events are sorted chronologically and counted cumulatively', () => {
  const events = adoptionEvents([
    isp('Late', true, [src('2022-01-01')]),
    isp('Early', true, [src('2015-01-01')]),
    isp('Middle', true, [src('2018-01-01')]),
  ]);
  assert.deepEqual(events.map(e => e.name), ['Early', 'Middle', 'Late']);
  assert.deepEqual(events.map(e => e.count), [1, 2, 3]);
});

test('empty input yields an empty chart, not a crash', () => {
  assert.deepEqual(adoptionEvents([]), []);
});
