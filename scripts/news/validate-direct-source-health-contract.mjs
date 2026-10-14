import fs from 'node:fs';

const path = 'src/routes/api/public/hooks/ingest-feeds.ts';
const text = fs.readFileSync(path, 'utf8');
for (const forbidden of [
  'https://texaslonghorns.com/news/',
  'https://texastech.com/news/',
  'https://www.wfaa.com/',
  'https://www.mlb.com/rangers/news',
]) {
  if (text.includes(forbidden)) throw new Error(`Retired redundant source still present: ${forbidden}`);
}
for (const required of ['quietSources:', 'failedSources:', 'successfulResults']) {
  if (!text.includes(required)) throw new Error(`Direct-source health contract missing: ${required}`);
}
if (!text.includes('https://12thman.com/news/')) throw new Error('Texas A&M direct source was accidentally removed');
const sourceBudgetMatch = text.match(/const SOURCE_FETCH_TOTAL_BUDGET_MS = ([\d_]+);/);
const sourceBudgetMs = Number(sourceBudgetMatch?.[1]?.replaceAll('_', ''));
if (!Number.isFinite(sourceBudgetMs) || sourceBudgetMs < 15_000 || sourceBudgetMs > 45_000) {
  throw new Error('Every feed needs a bounded, retry-inclusive 15–45s source deadline');
}
const partition = fs.readFileSync('src/lib/ingest-link-lookup.ts', 'utf8');
const lookupMatch = partition.match(/export const INGEST_EXISTING_LINK_LOOKUP_BATCH_SIZE = (\\d+);/);
const lookupSize = Number(lookupMatch?.[1]);
if (!Number.isInteger(lookupSize) || lookupSize < 1 || lookupSize > 25) {
  throw new Error('PostgREST link query must use no more than 25 source URLs');
}
if (!partition.includes('INGEST_EXISTING_LINK_QUERY_CHAR_BUDGET') ||
    !text.includes('partitionFeedLinkLookups(rows.map(row => row.link))') ||
    !text.includes('readExistingLinkBatchAdaptive')) {
  throw new Error('PostgREST link lookup needs an encoded GET size budget and 400 fallback');
}
for (const marker of [
  'const remainingMs = SOURCE_FETCH_TOTAL_BUDGET_MS - (Date.now() - startedAt)',
  'Math.min(timeoutMs, remainingMs)',
  'Date.now() - startedAt + retryDelayMs >= SOURCE_FETCH_TOTAL_BUDGET_MS',
  'attempts: attemptsMade',
  'const [directResults, googleResults] = await Promise.all([',
  'mapWithConcurrency(direct, 8, fetchSource)',
  'mapWithConcurrency(google, 4, fetchSource)',
  'partitionFeedLinkLookups(rows.map(row => row.link))',
  'offset += INGEST_UPSERT_BATCH_SIZE',
]) {
  if (!text.includes(marker)) throw new Error('Bounded source ingestion contract missing: ' + marker);
}

console.log('Direct-source health contract valid: redundant scrapers removed and quiet sources separated from failures.');
