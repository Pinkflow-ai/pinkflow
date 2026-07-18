# Pinkflow Company-Site Pricing and Truth Sync Design

## Goal

Bring the GitHub Pages company site at `pinkflow.ai` into line with the current
Namescape commercial contract and the real deployment state of both Pinkflow
products. The result should read like a normal small-company site: clear about
what is being built, specific about price, and unwilling to send customers to
destinations that are not available.

## Audited facts

- Namescape's one-time packs remain 50 searches for $5, 200 for $15, and 500
  for $30. The existing Paddle price identifiers remain unchanged.
- The old public action table is obsolete. Namescape now defines free product
  actions, 1/2-search premium name-idea tiers, 3/6-search bulk tiers,
  definitive-only final checks, batch final checks priced at one search per
  five definitive results rounded up, and a fixed 1/0/1 public API contract for
  name ideas, domain details, and definitive final checks.
- Failed or empty generation and indeterminate final checks do not use a
  search. Saving, revisiting, and copying an existing result remain free.
- Namescape's usage-metering release is verified in source but is not merged,
  deployed, or launch-ready according to its status ledger.
- As checked through public DNS on 2026-07-18, neither `namescape.pink` nor
  `gateway.pink` publishes an A, AAAA, or CNAME answer. The company site must
  not present either destination as currently reachable.
- Gateway's pricing snapshot and developer-preview status were refreshed on
  2026-07-18 and remain unchanged by this scope. Gateway checkout remains
  unavailable.

The Namescape action matrix is sourced from the verified branch's
`docs/usage-economics.md`, `backend/Services/UsagePolicyService.cs`, and
`backend/appsettings.json`. `PaddleService.cs`, appsettings product IDs, and
`docs/paddle-catalog.md` remain the separate authorities for pack sizes,
prices, and checkout identifiers.

## Chosen approach

Use a fact-first launch-safe refresh. Preserve the established Pinkflow visual
identity, page architecture, legal routes, and accessibility behavior. Update
the typed commercial data and every public consumer of that data. This is
preferred over a pricing-only patch, which would leave false lifecycle and CTA
claims, and over a full redesign, which would add risk without improving the
site's factual contract.

## Product lifecycle contract

The homepage continues to present both products because they are the current
Pinkflow portfolio, but neither is described as a reachable production
service.

- Namescape: `Launch preparation`; external destination, documentation, and
  checkout actions disabled; `live` is false; launch pricing remains public
  for transparency.
- Gateway.pink: `Developer preview`; external documentation and checkout
  actions disabled until its public destination resolves; `live` is false;
  preview pricing remains public for budgeting. Public copy describes the
  routes as implemented in the developer-preview catalog and explicitly says
  that public API and documentation access are not currently open.

The typed product model remains the single source for status labels and action
availability. Product pages render only actions allowed by that model. Built
pages contain no `namescape.pink` or `gateway.pink` anchor or structured-data
URL while those destinations are unavailable. Pack `Offer` schema is omitted
entirely while checkout is closed; launch prices are informational, not active
offers.

## Namescape pricing presentation

The pricing page separates actions by customer meaning rather than exposing
provider or token mechanics.

### Free actions

- Standard name ideas in the app
- Brief Helper
- Domain details in single, batch, and bulk workflows
- Public API domain details

### Search-priced actions

- Premium name ideas — Standard: 1 search per successful request
- Premium name ideas — Max: 2 searches per successful request
- Bulk name ideas — Standard: 3 searches per successful request
- Bulk name ideas — Max: 6 searches per successful request
- Final check — Single: 1 search per definitive result
- Final check — Batch: 1 search per 5 definitive results, rounded up
- Public API name ideas: 1 search per successful request
- Public API final check: 1 search per definitive result

The page explains searches as the complete customer usage unit and states that
failed, empty, or indeterminate work is not charged. It does not introduce
internal provider, model, or request-processing mechanics. The 40-domain/
60-second final-check attempt budget remains internal capacity protection and
is not presented as customer billing.

## Company and policy copy

- Replace claims that Pinkflow currently “operates” both products with neutral
  language about building the products and publishing their contracts.
- Remove “Open Namescape” and “Explore Gateway.pink” external actions while
  destinations are unavailable. Keep internal pricing and contact actions.
- Mark Namescape pack checkout as not currently available. Pricing is launch
  pricing, not a purchasable offer today.
- Keep product-specific data, refund, and payment distinctions. Terms and
  Refunds must not imply that either checkout is currently live.
- Audit Terms, Privacy, Refunds, Contact, homepage, pricing, footer, README, and
  metadata. Present-tense service, trial, purchase, support, or documentation
  claims must be conditional on launch or invitation access.
- Update policy revision dates to 2026-07-18 when their public wording changes,
  and update README pricing sources and lifecycle facts with the same contract.

## Visual treatment

Retain the committed `#120d1a` night background, `#ff4da6` flow-pink signal,
Plus Jakarta Sans identity, product-shaped artifacts, and varied section
rhythm. The refresh is a content and trust correction, not a new aesthetic.
Lifecycle status remains text-first, all primary actions keep 44px targets,
and current contrast, reduced-motion, 200% text-scale, and mobile safeguards
stay mandatory.

## Testing and deployment

1. Add failing contract tests for the new Namescape action matrix, authoritative
   action/pack source paths, source date, non-live lifecycle states, and
   unavailable external actions.
2. Add failing browser tests for the new pricing language, status labels,
   absence of external product CTAs, checkout-unavailable notices, absence of
   schema.org `Offer`, and zero unavailable product-domain anchors or JSON-LD
   URLs across every built public page.
3. Implement the smallest data and page changes that satisfy those contracts.
4. Run unit tests, Astro check/build, both Playwright projects, accessibility
   checks already included in the suite, `npm audit`, and `git diff --check`.
5. Inspect homepage, pricing, policies, and mobile layout in a real browser.
6. Recheck public DNS and HTTP for both product domains immediately before
   integration. If availability has not changed, fast-forward the clean main
   checkout, push `main`, monitor the Pages workflow, and verify the deployed
   `pinkflow.ai` routes, pricing copy, absence of dead product-domain links,
   and absence of purchasable-offer schema.

Publishing this company site does not deploy Namescape, Gateway.pink, their
DNS, or their checkout systems. Their public lifecycle labels change only
after those external facts are verified.
