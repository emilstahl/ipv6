# IPv6-adresse.dk source & data
[IPv6-adresse.dk](https://ipv6-adresse.dk)

## addrinfo.php

The IPv6 check uses a JSONP endpoint that returns the visitor IP address. A
compatible PHP implementation is available in `addrinfo.php`.

Host `addrinfo.php` on a dual-stack HTTPS hostname with both A and AAAA DNS
records, then build the Gatsby site with:

```sh
GATSBY_ADDRINFO_URL="https://xzz.dk/ipv6.php?callback=updateIPData" npm run build
```

If you use a different hostname, add it to the `script-src` directive in
`_headers`.

If the endpoint is behind a load balancer and the origin only sees the load
balancer address, set `TRUST_PROXY_HEADERS=1` for the PHP runtime. The endpoint
will then read the first valid address from `X-Forwarded-For`, so a header like
`2a09:5e41:823:471:5df:7620:160b:9b45, 104.22.69.172` returns the IPv6
address. Only enable this when direct access to the PHP origin is blocked or the
load balancer strips client-supplied forwarding headers.

For a Cloudflare-only setup, `TRUST_CF_CONNECTING_IP=1` is also supported.

To include the ISP name, set an IPinfo Lite API token for the PHP runtime:

```sh
IPINFO_TOKEN="your-token"
```

The endpoint will populate `isp_name` from IPinfo's `as_name` field. If the
token is missing or the lookup fails, the address check still works and
`isp_name` is returned as an empty string.

By default the lookup URL is:

```text
https://api.ipinfo.io/lite/{ip}?token={token}
```

You can override it with `IPINFO_LOOKUP_URL` if needed. The response should be
JSON with `as_name`, and optionally `country_code` and `country`.
