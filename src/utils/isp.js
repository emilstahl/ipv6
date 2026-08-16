// CommonJS so `node --test` can load it without a transpile step;
// webpack's CJS interop handles the named imports in src/.
const { safeDate } = require('./safe');

// Presentation state per ISP. `partial` only counts when ipv6 is true, so a
// stale partial flag on an ISP without IPv6 cannot upgrade it to "Delvist".
const ispState = ({ ipv6, partial }) =>
  !ipv6
    ? { state: 'Nej', color: '#ef9a9a' }
    : partial
      ? { state: 'Delvist', color: '#ffe082' }
      : { state: 'Ja', color: '#a5d6a7' };

// Table sort order for the labels ispState produces. Kept next to ispState so
// a renamed label cannot silently fall out of the priority map.
const STATE_PRIORITY = { 'Ja': 0, 'Delvist': 1, 'Nej': 2 };
const compareState = (a, b) => STATE_PRIORITY[a] - STATE_PRIORITY[b];

// Treat a missing prefix as the largest, so it sorts last
const parsePrefix = p => (p ? parseInt(p.replace('/', ''), 10) : 128);
const comparePrefix = (a, b) => parsePrefix(a) - parsePrefix(b);

// Newest valid date across an ISP's sources, regardless of array order
const newestDate = sources => sources.reduce((max, s) => {
  const d = safeDate(s.date);
  return d && (!max || d > max) ? d : max;
}, null);

// The headline numbers above the table. partial only counts alongside ipv6,
// mirroring ispState.
const ispStats = ispData => {
  const total = ispData.length;
  const full = ispData.filter(x => x.ipv6 && !x.partial).length;
  const partial = ispData.filter(x => x.ipv6 && x.partial).length;
  return { total, full, partial, none: total - full - partial };
};

module.exports = { ispState, compareState, comparePrefix, newestDate, ispStats };
