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
  priceUsd: number;
  mcpAccess?: boolean;
}

export interface GatewayEndpointPrice {
  name: string;
  credits: number;
  metered?: boolean;
  maximumCredits?: number;
  preview?: boolean;
}

export interface NamescapeUsagePrice {
  name: string;
  searches: number;
}

export const pricingSources = {
  namescape: {
    pricing: 'namescape/backend/Services/PaddleService.cs',
    priceIds: 'namescape/backend/appsettings.json',
    checkedAt: '2026-07-17',
  },
  gateway: {
    endpoints: 'gateway-pink/packages/shared/src/pricing.ts',
    packs: 'gateway-pink/packages/shared/src/creditPacks.ts',
    catalog: 'gateway-pink/packages/shared/src/catalog.ts',
    checkedAt: '2026-07-18',
  },
} as const;

export const gatewayCatalogCounts = {
  freeAvailable: 23,
  paidAvailable: 7,
  planned: 7,
} as const;

export const gatewayAiBudgetPolicy = {
  field: 'max_credits',
  minimum: 1,
  maximum: 100,
  hardCeiling: true,
} as const;

export const namescapeAnonymousAttempts = 1;

export const namescapeUsagePrices: NamescapeUsagePrice[] = [
  { name: 'Standard generation', searches: 1 },
  { name: 'Bulk generation', searches: 5 },
  { name: 'Bulk availability', searches: 3 },
  { name: 'Exact availability', searches: 1 },
];

/** One Gateway.pink credit is always one tenth of one US cent ($0.001). */
export const gatewayCreditUsdMicros = 1_000;

export const gatewayCreditPacks: GatewayCreditPack[] = [
  { id: 'starter', name: 'Starter', credits: 10_000, priceUsd: 10 },
  { id: 'standard', name: 'Standard', credits: 50_000, priceUsd: 50 },
  { id: 'bulk', name: 'Growth', credits: 100_000, priceUsd: 100, mcpAccess: true },
  { id: 'volume', name: 'Scale', credits: 500_000, priceUsd: 500, mcpAccess: true },
];

export const gatewayEndpointPrices: GatewayEndpointPrice[] = [
  { name: 'Email validation', credits: 17 },
  { name: 'Phone line-type lookup', credits: 40 },
  { name: 'Website screenshot', credits: 45 },
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
