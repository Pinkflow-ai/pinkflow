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
  paddleCatalog: 'docs/paddle-catalog.md',
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

### Task 2: Remove false lifecycle claims and dead product destinations

**Files:**
- Modify: `tests/e2e/pages.spec.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/components/Footer.astro`
- Modify: `src/data/site.ts`

- [ ] **Step 1: Add robust built-surface inspection helpers and failing tests**

Test the six navigable routes plus an unknown path that renders `404.html`.
Normalize every anchor with `new URL(href, page.url())`; reject hostnames
`namescape.pink` and `gateway.pink`. Parse every JSON-LD block with
`JSON.parse`, recursively visit every object/array/string, reject both
unavailable hostnames in string values, and fail if any block is invalid JSON.

```ts
const publicSurfaces = ['/', '/pricing', '/terms', '/privacy', '/refunds', '/contact', '/this-does-not-exist'];

function visitJson(value: unknown, visit: (value: unknown) => void): void {
  visit(value);
  if (Array.isArray(value)) value.forEach((item) => visitJson(item, visit));
  else if (value && typeof value === 'object') {
    Object.values(value as Record<string, unknown>).forEach((item) => visitJson(item, visit));
  }
}
```

Also fail on old homepage actions/status:

```ts
await expect(page.getByText('Launch preparation', { exact: true })).toBeVisible();
await expect(page.getByText('Developer preview', { exact: true })).toBeVisible();
await expect(page.getByRole('link', { name: /open namescape|explore gateway/i })).toHaveCount(0);
```

- [ ] **Step 2: Add failing metadata assertions**

For `/`, assert description, Open Graph description, and Twitter description
use the new building/publishing wording and do not contain `operates`,
`available`, `checkout`, or public-documentation claims. Keep exact canonical
tests for every navigable route.

- [ ] **Step 3: Run `npm run build && npx playwright test --project=desktop`; verify RED**

- [ ] **Step 4: Implement the lifecycle-safe homepage/footer/metadata**

- Replace “built and operated” with accurate building/publishing language.
- Replace the Namescape artifact's “checkout path” with “final check”.
- Render internal pricing/contact actions only.
- Keep product names in Organization schema without external product URLs.
- Preserve the legal operator identity; only the marketing verb changes.

- [ ] **Step 5: Run `npm run test:unit && npm run check && npm run build && npx playwright test --project=desktop`; verify GREEN**

- [ ] **Step 6: Commit the lifecycle correction**

```bash
git add tests/e2e/pages.spec.ts src/pages/index.astro src/components/Footer.astro src/data/site.ts
git commit -m "fix: publish honest Pinkflow lifecycle states"
```

### Task 3: Publish the complete Namescape price matrix and launch-safe schema

**Files:**
- Modify: `tests/e2e/pages.spec.ts`
- Modify: `src/pages/pricing.astro`

- [ ] **Step 1: Add failing row-scoped assertions for all twelve actions**

Give each rendered action `data-namescape-price-row`. For every item in
`namescapeUsagePrices`, locate exactly one row by its action name and assert its
exact price and optional note inside that row. This binds names to prices and
prevents a duplicated price elsewhere from producing a false pass.

Also assert:

- “Namescape checkout is not currently available.”
- “Failed, empty, or indeterminate work does not use a search.”
- Saving, revisiting, and copying an existing result are free.
- Within `page.locator('#namescape')`, no visible text contains `40 requested
  domains`, `40-domain`, `60-second`, provider/model terminology, or other
  internal capacity details. Do not apply this guard to Gateway's legitimate
  product-specific provider disclosures.

- [ ] **Step 2: Add failing Gateway and JSON-LD assertions**

Assert routes are “implemented in the developer-preview catalog,” public API
and documentation access is not currently open, and no Gateway docs CTA exists.
Extend Task 2's parsed recursive JSON-LD guard here to reject any object whose
`@type` is `Offer` or contains `Offer` in an array, proving there is no active
offer and no unavailable product URL after this task removes pricing schema.

Assert Pricing description, Open Graph description, and Twitter description
identify Namescape amounts as informational launch pricing and Gateway amounts
as preview pricing, and do not imply open checkout or documentation access.

- [ ] **Step 3: Run `npm run build && npx playwright test --project=desktop`; verify RED**

