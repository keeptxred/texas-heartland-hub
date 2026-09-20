import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ROUTES = path.join(ROOT, "src/routes");
const errors = [];

const requiredFiles = [
  "index.tsx",
  "news.index.tsx",
  "find-representative.tsx",
  "api.elections.district-lookup.ts",
  "elections.tsx",
  "elections.index.tsx",
  "elections.2026.tsx",
  "elections.races.tsx",
  "elections.races_.$raceSlug.tsx",
  "elections.statewide.tsx",
  "elections.legislative.tsx",
  "elections.districts.tsx",
  "elections.districts.index.tsx",
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

const [
  home,
  layout,
  legacyIndex,
  cycle,
  flags,
  electionRoutes,
  electionSitemap,
  siteNavigation,
  siteHeader,
  siteFooter,
  start,
  sitemapIndex,
  findMyRaces,
  districtLookup,
  legislatureHub,
] = await Promise.all([
  read("src/routes/index.tsx"),
  read("src/routes/elections.tsx"),
  read("src/routes/elections.index.tsx"),
  read("src/routes/elections.2026.tsx"),
  read("src/lib/elections/featureFlags.ts"),
  read("src/lib/elections/routes.ts"),
  read("src/lib/elections/sitemap.ts"),
  read("src/lib/site-navigation.ts"),
  read("src/components/site-header.tsx"),
  read("src/components/site-footer.tsx"),
  read("src/start.ts"),
  read("src/routes/sitemap[.]xml.ts"),
  read("src/routes/find-representative.tsx"),
  read("src/routes/api.elections.district-lookup.ts"),
  read("src/routes/texas-legislature.index.tsx"),
]);

requireText(home, "ELECTION_FEATURE_FLAGS.homepagePromotion", "Homepage is not wired to the election promotion feature flag.");
requireText(home, "<ElectionSeasonSpotlight />", "Homepage does not prominently promote the dedicated Election Central hub.");
requireText(home, 'to="/elections/2026"', "Homepage election promotion does not target the canonical 2026 Election Central hub.");
if (home.includes("<ElectionHomePage")) {
  errors.push("Homepage must not duplicate the Election Central page; /elections/2026 owns that search intent.");
}
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
requireText(flags, "VITE_ENABLE_ELECTION_CENTRAL_HOMEPAGE", "Election homepage promotion feature flag is missing.");
for (const route of [
  'findMyRaces: "/find-representative"',
  'statewide: "/elections/statewide"',
  'legislative: "/elections/legislative"',
  'districts: "/elections/districts"',
]) {
  requireText(electionRoutes, route, `Missing SEO election route constant: ${route}.`);
}
requireText(
  electionRoutes,
  '{ label: "Find My Races", href: ELECTION_ROUTES.findMyRaces }',
  "Election Central navigation is missing Find My Races.",
);
for (const requiredText of [
  'createFileRoute("/api/elections/district-lookup")',
  "geocoding.geo.census.gov/geocoder/locations/onelineaddress",
  "tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer",
  'lookupDistrict(0, "CD119"',
  'lookupDistrict(1, "SLDU"',
  'lookupDistrict(2, "SLDL"',
  '"cache-control": "no-store"',
  '"x-robots-tag": "noindex, nofollow"',
]) {
  requireText(
    districtLookup,
    requiredText,
    `Find My Races district lookup is missing required contract: ${requiredText}`,
  );
}
for (const requiredText of [
  'fetch("/api/elections/district-lookup"',
  "ELECTION_ROUTES.statewide",
  "This is not your complete ballot",
  "Texas Senate seats are staggered",
]) {
  requireText(
    findMyRaces,
    requiredText,
    `Find My Races public page is missing required behavior: ${requiredText}`,
  );
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
  siteNavigation,
  'id: "elections"',
  "Election Central is missing its primary navigation group.",
);
requireText(
  siteNavigation,
  'href: "/elections/2026"',
  "Election Central navigation group does not target the canonical 2026 hub.",
);
requireText(
  siteNavigation,
  '{ to: "/elections/2026", label: "Election Central"',
  "Election Central is missing from the shared site navigation contract.",
);
requireText(
  siteHeader,
  'from "@/lib/site-navigation"',
  "Primary site navigation is not connected to the shared navigation contract.",
);
requireText(
  siteHeader,
  "SITE_NAV_GROUPS.map",
  "Primary site navigation does not render the shared navigation groups.",
);
requireText(
  siteFooter,
  'from "@/lib/site-navigation"',
  "Site footer is not connected to the shared navigation contract.",
);
requireText(
  siteFooter,
  "SITE_NAV_GROUPS.map",
  "Site footer does not render the shared navigation groups.",
);
for (const crawlBridge of [
  'to="/elections/2026"',
  'to="/elections/candidates"',
  'to="/elections/legislative"',
]) {
  requireText(
    legislatureHub,
    crawlBridge,
    `Indexed Texas Legislature hub is missing Election Central crawl bridge: ${crawlBridge}.`,
  );
}
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
  '"sitemap-elections.xml"',
  "The root sitemap index does not advertise the election sitemap.",
);

if (/VITE_ENABLE_ELECTION_CENTRAL_HOMEPAGE\s*=\s*(?:true|1|yes|on)/i.test(`${home}\n${flags}`)) {
  errors.push("Election homepage promotion appears to be hard-coded on instead of controlled by the feature flag.");
}

if (errors.length) {
  console.error(`Election route QA failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Election route QA passed: ${requiredFiles.length} route files and shared navigation integration verified.`);

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
