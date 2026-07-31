import store from '../store/default';

// The endpoint answers JSONP ("updateIPData({...});") — strip the wrapper.
const parseJsonp = text =>
  JSON.parse(text.slice(text.indexOf('(') + 1, text.lastIndexOf(')')));

const addrInfoUrl =
  process.env.GATSBY_ADDRINFO_URL || 'https://check.ipv6-adresse.dk';

if (typeof window !== 'undefined') {
  fetch(addrInfoUrl, { signal: AbortSignal.timeout(10000) })
    .then(res => res.text())
    .then(text => {
      const data = parseJsonp(text);
      const isIPv6 = data.address.includes(':'); // an IPv4 address never contains a colon

      store.dispatch({
        type: 'SET_USER_DATA',
        payload: {
          testRun: true,
          ispName: data.isp_name,
          isIPv6,
          ipv6Address: isIPv6 ? data.address : null,
          ipv4Address: !isIPv6 ? data.address : null,
        },
      });
    })
    .catch(() => {
      store.dispatch({
        type: 'SET_USER_DATA',
        payload: { testRun: true, failed: true },
      });
    });
}
