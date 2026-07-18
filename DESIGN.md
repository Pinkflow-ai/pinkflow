---
name: Pinkflow Company Site
description: A direct, product-led company and trust surface for Pinkflow.ai.
colors:
  flow-pink: "#ff4da6"
  flow-pink-hover: "#ff70b8"
  night: "#120d1a"
  night-raised: "#1a1226"
  white: "#ffffff"
  white-muted: "#b9b3c1"
rounded:
  sm: "8px"
  md: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
typography:
  display:
    fontFamily: "Plus Jakarta Sans Variable, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 8vw, 6.5rem)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.045em"
  body:
    fontFamily: "Plus Jakarta Sans Variable, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
components:
  button-primary:
    backgroundColor: "{colors.flow-pink}"
    textColor: "{colors.night}"
    rounded: "{rounded.sm}"
    padding: "12px 18px"
  card:
    backgroundColor: "{colors.night-raised}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "24px"
---

# Design System: Pinkflow Company Site

## Overview

**Creative North Star: "The Working Company Board"**

Pinkflow should feel like walking up to a small, well-run workshop that is
building and preparing practical products, with their lifecycle states, launch
or preview price tags, and the person to contact all visible.
The existing near-black and flow-pink identity is retained, while larger type,
product-shaped artifacts, and clearer page rhythms replace generic card grids.

The system rejects anonymous venture-studio polish and inflated enterprise
signals. It is dark because the existing identity commits to it, not because a
developer company is expected to look like a terminal.

## Colors

Flow pink is the single high-energy signal against layered plum-black surfaces.

- **Flow Pink** (`#ff4da6`): primary actions, links, focus, and the animated mark.
- **Flow Pink Hover** (`#ff70b8`): accessible hover and pressed states.
- **Night** (`#120d1a`): page background.
- **Night Raised** (`#1a1226`): product and policy surfaces.
- **White** (`#ffffff`): headings and primary text.
- **White Muted** (`#b9b3c1`): secondary copy at accessible contrast.

Use pink as a directional signal, not as a wash over every surface.

## Typography

**Display and body:** Plus Jakarta Sans Variable with system sans-serif fallback.

One deliberately selected family carries the identity through strong weight and
scale contrast. Display copy is tight and decisive; body copy remains between
65 and 72 characters per line with relaxed leading.

- **Display:** 800 weight, fluid 44–104px, 0.96 line-height.
- **Page title:** 800 weight, fluid 38–64px, 1.02 line-height.
- **Section title:** 800 weight, fluid 28–44px, 1.1 line-height.
- **Body:** 400–500 weight, 16–19px, 1.65–1.75 line-height.
- **Labels:** 700 weight, 12–14px; sentence case by default.

## Elevation

Depth comes primarily from tonal layers and borders. Pink glow is reserved for
the animated mark and the most important action; product panels do not combine
wide shadows with decorative borders.

## Components

### Buttons

Primary buttons use Flow Pink, Night bold text, an 8px radius, and a minimum
44px touch height. Secondary actions use a tonal surface and visible border.
Every interactive element receives a two-pixel keyboard focus outline.

### Cards / Containers

Product panels use a 12px radius, Night Raised background, and structural
dividers. Their internal layouts differ to reflect the product rather than
repeating identical icon-heading-copy tiles.

### Navigation

The header presents Products, Pricing, Company, and Contact. Legal links live in
the footer. The mobile menu exposes the same labels and closes after navigation.

### Product Status

Status labels always include text such as “Launch preparation” or “Developer
preview.” Color reinforces the state but never carries it alone.

## Do's and Don'ts

### Do:

- **Do** show the product name, status, price unit, and any allowed action together.
- **Do** use representative product flows and reviewed API prices as site imagery.
- **Do** keep company facts and support routes easy to scan.
- **Do** retain the `#120d1a` / `#ff4da6` identity and reduced-motion behavior.

### Don't:

- **Don't** build a generic venture-studio page that hides products or prices.
- **Don't** use inflated enterprise claims, fabricated metrics, or vague AI copy.
- **Don't** use gradient text, decorative terminal cosplay, excessive glass, or
  identical icon-above-heading card grids.
- **Don't** apply Namescape's searches, stored history, or refund mechanics to
  Gateway requests, and don't apply Gateway's credits or zero-payload-storage
  contract to Namescape.
