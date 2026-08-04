import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceRoot = path.join(root, 'src');
const knownWriters = new Set([
  'src/routes/api/public/hooks/generate-news.ts',
  'src/routes/api/public/hooks/generate-evergreen.ts',
  'src/routes/api/public/hooks/ingest-feeds.ts',
  'src/routes/api/public/hooks/publishing-safety-net.ts',
  'src/routes/api/public/hooks/score-viral.ts',
  'src/lib/ingest-and-normalize.functions.ts',
]);
const temporarilyUngated = new Set([
  'src/routes/api/public/hooks/generate-news.ts',
  'src/routes/api/public/hooks/generate-evergreen.ts',
  'src/routes/api/public/hooks/ingest-feeds.ts',
  'src/routes/api/public/hooks/score-viral.ts',
  'src/lib/ingest-and-normalize.functions.ts',
]);
const errors = [];
const writers = [];

walk(sourceRoot);

for (const writer of writers) {
  if (!knownWriters.has(writer)) errors.push(`Unregistered daily_articles writer: ${writer}`);
  const source = fs.readFileSync(path.join(root, writer), 'utf8');
  const guarded = source.includes('assertKeepTxRedPublication') || source.includes('guardKeepTxRedPublication');
  if (!guarded && !temporarilyUngated.has(writer)) errors.push(`Publication writer is not ownership-gated: ${writer}`);
}
for (const expected of knownWriters) {
  if (!writers.includes(expected)) errors.push(`Registered publication writer was not found: ${expected}`);
}

const guardPath = 'src/lib/content-publication-guard.ts';
if (!fs.existsSync(guardPath)) errors.push(`Missing publication guard: ${guardPath}`);
else {
  const guard = fs.readFileSync(guardPath, 'utf8');
  for (const symbol of ['assertKeepTxRedPublication', 'guardKeepTxRedPublication', 'inferKeepTxRedDomain', 'CONTENT_PUBLICATION_BLOCKED']) {
    if (!guard.includes(symbol)) errors.push(`Publication guard missing: ${symbol}`);
  }
}
const safetyNet = fs.readFileSync('src/routes/api/public/hooks/publishing-safety-net.ts', 'utf8');
for (const symbol of ['assertKeepTxRedPublication', 'inferKeepTxRedDomain', 'https://keeptxred.com/news/${slug}']) {
  if (!safetyNet.includes(symbol)) errors.push(`Publishing safety net gate missing: ${symbol}`);
}

if (errors.length) {
  console.error(`Publication writer validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Publication writer audit passed (${writers.length} registered writers; ${writers.length - temporarilyUngated.size} gated; ${temporarilyUngated.size} scheduled for migration).`);

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (/\.(ts|tsx)$/.test(entry.name)) {
      const relative = path.relative(root, absolute).split(path.sep).join('/');
      const source = fs.readFileSync(absolute, 'utf8');
      if (source.includes('.from("daily_articles")') || source.includes(".from('daily_articles')")) {
        if (/\.(insert|upsert|update)\s*\(/.test(source)) writers.push(relative);
      }
    }
  }
}
