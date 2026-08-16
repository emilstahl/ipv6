// Semantic checks on data/*.json that the JSON schema cannot express.
// CI already validates shape with ajv; this guards meaning.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { safeUrl, safeDate } = require('../src/utils/safe');

const dataDir = path.join(__dirname, '..', 'data');
const isps = fs.readdirSync(dataDir)
  .filter(f => f.endsWith('.json'))
  .map(f => ({ file: f, ...JSON.parse(fs.readFileSync(path.join(dataDir, f), 'utf8')) }));

test('the data directory is populated', () => {
  assert.ok(isps.length >= 40, `only found ${isps.length} data files`);
});

test('every ISP url is a valid http(s) URL', () => {
  for (const isp of isps) {
    assert.ok(safeUrl(isp.url), `${isp.file}: unparseable url ${isp.url}`);
  }
});

test('source urls are valid http(s) URLs when present', () => {
  for (const isp of isps) {
    for (const s of isp.sources || []) {
      if (s.url != null) {
        assert.ok(safeUrl(s.url), `${isp.file}: unparseable source url ${s.url}`);
      }
    }
  }
});

// The schema's date pattern accepts 2026-13-99; this does not.
test('source dates are real dates and not in the future', () => {
  const now = new Date();
  for (const isp of isps) {
    for (const s of isp.sources || []) {
      const d = safeDate(s.date);
      assert.ok(d, `${isp.file}: invalid date ${s.date}`);
      assert.ok(d <= now, `${isp.file}: source dated in the future: ${s.date}`);
    }
  }
});

test('ISP names are unique', () => {
  const seen = new Map();
  for (const isp of isps) {
    const key = isp.name.toLowerCase();
    assert.ok(!seen.has(key), `${isp.file}: duplicate name "${isp.name}" (also in ${seen.get(key)})`);
    seen.set(key, isp.file);
  }
});

// Two files pointing at one hostname would fight over the same favicon and
// probably means an ISP was added twice under different names.
test('ISP url hostnames are unique', () => {
  const seen = new Map();
  for (const isp of isps) {
    const host = safeUrl(isp.url).hostname;
    assert.ok(!seen.has(host), `${isp.file}: duplicate hostname ${host} (also in ${seen.get(host)})`);
    seen.set(host, isp.file);
  }
});

// partial means "IPv6, but only for some customers" — it is meaningless
// without ipv6, and the site ignores it in that case. Keep the data honest.
test('partial implies ipv6', () => {
  for (const isp of isps) {
    if (isp.partial) {
      assert.ok(isp.ipv6, `${isp.file}: partial is true but ipv6 is false`);
    }
  }
});
