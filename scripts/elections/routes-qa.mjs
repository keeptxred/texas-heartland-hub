import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (file) => readFile(path.join(ROOT, file), "utf8");
const [start, guard, homepage, nav, header, sitemapIndex, electionFeed, admin, dataset] = await Promise.all([
  read("src/start.ts"),
  read("src/lib/retired-election-central.ts"),
  read("src/routes/index.tsx"),
  read("src/lib/site-navigation.ts"),
  read("src/components/site-header.tsx"),
  read("src/routes/sitemap[.]xml.ts"),
  read("src/routes/sitemap-elections[.]xml.ts"),
  read("src/routes/admin/elections/index.tsx"),
  read("src/data/elections/2026/races.json"),
]);

const checks = [
  [start.includes("isRetiredElectionCentralPath(url.pathname)"), "Retirement guard missing from request middleware"],
  [start.includes("status: 404"), "Seasonal shutdown must return 404, not permanent 410"],
  [start.includes('"x-robots-tag": "noindex, nofollow"'), "Retired routes must not be indexed"],
  [guard.includes('normalized.startsWith("/elections/")'), "Detail routes not covered by retirement"],
  [guard.includes('"/candidate-guides"'), "Legacy election alias not retired"],
  [homepage.includes('if (!ELECTION_FEATURE_FLAGS.homepagePromotion) return null'), "Homepage still links to Election Central"],
  [nav.includes("ELECTION_FEATURE_FLAGS.homepagePromotion ? ELECTION_NAV : []"), "Election Central still in site navigation"],
  [!header.includes('to="/elections/'), "Header still links to retired election hub"],
  [sitemapIndex.includes('ELECTION_FEATURE_FLAGS.homepagePromotion ? ["sitemap-elections.xml"] : []'), "Root sitemap still advertises election feed"],
  [electionFeed.includes("ELECTION_FEATURE_FLAGS.homepagePromotion ? PRIORITY_ELECTION_PATHS : []"), "Former election sitemap still advertises retired pages"],
  [admin.includes("/admin/elections"), "Election back-office route was removed"],
  [dataset.includes('"race-2026-us-senate"'), "Underlying election data was removed"],
];
const errors = checks.filter(([ok]) => !ok).map(([, message]) => message);
if (errors.length) {
  console.error("Election retirement QA failed:", errors.join("; "));
  process.exit(1);
}
console.log("Election retirement QA passed: public section retired; admin and election data preserved.");
