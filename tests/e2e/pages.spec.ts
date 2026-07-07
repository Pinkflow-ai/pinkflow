import { expect, test } from '@playwright/test';

const pages = [
  { path: '/', titleContains: 'Pinkflow', expectText: 'Tools for the everyday problems' },
  { path: '/pricing', titleContains: 'Pricing', expectText: 'One-time purchases' },
  { path: '/terms', titleContains: 'Terms of Service', expectText: 'Generally final once delivered or used' },
  { path: '/privacy', titleContains: 'Privacy Policy', expectText: 'supervisory authority' },
  { path: '/refunds', titleContains: 'Refund Policy', expectText: 'Generally final once delivered or used' },
  { path: '/contact', titleContains: 'Contact', expectText: 'hello@pinkflow.ai' },
];

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

test('no page contains the word "credits"', async ({ page }) => {
  for (const p of pages) {
    await page.goto(p.path);
    const body = await page.locator('body').innerText();
    expect(body.toLowerCase()).not.toContain('credit');
  }
});

test('footer shows operator line on every page', async ({ page }) => {
  for (const p of pages) {
    await page.goto(p.path);
    await expect(page.getByText(/Pinkflow, operated by/).first()).toBeVisible();
  }
});

test('header nav links resolve on all pages', async ({ page }) => {
  const navLinks = ['/pricing', '/terms', '/privacy', '/refunds', '/contact'];
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
  await expect(page.getByTestId('pinkflow-flow-mark')).toBeVisible();
  await expect(page.locator('.pinkflow-stream')).toHaveCSS('animation-name', 'pinkflowStream');
});

test('404 page renders for unknown route', async ({ page }) => {
  await page.goto('/this-does-not-exist');
  await expect(page.getByText('404')).toBeVisible();
});
