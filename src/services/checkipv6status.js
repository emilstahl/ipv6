import { parseJsonp } from '../utils/safe';

const addrInfoUrl =
  process.env.GATSBY_ADDRINFO_URL || 'https://check.ipv6-adresse.dk';

const check = () =>
  fetch(addrInfoUrl, { signal: AbortSignal.timeout(10000) })
    .then(res => res.text())
    .then(text => {
      const data = parseJsonp(text);
      const isIPv6 = data.address.includes(':'); // an IPv4 address never contains a colon

      return {
        ispName: data.isp_name,
        ipv6Address: isIPv6 ? data.address : null,
        ipv4Address: isIPv6 ? null : data.address,
      };
    })
    .catch(() => ({ failed: true }));

// Started at import time so the request is already in flight before React
// mounts. Resolves with what to render and never rejects — a failed check is a
// result, not an error. Resolves null during SSR, where there is no visitor to
// look up; the component renders its loading state into the static HTML.
const ipv6Check = typeof window === 'undefined' ? Promise.resolve(null) : check();

export default ipv6Check;
