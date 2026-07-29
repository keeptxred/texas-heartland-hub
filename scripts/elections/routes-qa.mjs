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
  "elections.races.$raceSlug.tsx",
  "elections.candidates.tsx",
  "elections.candidates.$candidateSlug.tsx",
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

const [home, layout, legacyIndex, cycle, flags] = await Promise.all([
  read("src/routes/index.tsx"),
  read("src/routes/elections.tsx"),
  read("src/routes/elections.index.tsx"),
  read("src/routes/elections.2026.tsx"),
  read("src/lib/elections/featureFlags.ts"),
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
