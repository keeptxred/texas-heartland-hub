import { expect, test } from "@playwright/test";

const ready = [
  ["bryan-hughes", "Bryan Hughes"],
  ["judith-zaffirini", "Judith Zaffirini"],
  ["terri-leo-wilson", "Terri Leo-Wilson"],
  ["mihaela-plesa", "Mihaela Pleșa"],
] as const;

test("certified representative pilot pages work on mobile with usable source research", async ({ page }) => {
  for (const [slug, name] of ready) {
    const response = await page.goto("/representatives/" + slug, { waitUntil: "domcontentloaded" });
    expect(response?.status(), slug).toBe(200);
    await expect(page.getByRole("heading", { name, exact: true, level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", {
      name: "89th Legislature: official bill-role research",
    })).toBeVisible();
    await expect(page.getByRole("searchbox", {
      name: "Search bill identifier, subject or status",
    })).toBeVisible();
    // SSR content can be visible before the React bundle hydrates. Interacting
    // before hydration would incorrectly test an inert pre-hydration input.
    // This also fails closed when a JS bundle is truly missing or broken.
    await expect(page.locator('[data-research-hydrated="true"]')).toBeVisible({ timeout: 20000 });
    const sources = page.getByRole("link", { name: "Official Texas Legislature bill history" });
    expect(await sources.count(), slug).toBeGreaterThanOrEqual(16);
    const tooWide = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
    expect(tooWide, slug + " has horizontal page overflow").toBe(false);
    await page.getByRole("searchbox", {
      name: "Search bill identifier, subject or status",
    }).fill("unmatched-specific-test-search-zzz");
    await expect(page.getByText("No sampled records match these filters.")).toBeVisible();
  }
});

test("House Speaker profile is usable on mobile without inventing bill sponsorship", async ({ page }) => {
  const response = await page.goto("/representatives/dustin-burrows", { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Dustin Burrows", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "89th Legislature: documented Speaker actions" })).toBeVisible();
  const official = page.locator('[data-speaker-research="verified"] a[href$=".pdf"]');
  expect(await official.count()).toBeGreaterThanOrEqual(16);
  expect(await page.locator('meta[name="robots"]').getAttribute("content")).toContain("index,follow");
  const copy = await page.locator('[data-speaker-research="verified"]').innerText();
  expect(copy).toContain("not evidence");
  expect(copy).not.toContain("Role-linked sample entries");
  const tooWide = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  expect(tooWide, "Speaker archive has horizontal overflow").toBe(false);
});

test("federal profiles remain public but are not presented as certified research", async ({ page }) => {
  for (const slug of ["dan-crenshaw", "john-cornyn"]) {
    const response = await page.goto("/representatives/" + slug, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("This page is being reviewed for completeness and source verification.", {
      exact: false,
    })).toBeVisible();
    expect(await page.locator('meta[name="robots"]').getAttribute("content")).toContain("noindex,follow");
  }
});
