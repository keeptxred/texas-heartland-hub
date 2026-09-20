import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const roundupPath = path.join(root, "supabase/migrations/20260827190000_expand_flyover_style_texas_discovery.sql");
const regionalPath = path.join(root, "supabase/migrations/20260827193000_primary_source_and_regional_texas_discovery.sql");

function readRequired(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required discovery migration is missing: ${path.relative(root, filePath)}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function requireTokens(label, content, tokens) {
  const missing = tokens.filter((token) => !content.includes(token));
  if (missing.length) {
    throw new Error(`${label} discovery contract is missing: ${missing.join(", ")}`);
  }
}

const roundup = readRequired(roundupPath);
const regional = readRequired(regionalPath);

requireTokens("Roundup archetype", roundup, [
  "Texas Executive Actions — Google News",
  "Texas Attorney General Actions — Google News",
  "Texas DPS and Wanted Notices — Google News",
  "Texas City and County Decisions — Google News",
  "Texas Police Sheriff and Fire Notices — Google News",
  "Texas Courts and Judicial Appointments — Google News",
  "Texas Higher Education and Campus Actions — Google News",
  "Texas Corporate Partnerships and Expansions — Google News",
  "Texas Grants and Workforce Investments — Google News",
  "Texas Property and Records Alerts — Google News",
  "Texas Zoos Wildlife and Conservation — Google News",
  "Texas Libraries Museums and Community Grants — Google News",
  "Texas Awards Contests and Recognition — Google News",
  "Texas Sports Recruiting and Partnerships — Google News",
  "Texas Sports Records and Honors — Google News",
  "Texas Airports TSA and Travel — Google News",
  "Texas Local Oddities and Human Interest — Google News",
]);

requireTokens("Primary-source", regional, [
  "Texas Governor Primary Source — Google News",
  "Texas Attorney General Primary Source — Google News",
  "Texas DPS Primary Source — Google News",
  "Texas Parks Wildlife Primary Source — Google News",
  "Texas Workforce Primary Source — Google News",
  "Texas Emergency and Forest Service Primary Sources — Google News",
  "Texas Transportation Primary Source — Google News",
  "Texas Courts Primary Source — Google News",
  "Texas Education Primary Sources — Google News",
  "Texas Comptroller Primary Source — Google News",
]);

requireTokens("Regional", regional, [
  "Texas Panhandle and South Plains — Regional Discovery",
  "West Texas and Permian Basin — Regional Discovery",
  "North Texas and Cross Timbers — Regional Discovery",
  "East Texas and Piney Woods — Regional Discovery",
  "Central Texas and Brazos Valley — Regional Discovery",
  "Gulf Coast and Coastal Bend — Regional Discovery",
  "South Texas and Rio Grande Valley — Regional Discovery",
  "Hill Country and San Antonio Region — Regional Discovery",
]);

for (const [label, content] of [["Roundup archetype", roundup], ["Primary/regional", regional]]) {
  if (!/INSERT INTO public\.content_sources/i.test(content)) {
    throw new Error(`${label} migration no longer inserts into public.content_sources`);
  }
  if (!/enabled\)\s+AS/i.test(content) || !/true\)/i.test(content)) {
    throw new Error(`${label} migration no longer preserves enabled discovery sources`);
  }
}

console.log("Roundup discovery coverage contract passed: 17 archetypes, 10 primary-source feeds, 8 regional sweeps.");
