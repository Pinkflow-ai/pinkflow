import { expect, test } from 'vitest';
import * as productData from '../../src/data/products';
import { productActionHref, site } from '../../src/data/site';

const { namescapePacks } = productData;

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
  expect(productData.pricingSources.namescape).toMatchObject({
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
