import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { path: '/', titleContains: 'Pinkflow', expectText: 'Practical software, built and operated by Pinkflow' },
  { path: '/pricing', titleContains: 'Pricing', expectText: 'Two products, two honest units' },
  { path: '/terms', titleContains: 'Terms of Service', expectText: 'Generally final once delivered or used' },
  { path: '/privacy', titleContains: 'Privacy Policy', expectText: 'supervisory authority' },
  { path: '/refunds', titleContains: 'Refund Policy', expectText: 'Generally final once delivered or used' },
  { path: '/contact', titleContains: 'Contact', expectText: 'hello@pinkflow.ai' },
];

const canonicalUrls: Record<string, string> = {
  '/': 'https://pinkflow.ai/',
  '/pricing': 'https://pinkflow.ai/pricing/',
  '/terms': 'https://pinkflow.ai/terms/',
  '/privacy': 'https://pinkflow.ai/privacy/',
  '/refunds': 'https://pinkflow.ai/refunds/',
  '/contact': 'https://pinkflow.ai/contact/',
};

for (const p of pages) {
  test(`${p.path} renders with expected content`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page).toHaveTitle(new RegExp(p.titleContains, 'i'));
    await expect(page.getByText(p.expectText).first()).toBeVisible();
  });
}

test('pricing shows three search packs', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.getByText('50 searches')).toBeVisible();
  await expect(page.getByText('200 searches')).toBeVisible();
  await expect(page.getByText('500 searches')).toBeVisible();
});

test('homepage presents both products with honest lifecycle status', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Namescape' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Gateway.pink' })).toBeVisible();
  await expect(page.getByText('Available', { exact: true })).toBeVisible();
  await expect(page.getByText('Developer preview', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Namescape' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore Gateway.pink' })).toBeVisible();
});

test('pricing publishes the Gateway credit contract without implying checkout is live', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.getByRole('heading', { name: 'Gateway.pink credits' })).toBeVisible();
  await expect(page.getByText('1 credit = $0.001', { exact: true })).toBeVisible();
  await expect(page.getByText('10,000 credits')).toBeVisible();
  await expect(page.getByText('$10', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Email validation')).toBeVisible();
  await expect(page.getByText('6 credits', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Phone line-type lookup')).toBeVisible();
  await expect(page.getByText('12 credits', { exact: true })).toBeVisible();
  await expect(page.getByText('17 currently available free routes')).toBeVisible();
  await expect(page.getByText('4 paid routes')).toBeVisible();
  await expect(page.getByText("is the caller's hard credit ceiling")).toBeVisible();
  await expect(page.getByText('Gateway.pink credit checkout is not currently available.')).toBeVisible();
  await expect(page.getByRole('link', { name: /buy gateway credits/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Explore Gateway.pink docs' })).toBeVisible();
});

test('pricing 200-pack is marked Best value', async ({ page }) => {
  await page.goto('/pricing');
  // Badge text is uppercase ("BEST VALUE") — match the badge span, not the
  // "Best value per search" deliverable line in the same pack.
  await expect(page.getByText('Best value', { exact: true })).toBeVisible();
});

test('pricing mentions final tax total at checkout', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.getByText('Final tax and currency total shown at checkout')).toBeVisible();
});

test('pricing explains current Namescape usage prices', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.getByRole('heading', { name: 'How search usage works' })).toBeVisible();
  await expect(page.getByText('Standard generation')).toBeVisible();
  await expect(page.getByText('Bulk generation')).toBeVisible();
  await expect(page.getByText('5 searches', { exact: true })).toBeVisible();
  await expect(page.getByText('Bulk availability')).toBeVisible();
  await expect(page.getByText('3 searches', { exact: true })).toBeVisible();
  await expect(page.getByText('Exact availability')).toBeVisible();
  await expect(page.getByText('one rate-limited generation attempt')).toBeVisible();
});

test('policies distinguish Namescape searches from Gateway credits', async ({ page }) => {
  await page.goto('/terms');
  await expect(page.getByRole('heading', { name: /Namescape searches and Gateway credits/ })).toBeVisible();

  await page.goto('/privacy');
  await expect(page.getByText('Gateway does not log or persistently store request or response bodies')).toBeVisible();
  await expect(page.getByText('cached-ttl')).toBeVisible();
  await expect(page.getByText('Provider-backed Gateway routes')).toBeVisible();

  await page.goto('/refunds');
  await expect(page.getByText('Gateway.pink credit checkout is not currently available.')).toBeVisible();
});

test('footer shows operator line on every page', async ({ page }) => {
  for (const p of pages) {
    await page.goto(p.path);
    await expect(page.getByText(/Pinkflow is operated by Miro Mal, an individual based in Tel Aviv, Israel/).first()).toBeVisible();
  }
});

test('header nav links resolve on all pages', async ({ page }) => {
  const navLinks = ['/#products', '/pricing', '/#company', '/contact'];
  for (const link of navLinks) {
    await page.goto('/');
    // On mobile the nav links are hidden behind the hamburger toggle until
    // opened; on desktop they're always visible. Open the menu first if the
    // toggle is present, then click the (now-visible) link.
    const toggle = page.locator('#nav-toggle');
    if (await toggle.isVisible()) {
      await toggle.click();
    }
    await page.locator(`header a[href="${link}"]`).filter({ visible: true }).first().click();
    await expect(page).toHaveURL(link);
  }
});

test('header uses the animated Pinkflow flow mark', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header').getByTestId('pinkflow-flow-mark')).toBeVisible();
  await expect(page.locator('header .pinkflow-stream')).toHaveCSS('animation-name', 'pinkflowStream');
});

