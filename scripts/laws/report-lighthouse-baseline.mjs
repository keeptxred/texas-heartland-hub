#!/usr/bin/env node
/**
 * Read-only, public-site Lighthouse baseline reporter.
 * Produces measured lab metrics, not CrUX field Core Web Vitals.
 */
import { readdirSync, readFileSync, appendFileSync } from "node:fs";
import { basename, join } from "node:path";

const CATEGORY_KEYS = ["performance", "accessibility", "best-practices", "seo"];
export function summarizeLighthouse(result) {
  if (!result || !result.finalDisplayedUrl || !result.categories || !result.audits) {
    throw new Error("Invalid Lighthouse result: missing URL/categories/audits");
  }
  const missing = CATEGORY_KEYS.filter((k) => !Number.isFinite(result.categories[k]?.score));
  if (missing.length) throw new Error(`Lighthouse missing scored categories: ${missing.join(", ")}`);
  const metric = (id) => result.audits[id]?.displayValue ?? "N/A";
  return {
    url: result.finalDisplayedUrl,
    scores: CATEGORY_KEYS.map((key) => Math.round(100 * result.categories[key].score)),
    lcp: metric("largest-contentful-paint"),
    cls: metric("cumulative-layout-shift"),
    tbt: metric("total-blocking-time"),
    fcp: metric("first-contentful-paint"),
  };
}
export function renderReport(reports) {
  if (reports.length === 0) throw new Error("No Lighthouse audits produced");
  const lines = [
    "## Texas laws — synthetic Lighthouse baseline",
    "",
    "Lab data only. These scores and lab LCP/CLS/TBT do **not** establish Google Search Console indexing, real-user Core Web Vitals, or field INP. Use Google's CrUX/Search Console when it becomes available.",
    "",
    "| Page | Performance | Accessibility | Best Practices | SEO | LCP (lab) | CLS (lab) | TBT (lab) |",
    "|---|---:|---:|---:|---:|---|---|---|",
  ];
  for (const r of reports) {
    const url = r.url.replace(/[|\n\r]/g, "");
    lines.push(`| [${url}](${url}) | ${r.scores.join(" | ")} | ${r.lcp} | ${r.cls} | ${r.tbt} |`);
  }
  lines.push("", "Scores are a single audit snapshot, not a guarantee of stable rankings. Review trace/report artifacts and repeat under consistent conditions before claiming measured improvement.");
  return lines.join("\n") + "\n";
}
if (process.argv[1]?.endsWith("report-lighthouse-baseline.mjs")) {
  const dir = process.argv[2];
  if (!dir) throw new Error("Usage: node report-lighthouse-baseline.mjs <audit-json-directory>");
  const files = readdirSync(dir).filter((file) => file.endsWith(".json")).sort();
  const rows = files.map((file) => {
    try { return summarizeLighthouse(JSON.parse(readFileSync(join(dir, file), "utf8"))); }
    catch (err) { throw new Error(`${basename(file)}: ${err.message}`); }
  });
  const report = renderReport(rows);
  process.stdout.write(report);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
}
