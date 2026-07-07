# Pinkflow

Static company site for Pinkflow (`pinkflow.ai`). Hosts the Terms, Privacy, Refunds, Pricing, and Contact pages required for Paddle approval of Namescape. Also serves as the company homepage.

Built with Astro, Tailwind, self-hosted Plus Jakarta Sans. Zero client JavaScript except a tiny inline mobile-nav toggle. Deployed via GitHub Pages.

## Quick Access

- Site: [pinkflow.ai](http://pinkflow.ai/)
- Repo: [Pinkflow-ai/pinkflow](https://github.com/Pinkflow-ai/pinkflow)
- Deploys: [GitHub Actions](https://github.com/Pinkflow-ai/pinkflow/actions)
- Pages settings: [GitHub Pages](https://github.com/Pinkflow-ai/pinkflow/settings/pages)
- Namescape app: [namescape.pink](https://namescape.pink)

Public pages:

- [Pricing](http://pinkflow.ai/pricing)
- [Terms](http://pinkflow.ai/terms)
- [Privacy](http://pinkflow.ai/privacy)
- [Refunds](http://pinkflow.ai/refunds)
- [Contact](http://pinkflow.ai/contact)

Ops:

- GitHub Pages source: [workflow deploy](https://github.com/Pinkflow-ai/pinkflow/blob/main/.github/workflows/deploy.yml)
- DNS records: `pinkflow.ai` apex points to the GitHub Pages `A` and `AAAA` records listed below.
- HTTPS status: enable HTTPS in [Pages settings](https://github.com/Pinkflow-ai/pinkflow/settings/pages) once GitHub finishes certificate provisioning.

## Develop

```bash
npm install
npm run dev
```

Visit http://localhost:4321.

## Build

```bash
npm run build
npm run preview
```

## Test

```bash
npx playwright install --with-deps chromium   # one-time browser install
npm run test                                    # Playwright E2E
npm run test:unit                               # vitest data-file tests
```

## Swap entity details

All company-specific values live in **`src/data/site.ts`**. Before submitting to Paddle, replace:

- `legalName` — your real full legal name.
- `operatorLine` — keep the format `Pinkflow, operated by <name>, an individual based in Israel`.
- `email` — your real support email.
- `city` — your real city.
- `paddlePriceId` fields in **`src/data/products.ts`** — the live price IDs from your Paddle dashboard (one per pack).
- `lastUpdated.*` — bump dates when you revise each page.

## Deploy

Pushing to `main` triggers the GitHub Actions workflow at `.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages.

One-time setup:
1. Register `pinkflow.ai`.
2. In GitHub repo settings: **Settings → Pages → Source: GitHub Actions**.
3. Configure DNS at your registrar:
   - `A` records on `pinkflow.ai` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - `AAAA` records on `pinkflow.ai` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
4. After first deploy, enable HTTPS in GitHub Pages settings.
5. Verify both `pinkflow.ai` and `namescape.pink` in the Paddle dashboard.

## Related

- Spec: `docs/superpowers/specs/2026-07-07-paddle-approval-pages-design.md` (in the Namescape repo).
- Companion spec: `docs/superpowers/specs/2026-07-06-paddle-migration-design.md` (Paddle integration in Namescape).
- Companion change (out of scope here): the Namescape app at `namescape.pink` carries footer legal links to `pinkflow.ai` and a copy of the Pricing page.
