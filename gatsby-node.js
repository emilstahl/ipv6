const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Cloudflare Pages reads `_headers` from the build output directory, and
// Gatsby's inline bootstrap script changes content (and thus CSP hash) on
// every build — so the file has to be generated here, not checked in.
exports.onPostBuild = () => {
  const pub = path.join(__dirname, 'public');

  const scriptHashes = new Set();
  for (const file of fs.readdirSync(pub, { recursive: true })) {
    // page-data/ contains a *directory* named 404.html — check it is a file
    if (!file.endsWith('.html') || !fs.statSync(path.join(pub, file)).isFile()) continue;
    const html = fs.readFileSync(path.join(pub, file), 'utf8');
    for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
      if (/\bsrc\s*=/.test(attrs) || body === '') continue;
      scriptHashes.add(`'sha256-${crypto.createHash('sha256').update(body).digest('base64')}'`);
    }
  }

  const csp = [
    "default-src 'self'",
    // 'unsafe-inline' is ignored by browsers that understand hashes; it only
    // acts as a fallback for old browsers without CSP2 support.
    `script-src 'self' ${[...scriptHashes].join(' ')} 'unsafe-inline' https://static.cloudflareinsights.com`,
    // SSR emits style attributes, which hashes cannot cover — hence no hashes here.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https://www.google.com https://*.gstatic.com",
    "connect-src 'self' https://check.ipv6-adresse.dk https://cloudflareinsights.com",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ');

  fs.writeFileSync(
    path.join(pub, '_headers'),
    `/*
  Content-Security-Policy: ${csp}
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Cross-Origin-Opener-Policy: same-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

/
  Cache-Control: public, max-age=0, must-revalidate

/page-data/*
  Cache-Control: public, max-age=0, must-revalidate

/static/*
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable
`
  );
};
