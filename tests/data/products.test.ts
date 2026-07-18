import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import * as productData from '../../src/data/products';
import { productActionHref, site } from '../../src/data/site';

const { namescapePacks } = productData;
const compactWhitespace = (value: string) => value.replace(/\s+/g, ' ');

function markdownTableRows(markdown: string, headerCells: string[]): string[][] {
  const lines = markdown.split('\n');
  const header = `| ${headerCells.join(' | ')} |`;
  const headerIndex = lines.findIndex((line) => line.trim() === header);
  if (headerIndex === -1) return [];

  return collectTableRows(lines, headerIndex + 2);
}

function collectTableRows(lines: string[], start: number): string[][] {
  const rows: string[][] = [];
  for (const line of lines.slice(start)) {
    if (!line.trim().startsWith('|')) break;
    rows.push(line.trim().slice(1, -1).split('|').map((cell) => cell.trim()));
  }
  return rows;
}

function markdownLinkTargets(markdown: string): string[] {
  return [...markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
}

function leadingBlockquote(markdown: string): string | null {
  const lines = markdown.split('\n');
  let index = lines.findIndex((line) => line.startsWith('# '));
  if (index === -1) return null;

  index += 1;
  while (lines[index]?.trim() === '') index += 1;
  if (!lines[index]?.startsWith('>')) return null;

  const quote: string[] = [];
  while (lines[index]?.startsWith('>')) {
    quote.push(lines[index].replace(/^>\s?/, ''));
    index += 1;
  }
  return quote.join('\n');
}

function planTaskSection(markdown: string, task: number): string {
  const start = markdown.indexOf(`### Task ${task}:`);
  if (start === -1) return '';
  const end = markdown.indexOf(`### Task ${task + 1}:`, start + 1);
  return markdown.slice(start, end === -1 ? undefined : end);
}

function planStepStates(markdown: string, task: number): boolean[] {
  return [...planTaskSection(markdown, task).matchAll(/^- \[([ x])\] \*\*Step \d+:/gm)]
    .map((match) => match[1] === 'x');
}

function paragraphContaining(markdown: string, requiredTerms: string[]): string | null {
  return markdown.split(/\n\s*\n/)
    .find((paragraph) => requiredTerms.every((term) => paragraph.includes(term))) ?? null;
}

test('three packs are defined', () => {
  expect(namescapePacks).toHaveLength(3);
});

test('pack values match Paddle catalog', () => {
  const byId = Object.fromEntries(namescapePacks.map((p) => [p.id, p]));
  expect(byId['pack-50']).toMatchObject({ searches: 50, priceUsd: 5 });
  expect(byId['pack-200']).toMatchObject({ searches: 200, priceUsd: 15, popular: true });
  expect(byId['pack-500']).toMatchObject({ searches: 500, priceUsd: 30 });
});

test('every pack has at least 3 deliverables listed', () => {
  for (const p of namescapePacks) {
    expect(p.includes.length).toBeGreaterThanOrEqual(3);
  }
});

test('no pack uses the word "credits"', () => {
  for (const p of namescapePacks) {
    for (const line of p.includes) {
      expect(line.toLowerCase()).not.toContain('credit');
    }
  }
});

test('Gateway uses a fixed one-tenth-cent credit denomination', () => {
  expect((productData as Record<string, unknown>).gatewayCreditUsdMicros).toBe(1_000);
});

test('Gateway credit packs preserve the fixed denomination', () => {
  const packs = (productData as Record<string, unknown>).gatewayCreditPacks as
    | Array<{ credits: number; priceUsd: number; mcpAccess?: boolean }>
    | undefined;

  expect(packs).toEqual([
    { id: 'starter', name: 'Starter', credits: 10_000, priceUsd: 10 },
    { id: 'standard', name: 'Standard', credits: 50_000, priceUsd: 50 },
    { id: 'bulk', name: 'Growth', credits: 100_000, priceUsd: 100, mcpAccess: true },
    { id: 'volume', name: 'Scale', credits: 500_000, priceUsd: 500, mcpAccess: true },
  ]);
});

test('Gateway fixed endpoint prices match the runtime pricing contract', () => {
  const prices = (productData as Record<string, unknown>).gatewayEndpointPrices;
  expect(prices).toEqual([
    { name: 'Email validation', credits: 17 },
    { name: 'Phone line-type lookup', credits: 40 },
    { name: 'Website screenshot', credits: 45 },
    { name: 'AI summarization', credits: 1, metered: true },
    { name: 'Browser screenshot', credits: 1, maximumCredits: 6, metered: true, preview: true },
    { name: 'Browser PDF', credits: 1, maximumCredits: 6, metered: true, preview: true },
    { name: 'Browser Markdown', credits: 1, maximumCredits: 3, metered: true, preview: true },
  ]);
});

test('Gateway is a developer preview rather than a purchasable production service', () => {
  expect(site.products.find((product) => product.slug === 'gateway')).toMatchObject({
    status: 'developer-preview',
    statusLabel: 'Developer preview',
    checkoutAvailable: false,
  });
});

test('Namescape usage prices match the configured runtime actions', () => {
  expect(productData.namescapeUsagePrices).toEqual([
    { group: 'Included free', name: 'Standard name ideas', price: 'Free' },
    { group: 'Included free', name: 'Brief Helper', price: 'Free' },
    { group: 'Included free', name: 'Domain details', price: 'Free', note: 'Single, batch, and bulk' },
    { group: 'Included free', name: 'Public API domain details', price: 'Free' },
    { group: 'Search-priced', name: 'Premium name ideas — Standard', price: '1 search', note: 'Per successful request' },
    { group: 'Search-priced', name: 'Premium name ideas — Max', price: '2 searches', note: 'Per successful request' },
    { group: 'Search-priced', name: 'Bulk name ideas — Standard', price: '3 searches', note: 'Per successful request' },
    { group: 'Search-priced', name: 'Bulk name ideas — Max', price: '6 searches', note: 'Per successful request' },
    { group: 'Search-priced', name: 'Final check — Single', price: '1 search', note: 'Per definitive result' },
    { group: 'Search-priced', name: 'Final check — Batch', price: '1 search per 5 definitive results', note: 'Rounded up' },
    { group: 'Search-priced', name: 'Public API name ideas', price: '1 search', note: 'Per successful request' },
    { group: 'Search-priced', name: 'Public API final check', price: '1 search', note: 'Per definitive result' },
  ]);
});

test('Namescape anonymous access is a rate-limited attempt, not a paid search balance', () => {
  expect((productData as Record<string, unknown>).namescapeAnonymousAttempts).toBe(1);
});

test('pricing snapshots identify every authoritative source file', () => {
  expect(productData.pricingSources.namescape).toEqual({
    actionPolicy: 'namescape/backend/Services/UsagePolicyService.cs',
    actionConfig: 'namescape/backend/appsettings.json',
    economics: 'namescape/docs/usage-economics.md',
    packMapping: 'namescape/backend/Services/PaddleService.cs',
    priceIds: 'namescape/backend/appsettings.json',
    paddleCatalog: 'docs/paddle-catalog.md',
    checkedAt: '2026-07-18',
  });
  expect((productData as Record<string, any>).pricingSources).toMatchObject({
    gateway: {
      endpoints: 'gateway-pink/packages/shared/src/pricing.ts',
      packs: 'gateway-pink/packages/shared/src/creditPacks.ts',
      catalog: 'gateway-pink/packages/shared/src/catalog.ts',
      checkedAt: '2026-07-18',
    },
  });
});

test('repository documentation publishes the complete Namescape launch-price contract', () => {
  const readme = readFileSync('README.md', 'utf8');
  const compactReadme = compactWhitespace(readme);
  const linkTargets = markdownLinkTargets(readme);
  const namescapeSha = '505199535b90d32087637f3235aabf9d2e828fc3';
  const gatewaySha = '6f12540f455d1bedb8e2b5c037a6cabf7e732d13';

  expect(markdownTableRows(readme, ['Group', 'Action', 'Price', 'Note'])).toEqual(
    productData.namescapeUsagePrices.map((item) => [
      item.group,
      item.name,
      item.price,
      item.note ?? '—',
    ]),
  );

  expect(linkTargets).toEqual(expect.arrayContaining([
    `https://github.com/Pinkflow-ai/namescape/blob/${namescapeSha}/backend/Services/UsagePolicyService.cs`,
    `https://github.com/Pinkflow-ai/namescape/blob/${namescapeSha}/backend/appsettings.json`,
    `https://github.com/Pinkflow-ai/namescape/blob/${namescapeSha}/docs/usage-economics.md`,
    `https://github.com/Pinkflow-ai/namescape/blob/${namescapeSha}/backend/Services/PaddleService.cs`,
    `https://github.com/Pinkflow-ai/namescape/commit/${namescapeSha}`,
    `https://github.com/Pinkflow-ai/gateway-pink/blob/${gatewaySha}/packages/shared/src/pricing.ts`,
    `https://github.com/Pinkflow-ai/gateway-pink/blob/${gatewaySha}/packages/shared/src/creditPacks.ts`,
    `https://github.com/Pinkflow-ai/gateway-pink/blob/${gatewaySha}/packages/shared/src/catalog.ts`,
    `https://github.com/Pinkflow-ai/gateway-pink/commit/${gatewaySha}`,
    'docs/paddle-catalog.md',
  ]));
  expect(readme).not.toMatch(/^- .*`(?:namescape|gateway-pink)\//gm);
  expect(readme).toContain('`codex/usage-metering`');
  expect(compactReadme).toMatch(/\bunmerged\b/i);
  expect(compactReadme).toMatch(/\bnot deployed\b/i);
  expect(compactReadme).toMatch(/\bnot launch-ready\b/i);
});

test('repository documentation keeps both products in honest closed lifecycle states', () => {
  const readme = readFileSync('README.md', 'utf8');
  const product = readFileSync('PRODUCT.md', 'utf8');
  const design = readFileSync('DESIGN.md', 'utf8');
  const currentDocs = [readme, product, design].join('\n');
  const compactReadme = compactWhitespace(readme);
  const compactCurrentDocs = compactWhitespace(currentDocs);

  expect(readme).toContain('Namescape — launch preparation');
  expect(readme).toContain('Gateway.pink — developer preview');
  expect(compactReadme).toContain('As checked on 2026-07-18');
  expect(compactReadme).toMatch(/both product domains.+closed.+public DNS/i);
  expect(compactReadme).toMatch(/neither product.+public destination/i);
  expect(compactReadme).toMatch(/neither product.+checkout/i);
  expect(compactReadme).toMatch(/neither product.+documentation site/i);
  expect(compactReadme).toMatch(/Publishing this company site does not deploy either product/i);
  expect(readme).not.toMatch(/\]\(https:\/\/(?:www\.)?(?:namescape\.pink|gateway\.pink)(?:[/?#)]|$)/i);

  expect(product).toMatch(/building and preparing/i);
  expect(design).toMatch(/building and preparing/i);
  expect(compactCurrentDocs).not.toMatch(/Namescape\s+—\s+available/i);
  expect(compactCurrentDocs).not.toMatch(/checkout is available/i);
  expect(compactCurrentDocs).not.toMatch(/documentation (?:is |remains )?available|documentation enabled/i);
  expect(compactCurrentDocs).not.toMatch(/standard generation 1|bulk generation 5|bulk availability 3|exact availability 1/i);
  expect(product).not.toContain('Lead with shipped products');
  expect(product).not.toContain('builds and operates real products');
  expect(design).not.toContain('“Available”');
});

test('historical refresh documents point readers to the current truth contract', () => {
  const historicalDesign = readFileSync(
    'docs/superpowers/specs/2026-07-17-company-site-refresh-design.md',
    'utf8',
  );
  const historicalPlan = readFileSync(
    'docs/superpowers/plans/2026-07-17-company-site-refresh.md',
    'utf8',
  );
  const currentPlan = readFileSync(
    'docs/superpowers/plans/2026-07-18-company-site-pricing-truth-sync.md',
    'utf8',
  );

  const historicalNotices = [
    {
      notice: leadingBlockquote(historicalDesign),
      designTarget: './2026-07-18-company-site-pricing-truth-sync-design.md',
    },
    {
      notice: leadingBlockquote(historicalPlan),
      designTarget: '../specs/2026-07-18-company-site-pricing-truth-sync-design.md',
    },
  ];
  for (const { notice, designTarget } of historicalNotices) {
    expect(notice).not.toBeNull();
    expect(notice).toMatch(/\bSuperseded\b/i);
    expect(markdownLinkTargets(notice!)).toContain(designTarget);
  }

  const task2 = planTaskSection(currentPlan, 2);
  const jsonLdGuidance = paragraphContaining(task2, ['JSON-LD', '`Gateway.pink`']);
  expect(jsonLdGuidance).not.toBeNull();
  expect(jsonLdGuidance).toMatch(/\bAllow\b[^.]*\bexact\b[^.]*`Gateway\.pink`/i);
  expect(jsonLdGuidance).toMatch(/\bonly\b[^.]*\bproduct name\b/i);
  expect(jsonLdGuidance).toMatch(/\bReject\b[^.]*\bproduct domain\b/i);
  expect(jsonLdGuidance).toMatch(/\bURL-shaped fields\b/i);
  expect(jsonLdGuidance).toMatch(/\bURL values\b/i);
  expect(jsonLdGuidance).toMatch(/\bfree-text(?:\s+availability)?\s+claims\b/i);
  expect(planStepStates(currentPlan, 1)).toEqual(Array(7).fill(true));
  expect(planStepStates(currentPlan, 2)).toEqual(Array(6).fill(true));
  expect(planStepStates(currentPlan, 3)).toEqual(Array(6).fill(true));
  expect(planStepStates(currentPlan, 4)).toEqual(Array(5).fill(true));
  expect(planStepStates(currentPlan, 5)).toEqual([
    true, true, true, true, true, true, true,
    false, false, false, false,
  ]);
});

test('Namescape Paddle identifiers match the production configuration', () => {
  expect(namescapePacks.map(({ id, paddlePriceId }) => ({ id, paddlePriceId }))).toEqual([
    { id: 'pack-50', paddlePriceId: 'pri_01kwxxa32m6f1s42dysq6mspba' },
    { id: 'pack-200', paddlePriceId: 'pri_01kwxxarmpdm7esa1k8921pka2' },
    { id: 'pack-500', paddlePriceId: 'pri_01kwxxb9aqkhv2k719bdpkfah5' },
  ]);
});

test('Gateway counts only currently available routes', () => {
  expect((productData as Record<string, unknown>).gatewayCatalogCounts).toEqual({
    freeAvailable: 23,
    paidAvailable: 7,
    planned: 7,
  });
});

test('Gateway AI exposes a hard caller-owned credit ceiling', () => {
  expect((productData as Record<string, unknown>).gatewayAiBudgetPolicy).toEqual({
    field: 'max_credits',
    minimum: 1,
    maximum: 100,
    hardCeiling: true,
  });
});

test('product lifecycle controls checkout and documentation actions', () => {
  expect(site.products.find((product) => product.slug === 'namescape')).toMatchObject({
    live: false,
    status: 'launch-preparation',
    statusLabel: 'Launch preparation',
    checkoutAvailable: false,
    documentationAvailable: false,
    url: null,
  });
  expect(site.products.find((product) => product.slug === 'gateway')).toMatchObject({
    live: false,
    status: 'developer-preview',
    statusLabel: 'Developer preview',
    checkoutAvailable: false,
    documentationAvailable: false,
    url: null,
  });

  const namescape = site.products.find((product) => product.slug === 'namescape')!;
  const gateway = site.products.find((product) => product.slug === 'gateway')!;
  expect(productActionHref(namescape, 'checkout')).toBeNull();
  expect(productActionHref(namescape, 'documentation')).toBeNull();
  expect(productActionHref(gateway, 'checkout')).toBeNull();
  expect(productActionHref(gateway, 'documentation')).toBeNull();
});

test('the public operator identity is a person, not the Pinkflow brand string', () => {
  expect(site.legalName).not.toMatch(/^Pinkflow(?:\.ai)?$/i);
  expect(site.operatorLine).toContain(site.legalName);
  expect(site.operatorLine).toContain(site.city);
  expect(site.operatorLine).toContain(site.country);
});
