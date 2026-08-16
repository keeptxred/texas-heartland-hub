import fs from 'node:fs';
import path from 'node:path';

const writers = [
  'src/routes/api/public/hooks/generate-news.ts',
  'src/routes/api/public/hooks/generate-newsroom.ts',
  'src/routes/api/public/hooks/generate-evergreen.ts',
  'src/routes/api/public/hooks/generate-sports.ts',
  'src/routes/api/public/hooks/publishing-safety-net.ts',
  'src/lib/ingest-feeds-legacy.ts',
  'src/lib/ingest-and-normalize.functions.ts',
];
const maintenanceWriters = new Map([
  [
    'src/lib/multi-source-publish.ts',
    ['body_json', 'source_name'],
  ],
  [
    'src/lib/ctr-loop.functions.ts',
    ['headline_variants', 'variant_b_impressions', 'variant_b_clicks'],
  ],
  [
    'src/lib/featured-image.functions.ts',
    ['featured_image_url', 'image_generation_status'],
  ],
  [
    'src/lib/gsc.ts',
    ['gsc_impressions', 'gsc_clicks', 'gsc_last_update'],
  ],
  [
    'src/lib/chatgpt-admin.functions.ts',
    ['quality_flags', 'chatgpt-admin-ignored'],
  ],
  [
    'src/routes/api/public/hooks/repair-article-structure.ts',
    ['body_json', 'repairLegacyArticleStructure'],
  ],
  [
    'src/routes/api/public/hooks/repair-sb37-production.ts',
    ['body_json', 'featured_image_url', 'stripLowValueInternalLinks'],
  ],
  [
    'src/routes/api/public/hooks/classify-sports.ts',
    ['kind', 'category', 'discover_category', 'teams', 'keywords'],
  ],
]);
const allowedWriterSet = new Set([...writers, ...maintenanceWriters.keys()]);
const sharedWriters = new Set([
  'src/routes/api/public/hooks/generate-news.ts',
  'src/routes/api/public/hooks/generate-newsroom.ts',
  'src/routes/api/public/hooks/generate-evergreen.ts',
  'src/routes/api/public/hooks/generate-sports.ts',
  'src/routes/api/public/hooks/publishing-safety-net.ts',
  'src/lib/ingest-feeds-legacy.ts',
]);
const errors = [];

const enrichment = read('src/lib/content-quality.ts');
for (const symbol of ['assertKeepTxRedPublication', 'inferKeepTxRedDomain', 'source_url?.includes("texasdefined.com")']) {
  if (!enrichment.includes(symbol)) errors.push(`Shared enrichment gate missing: ${symbol}`);
}
for (const marker of [
  'GENERATED_NEWS_PROVENANCE_SIGNATURE',
  'GENERATED_NEWSROOM_AUTHOR',
  'row.kind === "news"',
  'bodyText.includes(GENERATED_NEWS_PROVENANCE_SIGNATURE)',
  'row.author = GENERATED_NEWSROOM_AUTHOR',
]) {
  if (!enrichment.includes(marker)) {
    errors.push(`Shared enrichment missing automated newsroom author marker: ${marker}`);
  }
}

const generatedNewsSignature = 'Keep TX Red rewrote the coverage independently and links to the original for verification.';
const generatedNewsWriter = read('src/routes/api/public/hooks/generate-news.ts');
const generatedNewsroomWriter = read('src/routes/api/public/hooks/generate-newsroom.ts');
const generatedNewsTrigger = read('supabase/migrations/20260813014000_stamp_generated_newsroom_author.sql');
const generatedNewsAdmin = read('src/components/admin/ChatGptAutoArticlesPanel.tsx');

