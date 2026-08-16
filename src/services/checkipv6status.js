import { parseJsonp } from '../utils/safe';
import { classifyAddress } from '../utils/ipcheck';

const addrInfoUrl =
  process.env.GATSBY_ADDRINFO_URL || 'https://check.ipv6-adresse.dk';

const check = () =>
  fetch(addrInfoUrl, { signal: AbortSignal.timeout(10000) })
    .then(res => res.text())
    .then(text => classifyAddress(parseJsonp(text)))
    .catch(() => ({ failed: true }));

// Started at import time so the request is already in flight before React
// mounts. Resolves with what to render and never rejects — a failed check is a
// result, not an error. Resolves null during SSR, where there is no visitor to
// look up; the component renders its loading state into the static HTML.
const ipv6Check = typeof window === 'undefined' ? Promise.resolve(null) : check();

export default ipv6Check;
