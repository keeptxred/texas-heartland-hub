import { expect, test } from "@playwright/test";

test("deployed Texas legal navigation and source links have 44px mobile touch targets", async ({ page }) => {
  await page.goto("/laws/topic/landlord-tenant-rentals-law", { waitUntil: "domcontentloaded" });
  const tocLinks = page.getByRole("navigation", { name: "On this page" }).getByRole("link");
  expect(await tocLinks.count()).toBe(7);
  for (let i = 0; i < await tocLinks.count(); i++) {
    const rect = await tocLinks.nth(i).boundingBox();
    expect(rect?.height, `law topic contents link ${i} target height`).toBeGreaterThanOrEqual(44);
  }
  await page.goto("/laws", { waitUntil: "domcontentloaded" });
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