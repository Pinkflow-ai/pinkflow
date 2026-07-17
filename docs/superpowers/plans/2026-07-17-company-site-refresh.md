# Pinkflow.ai Company Site Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a factual two-product Pinkflow company site with current pricing, lifecycle, trust, legal, and support information.

**Architecture:** Keep the Astro static-site deployment and centralize commercial facts in typed data modules. Separate the base HTML shell from legal-page headings so company and pricing pages use product-led layouts without duplicating metadata, header, or footer behavior.

**Tech Stack:** Astro, TypeScript, Tailwind CSS, Vitest, Playwright, GitHub Pages.

**Baseline:** `main...origin/main` was clean before this task. Every dirty file after that check belongs to this scoped refresh. Stage only the explicit file lists below; never use `git add .`.

---

### Task 1: Lock the two product contracts

**Files:**
- Modify: `src/data/site.ts`
- Modify: `src/data/products.ts`
- Modify: `tests/data/products.test.ts`

- [ ] **Step 1: Add failing Gateway denomination, pack, and route-price tests**

```ts
expect(productData.gatewayCreditUsdMicros).toBe(1_000);
expect(productData.gatewayCreditPacks.map(({ credits, priceUsd }) => ({ credits, priceUsd }))).toEqual([
  { credits: 10_000, priceUsd: 10 },
  { credits: 50_000, priceUsd: 50 },
  { credits: 100_000, priceUsd: 100 },
  { credits: 500_000, priceUsd: 500 },
]);
expect(productData.gatewayEndpointPrices).toEqual([
  { name: 'Email validation', credits: 6 },
  { name: 'Phone line-type lookup', credits: 12 },
  { name: 'Website screenshot', credits: 6 },
  { name: 'AI summarization', credits: 1, metered: true },
]);
```

- [ ] **Step 2: Run `npm run test:unit` and confirm it fails because Gateway exports are missing**

- [ ] **Step 3: Add failing Namescape usage, source-path, route-count, and lifecycle-action tests**

```ts
expect(productData.namescapeUsagePrices).toEqual([
  { name: 'Standard generation', searches: 1 },
  { name: 'Bulk generation', searches: 5 },
  { name: 'Bulk availability', searches: 3 },
  { name: 'Exact availability', searches: 1 },
]);
expect(productData.namescapeAnonymousAttempts).toBe(1);
expect(productData.gatewayCatalogCounts).toEqual({ freeAvailable: 17, paidAvailable: 4, planned: 7 });
expect(productData.gatewayAiBudgetPolicy).toEqual({ field: 'max_credits', minimum: 1, maximum: 100, hardCeiling: true });
expect(productData.namescapePacks.map(({ id, paddlePriceId }) => ({ id, paddlePriceId }))).toEqual([
  { id: 'pack-50', paddlePriceId: 'pri_01kwxxa32m6f1s42dysq6mspba' },
  { id: 'pack-200', paddlePriceId: 'pri_01kwxxarmpdm7esa1k8921pka2' },
  { id: 'pack-500', paddlePriceId: 'pri_01kwxxb9aqkhv2k719bdpkfah5' },
]);
expect(productData.pricingSources.namescape.pricing).toBe('namescape/backend/Services/PaddleService.cs');
expect(productData.pricingSources.namescape.priceIds).toBe('namescape/backend/appsettings.json');
expect(productData.pricingSources.gateway.endpoints).toBe('gateway-pink/packages/shared/src/pricing.ts');
expect(productData.pricingSources.gateway.packs).toBe('gateway-pink/packages/shared/src/creditPacks.ts');
expect(productData.pricingSources.gateway.catalog).toBe('gateway-pink/packages/shared/src/catalog.ts');
expect(site.products.find(({ slug }) => slug === 'namescape')).toMatchObject({ statusLabel: 'Available', checkoutAvailable: true, documentationAvailable: true });
expect(site.products.find(({ slug }) => slug === 'gateway')).toMatchObject({ statusLabel: 'Developer preview', checkoutAvailable: false, documentationAvailable: true });
```

- [ ] **Step 4: Run `npm run test:unit` and confirm the new assertions fail for missing fields**

- [ ] **Step 5: Implement typed snapshots and product lifecycle/action fields in the two data files**

- [ ] **Step 6: Run `npm run test:unit`; expect all data tests to pass**

- [ ] **Step 7: Stage and commit only the data contract**

```bash
git add src/data/site.ts src/data/products.ts tests/data/products.test.ts
git commit -m "feat: publish Pinkflow product contracts"
```

### Task 2: Build the accessible company page shell

