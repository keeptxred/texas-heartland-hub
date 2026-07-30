import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ROUTES = path.join(ROOT, "src/routes");
const errors = [];

const requiredFiles = [
  "index.tsx",
  "news.index.tsx",
  "elections.tsx",
  "elections.index.tsx",
  "elections.2026.tsx",
  "elections.races.tsx",
  "elections.races_.$raceSlug.tsx",
  "elections.statewide.tsx",
  "elections.legislative.tsx",
  "elections.districts.tsx",
  "elections.districts.$districtSlug.tsx",
  "elections.candidates.tsx",
  "elections.candidates_.$candidateSlug.tsx",
  "elections.polls.tsx",
  "elections.polls.$pollSlug.tsx",
  "elections.forecast.tsx",
  "elections.forecast.$forecastSlug.tsx",
  "elections.results.tsx",
  "elections.results.$resultSlug.tsx",
  "elections.voting.tsx",
  "elections.methodology.tsx",
  "elections.corrections.tsx",
  "sitemap-elections[.]xml.ts",
];

for (const file of requiredFiles) {
  try {
    await access(path.join(ROUTES, file));
  } catch {
    errors.push(`Missing required route file: src/routes/${file}`);
  }
}

const [home, layout, legacyIndex, cycle, flags, electionRoutes, electionSitemap, siteHeader, siteFooter, start, sitemapIndex] = await Promise.all([
  read("src/routes/index.tsx"),
  read("src/routes/elections.tsx"),
  read("src/routes/elections.index.tsx"),
  read("src/routes/elections.2026.tsx"),
  read("src/lib/elections/featureFlags.ts"),
  read("src/lib/elections/routes.ts"),
  read("src/lib/elections/sitemap.ts"),
  read("src/components/site-header.tsx"),
  read("src/components/site-footer.tsx"),
  read("src/start.ts"),
  read("src/routes/sitemap[.]xml.ts"),
]);

requireText(home, "ELECTION_FEATURE_FLAGS.homepagePromotion", "Homepage is not wired to the election feature flag.");
requireText(home, "<ElectionHomePage", "Homepage takeover does not render Election Central.");
requireText(layout, 'createFileRoute("/elections")', "Election parent layout route is not registered.");
requireText(layout, "<Outlet />", "Election parent route must render an Outlet for child routes.");
requireText(
  legacyIndex,
  'createFileRoute("/elections/")',
  "Exact legacy /elections index route is not registered.",
);
requireText(
  legacyIndex,
  'throw redirect({ to: "/elections/2026"',
  "Legacy /elections index route does not redirect to /elections/2026.",
);
requireText(cycle, 'createFileRoute("/elections/2026")', "Canonical 2026 cycle route is not registered.");
requireText(flags, "false", "Election homepage feature flag must default to disabled.");
for (const route of [
  'statewide: "/elections/statewide"',
  'legislative: "/elections/legislative"',
  'districts: "/elections/districts"',
]) {
  requireText(electionRoutes, route, `Missing SEO election route constant: ${route}.`);
}
requireText(
  electionSitemap,
  "ELECTION_DISTRICT_PATHS",
  "Election sitemap does not include district URL generation.",
);
requireText(
  cycle,
  'const ELECTION_CENTRAL_URL = "https://keeptxred.com/elections/2026"',
  "Election Central hub is missing its absolute canonical URL.",
);
requireText(
  cycle,
  '"@type": "CollectionPage"',
  "Election Central hub is missing CollectionPage structured data.",
);
requireText(
  siteHeader,
  '{ to: "/elections/2026", label: "Elections" }',
  "Election Central is missing from the primary site navigation.",
);
requireText(
  siteFooter,
  '{ to: "/elections/2026", label: "Election Central" }',
  "Election Central is missing from the site footer.",
);
for (const redirectSource of [
  '["/election", "/elections/2026"]',
  '["/election-central", "/elections/2026"]',
  '["/texas-elections", "/elections/2026"]',
  '["/elections/forecasts", "/elections/forecast"]',
]) {
  requireText(start, redirectSource, `Missing legacy election redirect: ${redirectSource}.`);
}
requireText(
  sitemapIndex,
  '{ file: "sitemap-elections.xml", count: ELECTION_STATIC_SITEMAP_COUNT }',
  "The root sitemap index does not advertise the election sitemap.",
);

if (/VITE_ENABLE_ELECTION_CENTRAL_HOMEPAGE\s*=\s*(?:true|1|yes|on)/i.test(`${home}\n${flags}`)) {
  errors.push("Homepage takeover appears to be hard-coded on.");
}

if (errors.length) {
  console.error(`Election route QA failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Election route QA passed: ${requiredFiles.length} route files and gated homepage integration verified.`);

async function read(relative) {
  try {
    return await readFile(path.join(ROOT, relative), "utf8");
  } catch {
    errors.push(`Unable to read ${relative}.`);
    return "";
  }
}

function requireText(content, text, message) {
  if (!content.includes(text)) errors.push(message);
}
