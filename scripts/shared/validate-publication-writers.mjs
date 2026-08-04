import fs from 'node:fs';

const writers = [
  'src/routes/api/public/hooks/generate-news.ts',
  'src/routes/api/public/hooks/generate-evergreen.ts',
  'src/routes/api/public/hooks/ingest-feeds.ts',
  'src/routes/api/public/hooks/generate-sports.ts',
  'src/routes/api/public/hooks/publishing-safety-net.ts',
  'src/lib/ingest-and-normalize.functions.ts',
];
const sharedWriters = new Set(writers.slice(0, 4));
const errors = [];

const enrichment = read('src/lib/content-quality.ts');
for (const symbol of ['assertKeepTxRedPublication', 'inferKeepTxRedDomain', 'source_url?.includes("texasdefined.com")']) {
  if (!enrichment.includes(symbol)) errors.push(`Shared enrichment gate missing: ${symbol}`);
}

for (const file of writers) {
  const source = read(file);
  const hasArticleTable = source.includes('.from("daily_articles")') || source.includes(".from('daily_articles')");
  const hasWrite = source.includes('.insert(') || source.includes('.upsert(') || source.includes('.update(');
  if (!hasArticleTable || !hasWrite) errors.push(`Registered article writer changed: ${file}`);
  const direct = source.includes('assertKeepTxRedPublication') || source.includes('guardKeepTxRedPublication');
  const shared = sharedWriters.has(file) && source.includes('enrichArticleRow');
  if (!direct && !shared) errors.push(`Article writer is not ownership-gated: ${file}`);
}

const maintenance = read('src/routes/api/public/hooks/score-viral.ts');
if (!maintenance.includes('.from("daily_articles")') || !maintenance.includes('.delete()')) {
  errors.push('Viral scoring no longer contains its registered deletion-only maintenance path.');
}
if (/\.from\("daily_articles"\)[\s\S]{0,400}\.(insert|upsert|update)\(/.test(maintenance)) {
  errors.push('Viral scoring must not publish or update articles.');
}

const guard = read('src/lib/content-publication-guard.ts');
for (const symbol of [
  'CONTENT_PUBLICATION_BLOCKED',
  "resolvedDomain = input.domain === 'politics'",
  "return 'property-tax'",
  "return 'moving'",
  "return 'real-estate'",
  "return 'texas-culture'",
]) {
  if (!guard.includes(symbol)) errors.push(`Publication guard missing: ${symbol}`);
}

if (errors.length) {
  console.error(`Publication writer validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Publication writer audit passed (${writers.length} ownership-gated writers, no temporary exceptions).`);

function read(file) {
  if (!fs.existsSync(file)) {
    errors.push(`Missing required file: ${file}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}
