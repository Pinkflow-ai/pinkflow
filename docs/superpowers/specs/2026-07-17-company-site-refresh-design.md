# Pinkflow.ai Company Site Refresh Design

> **Superseded (2026-07-18):** This historical design is superseded by the [Company Site Pricing Truth Sync Design](./2026-07-18-company-site-pricing-truth-sync-design.md). The body below is preserved as implementation history and is not a current product contract.

## Goal

Make the GitHub Pages site at `pinkflow.ai` a complete, factual company surface
for the two current Pinkflow products: Namescape and Gateway.pink.

## Source-of-truth contract

- Namescape sells one-time packs of 50 searches for $5, 200 for $15, and 500
  for $30. The amounts and Paddle IDs are defined by
  `namescape/backend/Services/PaddleService.cs` and `namescape/backend/appsettings.json`.
  Standard generation costs one search, bulk generation five, bulk availability
  three, and exact availability one. Anonymous visitors currently receive one
  rate-limited generation attempt; signed-in balances are separate.
- Gateway.pink publishes 17 currently available free routes and four paid
  routes. Planned catalog entries are not counted as available. One credit is
  always $0.001. Email validation is 6 credits, phone lookup is 12, screenshots
  are 6, and AI summarization is metered from one credit with a caller-defined
  budget. Published packs are 10,000/$10, 50,000/$50, 100,000/$100, and
  500,000/$500. Route prices come from `gateway-pink/packages/shared/src/pricing.ts`
  and pack prices from `gateway-pink/packages/shared/src/creditPacks.ts`.
- Gateway's code and public documentation are ready, but production key/org
  resolution, payment checkout, provider secrets, and the database adapter are
  deployment work. The company site must call this a developer preview and
  must not imply that credits can already be purchased.

## Information architecture

The main navigation becomes Products, Pricing, Company, and Contact. Stable
legal routes remain in the footer. The homepage contains one product-led hero,
two intentionally different product panels, and a compact company/operations
section. Pricing contains separate Namescape and Gateway sections because their
units, availability, and refund mechanics are different.

## Legal and privacy boundaries

Terms cover both products and distinguish searches from credits. Namescape can
store prompts, saved names, and history. Gateway does not log or persistently
store request or response bodies; it stores billing/operations metadata, and
routes marked `cached-ttl` may briefly cache public upstream results while never
caching caller inputs. The policy also discloses that provider-backed calls
transmit required input to the named upstream. Refund language covers delivered
Namescape searches and, once checkout launches, consumed Gateway credits, while
explicitly preserving statutory rights.

Canonical lifecycle states are `Namescape — Available` with checkout enabled,
and `Gateway.pink — Developer preview` with documentation enabled and credit
checkout disabled. Those labels and allowed actions are typed site data rather
than page-local copy.

## Visual direction

Preserve the committed dark-plum and flow-pink identity, animated mark, and
self-hosted Plus Jakarta Sans. Increase typographic scale and spacing, use
product-shaped flow artifacts instead of repeated icon cards, and add explicit
text lifecycle labels. Meet WCAG 2.2 AA contrast, focus, reduced-motion, zoom,
and mobile requirements.

## Verification

Unit tests lock the local pricing snapshots, their checked source paths, and
both product status/action contracts. Browser tests cover
all public routes, mobile navigation, legal wording, status labels, Gateway
pricing, canonical metadata, and absence of horizontal overflow. Run Astro
check/build, dependency audit, Playwright desktop/mobile checks, and inspect the
deployed GitHub Pages site after publishing.
