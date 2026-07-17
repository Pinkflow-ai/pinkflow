import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('Pages verifies contracts, Astro, build, and both browser projects before upload', () => {
  const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
  const gates = [
    'npm run test:unit',
    'npm run check',
    'npm run build',
    'npx playwright test --project=desktop',
    'npx playwright test --project=mobile',
    'actions/upload-pages-artifact@v5',
  ];
  const positions = gates.map((gate) => workflow.indexOf(gate));

  expect(positions.every((position) => position >= 0)).toBe(true);
  expect(positions).toEqual([...positions].sort((left, right) => left - right));
});

test('Pages uses a Node release supported by Astro 7', () => {
  const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
  expect(workflow).toContain('node-version: 22.12');
});

test('Pages uses current Node 24 action runtimes', () => {
  const workflow = readFileSync('.github/workflows/deploy.yml', 'utf8');
  expect(workflow).toContain('actions/checkout@v7');
  expect(workflow).toContain('actions/setup-node@v7');
  expect(workflow).toContain('actions/upload-pages-artifact@v5');
  expect(workflow).toContain('actions/deploy-pages@v5');
});