**Files:**
- Create: `src/layouts/SiteLayout.astro`
- Modify: `src/layouts/LegalLayout.astro`
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/styles/global.css`
- Modify: `tests/e2e/pages.spec.ts`

- [ ] **Step 1: Add failing Playwright assertions for skip navigation, primary labels, mobile toggle, canonical URL, and zero overflow**

```ts
await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content');
await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrls[path]);
expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
```

- [ ] **Step 2: Run `npm run build && npx playwright test tests/e2e/pages.spec.ts --project=mobile`; expect missing shell assertions to fail**

- [ ] **Step 3: Implement the shared metadata shell, focus/skip treatment, primary navigation, legal footer, and mobile close behavior**

- [ ] **Step 4: Run `npm run check && npm run build`; expect zero diagnostics and a seven-page static build**

- [ ] **Step 5: Run `npx playwright test tests/e2e/pages.spec.ts --project=mobile`; expect shell assertions to pass**

- [ ] **Step 6: Stage and commit only the shell**

```bash
git add src/layouts/SiteLayout.astro src/layouts/LegalLayout.astro src/components/Header.astro src/components/Footer.astro src/styles/global.css tests/e2e/pages.spec.ts
git commit -m "feat: add accessible Pinkflow company shell"
```

### Task 3: Refresh homepage and pricing

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/pricing.astro`
- Modify: `src/components/PackCard.astro`
- Modify: `tests/e2e/pages.spec.ts`

- [ ] **Step 1: Add failing homepage assertions for both product headings, `Available`, `Developer preview`, Namescape checkout action, Gateway docs action, and no Gateway checkout action**

- [ ] **Step 2: Add failing pricing assertions for `1 credit = $0.001`, four Gateway packs, endpoint prices `6/12/6/from 1`, 17 currently available free routes, four paid routes, AI's `max_credits` hard caller ceiling, and the unavailable checkout notice**

- [ ] **Step 3: Run `npm run build && npx playwright test tests/e2e/pages.spec.ts --project=desktop`; expect the new homepage/pricing assertions to fail**

- [ ] **Step 4: Implement the product-led homepage with distinct Namescape and Gateway flow artifacts**

- [ ] **Step 5: Implement separate Namescape and Gateway pricing sections; label Gateway packs as published preview pricing, not purchasable products**

- [ ] **Step 6: Remove the bordered-card plus wide-glow combination from the featured Namescape pack**

- [ ] **Step 7: Run `npm run test:unit && npm run check && npm run build`; expect all to pass**

- [ ] **Step 8: Run `npx playwright test tests/e2e/pages.spec.ts --project=desktop`; expect all desktop assertions to pass**

- [ ] **Step 9: Stage and commit only homepage/pricing changes**

```bash
git add src/pages/index.astro src/pages/pricing.astro src/components/PackCard.astro tests/e2e/pages.spec.ts
git commit -m "feat: present Namescape and Gateway pricing"
```

### Task 4: Align company policies without blurring product data contracts

**Files:**
- Modify: `src/pages/terms.astro`
- Modify: `src/pages/privacy.astro`
- Modify: `src/pages/refunds.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/data/site.ts`
- Modify: `tests/e2e/pages.spec.ts`

- [ ] **Step 1: Add failing Terms assertions for both products and the `Namescape searches and Gateway credits` heading**

- [ ] **Step 2: Add failing Privacy assertions for all exact Gateway distinctions**

```ts
await expect(page.getByText('Gateway does not log or persistently store request or response bodies')).toBeVisible();
await expect(page.getByText('billing and operations metadata')).toBeVisible();
await expect(page.getByText('cached-ttl')).toBeVisible();
await expect(page.getByText('caller inputs are never cached')).toBeVisible();
await expect(page.getByText('Provider-backed Gateway routes')).toBeVisible();
```

- [ ] **Step 3: Add failing Refund assertions for product-specific treatment, Gateway checkout unavailability, and preserved statutory rights**

- [ ] **Step 4: Run `npm run build && npx playwright test tests/e2e/pages.spec.ts --project=desktop`; expect policy assertions to fail**

- [ ] **Step 5: Update Terms with separate product descriptions, units, account/key duties, provider limitations, and preview status**

- [ ] **Step 6: Update Privacy to distinguish Namescape stored prompts/history from Gateway non-persistent bodies, metadata, short-lived public-result caching, caller-input rules, and named-upstream transmission**

- [ ] **Step 7: Update Refunds and Contact for both products while preserving non-waivable consumer rights**

- [ ] **Step 8: Set all policy revision dates to `2026-07-17`**

- [ ] **Step 9: Run `npm run check && npm run build && npx playwright test tests/e2e/pages.spec.ts --project=desktop`; expect all to pass**

- [ ] **Step 10: Stage and commit only policy changes**

```bash
git add src/pages/terms.astro src/pages/privacy.astro src/pages/refunds.astro src/pages/contact.astro src/data/site.ts tests/e2e/pages.spec.ts
git commit -m "docs: align Pinkflow policies across products"
```

### Task 5: Gate, document, visually verify, and publish

