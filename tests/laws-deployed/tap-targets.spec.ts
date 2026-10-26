import { expect, test } from "@playwright/test";

test("deployed Texas legal navigation and source links have 44px mobile touch targets", async ({ page }) => {
  await page.goto("/laws/topic/landlord-tenant-rentals-law", { waitUntil: "domcontentloaded" });
  const tocLinks = page.getByRole("navigation", { name: "On this page" }).getByRole("link");
  expect(await tocLinks.count()).toBe(7);
  for (let i = 0; i < await tocLinks.count(); i++) {
    const rect = await tocLinks.nth(i).boundingBox();
    expect(rect?.height, `law topic contents link ${i} target height`).toBeGreaterThanOrEqual(44);
  }
  // Breadcrumbs, official statutory references and related navigation are
  // clickable legal resources, not exempt tiny inline text.
  for (const label of ["Breadcrumb", "Related Texas law resources"]) {
    const links = page.getByRole("navigation", { name: label }).getByRole("link");
    expect(await links.count(), `${label} link count`).toBeGreaterThan(0);
    for (let i = 0; i < await links.count(); i++) {
      const rect = await links.nth(i).boundingBox();
      expect(rect?.height, `${label} link ${i} target height`).toBeGreaterThanOrEqual(44);
    }
  }
  const statuteSources = page.locator("#law-sources").getByRole("link");
  expect(await statuteSources.count()).toBeGreaterThan(0);
  for (let i = 0; i < await statuteSources.count(); i++) {
    const rect = await statuteSources.nth(i).boundingBox();
    expect(rect?.height, `official statute source link ${i} target height`).toBeGreaterThanOrEqual(44);
  }

  await page.goto("/laws/topics", { waitUntil: "domcontentloaded" });
  const directoryBreadcrumbs = page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link");
  expect(await directoryBreadcrumbs.count()).toBe(2);
  for (let i = 0; i < await directoryBreadcrumbs.count(); i++) {
    const rect = await directoryBreadcrumbs.nth(i).boundingBox();
    expect(rect?.height, `directory breadcrumb ${i} target height`).toBeGreaterThanOrEqual(44);
  }
  const officialCodes = page.getByRole("link", { name: /Official Texas codes and statutes/ });
  expect((await officialCodes.boundingBox())?.height).toBeGreaterThanOrEqual(44);

  await page.goto("/laws", { waitUntil: "domcontentloaded" });
  const headlineLinks = page.getByRole("navigation", { name: "Latest headlines" }).getByRole("link");
  expect(await headlineLinks.count()).toBeGreaterThan(0);
  for (let i = 0; i < await headlineLinks.count(); i++) {
    const rect = await headlineLinks.nth(i).boundingBox();
    expect(rect?.height, `latest-headline link ${i} target height`).toBeGreaterThanOrEqual(44);
  }
  for (const name of [
    /Browse full Texas law-topic library/i,
    /Texas property tax law/i,
    /Official Texas statutes/i,
    /Official elections and ballot notices/i,
  ]) {
    const link = page.getByRole("navigation").getByRole("link", { name }).first();
    const rect = await link.boundingBox();
    expect(rect?.height, `law hub resource ${name} target height`).toBeGreaterThanOrEqual(44);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, "mobile law hub horizontal overflow").toBeLessThanOrEqual(1);
});