test('404 page renders for unknown route', async ({ page }) => {
  await page.goto('/this-does-not-exist');
  await expect(page.getByText('404')).toBeVisible();
});

test('public pages do not overflow horizontally', async ({ page }) => {
  for (const p of pages) {
    await page.goto(p.path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  }
});

test('public pages expose exact canonical URLs', async ({ page }) => {
  for (const p of pages) {
    await page.goto(p.path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrls[p.path]);
  }
});

test('every page offers keyboard users a skip link', async ({ page }) => {
  for (const p of pages) {
    await page.goto(p.path);
    await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main-content');
  }
});

test('public pages have no automated WCAG A or AA violations', async ({ page }) => {
  for (const p of pages) {
    await page.goto(p.path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations, `${p.path}: ${results.violations.map((violation) => violation.id).join(', ')}`).toEqual([]);
  }
});

test('the animated mark respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const duration = await page.locator('.pinkflow-stream').first().evaluate((element) => {
    const value = getComputedStyle(element).animationDuration;
    return Number.parseFloat(value) * (value.endsWith('ms') ? 1 : 1000);
  });
  expect(duration).toBeLessThanOrEqual(10);
});

test('key product content remains usable at 200% text size', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  for (const path of ['/', '/pricing']) {
    await page.goto(path);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(1);

    const wordsBrokenAcrossLines = await page.locator('h1, h2, h3').evaluateAll((headings) => {
      const broken: string[] = [];
      for (const element of headings) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const text = node.textContent ?? '';
          for (const match of text.matchAll(/\S+/g)) {
            const range = document.createRange();
            range.setStart(node, match.index ?? 0);
            range.setEnd(node, (match.index ?? 0) + match[0].length);
            const lineTops = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top)));
            if (lineTops.size > 1) broken.push(`${element.textContent?.trim()}: ${match[0]}`);
          }
        }
      }
      return broken;
    });
    expect(wordsBrokenAcrossLines, `${path} breaks words inside a heading`).toEqual([]);
  }
});

test('inline links remain identifiable without relying on color alone', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#company a[href="mailto:hello@pinkflow.ai"]')).toHaveCSS('text-decoration-line', 'underline');

  await page.goto('/pricing');
  await expect(page.locator('main a[href="mailto:hello@pinkflow.ai"]')).toHaveCSS('text-decoration-line', 'underline');
});
