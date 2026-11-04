import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const [electionSitemap, sitemapIndex, sitemapShared, priority] = await Promise.all([
  readFile(path.join(ROOT, "src/routes/sitemap-elections[.]xml.ts"), "utf8"),
  readFile(path.join(ROOT, "src/routes/sitemap[.]xml.ts"), "utf8"),
  readFile(path.join(ROOT, "src/lib/sitemap-shared.ts"), "utf8"),
  readFile(path.join(ROOT, "src/data/search-console-priority-sitemap-urls.json"), "utf8"),
]);
const priorityUrls = JSON.parse(priority);
const errors = [];
if (!electionSitemap.includes("renderUrlset([])")) errors.push("Retired election sitemap is not empty.");
if (sitemapIndex.includes('"sitemap-elections.xml"')) errors.push("Retired election sitemap is still advertised.");
if (!sitemapShared.includes('"/elections"')) errors.push("Shared sitemap renderer does not filter retired election paths.");
if (priorityUrls.some((url) => new URL(url).pathname.startsWith("/elections/"))) errors.push("Priority sitemap contains retired election URL.");
if (errors.length) {
  console.error("Election sitemap retirement QA failed:", errors.join("; "));
  process.exit(1);
}
console.log("Election sitemap retirement QA passed.");
