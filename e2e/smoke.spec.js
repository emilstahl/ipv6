// End-to-end smoke tests against the production build (`gatsby serve`).
// The IPv6 check endpoint is mocked per test, so every state of the
// "Har jeg IPv6?" widget is exercised through the real bundle — fetch,
// JSONP parsing, classification and rendering included.
const { test, expect } = require('@playwright/test');

const isCheckEndpoint = url => url.hostname === 'check.ipv6-adresse.dk';
const jsonp = data => `updateIPData(${JSON.stringify(data)});`;

const mockCheck = (page, data) =>
  page.route(isCheckEndpoint, route =>
    route.fulfill({ status: 200, contentType: 'text/javascript', body: jsonp(data) }));

test('front page renders the stats, chart and ISP table', async ({ page }) => {
  await mockCheck(page, { address: '2001:db8::1', isp_name: 'Example A/S', country: 'Denmark' });
  await page.goto('/');

  await expect(page.locator('h1')).toContainText('Vi er løbet tør for IPv4-adresser');
  await expect(page.locator('.stats')).toContainText(/Internetudbydere på listen: \d+/);

  // The adoption chart only renders with at least two adoption events
  await expect(page.locator('figure svg[role="img"]')).toBeVisible();

  // gridjs table: every ISP name links out with a safe http(s) href
  const links = page.locator('a.ispLink');
  await expect(links.first()).toBeVisible();
  expect(await links.count()).toBeGreaterThan(30);
  for (const href of await links.evaluateAll(as => as.map(a => a.href))) {
    expect(href).toMatch(/^https?:\/\//);
  }
});

test('business-only ISPs carry the Erhverv badge, consumer ISPs do not', async ({ page }) => {
  await mockCheck(page, { address: '192.0.2.1', isp_name: 'Example A/S' });
  await page.goto('/');

  const rows = page.locator('.gridjs tbody tr');
  await expect(rows.first()).toBeVisible();

  // ipnordic has b2b: true — the badge renders next to (not inside) the link
  const search = page.getByPlaceholder('🔎 Søg i tabellen');
  await search.fill('ipnordic');
  await expect(rows.first()).toContainText('ipnordic');
  const badge = rows.first().locator('.b2bBadge');
  await expect(badge).toHaveText('Erhverv');
  expect(await rows.first().locator('a.ispLink .b2bBadge').count()).toBe(0);

  // Fiberby has no b2b field — no badge
  await search.fill('Fiberby');
  await expect(rows.first()).toContainText('Fiberby');
  await expect(rows.first().locator('.b2bBadge')).toHaveCount(0);
});

test('table search narrows the list', async ({ page }) => {
  await mockCheck(page, { address: '192.0.2.1', isp_name: 'Example A/S' });
  await page.goto('/');

  // gridjs renders after hydration — wait for rows before taking the baseline
  const rows = page.locator('.gridjs tbody tr');
  await expect(rows.first()).toBeVisible();
  const all = await rows.count();
  expect(all).toBeGreaterThan(30);

  await page.getByPlaceholder('🔎 Søg i tabellen').fill('Fiberby');
  await expect(rows.first()).toContainText('Fiberby');
  expect(await rows.count()).toBeLessThan(all);
});

test('a visitor with IPv6 sees the success state and their details', async ({ page }) => {
  await mockCheck(page, { address: '2001:db8::1', isp_name: 'Example A/S', country: 'Denmark' });
  await page.goto('/');

  const widget = page.locator('.DoIHaveIPv6');
  await expect(widget).toContainText('Ja! Du har IPv6');
  await expect(widget).toContainText('Din IPv6-adresse er 2001:db8::1');
  await expect(widget).toContainText('Din udbyder er Example A/S');
  await expect(widget).not.toContainText('Din IPv4-adresse');
});

test('a visitor without IPv6 sees the IPv4 state', async ({ page }) => {
  await mockCheck(page, { address: '192.0.2.1', isp_name: 'Example A/S', country: 'Denmark' });
  await page.goto('/');

  const widget = page.locator('.DoIHaveIPv6');
  await expect(widget).toContainText('Øv! Du har desværre ikke IPv6');
  await expect(widget).toContainText('Din IPv4-adresse er 192.0.2.1');
  await expect(widget).not.toContainText('Din IPv6-adresse');
});

test('an unreachable check endpoint degrades to the failure state', async ({ page }) => {
  await page.route(isCheckEndpoint, route => route.abort());
  await page.goto('/');

  await expect(page.locator('.DoIHaveIPv6'))
    .toContainText('Vi kunne desværre ikke teste om du har IPv6');
});

test('a non-JSONP answer (e.g. an error page) also degrades to the failure state', async ({ page }) => {
  await page.route(isCheckEndpoint, route =>
    route.fulfill({ status: 502, contentType: 'text/html', body: '<html>502 Bad Gateway</html>' }));
  await page.goto('/');

  await expect(page.locator('.DoIHaveIPv6'))
    .toContainText('Vi kunne desværre ikke teste om du har IPv6');
});
