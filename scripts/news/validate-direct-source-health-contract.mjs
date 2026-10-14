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
const lookupMatch = text.match(/const INGEST_EXISTING_LINK_LOOKUP_BATCH_SIZE = ([\d_]+);/);
const lookupSize = Number(lookupMatch?.[1]?.replaceAll('_', ''));
if (!Number.isInteger(lookupSize) || lookupSize < 50 || lookupSize > 200) {
  throw new Error('Indexed existing-link reads must use a bounded 50–200 row batch');
}
for (const marker of [
  'const remainingMs = SOURCE_FETCH_TOTAL_BUDGET_MS - (Date.now() - startedAt)',
  'Math.min(timeoutMs, remainingMs)',
  'Date.now() - startedAt + retryDelayMs >= SOURCE_FETCH_TOTAL_BUDGET_MS',
  'attempts: attemptsMade',
  'const [directResults, googleResults] = await Promise.all([',
  'mapWithConcurrency(direct, 8, fetchSource)',
  'mapWithConcurrency(google, 4, fetchSource)',
  'offset += INGEST_EXISTING_LINK_LOOKUP_BATCH_SIZE',
  'offset += INGEST_UPSERT_BATCH_SIZE',
]) {
  if (!text.includes(marker)) throw new Error('Bounded source ingestion contract missing: ' + marker);
}

console.log('Direct-source health contract valid: redundant scrapers removed and quiet sources separated from failures.');
