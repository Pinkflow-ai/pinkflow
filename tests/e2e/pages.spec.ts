import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { namescapeUsagePrices } from '../../src/data/products';

const pages = [
  { path: '/', titleContains: 'Pinkflow', expectText: 'Practical software, being built by Pinkflow' },
  { path: '/pricing', titleContains: 'Pricing', expectText: 'Two products, two honest units' },
  { path: '/terms', titleContains: 'Terms of Service', expectText: 'Generally final once delivered or used' },
  { path: '/privacy', titleContains: 'Privacy Policy', expectText: 'supervisory authority' },
  { path: '/refunds', titleContains: 'Refund Policy', expectText: 'Generally final once delivered or used' },
  { path: '/contact', titleContains: 'Contact', expectText: 'hello@pinkflow.ai' },
];

const publicSurfaces = [...pages.map(({ path }) => path), '/this-does-not-exist'];
const unavailableProductHostnames = new Set(['namescape.pink', 'gateway.pink']);
const unavailableProductNames = new Set(['Namescape', 'Gateway.pink']);

const canonicalUrls: Record<string, string> = {
  '/': 'https://pinkflow.ai/',
  '/pricing': 'https://pinkflow.ai/pricing/',
  '/terms': 'https://pinkflow.ai/terms/',
  '/privacy': 'https://pinkflow.ai/privacy/',
  '/refunds': 'https://pinkflow.ai/refunds/',
  '/contact': 'https://pinkflow.ai/contact/',
};

function findLaunchUnsafeJsonLd(value: unknown, path = '$'): string[] {
  if (typeof value === 'string') {
    if (path.endsWith('.name') && value === 'Gateway.pink') return [];
    const hostname = ['namescape.pink', 'gateway.pink']
      .find((candidate) => value.toLowerCase().includes(candidate));
    return hostname ? [`${path} contains unavailable product hostname ${hostname}`] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findLaunchUnsafeJsonLd(item, `${path}[${index}]`));
  }

  if (!value || typeof value !== 'object') return [];

  const object = value as Record<string, unknown>;
  const schemaType = object['@type'];
  const schemaTypes = Array.isArray(schemaType) ? schemaType : [schemaType];
  const declaresOffer = schemaTypes.some((type) => type === 'Offer'
    || (typeof type === 'string' && /^https?:\/\/schema\.org\/Offer\/?$/i.test(type)));
  const violations = declaresOffer ? [`${path} declares schema.org Offer`] : [];
  if (Object.prototype.hasOwnProperty.call(object, 'offers')) {
    violations.push(`${path} declares an offers property`);
  }

  return violations.concat(
    Object.entries(object).flatMap(([key, item]) => findLaunchUnsafeJsonLd(item, `${path}.${key}`)),
  );
}

async function parseJsonLdBlocks(page: Page): Promise<unknown[]> {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();

  return blocks.map((block, index) => {
    try {
      return JSON.parse(block) as unknown;
    } catch (error) {
      throw new Error(`JSON-LD block ${index} is not valid JSON`, { cause: error });
    }
  });
}

async function expectLaunchSafeJsonLd(page: Page) {
  const blocks = await parseJsonLdBlocks(page);
  for (const [index, parsed] of blocks.entries()) {
    expect(findLaunchUnsafeJsonLd(parsed), `JSON-LD block ${index} must be launch-safe`).toEqual([]);
  }
}

async function findUnavailableProductAnchors(page: Page): Promise<string[]> {
  const anchors = await page.locator('a').evaluateAll((elements) => elements.map(
    (element) => ({
      href: element.getAttribute('href'),
      text: element.textContent?.trim() ?? '',
    }),
  ));

  return anchors.flatMap(({ href, text }) => {
    if (href === null) {
      return unavailableProductNames.has(text) ? [`${text} anchor has no destination`] : [];
    }

    const url = new URL(href, page.url());
    const hostname = url.hostname.toLowerCase();
    const unavailable = [...unavailableProductHostnames].some(
      (base) => hostname === base || hostname.endsWith(`.${base}`),
    );
    return unavailable ? [url.href] : [];
  });
}

test('JSON-LD hostname guard rejects unavailable product domains in every string form', () => {
  expect(findLaunchUnsafeJsonLd({
    bare: 'namescape.pink',
    nested: [
      'Read gateway.pink/docs before launch',
      { protocolRelative: '//namescape.pink/path' },
    ],
  })).toEqual([
    '$.bare contains unavailable product hostname namescape.pink',
    '$.nested[0] contains unavailable product hostname gateway.pink',
    '$.nested[1].protocolRelative contains unavailable product hostname namescape.pink',
  ]);
});