- [ ] **Step 4: Implement the pricing page**

- Render group, action, price, and note for the typed Namescape matrix.
- Explain searches as the complete customer usage unit.
- Add the launch-price/checkout-unavailable notice.
- Describe Gateway entries and public access accurately; remove its docs CTA.
- Remove Namescape Product/Offer JSON-LD while checkout is closed.

- [ ] **Step 5: Run `npm run test:unit && npm run check && npm run build && npx playwright test --project=desktop`; verify GREEN**

- [ ] **Step 6: Commit the pricing correction**

```bash
git add tests/e2e/pages.spec.ts src/pages/pricing.astro
git commit -m "fix: publish current Namescape pricing"
```

### Task 4: Align legal, privacy, refund, and support copy

**Files:**
- Modify: `tests/e2e/pages.spec.ts`
- Modify: `src/pages/terms.astro`
- Modify: `src/pages/privacy.astro`
- Modify: `src/pages/refunds.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/data/site.ts`

- [ ] **Step 1: Add failing policy/contact assertions**

- Terms names both products without external links and states that neither is a
  currently open public purchase offer.
- Privacy describes the signed-out attempt and account purchase behavior as
  launch behavior; Gateway public API/docs access is closed.
- Refunds says neither checkout is currently available while preserving future
  digital-consumable rules and non-waivable statutory rights.
- Contact accepts launch/pricing questions and invitation-preview reports, not
  ordinary production support claims for unreachable products.
- Terms, Privacy, and Refund revision dates are `2026-07-18`.
- Metadata descriptions for all four routes avoid current-availability claims.

- [ ] **Step 2: Run `npm run build && npx playwright test --project=desktop`; verify RED**

- [ ] **Step 3: Implement the complete policy/contact audit**

Preserve product-specific data handling, provider disclosures, payment roles,
refund mechanics, operator identity, and statutory-rights language. Change
only availability/purchase tense, dead links, and support expectations.

- [ ] **Step 4: Run `npm run check && npm run build && npx playwright test --project=desktop`; verify GREEN**

- [ ] **Step 5: Commit the policy correction**

```bash
git add tests/e2e/pages.spec.ts src/pages/terms.astro src/pages/privacy.astro src/pages/refunds.astro src/pages/contact.astro src/data/site.ts
git commit -m "docs: align Pinkflow prelaunch policies"
```

### Task 5: Reconcile documentation, review, verify, and deploy

**Files:**
- Modify: `tests/data/products.test.ts`
- Modify: `README.md`
- Modify: `PRODUCT.md`
- Modify: `DESIGN.md`
- Modify: `docs/superpowers/specs/2026-07-17-company-site-refresh-design.md`
- Modify: `docs/superpowers/plans/2026-07-17-company-site-refresh.md`

- [ ] **Step 1: Add a failing repository-copy contract test**

For README/PRODUCT/DESIGN, reject current availability, live checkout/docs, and
the obsolete Namescape action table. Assert README includes action policy,
action config, economics, pack mapping, appsettings IDs, and
`docs/paddle-catalog.md`.

For the historical 2026-07-17 spec/plan, test only that the opening notice says
the document is superseded by and links to the 2026-07-18 design. Replace the
existing Gateway-only notice; do not require historical body text to change.

- [ ] **Step 2: Run `npm run test:unit`; verify RED**

- [ ] **Step 3: Update current and historical documentation**

- README: launch-preparation lifecycle, complete current matrix, separate
  pack/action sources, no dead product links, and deployment/DNS boundary.
- PRODUCT/DESIGN: building/preparing language and text lifecycle examples.
- Prior spec/plan: one prominent supersession notice pointing to the new design.

- [ ] **Step 4: Run `npm run test:unit`; verify GREEN**

- [ ] **Step 5: Commit the documentation correction**

```bash
git add tests/data/products.test.ts README.md PRODUCT.md DESIGN.md docs/superpowers/specs/2026-07-17-company-site-refresh-design.md docs/superpowers/plans/2026-07-17-company-site-refresh.md
git commit -m "docs: reconcile Pinkflow launch status"
```

- [ ] **Step 6: Perform controlled visual QA**

Ensure no process is already listening on port 4323, then run:

```bash
npm run build
npm run preview -- --port 4323 --host 127.0.0.1
```

