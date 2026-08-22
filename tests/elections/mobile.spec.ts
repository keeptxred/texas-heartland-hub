import { expect, test, type Page, type Response } from "@playwright/test";

const STANDARD_HOMEPAGE_HEADING = /follow the decisions shaping texas/i;
const ELECTION_HOMEPAGE_HEADING = /texas election central/i;

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

async function expectSuccessfulNavigation(response: Response | null, label: string) {
  const status = response?.status() ?? 0;
  if (response && status >= 400) {
    const body = await response.text().catch(() => "<response body unavailable>");
    console.error(
      `[mobile-qa-http] ${label} status=${status} headers=${JSON.stringify(response.headers())} body=${JSON.stringify(body.slice(0, 2000))}`,
    );
  }
  expect(status, `${label} returned an error status`).toBeLessThan(400);
}

test("homepage renders exactly one supported experience", async ({ page }) => {
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectSuccessfulNavigation(response, "/");

  const standardHeading = page.getByRole("heading", { name: STANDARD_HOMEPAGE_HEADING });
  const electionHeading = page.getByRole("heading", { name: ELECTION_HOMEPAGE_HEADING });
  const standardVisible = await standardHeading.first().isVisible().catch(() => false);
  const electionVisible = await electionHeading.first().isVisible().catch(() => false);

  expect(
    Number(standardVisible) + Number(electionVisible),
    "homepage should render either the standard KTR experience or Election Central, but not both",
  ).toBe(1);

  if (standardVisible) {
    await expect(standardHeading.first()).toBeVisible();
    await expect(electionHeading).toHaveCount(0);
  } else {
    await expect(electionHeading.first()).toBeVisible();
    await expect(standardHeading).toHaveCount(0);
  }

  await expectNoHorizontalOverflow(page);
});

for (const route of ROUTES) {
  test(`mobile route renders without overflow: ${route}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    await expectSuccessfulNavigation(response, route);
    await expect(page.locator("h1").first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(consoleErrors, `${route} logged browser errors`).toEqual([]);
  });
}

test("polling and forecasts are sourced while result states remain honest", async ({ page }) => {
  await page.goto("/elections/polls", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("link", { name: /view poll source/i }).first()).toBeVisible({
    timeout: 20_000,
  });

  await page.goto("/elections/forecast", { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Forecasts are not available yet")).toHaveCount(0);
  await expect(page.locator('a[href^="/elections/forecast/"]').first()).toBeVisible();

  await page.goto("/elections/results", { waitUntil: "domcontentloaded" });
  await expect(page.getByText(/unofficial and may change as ballots are counted/i)).toBeVisible({
    timeout: 20_000,
  });
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
