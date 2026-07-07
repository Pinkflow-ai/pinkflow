import { expect, test } from 'vitest';
import { namescapePacks } from '../../src/data/products';

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
