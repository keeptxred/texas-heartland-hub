import fs from "node:fs";

const scorerPath = "src/lib/viral-score.ts";
const sourceMigrationPath = "supabase/migrations/20260805142000_expand_texas_news_coverage.sql";
const gapMigrationPath = "supabase/migrations/20260805145500_add_news_coverage_gap_view.sql";
const healthMigrationPath = "supabase/migrations/20260805153500_add_news_source_health_view.sql";
const healthEndpointPath = "src/routes/api/public/newsroom-health.ts";
const smokePath = "scripts/news/smoke-live-newsroom.mjs";

const requiredFiles = [
  scorerPath,
  sourceMigrationPath,
  gapMigrationPath,
  healthMigrationPath,
  healthEndpointPath,
  smokePath,
];
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) throw new Error(`Missing newsroom coverage file: ${file}`);
}

const scorer = fs.readFileSync(scorerPath, "utf8");
const sources = fs.readFileSync(sourceMigrationPath, "utf8");
const gaps = fs.readFileSync(gapMigrationPath, "utf8");
const health = fs.readFileSync(healthMigrationPath, "utf8");
const healthEndpoint = fs.readFileSync(healthEndpointPath, "utf8");
const smoke = fs.readFileSync(smokePath, "utf8");

const configuredSources = [
  "Texas State Agencies — Google News",
  "Texas Universities — Google News",
  "Texas Hospitals and Health — Google News",
  "Texas Courts and Civil Rights — Google News",
  "Texas Local Government — Google News",
  "Texas Business and Workforce — Google News",
  "Moving to Texas and Demographics — Google News",
  "Texas Culture and Attractions — Google News",
  "Texas Wildfire and Emergency — Google News",
  "Texas Sports Statewide — Google News",
];
for (const source of configuredSources) {
  if (!sources.includes(source)) throw new Error(`Discovery source missing from migration: ${source}`);
}

for (const token of [
  "SEO_ARTICLE",
  "SOURCE_REPUTATION_FLOOR",
  "TEXAS_RELEVANCE_MIN",
  "Statewide public-interest topic",
  "Texas institution named",
  "Category must never be used as a political-only veto",
]) {
  if (!scorer.includes(token)) throw new Error(`Coverage scorer contract missing: ${token}`);
}

for (const token of [
  "gap_reason",
  "coverage_priority",
  "article_generation_or_publish_gap",
  "low_source_reputation",
  "routing_gate",
]) {
  if (!gaps.includes(token)) throw new Error(`Coverage-gap view contract missing: ${token}`);
}

for (const token of [
  "items_24h",
  "items_7d",
  "covered_7d",
  "coverage_rate_7d",
  "never_seen",
  "stale",
  "quiet",
  "healthy",
]) {
  if (!health.includes(token)) throw new Error(`Source-health view contract missing: ${token}`);
}

for (const token of ["databaseViewsReady", "coverageGapCount", "sourceStatusCounts", "news_coverage_gaps", "news_source_health"]) {
  if (!healthEndpoint.includes(token)) throw new Error(`Newsroom health endpoint contract missing: ${token}`);
}
for (const token of ["/admin/coverage-gaps", "/admin/source-health", "/api/public/newsroom-health", "/api/public/hooks/ingest-feeds"]) {
  if (!smoke.includes(token)) throw new Error(`Live newsroom smoke contract missing: ${token}`);
}

console.log(`Newsroom coverage contract valid: ${configuredSources.length} discovery sources, scoring, gap reporting, source health, server health, and live smoke monitoring.`);
