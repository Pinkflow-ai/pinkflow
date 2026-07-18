# Pinkflow.ai company site

Static company, pricing, support, and policy site for
[pinkflow.ai](https://pinkflow.ai). It is the shared public trust surface for
Pinkflow products and is deployed through GitHub Pages.

## Product status

As checked on 2026-07-18, both product domains are closed at public DNS, and
neither product exposes a public destination, checkout, or documentation site.
Publishing this company site does not deploy either product. The lifecycle and
prices below describe the reviewed source contracts, not open purchase offers.

### Namescape — launch preparation

Namescape is being prepared to turn a product brief into domain-name shortlists
with price guidance and final checks. Its one-time launch packs are 50 searches
for $5, 200 for $15, and 500 for $30. Checkout remains closed.

The complete action matrix is:

| Group | Action | Price | Note |
| --- | --- | --- | --- |
| Included free | Standard name ideas | Free | — |
| Included free | Brief Helper | Free | — |
| Included free | Domain details | Free | Single, batch, and bulk |
| Included free | Public API domain details | Free | — |
| Search-priced | Premium name ideas — Standard | 1 search | Per successful request |
| Search-priced | Premium name ideas — Max | 2 searches | Per successful request |
| Search-priced | Bulk name ideas — Standard | 3 searches | Per successful request |
| Search-priced | Bulk name ideas — Max | 6 searches | Per successful request |
| Search-priced | Final check — Single | 1 search | Per definitive result |
| Search-priced | Final check — Batch | 1 search per 5 definitive results | Rounded up |
| Search-priced | Public API name ideas | 1 search | Per successful request |
| Search-priced | Public API final check | 1 search | Per definitive result |

Included-free actions use no searches. Search-priced name-idea actions charge
only for successful requests, while final checks charge only for definitive
results. Failed, empty, or indeterminate work does not use a search.

Authoritative Namescape sources:

- Action policy: [backend/Services/UsagePolicyService.cs](https://github.com/Pinkflow-ai/namescape/blob/505199535b90d32087637f3235aabf9d2e828fc3/backend/Services/UsagePolicyService.cs)
- Action configuration and Paddle price IDs: [backend/appsettings.json](https://github.com/Pinkflow-ai/namescape/blob/505199535b90d32087637f3235aabf9d2e828fc3/backend/appsettings.json)
- Usage economics: [docs/usage-economics.md](https://github.com/Pinkflow-ai/namescape/blob/505199535b90d32087637f3235aabf9d2e828fc3/docs/usage-economics.md)
- Pack mapping: [backend/Services/PaddleService.cs](https://github.com/Pinkflow-ai/namescape/blob/505199535b90d32087637f3235aabf9d2e828fc3/backend/Services/PaddleService.cs)
- Paddle catalog: [docs/paddle-catalog.md](docs/paddle-catalog.md)
- Company-site snapshot: [src/data/products.ts](src/data/products.ts)

The usage contract was verified from the local, unmerged
`codex/usage-metering` branch at [commit `5051995`](https://github.com/Pinkflow-ai/namescape/commit/505199535b90d32087637f3235aabf9d2e828fc3).
That snapshot is not deployed and is not launch-ready; re-verify it before
enabling any public product action.

### Gateway.pink — developer preview

Gateway.pink is an implemented developer-preview catalog intended to place a
growing collection of small APIs behind one key. Public API, documentation, and
credit checkout access remain closed.

- The source catalog contains 25 implemented free routes, nine implemented
  paid routes, and five planned routes.
- One credit is always $0.001.
- Paid preview prices: email validation 17 credits, phone lookup 40, screenshot
  45, document OCR 8, invoice/receipt extraction 50, AI summarization metered
  from 1 credit with caller-controlled `max_credits` from 1 to 100, browser
  screenshot/PDF 1–6 credits, and browser Markdown 1–3 credits.
- Paid requests require an idempotency key. Provider failures, timeouts, and
  invalid provider responses charge zero credits.
- Published fee-inclusive preview subtotals before tax: 10,000/$11.06,
  50,000/$53.16, 100,000/$105.79, and 500,000/$526.85. Those packs load
  $10, $50, $100, and $500 of API usage value respectively.
- OpenAPI 3.1, dependency-light TypeScript and Python SDKs, and an
  entitlement-gated MCP stdio adapter are implemented in source. This does not
  mean public API or documentation access is open.
- The prices are published for preview budgeting, not as purchasable offers.

Authoritative pricing/catalog sources, pinned to the verified Gateway snapshot:

- Endpoint pricing: [packages/shared/src/pricing.ts](https://github.com/Pinkflow-ai/gateway-pink/blob/b478b3f8e03ae48b96131aacb26a9abd85c96ae2/packages/shared/src/pricing.ts)
- Credit packs: [packages/shared/src/creditPacks.ts](https://github.com/Pinkflow-ai/gateway-pink/blob/b478b3f8e03ae48b96131aacb26a9abd85c96ae2/packages/shared/src/creditPacks.ts)
- Catalog: [packages/shared/src/catalog.ts](https://github.com/Pinkflow-ai/gateway-pink/blob/b478b3f8e03ae48b96131aacb26a9abd85c96ae2/packages/shared/src/catalog.ts)
- Verified commercial snapshot: [commit `b478b3f`](https://github.com/Pinkflow-ai/gateway-pink/commit/b478b3f8e03ae48b96131aacb26a9abd85c96ae2)
- Public runtime contract: [OpenAPI 3.1 artifact](https://github.com/Pinkflow-ai/gateway-pink-public/blob/ffaddfcf6bee5d3823465befd56cdb99faa1806d/openapi/gateway.openapi.json)
- Verified runtime snapshot: [commit `ffaddfc`](https://github.com/Pinkflow-ai/gateway-pink-public/commit/ffaddfcf6bee5d3823465befd56cdb99faa1806d)
- Company-site snapshot: [src/data/products.ts](src/data/products.ts)

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

Namescape Paddle identifiers are recorded in `docs/paddle-catalog.md`. Neither
product has an open checkout. Gateway must not be added to the Paddle catalog
as if it were purchasable.
