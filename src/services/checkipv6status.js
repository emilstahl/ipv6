import jsonp from 'jsonp';
import store from '../store/default';

const isIPv6 = input => (/^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/gi).test(input);

let addr = '';

try {
  jsonp('https://v4v6.ipv6-test.com/json/addrinfo.php?callback=updateIPData', {}, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    store.dispatch({
      type: 'SET_USER_DATA', payload: {
        testRun: true,
        ispName: data.isp_name,
        isIPv6: isIPv6(data.address),
        ipv6Address: isIPv6(data.address) ? data.address : null,
        ipv4Address: !isIPv6(data.address) ? data.address : null,
      }
    })

    addr = data.address;
  })

} catch (e) {
  // Ignore
}
