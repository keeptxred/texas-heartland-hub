import fs from 'node:fs';
import path from 'node:path';

const writers = [
  'src/routes/api/public/hooks/generate-news.ts',
  'src/routes/api/public/hooks/generate-evergreen.ts',
  'src/routes/api/public/hooks/ingest-feeds.ts',
  'src/routes/api/public/hooks/generate-sports.ts',
  'src/routes/api/public/hooks/publishing-safety-net.ts',
  'src/lib/ingest-and-normalize.functions.ts',
];
const writerSet = new Set(writers);
const sharedWriters = new Set(writers.slice(0, 4));
const errors = [];

const enrichment = read('src/lib/content-quality.ts');
for (const symbol of ['assertKeepTxRedPublication', 'inferKeepTxRedDomain', 'source_url?.includes("texasdefined.com")']) {
  if (!enrichment.includes(symbol)) errors.push(`Shared enrichment gate missing: ${symbol}`);
}

for (const file of discoverArticleWriters('src')) {
  if (!writerSet.has(file)) errors.push(`Unregistered daily_articles writer: ${file}`);
}

for (const file of writers) {
  const source = read(file);
  if (!hasArticleWrite(source)) errors.push(`Registered article writer changed: ${file}`);
  const direct = source.includes('assertKeepTxRedPublication') || source.includes('guardKeepTxRedPublication');
  const shared = sharedWriters.has(file) && source.includes('enrichArticleRow');
  if (!direct && !shared) errors.push(`Article writer is not ownership-gated: ${file}`);
}

const maintenance = read('src/routes/api/public/hooks/score-viral.ts');
if (!maintenance.includes('.from("daily_articles")') || !maintenance.includes('.delete()')) {
  errors.push('Viral scoring no longer contains its registered deletion-only maintenance path.');
}
if (hasArticleWrite(maintenance)) errors.push('Viral scoring must not publish or update articles.');

const guard = read('src/lib/content-publication-guard.ts');
for (const symbol of [
  'CONTENT_PUBLICATION_BLOCKED',
  'resolveKeepTxRedPublicationDomain(input.domain, input.title)',
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
console.log(`Publication writer audit passed (${writers.length} ownership-gated writers, no temporary exceptions or unregistered paths).`);

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