if (!generatedNewsWriter.includes(generatedNewsSignature)) {
  errors.push('Daily Texas News writer provenance signature changed without updating the newsroom author contract.');
}
if (!generatedNewsroomWriter.includes(generatedNewsSignature)) {
  errors.push('Cluster newsroom writer provenance signature does not match the newsroom author contract.');
}
if (!enrichment.includes(generatedNewsSignature)) {
  errors.push('Shared enrichment newsroom provenance signature no longer matches the Daily Texas News writer.');
}
for (const marker of [
  'stamp_generated_newsroom_author',
  "NEW.author := 'Keep TX Red Newsroom'",
  generatedNewsSignature,
  "NEW.kind = 'news'",
  'NEW.is_ingested IS FALSE',
  "= 'Source attribution'",
]) {
  if (!generatedNewsTrigger.includes(marker)) {
    errors.push(`Daily Texas News newsroom-author trigger missing contract marker: ${marker}`);
  }
}
for (const marker of [
  '.or("author.eq.Keep TX Red Newsroom,author.is.null")',
  '.eq("is_ingested", false)',
]) {
  if (!generatedNewsAdmin.includes(marker)) {
    errors.push(`ChatGPT Auto Articles admin feed missing provenance compatibility marker: ${marker}`);
  }
}

for (const file of discoverArticleWriters('src')) {
  if (!allowedWriterSet.has(file)) errors.push(`Unregistered daily_articles writer: ${file}`);
}

for (const file of writers) {
  const source = read(file);
  if (!hasArticleWrite(source)) errors.push(`Registered article writer changed: ${file}`);
  const direct = source.includes('assertKeepTxRedPublication') || source.includes('guardKeepTxRedPublication');
  const shared = sharedWriters.has(file) && source.includes('enrichArticleRow');
  if (!direct && !shared) errors.push(`Article writer is not ownership-gated: ${file}`);
}

for (const [file, markers] of maintenanceWriters) {
  const source = read(file);
  if (!hasArticleWrite(source)) errors.push(`Registered article maintenance writer changed: ${file}`);
  for (const marker of markers) {
    if (!source.includes(marker)) errors.push(`Article maintenance writer missing ${marker}: ${file}`);
  }
}

const maintenance = read('src/routes/api/public/hooks/score-viral.ts');
if (!maintenance.includes('.from("daily_articles")') || !maintenance.includes('.delete()')) {
  errors.push('Viral scoring no longer contains its registered deletion-only maintenance path.');
}
if (hasArticleWrite(maintenance)) errors.push('Viral scoring must not publish or update articles.');

const guard = read('src/lib/content-publication-guard.ts');
for (const symbol of [
  'CONTENT_PUBLICATION_BLOCKED',
  'classifyStoryOwnership',
  'fallbackDomain: resolveKeepTxRedPublicationDomain',
  "return domain === 'politics' ? inferKeepTxRedDomain(domain, context) : domain;",
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
console.log(`Publication writer audit passed (${writers.length} ownership-gated writers, ${maintenanceWriters.size} metadata-only writers, app-side newsroom author stamping locked, database fallback contract locked, no temporary exceptions or unregistered paths).`);

function read(file) {
  if (!fs.existsSync(file)) {
    errors.push(`Missing required file: ${file}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function hasArticleWrite(source) {
  const tablePattern = /\.from\(["']daily_articles["']\)/g;
  for (const match of source.matchAll(tablePattern)) {
    const start = (match.index ?? 0) + match[0].length;
    const remainder = source.slice(start);
    const nextTable = remainder.search(/\.from\(/);
    const statementEnd = remainder.indexOf(';');
    const boundaries = [nextTable, statementEnd].filter((value) => value >= 0);
    const end = boundaries.length ? Math.min(...boundaries) : remainder.length;
    const chain = remainder.slice(0, end);
    if (/\.(insert|upsert|update)\s*\(/.test(chain)) return true;
  }
  return false;
}

function discoverArticleWriters(directory) {
  const found = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) found.push(...discoverArticleWriters(absolute));
    else if (/\.(ts|tsx)$/.test(entry.name)) {
      const source = fs.readFileSync(absolute, 'utf8');
      if (hasArticleWrite(source)) found.push(absolute.split(path.sep).join('/'));
    }
  }
  return found;
}
