import { expect, test, type Page } from "@playwright/test";

const ROUTES = [
  "/elections/2026",
  "/elections/races",
  "/elections/races/2026-us-senate",
  "/elections/candidates",
  "/elections/candidates/ken-paxton-republican-race-2026-us-senate",
  "/elections/polls",
  "/elections/forecast",
  "/elections/results",
  "/elections/voting",
  "/elections/methodology",
] as const;

test("normal homepage remains active while takeover is disabled", async ({ page }) => {
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBeLessThan(400);
  await expect(page.getByRole("heading", { name: /your guide to moving to and living in texas/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /texas election central/i })).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

for (const route of ROUTES) {
  test(`mobile route renders without overflow: ${route}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `${route} returned an error status`).toBeLessThan(400);
    await expect(page.locator("h1").first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(consoleErrors, `${route} logged browser errors`).toEqual([]);
  });
}

test("polling and forecasts are sourced while result states remain honest", async ({ page }) => {
  await page.goto("/elections/polls", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("link", { name: /view poll source/i }).first()).toBeVisible();

  await page.goto("/elections/forecast", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Forecasts are not available yet")).toHaveCount(0);
  await expect(page.locator('a[href^="/elections/forecast/"]').first()).toBeVisible();

  await page.goto("/elections/results", { waitUntil: "domcontentloaded" });
  await expect(page.getByText(/remain unofficial until certified/i)).toBeVisible();
});

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(dimensions.document, "page has horizontal overflow").toBeLessThanOrEqual(
    dimensions.viewport + 1,
  );
}
