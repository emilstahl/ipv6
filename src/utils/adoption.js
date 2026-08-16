// CommonJS so `node --test` can load it without a transpile step;
// webpack's CJS interop handles the named imports in src/.
const { safeDate } = require('./safe');

// Earliest valid source date per ISP with (full or partial) IPv6 support,
// sorted chronologically and numbered cumulatively — the chart's step data.
// ISPs without any parseable source date are left out rather than plotted
// at an arbitrary position.
const adoptionEvents = ispData => ispData
  .filter(isp => isp.ipv6 === true && isp.sources && isp.sources.length > 0)
  .map(isp => {
    const dates = isp.sources.map(s => safeDate(s.date)).filter(Boolean);
    return dates.length ? { name: isp.name, date: new Date(Math.min(...dates)) } : null;
  })
  .filter(Boolean)
  .sort((a, b) => a.date - b.date)
  .map((e, i) => ({ ...e, count: i + 1 }));

module.exports = { adoptionEvents };
