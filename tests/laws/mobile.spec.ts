import { expect, test, type Page } from "@playwright/test";

const ROUTES = [
  "/laws",
  "/laws/topics",
  "/laws/topic/landlord-tenant-rentals-law",
  "/laws/topic/employment-wages-workplace-rights-law",
] as const;

async function expectNoOverflow(page: Page) {
  const widths = await page.evaluate(() => ({
    viewport: window.innerWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(widths.scroll, "legal page should not overflow the viewport horizontally")
    .toBeLessThanOrEqual(widths.viewport + 1);
}

// This site uses SSR. The initial HTML has every law card and an inert menu
// until client hydration attaches search and navigation event handlers.
// Waiting for this React-managed signal keeps the assertions strict and avoids
// false positives from links that were present before search actually worked.
async function expectInteractiveHydration(page: Page) {
  await expect(page.locator("header")).toHaveAttribute("data-client-ready", "true", { timeout: 20_000 });
}

// 320 CSS pixels also exercises WCAG 1.4.10 reflow (e.g. a 640px viewport at 200% zoom).
for (const width of [320, 390, 1280]) {
  test.describe(`${width}px law page layout`, () => {
    test.use({ viewport: { width, height: 844 } });
    for (const route of ROUTES) {
      test(`renders accessible H1, canonical and no overflow: ${route}`, async ({ page }) => {
        const response = await page.goto(route, { waitUntil: "domcontentloaded" });
        expect(response?.status(), `${route} HTTP response`).toBeLessThan(400);
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("h1")).toBeVisible();
        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveCount(1);
        await expect(canonical).toHaveAttribute("href", `https://keeptxred.com${route}`);
        await expectNoOverflow(page);
      });
    }
  });
}

test("law library searches the actual legal answers and handles no results", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/laws/topics", { waitUntil: "domcontentloaded" });
  await expectInteractiveHydration(page);
  const search = page.getByRole("searchbox", { name: /search the texas law-topic library/i });
  await search.fill("security deposit");
  await expect(page.locator('#law-topic-results a[href="/laws/topic/landlord-tenant-rentals-law"]')).toBeVisible();

  await search.fill("final paycheck");
  await expect(page.locator('#law-topic-results a[href="/laws/topic/employment-wages-workplace-rights-law"]')).toBeVisible();

  await search.fill("never-a-valid-law-topic-zzzx");
  await expect(page.getByText("No law topics match that search")).toBeVisible();
  await expectNoOverflow(page);
});

test("long law pages have working keyboard-friendly source navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/laws/topic/landlord-tenant-rentals-law", { waitUntil: "domcontentloaded" });
  const link = page.getByRole("navigation", { name: "On this page" }).getByRole("link", { name: /official sources/i });
  await expect(link).toBeVisible();
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#law-sources$/);
  await expect(page.locator("#law-sources")).toBeVisible();
  await expect(page.getByRole("heading", { name: /^official sources$/i })).toBeVisible();
  await expectNoOverflow(page);
});


test("legal-page header navigation has usable 44px tap targets on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/laws", { waitUntil: "domcontentloaded" });
  await expectInteractiveHydration(page);
  const header = page.locator("header");
  const menu = header.getByRole("button", { name: "Open menu" });
  const menuBounds = await menu.boundingBox();
  expect(menuBounds?.width, "mobile menu tap width").toBeGreaterThanOrEqual(44);
  expect(menuBounds?.height, "mobile menu tap height").toBeGreaterThanOrEqual(44);
  await menu.click();
  const links = header.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link");
  const total = await links.count();
  expect(total).toBeGreaterThan(5);
  for (let index = 0; index < total; index++) {
    const link = links.nth(index);
    const rect = await link.boundingBox();
    expect(rect?.height, `mobile navigation link ${index} tap height`).toBeGreaterThanOrEqual(44);
  }
  await expectNoOverflow(page);
});

test("legal-page desktop primary navigation triggers meet 44px target height", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("/laws", { waitUntil: "domcontentloaded" });
  const header = page.locator("header");
  const nav = header.getByRole("navigation", { name: "Primary navigation" });
  await expect(nav).toBeVisible();
  const controls = nav.locator("button, a");
  const total = await controls.count();
  expect(total).toBeGreaterThan(3);
  for (let index = 0; index < total; index++) {
    const rect = await controls.nth(index).boundingBox();
    expect(rect?.height, `desktop primary nav control ${index}`).toBeGreaterThanOrEqual(44);
  }
  const logo = header.locator('a[href="/"]').first();
  expect((await logo.boundingBox())?.height).toBeGreaterThanOrEqual(44);
  await expectNoOverflow(page);
});


test("law directory reflows at 320 CSS pixels while keeping its search usable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  const response = await page.goto("/laws/topics", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expectInteractiveHydration(page);
  const search = page.getByRole("searchbox", { name: /search the texas law-topic library/i });
  await expect(search).toBeVisible();
  await search.fill("security deposit");
  await expect(page.locator('#law-topic-results a[href="/laws/topic/landlord-tenant-rentals-law"]')).toBeVisible();
  await expectNoOverflow(page);
});
