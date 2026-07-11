export interface ProductEntry {
  slug: string;
  live: boolean;
  name: string;
  tagline: string;
  url: string | null;
}

export const site = {
  brand: 'Pinkflow',
  legalName: 'Pinkflow.ai',
  operatorLine: 'Pinkflow (pinkflow.ai), based in Israel',
  jurisdiction: 'Israel',
  city: 'Tel Aviv',
  country: 'Israel',
  email: 'hello@pinkflow.ai',
  responseWindow: '2 business days',
  resolutionWindow: '10 business days',
  founded: '2025',
  lastUpdated: {
    terms: '2026-07-07',
    privacy: '2026-07-07',
    refunds: '2026-07-07',
  },
  paddle: {
    role: 'Merchant of Record / authorized reseller',
    statementLabel: 'PADDLE*PINKFLOW',
  },
  products: [
    {
      slug: 'namescape',
      live: true,
      name: 'Namescape',
      tagline: 'Find shortlist-ready domains with price guidance and checkout paths.',
      url: 'https://namescape.pink',
    },
    {
      slug: 'gateway',
      live: true,
      name: 'Gateway',
      tagline: 'A single key for a growing collection of small, useful APIs.',
      url: 'https://gateway.pink',
    },
  ] satisfies ProductEntry[],
};

export const liveProducts = site.products.filter((p) => p.live);