test('JSON-LD hostname guard allows only the Gateway.pink product name', () => {
  expect(findLaunchUnsafeJsonLd({
    name: 'Gateway.pink',
    url: 'https://gateway.pink',
    description: 'Gateway.pink documentation',
  })).toEqual([
    '$.url contains unavailable product hostname gateway.pink',
    '$.description contains unavailable product hostname gateway.pink',
  ]);
});

test('JSON-LD schema guard rejects scalar and array Offer types including schema.org IRIs', () => {
  expect(findLaunchUnsafeJsonLd([
    { '@type': 'Offer' },
    { '@type': ['Product', 'Offer'] },
    { '@type': 'https://schema.org/Offer' },
    { '@type': ['Product', 'http://schema.org/Offer'] },
  ])).toEqual([
    '$[0] declares schema.org Offer',
    '$[1] declares schema.org Offer',
    '$[2] declares schema.org Offer',
    '$[3] declares schema.org Offer',
  ]);
});

test('JSON-LD schema guard rejects offers properties without Offer types', () => {
  expect(findLaunchUnsafeJsonLd({
    name: 'Launch prices',
    offers: { price: '5.00' },
    nested: [{ offers: null }],
  })).toEqual([
    '$ declares an offers property',
    '$.nested[0] declares an offers property',
  ]);
});

test('anchor guard rejects product hosts, subdomains, and exact product names without destinations', async ({ page }) => {
  await page.goto('/');
  await page.setContent(`
    <a href="https://namescape.pink/">Namescape launch</a>
    <a href="https://docs.namescape.pink/start">Namescape docs</a>
    <a href="https://gateway.pink/">Gateway launch</a>
    <a href="https://api.gateway.pink/v1">Gateway API</a>
    <a>Namescape</a>
    <a>Gateway.pink</a>
    <a>Namescape pricing</a>
    <a href="/pricing">Gateway.pink</a>
  `);

  expect(await findUnavailableProductAnchors(page)).toEqual([
    'https://namescape.pink/',
    'https://docs.namescape.pink/start',
    'https://gateway.pink/',
    'https://api.gateway.pink/v1',
    'Namescape anchor has no destination',
    'Gateway.pink anchor has no destination',
  ]);
});

for (const p of pages) {
  test(`${p.path} renders with expected content`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page).toHaveTitle(new RegExp(p.titleContains, 'i'));
    await expect(page.getByText(p.expectText).first()).toBeVisible();
  });
}

test('pricing shows three search packs', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.getByText('50 searches')).toBeVisible();
  await expect(page.getByText('200 searches')).toBeVisible();
  await expect(page.getByText('500 searches')).toBeVisible();
});

