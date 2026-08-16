const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { collectScriptHashes } = require('../src/utils/csp');

const sha256 = body =>
  `'sha256-${crypto.createHash('sha256').update(body).digest('base64')}'`;

test('hashes every inline script body, including multiline ones', () => {
  const html = `<html><body>
    <script>window.a=1</script>
    <script type="application/json" id="x">{
      "multi": "line"
    }</script>
  </body></html>`;
  const hashes = collectScriptHashes(html);
  assert.equal(hashes.size, 2);
  assert.ok(hashes.has(sha256('window.a=1')));
  assert.ok(hashes.has(sha256('{\n      "multi": "line"\n    }')));
});

// External scripts are covered by 'self' in the CSP; hashing them would be
// wrong, and hashing the empty string would whitelist every empty script.
test('skips src= scripts and empty bodies', () => {
  const html = [
    '<script src="/app.js"></script>',
    "<script async src='/x.js'></script>",
    '<script></script>',
  ].join('\n');
  assert.equal(collectScriptHashes(html).size, 0);
});

test('identical bodies across pages collapse to one hash', () => {
  const hashes = new Set();
  collectScriptHashes('<script>shared()</script>', hashes);
  collectScriptHashes('<script>shared()</script><script>other()</script>', hashes);
  assert.equal(hashes.size, 2);
});

// The header value wraps each hash in single quotes — a regression here
// produces a syntactically invalid CSP that browsers ignore entirely.
test('hashes are emitted in CSP source-list form', () => {
  const [hash] = [...collectScriptHashes('<script>x()</script>')];
  assert.match(hash, /^'sha256-[A-Za-z0-9+/]+={0,2}'$/);
});
