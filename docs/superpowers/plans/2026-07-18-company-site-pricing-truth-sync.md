# Pinkflow Company-Site Pricing and Truth Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a factually correct Pinkflow company site whose Namescape pricing, product lifecycle, external actions, policies, and metadata match the verified product and deployment state.

**Architecture:** Keep the Astro static-site structure and visual system. Put the complete Namescape commercial matrix and lifecycle/action permissions in typed data, render those facts on the homepage and pricing page, and remove unavailable product destinations and active-offer semantics from every public route and structured-data block.

**Tech Stack:** Astro 7, TypeScript, Tailwind CSS 4, Vitest, Playwright, axe-core, GitHub Pages.

**Design:** `docs/superpowers/specs/2026-07-18-company-site-pricing-truth-sync-design.md`

---

### Task 1: Lock pricing sources and non-live lifecycle contracts

**Files:**
- Modify: `tests/data/products.test.ts`
- Modify: `src/data/products.ts`
- Modify: `src/data/site.ts`

- [ ] **Step 1: Replace the old Namescape action assertion with the complete failing matrix**

Use a customer-facing representation that can express free actions, fixed prices,
and the batch formula without exposing internal mechanics:

```ts
expect(productData.namescapeUsagePrices).toEqual([
  { group: 'Included free', name: 'Standard name ideas', price: 'Free' },
  { group: 'Included free', name: 'Brief Helper', price: 'Free' },
  { group: 'Included free', name: 'Domain details', price: 'Free', note: 'Single, batch, and bulk' },
  { group: 'Included free', name: 'Public API domain details', price: 'Free' },
  { group: 'Search-priced', name: 'Premium name ideas — Standard', price: '1 search', note: 'Per successful request' },
  { group: 'Search-priced', name: 'Premium name ideas — Max', price: '2 searches', note: 'Per successful request' },
  { group: 'Search-priced', name: 'Bulk name ideas — Standard', price: '3 searches', note: 'Per successful request' },
  { group: 'Search-priced', name: 'Bulk name ideas — Max', price: '6 searches', note: 'Per successful request' },
  { group: 'Search-priced', name: 'Final check — Single', price: '1 search', note: 'Per definitive result' },
  { group: 'Search-priced', name: 'Final check — Batch', price: '1 search per 5 definitive results', note: 'Rounded up' },
  { group: 'Search-priced', name: 'Public API name ideas', price: '1 search', note: 'Per successful request' },
  { group: 'Search-priced', name: 'Public API final check', price: '1 search', note: 'Per definitive result' },
]);
```

- [ ] **Step 2: Add failing source-of-truth assertions**

```ts
expect(productData.pricingSources.namescape).toMatchObject({
  actionPolicy: 'namescape/backend/Services/UsagePolicyService.cs',
  actionConfig: 'namescape/backend/appsettings.json',
  economics: 'namescape/docs/usage-economics.md',
  packMapping: 'namescape/backend/Services/PaddleService.cs',
  priceIds: 'namescape/backend/appsettings.json',
  checkedAt: '2026-07-18',
});
```

- [ ] **Step 3: Add failing lifecycle and action assertions**

```ts
expect(site.products.find(({ slug }) => slug === 'namescape')).toMatchObject({
  live: false,
  status: 'launch-preparation',
  statusLabel: 'Launch preparation',
  checkoutAvailable: false,
  documentationAvailable: false,
  url: null,
});
expect(site.products.find(({ slug }) => slug === 'gateway')).toMatchObject({
  live: false,
  status: 'developer-preview',
  statusLabel: 'Developer preview',
  checkoutAvailable: false,
  documentationAvailable: false,
  url: null,
});
expect(productActionHref(namescape, 'checkout')).toBeNull();
expect(productActionHref(gateway, 'documentation')).toBeNull();
```

- [ ] **Step 4: Run `npm run test:unit`; verify RED**

Expected failures: obsolete four-row Namescape matrix, missing action-source
fields, and both products still marked live/reachable.

- [ ] **Step 5: Implement the minimal typed data changes**

- Change `NamescapeUsagePrice` to `group`, `name`, `price`, and optional `note`.
- Replace the four obsolete rows with the exact tested matrix.
- Split Namescape action sources from pack/ID sources and set `checkedAt` to
  `2026-07-18`.