**Files:**
- Modify: `.github/workflows/deploy.yml`
- Modify: `astro.config.mjs`
- Modify: `tailwind.config.mjs`
- Modify: `src/styles/global.css`
- Modify: `README.md`
- Create: `PRODUCT.md`
- Create: `DESIGN.md`
- Create: `.impeccable/design.json`
- Create: `.impeccable/live/config.json`
- Create: `docs/superpowers/specs/2026-07-17-company-site-refresh-design.md`
- Create: `docs/superpowers/plans/2026-07-17-company-site-refresh.md`
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `tests/data/workflow.test.ts`
- Modify: `tests/e2e/pages.spec.ts`

- [ ] **Step 1: Create `tests/data/workflow.test.ts` with a failing ordered-gate assertion**

```ts
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
    'actions/upload-pages-artifact@v3',
  ];
  const positions = gates.map((gate) => workflow.indexOf(gate));
  expect(positions.every((position) => position >= 0)).toBe(true);
  expect(positions).toEqual([...positions].sort((a, b) => a - b));
});
```

- [ ] **Step 2: Run `npm run test:unit`; expect the workflow test to fail because the gates are absent**

- [ ] **Step 3: Update the Pages workflow to Node 22.12+, install Chromium, and run those gates before artifact upload**

- [ ] **Step 4: Add exact canonical checks with the existing trailing-slash URL policy**

```ts
const canonicalUrls = {
  '/': 'https://pinkflow.ai/',
  '/pricing': 'https://pinkflow.ai/pricing/',
  '/terms': 'https://pinkflow.ai/terms/',
  '/privacy': 'https://pinkflow.ai/privacy/',
  '/refunds': 'https://pinkflow.ai/refunds/',
  '/contact': 'https://pinkflow.ai/contact/',
};
```

Verify the same route set in desktop and mobile projects, including navigation and horizontal overflow.

- [ ] **Step 5: Update README with the two-product pricing sources, lifecycle boundaries, test commands, and deployment gates**

- [ ] **Step 6: Migrate the build stack explicitly**

- Set `astro` to `7.1.1`, `tailwindcss` and `@tailwindcss/vite` to `4.3.3`, `vitest` to `4.1.10`, `typescript` to `5.7.2`, `@astrojs/check` to `0.9.9`, `@astrojs/sitemap` to `3.7.3`, `@playwright/test` to `1.61.1`, and `@axe-core/playwright` to `4.12.1`.
- Remove `@astrojs/tailwind`; add the pinned `@tailwindcss/vite` dependency.
- In `astro.config.mjs`, import `@tailwindcss/vite` and put `tailwindcss()` under `vite.plugins`.
- In `src/styles/global.css`, replace Tailwind 3 directives with `@config "../../tailwind.config.mjs";` and `@import "tailwindcss";`.
- Add `"engines": { "node": ">=22.12" }` to `package.json` and set the workflow runtime to Node `22.12` because Astro 7 does not support Node 20.
- Run `npm install`, then `npm run check && npm run build`; fix migration diagnostics without `npm audit fix --force`.

- [ ] **Step 7: Add accessibility and scale assertions before the final suite**

- Use `AxeBuilder` from `@axe-core/playwright` on `/`, `/pricing`, and every legal/contact route; fail on WCAG A/AA violations.
- Emulate `reducedMotion: 'reduce'` and assert `.pinkflow-stream` has an animation duration at or below `0.01s`.
- At a 375px viewport, set root font size to `200%` and assert key headings/actions remain visible with horizontal overflow at most one pixel.
- In the visual pass, inspect body, muted body, link, status, and button foreground/background pairs; record computed ratios of at least 4.5:1 for normal text and 3:1 for large text.

- [ ] **Step 8: Run the complete fresh verification suite**

```bash
npm run test:unit
npm run check
npm run build
npx playwright test --project=desktop
npx playwright test --project=mobile
npm audit
git diff --check
```

Expected: all tests pass, Astro reports zero diagnostics, seven static pages build, both browser projects pass, audit reports zero known vulnerabilities, and diff check is silent.

- [ ] **Step 9: Start the local production preview, inspect homepage/pricing/policies at 1280px, 375px, and the 200% text-scale case; confirm zero console errors/warnings and the contrast thresholds above**

- [ ] **Step 10: Stage only the remaining workflow/docs/tooling files and commit**

```bash
git add .github/workflows/deploy.yml astro.config.mjs tailwind.config.mjs src/styles/global.css README.md PRODUCT.md DESIGN.md .impeccable/design.json .impeccable/live/config.json docs/superpowers/specs/2026-07-17-company-site-refresh-design.md docs/superpowers/plans/2026-07-17-company-site-refresh.md package.json package-lock.json tests/data/workflow.test.ts tests/e2e/pages.spec.ts
git commit -m "chore: gate and document Pinkflow Pages deploy"
```

- [ ] **Step 11: Confirm `git status --short` is empty, push `main`, monitor the deploy workflow, and verify all six live routes plus canonical metadata at `https://pinkflow.ai`**
