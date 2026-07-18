export interface SearchPack {
  id: string;
  searches: number;
  priceUsd: number;
  popular?: boolean;
  paddlePriceId: string;
  includes: string[];
}

export interface GatewayCreditPack {
  id: string;
  name: string;
  credits: number;
  usageValueUsd: number;
  checkoutSubtotalUsd: number;
}

export interface GatewayEndpointPrice {
  name: string;
  credits: number;
  metered?: boolean;
  maximumCredits?: number;
  preview?: boolean;
}

export interface NamescapeUsagePrice {
  group: string;
  name: string;
  price: string;
  note?: string;
}

export const pricingSources = {
  namescape: {
    actionPolicy: 'namescape/backend/Services/UsagePolicyService.cs',
    actionConfig: 'namescape/backend/appsettings.json',
    economics: 'namescape/docs/usage-economics.md',
    packMapping: 'namescape/backend/Services/PaddleService.cs',
    priceIds: 'namescape/backend/appsettings.json',
    paddleCatalog: 'docs/paddle-catalog.md',
    checkedAt: '2026-07-18',
  },
  gateway: {
    endpoints: 'gateway-pink/packages/shared/src/pricing.ts',
    packs: 'gateway-pink/packages/shared/src/creditPacks.ts',
    catalog: 'gateway-pink/packages/shared/src/catalog.ts',
    checkedAt: '2026-07-18',
  },
} as const;

export const gatewayCatalogCounts = {
  freeAvailable: 25,
  paidAvailable: 9,
  planned: 5,
} as const;

export const gatewayDeveloperSurfaces = [
  'OpenAPI 3.1 contract',
  'TypeScript SDK',
  'Python SDK',
  'MCP stdio adapter',
] as const;

export const gatewayMcpUnlockThreshold = 100_000;

export const gatewayAiBudgetPolicy = {
  field: 'max_credits',
  minimum: 1,
  maximum: 100,
  hardCeiling: true,
} as const;

export const namescapeAnonymousAttempts = 1;

export const namescapeUsagePrices: NamescapeUsagePrice[] = [
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
];

/** One Gateway.pink credit is always one tenth of one US cent ($0.001). */
export const gatewayCreditUsdMicros = 1_000;

export const gatewayCreditPacks: GatewayCreditPack[] = [
  { id: 'starter', name: 'Starter', credits: 10_000, usageValueUsd: 10, checkoutSubtotalUsd: 11.06 },
  { id: 'standard', name: 'Standard', credits: 50_000, usageValueUsd: 50, checkoutSubtotalUsd: 53.16 },
  { id: 'bulk', name: 'Growth', credits: 100_000, usageValueUsd: 100, checkoutSubtotalUsd: 105.79 },
  { id: 'volume', name: 'Scale', credits: 500_000, usageValueUsd: 500, checkoutSubtotalUsd: 526.85 },
];

export const gatewayEndpointPrices: GatewayEndpointPrice[] = [
  { name: 'Email validation', credits: 17 },
  { name: 'Phone line-type lookup', credits: 40 },
  { name: 'Website screenshot', credits: 45 },
  { name: 'Document OCR', credits: 8 },
  { name: 'Invoice & receipt extraction', credits: 50 },
  { name: 'AI summarization', credits: 1, metered: true },
  { name: 'Browser screenshot', credits: 1, maximumCredits: 6, metered: true, preview: true },
  { name: 'Browser PDF', credits: 1, maximumCredits: 6, metered: true, preview: true },
  { name: 'Browser Markdown', credits: 1, maximumCredits: 3, metered: true, preview: true },
];

export const namescapePacks: SearchPack[] = [
  {
    id: 'pack-50',
    searches: 50,
    priceUsd: 5,
    paddlePriceId: 'pri_01kwxxa32m6f1s42dysq6mspba',
    includes: [
      '50 Namescape searches',
      'Saved shortlist access',
      'Price guidance per name',
      'Likely-availability clues',
    ],
  },
  {
    id: 'pack-200',
    searches: 200,
    priceUsd: 15,
    popular: true,
    paddlePriceId: 'pri_01kwxxarmpdm7esa1k8921pka2',
    includes: [
      '200 Namescape searches',
      'Saved shortlist access',
      'Price guidance per name',
      'Likely-availability clues',
      'Best value per search',
    ],
  },
  {
    id: 'pack-500',
    searches: 500,
    priceUsd: 30,
    paddlePriceId: 'pri_01kwxxb9aqkhv2k719bdpkfah5',
    includes: [
      '500 Namescape searches',
      'Saved shortlist access',
      'Price guidance per name',
      'Likely-availability clues',
    ],
  },
];
