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

// The IPv6 check endpoint answers JSONP ("updateIPData({...});") even when no
// callback parameter is sent. Pull the JSON out of the wrapper instead of
// letting a <script> tag execute it. Throws on anything else — callers catch.
const parseJsonp = text =>
  JSON.parse(text.slice(text.indexOf('(') + 1, text.lastIndexOf(')')));

// dd/MM/yyyy. en-GB day/month/year order matches what the site has always shown.
const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});
const formatDate = d => dateFormat.format(d);

module.exports = { safeUrl, safeDate, formatDate, parseJsonp };
