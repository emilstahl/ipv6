// CommonJS — shared between gatsby-node.js and the tests.
const crypto = require('crypto');

// CSP hashes for every inline <script> body in a page. Scripts loaded via
// src= are already covered by 'self', and an empty body has nothing to hash.
// Adds to (and returns) `hashes` so callers can accumulate across pages.
const collectScriptHashes = (html, hashes = new Set()) => {
  // Per the HTML spec a script element ends at "</script" followed by
  // whitespace, "/" or ">" — anything after that up to ">" is discarded, so
  // "</script bar>" closes the element too. Match exactly that, or a browser
  // and this regex would disagree on where a body ends and its hash breaks.
  for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script(?=[\s/>])[^>]*>/gi)) {
    if (/\bsrc\s*=/.test(attrs) || body === '') continue;
    hashes.add(`'sha256-${crypto.createHash('sha256').update(body).digest('base64')}'`);
  }
  return hashes;
};

module.exports = { collectScriptHashes };
