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