test('homepage presents both products with honest lifecycle status', async ({ page }) => {
  await page.goto('/');
  const namescape = page.getByRole('article').filter({
    has: page.getByRole('heading', { name: 'Namescape', exact: true }),
  });
  const gateway = page.getByRole('article').filter({
    has: page.getByRole('heading', { name: 'Gateway.pink', exact: true }),
  });
  const namescapeFlow = namescape.getByLabel('Namescape product flow');

  await expect(namescape).toBeVisible();
  await expect(gateway).toBeVisible();
  await expect(page.getByText('Launch preparation', { exact: true })).toBeVisible();
  await expect(page.getByText('Developer preview', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /open namescape|explore gateway/i })).toHaveCount(0);
  await expect(namescape.getByText(
    'Find shortlist-ready domains with price guidance and final checks.',
    { exact: true },
  )).toBeVisible();
  await expect(namescapeFlow.getByText('Price + final check', { exact: true })).toBeVisible();
  await expect(page.getByText(/checkout paths?/i)).toHaveCount(0);

  await expect(namescape.getByRole('link', { name: 'See search packs', exact: true }))
    .toHaveAttribute('href', '/pricing#namescape');
  await expect(namescape.getByRole('link', { name: 'Contact Pinkflow', exact: true }))
    .toHaveAttribute('href', '/contact');
  await expect(gateway.getByRole('link', { name: 'See preview pricing', exact: true }))
    .toHaveAttribute('href', '/pricing#gateway');
  await expect(gateway.getByRole('link', { name: 'Contact Pinkflow', exact: true }))
    .toHaveAttribute('href', '/contact');

  expect(await namescape.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href'))))
    .toEqual(['/pricing#namescape', '/contact']);
  expect(await gateway.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href'))))
    .toEqual(['/pricing#gateway', '/contact']);
});

test('homepage metadata describes products being built and contracts being published', async ({ page }) => {
  await page.goto('/');
  const description = 'Pinkflow.ai is building Namescape and Gateway.pink and publishing clear launch pricing, product limits, company policies, and direct contact details.';
  const metadata = [
    page.locator('meta[name="description"]'),
    page.locator('meta[property="og:description"]'),
    page.locator('meta[name="twitter:description"]'),
  ];

  for (const element of metadata) {
    await expect(element).toHaveAttribute('content', description);
    expect(await element.getAttribute('content')).not.toMatch(/\b(?:operates|available|checkout|documentation)\b/i);
  }
});

test('homepage Organization schema names both products without external URLs', async ({ page }) => {
  await page.goto('/');
  const blocks = await parseJsonLdBlocks(page);
  const organization = blocks.find((block) => (
    block && typeof block === 'object' && (block as Record<string, unknown>)['@type'] === 'Organization'
  )) as Record<string, unknown> | undefined;

  expect(organization).toBeDefined();
  expect(organization).not.toHaveProperty('offers');
  expect(organization?.owns).toEqual([
    {
      '@type': 'SoftwareApplication',
      name: 'Namescape',
      applicationCategory: 'WebApplication',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Gateway.pink',
      applicationCategory: 'WebApplication',
    },
  ]);
});

test('pricing publishes the Gateway credit contract without implying checkout is live', async ({ page }) => {
  await page.goto('/pricing');
  const gateway = page.locator('#gateway');

  await expect(page.getByRole('heading', { name: 'Gateway.pink credits' })).toBeVisible();
  await expect(page.getByText('1 credit = $0.001', { exact: true })).toBeVisible();
  await expect(page.getByText('10,000 credits')).toBeVisible();
  await expect(page.getByText('$10', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Email validation')).toBeVisible();
  await expect(page.getByText('17 credits', { exact: true })).toBeVisible();
  await expect(page.getByText('$0.017 / call', { exact: true })).toBeVisible();
  await expect(page.getByText('Phone line-type lookup')).toBeVisible();
  await expect(page.getByText('40 credits', { exact: true })).toBeVisible();
  await expect(page.getByText('$0.040 / call', { exact: true })).toBeVisible();
  await expect(page.getByText('45 credits', { exact: true })).toBeVisible();
  await expect(page.getByText('$0.045 / call', { exact: true })).toBeVisible();
  await expect(page.getByText('Direct or high-volume provider plans may have lower unit prices.')).toBeVisible();
  await expect(page.getByText(/23 free routes and 7 paid routes implemented in the developer-preview catalog/)).toBeVisible();
  await expect(page.getByText('7 paid routes')).toBeVisible();
  await expect(page.getByText('Browser screenshot')).toBeVisible();
  await expect(page.getByText('1–6 credits', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('$0.001–$0.006 / call', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Paid requests require a unique')).toBeVisible();
  await expect(page.getByText("is the AI caller's hard credit ceiling")).toBeVisible();
  await expect(page.getByText('Gateway.pink credit checkout is not currently available.')).toBeVisible();
  await expect(gateway.getByText(/Gateway\.pink credit checkout is not currently available\. These are published preview prices/)).toBeVisible();
  await expect(page.getByText('Public API and documentation access is not currently open.')).toBeVisible();
  await expect(page.getByRole('link', { name: /buy gateway credits/i })).toHaveCount(0);
  await expect(gateway.getByRole('link', { name: /docs|documentation/i })).toHaveCount(0);
  await expect(gateway.locator('a[href*="docs" i], a[href*="documentation" i]')).toHaveCount(0);
});

test('pricing 200-pack is marked Best value', async ({ page }) => {
  await page.goto('/pricing');
  // Badge text is uppercase ("BEST VALUE") — match the badge span, not the
  // "Best value per search" deliverable line in the same pack.
  await expect(page.getByText('Best value', { exact: true })).toBeVisible();
});

test('pricing mentions final tax total at checkout', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.getByText('Final tax and currency total shown at checkout')).toBeVisible();
});

test('pricing explains current Namescape usage prices', async ({ page }) => {
  await page.goto('/pricing');
  const namescape = page.locator('#namescape');

  await expect(page.getByRole('heading', { name: 'How search usage works' })).toBeVisible();
  await expect(namescape.getByText('One-time balances for search-priced name ideas and final checks. Searches do not expire or auto-renew.', { exact: true })).toBeVisible();
  await expect(namescape.getByText('Namescape checkout is not currently available.')).toBeVisible();
  await expect(namescape.getByText(/Namescape checkout is not currently available\. These amounts are informational launch pricing/)).toBeVisible();
  await expect(namescape.getByText('A search is the usage unit for one completed search-priced action. Included-free actions use no searches.', { exact: true })).toBeVisible();
  await expect(namescape.getByText('Failed, empty, or indeterminate work does not use a search.')).toBeVisible();
  await expect(namescape.getByText('Saving, revisiting, and copying an existing result are free.')).toBeVisible();

  const table = namescape.getByRole('table', { name: 'Namescape action pricing' });
  const tableRegion = namescape.locator('[data-namescape-price-table-region]');
  await expect(table).toBeVisible();
  await expect(table.getByRole('caption')).toHaveText('Namescape action pricing');
  for (const column of ['Group', 'Action', 'Price', 'Note']) {
    await expect(table.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
  }

  const firstRowLayout = await table.locator('[data-namescape-price-row]').first().evaluate((row) => ({
    display: getComputedStyle(row).display,
    gridColumns: getComputedStyle(row).gridTemplateColumns.trim().split(/\s+/).filter(Boolean),
    cellDisplays: [...row.children].map((cell) => getComputedStyle(cell).display),
  }));
  if ((page.viewportSize()?.width ?? 0) >= 640) {
    expect(firstRowLayout.display).toBe('table-row');
    expect(firstRowLayout.cellDisplays).toEqual(['table-cell', 'table-cell', 'table-cell', 'table-cell']);
  } else {
    expect(firstRowLayout.gridColumns).toHaveLength(1);
  }

  for (const item of namescapeUsagePrices) {
    const row = table.locator('[data-namescape-price-row]').filter({
      has: page.getByText(item.name, { exact: true }),
    });
    await expect(row, `${item.name} should have exactly one price row`).toHaveCount(1);
    await expect(row.getByRole('rowheader', { name: item.name, exact: true })).toBeVisible();
    await expect(row.getByText(item.group, { exact: true })).toBeVisible();
    const price = row.getByText(item.price, { exact: true });
    await expect(price).toBeVisible();
    const values = item.note ? [price, row.getByText(item.note, { exact: true })] : [price];
    for (const value of values) {
      await expect(value).toBeVisible();
      const [regionBox, valueBox] = await Promise.all([tableRegion.boundingBox(), value.boundingBox()]);
      expect(valueBox!.x, `${item.name} should not be clipped to the left`).toBeGreaterThanOrEqual(regionBox!.x);
      expect(valueBox!.x + valueBox!.width, `${item.name} should not be clipped to the right`)
        .toBeLessThanOrEqual(regionBox!.x + regionBox!.width + 1);
    }
  }

  const visibleNamescapeText = await namescape.innerText();
  expect(visibleNamescapeText).not.toMatch(
    /40 requested domains|40-domain|60-second|rate-limited|anonymous allowance|\b(?:AI|LLM|provider|provenance|metadata|RDAP|model)\b|exact verification|prompt pipeline|backend source/i,
  );
});

test('pricing table keeps every semantic cell contained in narrow and 200% text layouts', async ({ page }) => {
  const scenarios = [
    { label: '320px normal text', width: 320, rootFontSize: '100%' },
    { label: '375px at 200% text', width: 375, rootFontSize: '200%' },
  ];

  for (const scenario of scenarios) {
    await page.setViewportSize({ width: scenario.width, height: 700 });
    await page.goto('/pricing');
    await page.evaluate((fontSize) => { document.documentElement.style.fontSize = fontSize; }, scenario.rootFontSize);

    const table = page.locator('#namescape').getByRole('table', { name: 'Namescape action pricing' });
    await expect(table).toBeVisible();
    await expect(table.getByRole('caption')).toHaveText('Namescape action pricing');
    for (const column of ['Group', 'Action', 'Price', 'Note']) {
      await expect(table.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
    }

    const rows = table.locator('[data-namescape-price-row]');
    await expect(rows).toHaveCount(namescapeUsagePrices.length);
    const batchRow = rows.filter({ has: page.getByRole('rowheader', { name: 'Final check — Batch', exact: true }) });
    await expect(batchRow).toHaveCount(1);
    await expect(batchRow.getByRole('rowheader', { name: 'Final check — Batch', exact: true })).toBeVisible();
    await expect(batchRow.getByText('1 search per 5 definitive results', { exact: true })).toBeVisible();
    await expect(batchRow.getByText('Rounded up', { exact: true })).toBeVisible();

    for (let rowIndex = 0; rowIndex < namescapeUsagePrices.length; rowIndex += 1) {
      const metrics = await rows.nth(rowIndex).evaluate((row) => {
        const rowRect = row.getBoundingClientRect();
        return {
          row: { left: rowRect.left, right: rowRect.right, top: rowRect.top },
          gridColumns: getComputedStyle(row).gridTemplateColumns.trim().split(/\s+/).filter(Boolean),
          cells: [...row.children].map((cell) => {
            const element = cell as HTMLElement;
            const rect = element.getBoundingClientRect();
            return {
              text: element.textContent?.trim() ?? '',
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
              width: rect.width,
              clientWidth: element.clientWidth,
              scrollWidth: element.scrollWidth,
            };
          }),
        };
      });

      expect(metrics.gridColumns, `${scenario.label}, row ${rowIndex}: one mobile column`).toHaveLength(1);
      expect(metrics.cells, `${scenario.label}, row ${rowIndex}: group, action, price, note`).toHaveLength(4);
      let previousBottom = metrics.row.top;
      for (const [cellIndex, cell] of metrics.cells.entries()) {
        if (cell.text) expect(cell.width, `${scenario.label}, row ${rowIndex}, cell ${cellIndex}: width`).toBeGreaterThan(0);
        expect(cell.left, `${scenario.label}, row ${rowIndex}, cell ${cellIndex}: viewport left`).toBeGreaterThanOrEqual(0);
        expect(cell.right, `${scenario.label}, row ${rowIndex}, cell ${cellIndex}: viewport right`).toBeLessThanOrEqual(scenario.width + 1);
        expect(cell.left, `${scenario.label}, row ${rowIndex}, cell ${cellIndex}: row left`).toBeGreaterThanOrEqual(metrics.row.left - 1);
        expect(cell.right, `${scenario.label}, row ${rowIndex}, cell ${cellIndex}: row right`).toBeLessThanOrEqual(metrics.row.right + 1);
        expect(cell.scrollWidth, `${scenario.label}, row ${rowIndex}, cell ${cellIndex}: no internal overflow`).toBeLessThanOrEqual(cell.clientWidth);
        expect(cell.top, `${scenario.label}, row ${rowIndex}, cell ${cellIndex}: DOM order`).toBeGreaterThanOrEqual(previousBottom - 1);
        previousBottom = cell.bottom;
      }
    }
  }

  await page.setViewportSize({ width: 640, height: 700 });
  await page.goto('/pricing');
  const smTable = page.locator('#namescape').getByRole('table', { name: 'Namescape action pricing' });
  await expect(smTable.getByRole('caption')).toHaveText('Namescape action pricing');
  for (const column of ['Group', 'Action', 'Price', 'Note']) {
    await expect(smTable.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
  }
  const smLayout = await smTable.locator('[data-namescape-price-row]').first().evaluate((row) => ({
    display: getComputedStyle(row).display,
    cellDisplays: [...row.children].map((cell) => getComputedStyle(cell).display),
  }));
  expect(smLayout.display).toBe('table-row');
  expect(smLayout.cellDisplays).toEqual(['table-cell', 'table-cell', 'table-cell', 'table-cell']);
});

test('pricing metadata describes informational and preview prices without implying open access', async ({ page }) => {
  await page.goto('/pricing');
  const description = 'Informational Namescape launch pricing and Gateway.pink developer-preview pricing. Checkout is unavailable, and Gateway.pink public API and documentation access are not currently open.';

  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description);
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', description);
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', description);
});

test('pricing structured data does not publish unavailable offers or product URLs', async ({ page }) => {
  await page.goto('/pricing');
  await expectLaunchSafeJsonLd(page);
});

test('policies distinguish Namescape searches from Gateway credits', async ({ page }) => {
  await page.goto('/terms');
  await expect(page.getByRole('heading', { name: /Namescape searches and Gateway credits/ })).toBeVisible();

  await page.goto('/privacy');
  await expect(page.getByText('Gateway does not log or persistently store request or response bodies')).toBeVisible();
  await expect(page.getByText('cached-ttl')).toBeVisible();
  await expect(page.getByText('Provider-backed Gateway routes')).toBeVisible();
  await expect(page.getByText('Cloudflare Browser Rendering')).toBeVisible();
  await expect(page.getByText('Have I Been Pwned (HIBP)')).toBeVisible();

  await page.goto('/refunds');
  await expect(page.getByText('Gateway.pink credit checkout is not currently available.')).toBeVisible();
});

test('footer shows operator line on every page', async ({ page }) => {
  for (const p of pages) {
    await page.goto(p.path);
    await expect(page.getByText(
      'Practical software being built in Tel Aviv, Israel, with launch facts published here.',
      { exact: true },
    )).toBeVisible();
    await expect(page.getByText(/Pinkflow is operated by Miro Mal, an individual based in Tel Aviv, Israel/).first()).toBeVisible();
  }
});

test('header nav links resolve on all pages', async ({ page }) => {
  const navLinks = ['/#products', '/pricing', '/#company', '/contact'];
  for (const link of navLinks) {
    await page.goto('/');
    // On mobile the nav links are hidden behind the hamburger toggle until
    // opened; on desktop they're always visible. Open the menu first if the
    // toggle is present, then click the (now-visible) link.
    const toggle = page.locator('#nav-toggle');
    if (await toggle.isVisible()) {
      await toggle.click();
    }
    await page.locator(`header a[href="${link}"]`).filter({ visible: true }).first().click();
    await expect(page).toHaveURL(link);
  }
});

test('header uses the animated Pinkflow flow mark', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header').getByTestId('pinkflow-flow-mark')).toBeVisible();
  await expect(page.locator('header .pinkflow-stream')).toHaveCSS('animation-name', 'pinkflowStream');
});

test('404 page renders for unknown route', async ({ page }) => {
  await page.goto('/this-does-not-exist');
  await expect(page.getByText('404')).toBeVisible();
});

test('every public surface excludes unavailable product destinations', async ({ page }) => {
  for (const path of publicSurfaces) {
    await page.goto(path);
    expect(await findUnavailableProductAnchors(page), `${path} must not link to an unavailable product`).toEqual([]);
    await expectLaunchSafeJsonLd(page);
  }
});

test('public pages do not overflow horizontally', async ({ page }) => {
  for (const p of pages) {
    await page.goto(p.path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
});

test('public pages expose exact canonical URLs', async ({ page }) => {
  for (const p of pages) {
    await page.goto(p.path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrls[p.path]);
  }
});

test('every page offers keyboard users a skip link', async ({ page }) => {
  for (const p of pages) {
    await page.goto(p.path);
    await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content');
  }
});

test('public pages have no automated WCAG A or AA violations', async ({ page }) => {
  for (const p of pages) {
    await page.goto(p.path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations, `${p.path}: ${results.violations.map((violation) => violation.id).join(', ')}`).toEqual([]);
  }
});

test('the animated mark respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const duration = await page.locator('.pinkflow-stream').first().evaluate((element) => {
    const value = getComputedStyle(element).animationDuration;
    return Number.parseFloat(value) * (value.endsWith('ms') ? 1 : 1000);
  });
  expect(duration).toBeLessThanOrEqual(10);
});

test('key product content remains usable at 200% text size', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  for (const path of ['/', '/pricing']) {
    await page.goto(path);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(1);

    const wordsBrokenAcrossLines = await page.locator('h1, h2, h3').evaluateAll((headings) => {
      const broken: string[] = [];
      for (const element of headings) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const text = node.textContent ?? '';
          for (const match of text.matchAll(/\S+/g)) {
            const range = document.createRange();
            range.setStart(node, match.index ?? 0);
            range.setEnd(node, (match.index ?? 0) + match[0].length);
            const lineTops = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top)));
            if (lineTops.size > 1) broken.push(`${element.textContent?.trim()}: ${match[0]}`);
          }
        }
      }
      return broken;
    });
    expect(wordsBrokenAcrossLines, `${path} breaks words inside a heading`).toEqual([]);
  }
});

test('inline links remain identifiable without relying on color alone', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#company a[href="mailto:hello@pinkflow.ai"]')).toHaveCSS('text-decoration-line', 'underline');

  await page.goto('/pricing');
  await expect(page.locator('main a[href="mailto:hello@pinkflow.ai"]')).toHaveCSS('text-decoration-line', 'underline');
});
