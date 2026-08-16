// CommonJS so `node --test` can load it without a transpile step;
// webpack's CJS interop handles the named imports in src/.

// Shapes the parsed payload from the check endpoint into what the widget
// renders. An IPv4 address never contains a colon. Throws on a payload
// without an address — the caller turns that into { failed: true }.
const classifyAddress = data => {
  const isIPv6 = data.address.includes(':');
  return {
    ispName: data.isp_name,
    ipv6Address: isIPv6 ? data.address : null,
    ipv4Address: isIPv6 ? null : data.address,
  };
};

module.exports = { classifyAddress };
