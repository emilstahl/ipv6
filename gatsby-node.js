const fs = require('fs');
const path = require('path');
const { safeUrl } = require('./src/utils/safe');
const { collectScriptHashes } = require('./src/utils/csp');

// Favicons used to be loaded straight from Google's favicon endpoint, which
// handed every visitor's IP and User-Agent to a third party 41 times per page
// view. Fetch them once at build time into static/ instead — Gatsby copies
// static/ verbatim, so they end up same-origin at /favicons/<hostname>.png.
// A favicon is decoration: nothing in here may fail the build.
exports.onPreBootstrap = async ({ reporter }) => {
  const dir = path.join(__dirname, 'static', 'favicons');
  fs.mkdirSync(dir, { recursive: true });

  const dataDir = path.join(__dirname, 'data');
  const hostnames = new Set();
  for (const file of fs.readdirSync(dataDir)) {
    if (!file.endsWith('.json')) continue;
    const url = safeUrl(JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8')).url);
    if (url) hostnames.add(url.hostname);
  }

  // ponytail: sequential, ~41 requests on a cold cache. Existing files are
  // skipped, so a normal build does zero. Parallelise if that ever hurts.
  for (const hostname of hostnames) {
    const dest = path.join(dir, `${hostname}.png`);
    if (fs.existsSync(dest)) continue;
    try {
      // Google 301s to *.gstatic.com — fetch follows redirects by default.
      const res = await fetch(
        `https://www.google.com/s2/favicons?sz=128&domain_url=${hostname}`,
        { signal: AbortSignal.timeout(10000) }
      );
      const type = res.headers.get('content-type') || '';
      if (!res.ok || !type.startsWith('image/')) throw new Error(`${res.status} ${type}`);
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      reporter.info(`favicon: fetched ${hostname}`);
    } catch (e) {
      reporter.warn(`favicon: skipping ${hostname}: ${e.message}`);
    }
  }
};

// Cloudflare Pages reads `_headers` from the build output directory, and
// Gatsby's inline bootstrap script changes content (and thus CSP hash) on
// every build — so the file has to be generated here, not checked in.
exports.onPostBuild = () => {
  const pub = path.join(__dirname, 'public');

  const scriptHashes = new Set();
  for (const file of fs.readdirSync(pub, { recursive: true })) {
    // page-data/ contains a *directory* named 404.html — check it is a file
    if (!file.endsWith('.html') || !fs.statSync(path.join(pub, file)).isFile()) continue;
    collectScriptHashes(fs.readFileSync(path.join(pub, file), 'utf8'), scriptHashes);
  }

  const csp = [
    "default-src 'self'",
    // 'unsafe-inline' is ignored by browsers that understand hashes; it only
    // acts as a fallback for old browsers without CSP2 support.
    `script-src 'self' ${[...scriptHashes].join(' ')} 'unsafe-inline' https://static.cloudflareinsights.com`,
    // SSR emits style attributes, which hashes cannot cover — hence no hashes here.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self'",
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
