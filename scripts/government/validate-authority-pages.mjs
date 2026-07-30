import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const expectedSlugs = [
  "governor",
  "lieutenant-governor",
  "attorney-general",
  "comptroller",
  "agriculture-commissioner",
  "land-commissioner",
  "secretary-of-state",
  "railroad-commission",
  "state-board-of-education",
  "texas-legislature",
  "texas-house",
  "texas-senate",
  "speaker-of-the-house",
  "supreme-court",
  "court-of-criminal-appeals",
];
const requiredFiles = [
  "src/lib/texas-government.ts",
  "src/routes/texas-government.tsx",
  "src/routes/texas-government.$entitySlug.tsx",
  "src/routes/sitemap-government[.]xml.ts",
];
const requiredSections = [
  "overview",
  "responsibilities",
  "leadership",
  "history",
  "powers",
  "laws",
  "elections",
  "representatives",
  "news",
  "faqs",
];
const errors = [];

for (const file of requiredFiles) {
  try {
    await access(path.join(ROOT, file));
  } catch {
    errors.push(`Missing required file: ${file}`);
  }
}

const dataSource = await readFile(path.join(ROOT, "src/lib/texas-government.ts"), "utf8");
const detailSource = await readFile(path.join(ROOT, "src/routes/texas-government.$entitySlug.tsx"), "utf8");
const hubSource = await readFile(path.join(ROOT, "src/routes/texas-government.tsx"), "utf8");
const sitemapSource = await readFile(path.join(ROOT, "src/routes/sitemap-government[.]xml.ts"), "utf8");
const sitemapIndex = await readFile(path.join(ROOT, "src/routes/sitemap[.]xml.ts"), "utf8");

const discoveredSlugs = [...dataSource.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((match) => match[1]);
const uniqueSlugs = new Set(discoveredSlugs);
if (discoveredSlugs.length !== uniqueSlugs.size) errors.push("Duplicate government entity slugs detected.");
for (const slug of expectedSlugs) if (!uniqueSlugs.has(slug)) errors.push(`Missing entity slug: ${slug}`);
if (uniqueSlugs.size !== expectedSlugs.length) errors.push(`Expected ${expectedSlugs.length} entities, found ${uniqueSlugs.size}.`);

for (const section of requiredSections) {
  if (!detailSource.includes(`id=\"${section}\"`)) errors.push(`Detail template missing section: ${section}`);
}

const requiredDataFields = [
  "overview:",
  "constitutionalResponsibilities:",
  "currentOfficeholder:",
  "history:",
  "powers:",
  "relatedLaws:",
  "relatedElections:",
  "relatedRepresentatives:",
  "faqs:",
  "newsKeywords:",
  "officialUrl:",
];
for (const field of requiredDataFields) if (!dataSource.includes(field)) errors.push(`Data model missing required field: ${field}`);

for (const marker of ["GovernmentOrganization", "FAQPage", "BreadcrumbList", "CollectionPage", "ItemList"]) {
  if (!dataSource.includes(marker)) errors.push(`Structured data marker missing: ${marker}`);
}
for (const marker of ["rel: \"canonical\"", "og:title", "description"]) {
  if (!detailSource.includes(marker) || !hubSource.includes(marker)) errors.push(`SEO marker missing from hub or detail route: ${marker}`);
}
if (!sitemapSource.includes("GOVERNMENT_ENTITIES.map")) errors.push("Government sitemap does not enumerate entity pages.");
if (!sitemapIndex.includes("sitemap-government.xml")) errors.push("Government sitemap is absent from the sitemap index.");
if (/TODO|FIXME|placeholder/i.test(`${dataSource}\n${detailSource}\n${hubSource}`)) errors.push("Unfinished placeholder marker detected.");

const result = {
  valid: errors.length === 0,
  entityCount: uniqueSlugs.size,
  routeCount: uniqueSlugs.size + 1,
  requiredSectionCount: requiredSections.length,
  structuredDataTypes: ["GovernmentOrganization", "Organization", "WebPage", "CollectionPage", "ItemList", "BreadcrumbList", "FAQPage", "Person"],
  errors,
};
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exit(1);
