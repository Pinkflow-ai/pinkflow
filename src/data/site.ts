export interface ProductEntry {
  slug: string;
  live: boolean;
  status: 'available' | 'launch-preparation' | 'developer-preview';
  statusLabel: string;
  checkoutAvailable: boolean;
  documentationAvailable: boolean;
  name: string;
  tagline: string;
  url: string | null;
}

export type ProductAction = 'checkout' | 'documentation';

export function productActionHref(product: ProductEntry, action: ProductAction): string | null {
  const available = action === 'checkout'
    ? product.checkoutAvailable
    : product.documentationAvailable;
  return available ? product.url : null;
}

export const site = {
  brand: 'Pinkflow',
  legalName: 'Miro Mal',
  operatorLine: 'Pinkflow is operated by Miro Mal, an individual based in Tel Aviv, Israel',
  jurisdiction: 'Israel',
  city: 'Tel Aviv',
  country: 'Israel',
  email: 'hello@pinkflow.ai',
  responseWindow: '2 business days',
  resolutionWindow: '10 business days',
  founded: '2025',
  lastUpdated: {
    terms: '2026-07-18',
    privacy: '2026-07-18',
    refunds: '2026-07-17',
  },
  paddle: {
    role: 'Merchant of Record / authorized reseller',
    statementLabel: 'PADDLE*PINKFLOW',
  },
  products: [
    {
      slug: 'namescape',
      live: false,
      status: 'launch-preparation',
      statusLabel: 'Launch preparation',
      checkoutAvailable: false,
      documentationAvailable: false,
      name: 'Namescape',
      tagline: 'Find shortlist-ready domains with price guidance and checkout paths.',
      url: null,
    },
    {
      slug: 'gateway',
      live: false,
      status: 'developer-preview',
      statusLabel: 'Developer preview',
      checkoutAvailable: false,
      documentationAvailable: false,
      name: 'Gateway.pink',
      tagline: 'One key for a growing collection of small, useful APIs.',
      url: null,
    },
  ] satisfies ProductEntry[],
};

export const liveProducts = site.products.filter((p) => p.live);
