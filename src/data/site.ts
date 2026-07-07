export interface ProductEntry {
  slug: string;
  live: boolean;
  name: string;
  tagline: string;
  url: string | null;
}

export const site = {
  brand: 'Pinkflow',
  legalName: '[Your Full Legal Name]',
  operatorLine: 'Pinkflow, operated by [Your Full Legal Name], an individual based in Israel',
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
    { slug: 'project-2', live: false, name: 'Project 2', tagline: 'Coming soon.', url: null },
    { slug: 'project-3', live: false, name: 'Project 3', tagline: 'Coming soon.', url: null },
  ] satisfies ProductEntry[],
};

export const liveProducts = site.products.filter((p) => p.live);
