import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('Cloudflare Pages uses the production output and reproducible deploy command', () => {
  const config = JSON.parse(readFileSync('wrangler.jsonc', 'utf8'));
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

  expect(config).toMatchObject({
    name: 'pinkflow-ai',
    pages_build_output_dir: './dist',
  });
  expect(packageJson.scripts['deploy:cloudflare']).toContain('wrangler pages deploy dist');
  expect(packageJson.scripts['deploy:cloudflare']).toContain('--project-name=pinkflow-ai');
});

test('Cloudflare Pages publishes security headers and no GitHub Pages marker', () => {
  const headers = readFileSync('public/_headers', 'utf8');

  expect(headers).toContain('X-Content-Type-Options: nosniff');
  expect(headers).toContain('Strict-Transport-Security: max-age=31536000');
  expect(existsSync('CNAME')).toBe(false);
  expect(existsSync('public/CNAME')).toBe(false);
  expect(existsSync('.github/workflows/deploy.yml')).toBe(false);
});

test('Cloudflare Pages build keeps the Node runtime supported by Astro 7', () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  expect(packageJson.engines.node).toBe('>=22.12');
});
