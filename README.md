# Pinkflow.ai company site

Static company, pricing, support, and policy site for
[pinkflow.ai](https://pinkflow.ai). It is the shared public trust surface for
Pinkflow products and is deployed through GitHub Pages.

## Current products

### Namescape — available

[Namescape](https://namescape.pink) turns a product brief into domain-name
shortlists with price and availability signals.

- One-time packs: 50 searches / $5, 200 / $15, 500 / $30.
- Current signed-in usage: standard generation 1, bulk generation 5, bulk
  availability 3, exact availability 1.
- Signed-out visitors receive one rate-limited generation attempt. This is not
  a paid balance.
- Checkout is available through Paddle; no subscription or auto-renewal.

Authoritative pricing and IDs:

- `../namescape/backend/Services/PaddleService.cs`
- `../namescape/backend/appsettings.json`
- Snapshot for this site: `src/data/products.ts`

### Gateway.pink — developer preview

[Gateway.pink](https://gateway.pink) places a growing API catalog behind one
key with explicit storage and per-call pricing policies.

- 17 currently available free routes and four paid routes.
- One credit is always $0.001.
- Paid preview prices: email validation 17 credits, phone lookup 40, screenshot
  20, AI summarization metered from 1 credit with caller-controlled
  `max_credits` from 1 to 100.
- Published packs: 10,000/$10, 50,000/$50, 100,000/$100, 500,000/$500.
- Production credit checkout is not currently available. The prices are
  published for preview budgeting, not as purchasable offers today.

Authoritative pricing/catalog sources:

- `../gateway-pink/packages/shared/src/pricing.ts`
- `../gateway-pink/packages/shared/src/creditPacks.ts`
- `../gateway-pink/packages/shared/src/catalog.ts`
- Snapshot for this site: `src/data/products.ts`

Update the snapshot and `checkedAt` values whenever one of those product
contracts changes. Contract tests lock the mapped values inside this repository.

## Public routes

- [Company homepage](https://pinkflow.ai/)
- [Pricing](https://pinkflow.ai/pricing/)
- [Terms](https://pinkflow.ai/terms/)
- [Privacy](https://pinkflow.ai/privacy/)
- [Refunds](https://pinkflow.ai/refunds/)
- [Contact](https://pinkflow.ai/contact/)

The policies intentionally distinguish Namescape data and searches from Gateway
metadata and credits. Do not reuse one product's storage or billing promise for
the other.

## Stack

- Astro 7 static output
- Tailwind CSS 4 through `@tailwindcss/vite`
- Self-hosted Plus Jakarta Sans
- Vitest contract/deployment tests
- Playwright desktop/mobile, canonical, reduced-motion, scale, and WCAG checks
- GitHub Actions and GitHub Pages

Node 22.12 or newer is required.

## Develop

```bash
npm ci
npm run dev
```

Open `http://localhost:4321`.

## Verify

```bash
npm run test:unit
npm run check
npm run build
npx playwright test --project=desktop
npx playwright test --project=mobile
npm audit
```

The Pages workflow runs the same contract, Astro, build, desktop, and mobile
gates before uploading `dist`. A failing check cannot publish the site.

## Company and policy data

Shared operator/support values and policy revision dates live in
`src/data/site.ts`. Before changing them, check every page that consumes:

- `legalName`, `operatorLine`, `city`, `country`, and `email`;
- Paddle role and statement label;
- product lifecycle, documentation, and checkout availability;
- Terms, Privacy, and Refund revision dates.

The public operator identity must match the verified individual or entity that
operates Pinkflow and the controller identity published in the Privacy Policy.
Do not replace it with the brand name alone.

## Deployment

Pushing `main` starts `.github/workflows/deploy.yml`:

1. Check out the repository.
2. Install Node 22.12 and locked dependencies.
3. Install Chromium.
4. Run product/workflow contract tests.
5. Run Astro diagnostics and the production build.
6. Run desktop and mobile Playwright projects.
7. Upload `dist` and deploy it to GitHub Pages.

Repository and Pages operations:

- [Repository](https://github.com/Pinkflow-ai/pinkflow)
- [Actions](https://github.com/Pinkflow-ai/pinkflow/actions)
- [Pages settings](https://github.com/Pinkflow-ai/pinkflow/settings/pages)

The apex `pinkflow.ai` domain uses the standard GitHub Pages A/AAAA records and
`www.pinkflow.ai` points to `pinkflow-ai.github.io`. Both `CNAME` files must
remain `pinkflow.ai`.

## Paddle catalog

Namescape Paddle identifiers are recorded in `docs/paddle-catalog.md`. Gateway
does not have a live checkout/catalog yet and must not be added there as if it
were purchasable.
