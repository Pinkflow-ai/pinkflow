export interface SearchPack {
  id: string;
  searches: number;
  priceUsd: number;
  popular?: boolean;
  paddlePriceId: string;
  includes: string[];
}

export const namescapePacks: SearchPack[] = [
  {
    id: 'pack-50',
    searches: 50,
    priceUsd: 5,
    paddlePriceId: '',
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
    paddlePriceId: '',
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
    paddlePriceId: '',
    includes: [
      '500 Namescape searches',
      'Saved shortlist access',
      'Price guidance per name',
      'Likely-availability clues',
    ],
  },
];
