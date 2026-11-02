// One-page, read-only post-deployment forecast acceptance. Checkpoint: #3353.
// This runs on a GitHub runner against the public domain after a real Worker deploy.
// It does not publish, change source data, purge caches, or invoke Cloudflare APIs.
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const reportFile = "election-forecast-production-report.md";
const snapshots = JSON.parse(await readFile("src/data/elections/2026/forecasts.json", "utf8"));
const expected = snapshots.filter((item) =>
  item.publicationStatus === "published" &&
  item.verificationStatus === "verified" &&
  ["active", "final"].includes(item.status)
);
const errors = [];
const observations = [];
let browser;

try {
  if (expected.length === 0) {
    throw new Error("No published verified forecast snapshots are available for comparison");
  }
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    locale: "en-US",
    timezoneId: "UTC",
    serviceWorkers: "block",
    extraHTTPHeaders: { "Cache-Control": "no-cache" },
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const url = "https://keeptxred.com/elections/forecast?ktr_forecast_verify=" +
    encodeURIComponent(process.env.GITHUB_RUN_ID || "manual");
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  observations.push("GET /elections/forecast HTTP " + String(response?.status() ?? "no response"));
  if (!response?.ok()) {
    throw new Error("Forecast page did not return HTTP 2xx");
  }
  const canonical = await page.locator('link[rel="canonical"]').first().getAttribute("href");
  observations.push("Canonical: " + (canonical || "missing"));
  if (canonical !== "https://keeptxred.com/elections/forecast") {
    errors.push("Unexpected or missing canonical URL");
  }

  // Forecast cards are client-rendered. An HTTP-only SSR smoke cannot prove
  // their presence. Wait once for the expected published cards to hydrate.
  await page.waitForFunction(
    (count) => document.querySelectorAll('article h3 a[href*="/elections/forecast/"]').length >= count,
    expected.length,
    { timeout: 30000 }
  );
  const cards = page.locator('article:has(h3 a[href*="/elections/forecast/"])');
  const cardCount = await cards.count();
  observations.push("Hydrated forecast cards: " + cardCount + "; published verified snapshots: " + expected.length);
  if (cardCount !== expected.length) {
    errors.push("Card count differs from the verified source snapshots");
  }

  for (const snapshot of expected) {
    const anchor = page.locator('article h3 a[href$="/elections/forecast/' + snapshot.slug + '"]');
    const matches = await anchor.count();
    if (matches !== 1 || !(await anchor.first().isVisible())) {
      errors.push("Missing or duplicate visible forecast card: " + snapshot.slug);
      continue;
    }
    const text = await anchor.first().locator("xpath=ancestor::article").innerText();
    const match = text.match(/Updated\s+(\d{1,2}\/\d{1,2}\/\d{4},?\s+\d{1,2}:\d{2}:\d{2}\s*[AP]M)/i);
    if (!match) {
      errors.push("Missing visible update timestamp: " + snapshot.slug);
      continue;
    }
    const observed = Date.parse(match[1]);
    const source = Date.parse(snapshot.updatedAt);
    observations.push(snapshot.slug + ": source=" + snapshot.updatedAt + "; public=" + match[1]);
    if (!Number.isFinite(observed) || !Number.isFinite(source) || observed + 1000 < source) {
      errors.push("Public forecast is older than deployed verified snapshot: " + snapshot.slug);
    }
  }
  if (pageErrors.length) {
    observations.push("Browser page errors (diagnostic): " + pageErrors.slice(0, 5).join(" | "));
  }
} catch (error) {
  errors.push("Forecast hydration inspection failed: " + (error?.message || String(error)));
} finally {
  if (browser) await browser.close();
}

const report = [
  "# Election Central forecast — production browser acceptance",
  "Checked: " + new Date().toISOString(),
  "Expected published verified snapshots: " + expected.length,
  "One Chromium browser, mobile viewport 390x844, UTC locale; canonical /elections/forecast.",
  "",
  "## Observations",
  ...observations.map((item) => "- " + item),
  "",
  errors.length ? "## Failures" : "## Live hydrated forecast acceptance passed",
  ...errors.map((item) => "- " + item),
  "",
  "Read-only page verification. Poll snapshots and model projections are not election results.",
].join("\n") + "\n";
await writeFile(reportFile, report);
console.log(report);
if (errors.length) process.exitCode = 1;
