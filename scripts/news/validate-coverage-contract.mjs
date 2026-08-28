import fs from "node:fs";

const scorerPath = "src/lib/viral-score.ts";
const sourceMigrationPath = "supabase/migrations/20260805142000_expand_texas_news_coverage.sql";
const hyperlocalMigrationPath = "supabase/migrations/20260811043000_hyperlocal_primary_source_discovery.sql";
const telemetryMigrationPath = "supabase/migrations/20260819215000_hyperlocal_source_health_and_geography_current.sql";
const attributionMigrationPath = "supabase/migrations/20260827003000_news_source_attribution_health.sql";
const gapMigrationPath = "supabase/migrations/20260805145500_add_news_coverage_gap_view.sql";
const healthMigrationPath = "supabase/migrations/20260805153500_add_news_source_health_view.sql";
const healthEndpointPath = "src/routes/api/public/newsroom-health.ts";
const ingestPath = "src/routes/api/public/hooks/ingest-feeds.ts";
const smokePath = "scripts/news/smoke-live-newsroom.mjs";

const requiredFiles = [
  scorerPath,
  sourceMigrationPath,
  hyperlocalMigrationPath,
  telemetryMigrationPath,
  attributionMigrationPath,
  gapMigrationPath,
  healthMigrationPath,
  healthEndpointPath,
  ingestPath,
  smokePath,
];
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) throw new Error(`Missing newsroom coverage file: ${file}`);
}

const scorer = fs.readFileSync(scorerPath, "utf8");
const sources = fs.readFileSync(sourceMigrationPath, "utf8");
const hyperlocalSources = fs.readFileSync(hyperlocalMigrationPath, "utf8");
const telemetry = fs.readFileSync(telemetryMigrationPath, "utf8");
const attribution = fs.readFileSync(attributionMigrationPath, "utf8");
const gaps = fs.readFileSync(gapMigrationPath, "utf8");
const health = fs.readFileSync(healthMigrationPath, "utf8");
const healthEndpoint = fs.readFileSync(healthEndpointPath, "utf8");
const ingest = fs.readFileSync(ingestPath, "utf8");
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

const hyperlocalRequiredSources = [
  "Texas City Municipal Agendas — CivicEngage",
  "Sinton City Council Agendas — CivicEngage",
  "Orange City Council Agendas — CivicEngage",
  "Webster City Council Agendas — CivicEngage",
  "Aubrey City Council Agendas — CivicEngage",
  "Paris Texas City Notices — CivicEngage",
  "Galveston City Council Agendas — CivicEngage",
  "Texas Hyperlocal Government — Daily Discovery",
  "Texas Hyperlocal Human Interest — Daily Discovery",
  "Texas Mosquito and Local Health — Daily Discovery",
];
for (const source of hyperlocalRequiredSources) {
  if (!hyperlocalSources.includes(source)) throw new Error(`Hyperlocal source missing from migration: ${source}`);
}
for (const token of ["Primary-source", "Hyperlocal", "public-health", "human-interest"]) {
  if (!hyperlocalSources.includes(token)) throw new Error(`Hyperlocal discovery contract missing: ${token}`);
}

for (const token of [
  "SEO_ARTICLE",
  "SOURCE_REPUTATION_FLOOR",
  "TEXAS_RELEVANCE_MIN",
  "Statewide public-interest topic",
  "Texas institution named",
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

for (const token of [
  "hyperlocal_source_health",
  "texas_news_geography",
  "infer_texas_geography",
  "recommended_action",
  "deterministic_text_match",
  "unresolved",
  "security_invoker = true",
]) {
  if (!telemetry.includes(token)) throw new Error(`Hyperlocal telemetry contract missing: ${token}`);
}
if (telemetry.includes("CREATE OR REPLACE VIEW public.news_source_health")) {
  throw new Error("Hyperlocal telemetry must layer on the canonical news_source_health view, not replace it");
}
if (telemetry.includes("'Texas City','Galveston County','Gulf Coast','texas city'")) {
  throw new Error("Ambiguous generic Texas City geography match must remain disallowed");
}

for (const token of [
  "coalesce(nullif(btrim(trend_source), ''), source)",
  "attribution_source",
  "configured discovery-feed attribution",
]) {
  if (!attribution.includes(token)) throw new Error(`Source-attribution migration contract missing: ${token}`);
}
for (const token of [
  "trend_source: result.source",
  "OFFICIAL_HYPERLOCAL_SOURCE_RE",
  "trend_source backfill failed",
]) {
  if (!ingest.includes(token)) throw new Error(`Ingestion attribution contract missing: ${token}`);
}
for (const token of [
  "news_source_fetch_state",
  "fetchByName",
  "fetchByUrl",
  "classifyFetch",
  "flyover_aug10_reconciliation",
  "flyoverDispositionCounts",
]) {
  if (!healthEndpoint.includes(token)) throw new Error(`Authoritative newsroom health contract missing: ${token}`);
}

for (const token of [
  "databaseViewsReady",
  "coverageGapCount",
  "sourceStatusCounts",
  "news_coverage_gaps",
  "content_sources",
  "texas_news_feed",
  "sources",
]) {
  if (!healthEndpoint.includes(token)) throw new Error(`Newsroom health endpoint contract missing: ${token}`);
}
for (const token of ["/admin/coverage-gaps", "/api/public/newsroom-health", "/api/public/hooks/ingest-feeds"]) {
  if (!smoke.includes(token)) throw new Error(`Live newsroom smoke contract missing: ${token}`);
}

console.log(`Newsroom coverage contract valid: ${configuredSources.length} statewide discovery sources + ${hyperlocalRequiredSources.length} hyperlocal sources, configured-feed attribution, scoring, gap reporting, authoritative Flyover reconciliation, fetch-state source health, deterministic geography telemetry, server aggregation, and live smoke monitoring.`);
