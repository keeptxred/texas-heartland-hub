import { expect, test, type Page } from "@playwright/test";

const LOCAL_PREVIEW = "http://127.0.0.1:4173";
const ROUTES = [
  "/laws",
  "/laws/topics",
  "/laws/topic/landlord-tenant-rentals-law",
  "/laws/topic/employment-wages-workplace-rights-law",
] as const;

test.beforeEach(async ({ page }) => {
  await page.route(`${LOCAL_PREVIEW}/**`, async (route) => {
    await route.continue({
      headers: {
        ...route.request().headers(),
        "x-forwarded-host": "keeptxred.com",
        "x-forwarded-proto": "https",
      },
    });
  });
});

async function expectNoOverflow(page: Page) {
  const widths = await page.evaluate(() => ({
    viewport: window.innerWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(widths.scroll, "legal page should not overflow the viewport horizontally")
    .toBeLessThanOrEqual(widths.viewport + 1);
}

for (const width of [390, 1280]) {
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