- Extend the product status union with `launch-preparation`, set both products
  non-live/unreachable, and keep their names/taglines available to internal
  company pages.

- [ ] **Step 6: Run `npm run test:unit`; verify GREEN**

- [ ] **Step 7: Commit only the data contract**

```bash
git add tests/data/products.test.ts src/data/products.ts src/data/site.ts
git commit -m "fix: align Pinkflow product contracts"
```

### Task 2: Make every public surface launch-safe and commercially accurate

**Files:**
- Modify: `tests/e2e/pages.spec.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/pricing.astro`
- Modify: `src/pages/terms.astro`
- Modify: `src/pages/privacy.astro`
- Modify: `src/pages/refunds.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/components/PackCard.astro` only if its inactive state needs copy support
- Modify: `src/data/site.ts`

- [ ] **Step 1: Write failing lifecycle and external-destination browser tests**

Update the homepage expectation and add a route-wide dead-domain guard:

```ts
await expect(page.getByText('Launch preparation', { exact: true })).toBeVisible();
await expect(page.getByText('Developer preview', { exact: true })).toBeVisible();
await expect(page.getByRole('link', { name: /open namescape/i })).toHaveCount(0);
await expect(page.getByRole('link', { name: /explore gateway/i })).toHaveCount(0);

for (const { path } of pages) {
  await page.goto(path);
  await expect(page.locator('a[href*="namescape.pink"], a[href*="gateway.pink"]')).toHaveCount(0);
  const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(structuredData.join('\n')).not.toMatch(/namescape\.pink|gateway\.pink/);
}
```

- [ ] **Step 2: Write failing Namescape pricing browser tests**

Assert the free-action labels, all eight search-priced actions/formulas, the
successful/definitive conditions, and the visible launch notice:

```ts
await expect(page.getByText('Namescape checkout is not currently available.')).toBeVisible();
await expect(page.getByText('Premium name ideas — Standard')).toBeVisible();
await expect(page.getByText('2 searches', { exact: true })).toBeVisible();
await expect(page.getByText('Bulk name ideas — Standard')).toBeVisible();
await expect(page.getByText('3 searches', { exact: true })).toBeVisible();
await expect(page.getByText('Bulk name ideas — Max')).toBeVisible();
await expect(page.getByText('6 searches', { exact: true })).toBeVisible();
await expect(page.getByText('1 search per 5 definitive results', { exact: true })).toBeVisible();
await expect(page.getByText('Failed, empty, or indeterminate work does not use a search.')).toBeVisible();
```

- [ ] **Step 3: Write failing Gateway-access and structured-offer tests**

```ts
await expect(page.getByText(/implemented in the developer-preview catalog/i)).toBeVisible();
await expect(page.getByText(/public API and documentation access is not currently open/i)).toBeVisible();
expect((await page.locator('script[type="application/ld+json"]').allTextContents()).join('\n')).not.toContain('"@type":"Offer"');
```

- [ ] **Step 4: Write failing policy/contact assertions**

- Terms names both products without external links and states they are not
  currently public purchase offers.
- Privacy describes the signed-out attempt and account purchase behavior as
  launch behavior, not present availability; Gateway public access is closed.
- Refunds says neither checkout is currently available while preserving the
  future digital-consumable and statutory-rights policy.
- Contact asks for launch/pricing questions and invitation-preview reports,
  not ordinary production support for unreachable products.
- All changed policy dates are `2026-07-18`.

- [ ] **Step 5: Run `npm run build && npx playwright test --project=desktop`; verify RED**

Expected failures: old statuses, dead links/JSON-LD URLs, obsolete Namescape
prices, active Namescape offers, and present-tense legal/support claims.

- [ ] **Step 6: Implement homepage and shared company-copy changes**

- Keep the existing brand/layout, but replace “built and operated” claims with
  accurate building/publishing language.
- Replace the Namescape “checkout path” artifact label with “final check”.
- Show only internal pricing/contact actions for both products.
- Keep product names in Organization schema without unavailable URLs.
- Update footer copy without changing the legal operator identity.

- [ ] **Step 7: Implement the pricing-page contract**

- Render the typed matrix with group, action, price, and optional note.
- Describe searches only as the complete customer usage unit.
- Add the Namescape launch-pricing/checkout-unavailable notice.
- Describe Gateway routes as implemented catalog entries and public access as
  closed.
