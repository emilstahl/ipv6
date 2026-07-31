// CommonJS so `node --test` can load it without a transpile step;
// webpack's CJS interop handles the named imports in src/.

// Parsed URL when http(s), otherwise null — keeps javascript: etc. out of hrefs.
const safeUrl = u => {
  try {
    const url = new URL(u);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url : null;
  } catch {
    return null;
  }
};

const safeDate = d => {
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? null : date;
};

module.exports = { safeUrl, safeDate };