In a separate shell, use `$HOME/.codex/skills/playwright/scripts/playwright_cli.sh`
to open `http://127.0.0.1:4323`, snapshot before each interaction, and inspect
homepage, pricing, Terms, Privacy, Refunds, Contact, and an unknown route at
desktop and mobile widths. Store any screenshots only under ignored
`test-results/manual/`, then stop the exact preview PID. Verify the browser
console is clean and no stale server was reused.

- [ ] **Step 7: Request independent spec-compliance and code-quality reviews**

Fix every Critical or Important finding. Stage review corrections explicitly
from `git diff --name-only`; never use `git add .`. Commit corrections before
the final suite.

- [ ] **Step 8: Run the complete fresh post-review verification suite**

```bash
npm run test:unit
npm run check
npm run build
npx playwright test --project=desktop
npx playwright test --project=mobile
npm audit
git diff --check
git status --short
```

Expected: all commands exit zero; all unit/browser tests report zero failures;
Astro reports zero diagnostics; six navigable routes plus `404.html` build;
audit reports zero vulnerabilities; diff check is silent; the feature worktree
is clean. `package-lock.json` was restored after setup and must remain unchanged
unless an intentional dependency change is separately justified and committed.

- [ ] **Step 9: Recheck product DNS and HTTP immediately before integration**

Query public resolvers for A/AAAA/CNAME and make bounded HTTPS probes. A DNS or
HTTP change alone does not authorize checkout/docs CTAs. If external state
changed, stop and reassess product reachability, documentation access, checkout
readiness, and release status separately; update affected contracts/surfaces,
repeat review, and rerun the full suite.

```bash
set -euo pipefail

for domain in namescape.pink gateway.pink; do
  test -z "$(dig @1.1.1.1 +short A "$domain")"
  test -z "$(dig @1.1.1.1 +short AAAA "$domain")"
  test -z "$(dig @1.1.1.1 +short CNAME "$domain")"
  if curl --fail --silent --show-error --head --location --max-time 15 "https://$domain/"; then
    exit 1
  fi
done
```

Expected for the approved launch-safe state: all public-DNS answers are empty
and both bounded HTTPS probes fail. Any nonempty answer or successful probe is
an external-state change that triggers reassessment rather than automatic CTA
enablement.

- [ ] **Step 10: Integrate with exact fast-forward gates**

```bash
MAIN=/Users/miromal/Desktop/Source.nosync/GitHub/Pinkflow-ai/pinkflow
FEATURE=/Users/miromal/.config/superpowers/worktrees/pinkflow/company-site-pricing-sync
BASE=73a330697a17c21187157e4bb1443862f0fed5bc

git -C "$MAIN" fetch origin main
test -z "$(git -C "$MAIN" status --short)"
test -z "$(git -C "$FEATURE" status --short)"
test "$(git -C "$MAIN" rev-parse HEAD)" = "$BASE"
test "$(git -C "$MAIN" rev-parse origin/main)" = "$BASE"
git -C "$MAIN" merge --ff-only codex/company-site-pricing-sync
git -C "$MAIN" push origin main
```

If either base check fails, stop; reconcile/review/reverify instead of forcing.

- [ ] **Step 11: Monitor Pages and verify the deployed result**

Capture the pushed feature SHA. Find the newest `deploy.yml` main-branch push
run whose `headSha` equals it, then execute `gh run watch <run-id> --exit-status`.
After success, verify all six navigable `pinkflow.ai` routes plus unknown-route
404 behavior, exact canonical/description/OG/Twitter metadata, all twelve
Namescape pricing rows, lifecycle labels, zero unavailable product-domain
anchors/JSON-LD URLs, and zero `Offer` schema.

```bash
MAIN=/Users/miromal/Desktop/Source.nosync/GitHub/Pinkflow-ai/pinkflow
PUSHED_SHA=$(git -C "$MAIN" rev-parse HEAD)
RUN_ID=$(gh run list --repo Pinkflow-ai/pinkflow --workflow deploy.yml --branch main --event push --limit 20 --json databaseId,headSha,status,conclusion,url --jq ".[] | select(.headSha == \"$PUSHED_SHA\") | .databaseId" | head -n 1)
test -n "$RUN_ID"
gh run watch "$RUN_ID" --repo Pinkflow-ai/pinkflow --exit-status
```