- Remove Gateway docs CTA.
- Remove Product/Offer JSON-LD while checkout is unavailable.

- [ ] **Step 8: Implement the complete policy/contact audit**

Update Terms, Privacy, Refunds, Contact, and policy dates exactly as the failing
tests require. Preserve existing product-specific privacy, payment, data, and
statutory-rights distinctions.

- [ ] **Step 9: Run `npm run test:unit && npm run check && npm run build && npm test`; verify GREEN**

- [ ] **Step 10: Commit the public-surface correction**

```bash
git add tests/e2e/pages.spec.ts src/pages/index.astro src/pages/pricing.astro src/pages/terms.astro src/pages/privacy.astro src/pages/refunds.astro src/pages/contact.astro src/components/Footer.astro src/components/PackCard.astro src/data/site.ts
git commit -m "fix: publish launch-safe Pinkflow pricing"
```

### Task 3: Reconcile repository documentation, inspect visually, and publish

**Files:**
- Modify: `README.md`
- Modify: `PRODUCT.md`
- Modify: `DESIGN.md`
- Modify: `docs/superpowers/specs/2026-07-17-company-site-refresh-design.md`
- Modify: `docs/superpowers/plans/2026-07-17-company-site-refresh.md`
- Test: `tests/data/products.test.ts`
- Test: `tests/e2e/pages.spec.ts`

- [ ] **Step 1: Add a failing repository-copy contract test**

Read `README.md`, `PRODUCT.md`, `DESIGN.md`, and the prior refresh spec/plan.
Assert they no longer claim Namescape is available, its checkout is live, the
obsolete `1/5/3/1` action prices, or Gateway public docs access. Assert README
names all action and pack source paths.

- [ ] **Step 2: Run `npm run test:unit`; verify RED**

- [ ] **Step 3: Update repository documentation**

- README: launch-preparation lifecycle, complete current price matrix, separate
  pack/action sources, no dead product links, and DNS/deployment boundary.
- PRODUCT/DESIGN: building/preparing language and text lifecycle examples.
- Prior spec/plan: add a supersession notice pointing to the 2026-07-18 design
  instead of rewriting historical implementation instructions.

- [ ] **Step 4: Run `npm run test:unit`; verify GREEN**

- [ ] **Step 5: Run the complete fresh verification suite**

```bash
npm run test:unit
npm run check
npm run build
npx playwright test --project=desktop
npx playwright test --project=mobile
npm audit
git diff --check
```

Expected: every command exits zero; unit tests and both browser projects report
zero failures; Astro reports zero diagnostics; seven static routes build; audit
reports zero known vulnerabilities; diff check is silent.

- [ ] **Step 6: Perform live browser QA against the production preview**

Use the Playwright CLI wrapper to open the local production preview. Snapshot
before interaction; inspect homepage, pricing, Terms, Privacy, Refunds, and
Contact at desktop and mobile widths; capture screenshots under
`output/playwright/`; verify no console errors, dead product links, overflow,
or contradictory purchase/status copy.

- [ ] **Step 7: Request independent code/spec-quality review and fix all Critical or Important findings**

- [ ] **Step 8: Commit documentation and review corrections**

```bash
git add README.md PRODUCT.md DESIGN.md docs/superpowers/specs/2026-07-17-company-site-refresh-design.md docs/superpowers/plans/2026-07-17-company-site-refresh.md tests/data/products.test.ts tests/e2e/pages.spec.ts
git commit -m "docs: reconcile Pinkflow launch status"
```

- [ ] **Step 9: Recheck product DNS and HTTP immediately before integration**

Use public resolvers for A/AAAA/CNAME and make bounded HTTPS probes. If either
product destination is verifiably available, stop integration and update the
lifecycle contract/tests before publishing. Otherwise continue with the
approved launch-safe state.

- [ ] **Step 10: Integrate, deploy, and verify**

- Confirm the main checkout is clean and still at the feature branch base.
- Fast-forward `main` to the reviewed branch and push `origin/main`.
- Monitor `.github/workflows/deploy.yml` to success.
- Verify all six live `pinkflow.ai` routes, canonical metadata, updated
  Namescape prices, lifecycle labels, zero product-domain links/JSON-LD URLs,
  and absence of `Offer` schema.

