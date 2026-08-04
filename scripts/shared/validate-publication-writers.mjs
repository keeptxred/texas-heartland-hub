import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourceRoot = path.join(root, 'src');
const knownWriters = new Set([
  'src/routes/api/public/hooks/generate-news.ts',
  'src/routes/api/public/hooks/generate-evergreen.ts',
  'src/routes/api/public/hooks/ingest-feeds.ts',
  'src/routes/api/public/hooks/publishing-safety-net.ts',
  'src/lib/ingest-and-normalize.functions.ts',
]);
const deletionOnlyMaintenance = new Set([
  'src/routes/api/public/hooks/score-viral.ts',
]);
const temporarilyUngated = new Set([
  'src/routes/api/public/hooks/generate-news.ts',
  'src/routes/api/public/hooks/generate-evergreen.ts',
  'src/routes/api/public/hooks/ingest-feeds.ts',
]);
const errors = [];
const articleAccessPaths = [];

walk(sourceRoot);

for (const file of articleAccessPaths) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const hasWrite = hasDailyArticlesWrite(source);
  const hasDelete = hasDailyArticlesDelete(source);
  if (hasWrite) {
    if (!knownWriters.has(file)) errors.push(`Unregistered daily_articles writer: ${file}`);
    const guarded = source.includes('assertKeepTxRedPublication') || source.includes('guardKeepTxRedPublication');
    if (!guarded && !temporarilyUngated.has(file)) errors.push(`Publication writer is not ownership-gated: ${file}`);
  } else if (hasDelete) {
    if (!deletionOnlyMaintenance.has(file)) errors.push(`Unregistered daily_articles deletion path: ${file}`);
  }
}
for (const expected of knownWriters) {
  const source = fs.readFileSync(path.join(root, expected), 'utf8');
  if (!hasDailyArticlesWrite(source)) errors.push(`Registered publication writer was not found: ${expected}`);
}
for (const expected of deletionOnlyMaintenance) {
  const source = fs.readFileSync(path.join(root, expected), 'utf8');
  if (!hasDailyArticlesDelete(source) || hasDailyArticlesWrite(source)) {
    errors.push(`Deletion-only maintenance classification changed: ${expected}`);
  }
}

const guardPath = 'src/lib/content-publication-guard.ts';
if (!fs.existsSync(guardPath)) errors.push(`Missing publication guard: ${guardPath}`);
else {
  const guard = fs.readFileSync(guardPath, 'utf8');
  for (const symbol of ['assertKeepTxRedPublication', 'guardKeepTxRedPublication', 'inferKeepTxRedDomain', 'CONTENT_PUBLICATION_BLOCKED']) {
    if (!guard.includes(symbol)) errors.push(`Publication guard missing: ${symbol}`);
  }
}
const requiredGuardedPaths = [
  'src/routes/api/public/hooks/publishing-safety-net.ts',
  'src/lib/ingest-and-normalize.functions.ts',
];
for (const file of requiredGuardedPaths) {
  const source = fs.readFileSync(file, 'utf8');
  for (const symbol of ['assertKeepTxRedPublication', 'inferKeepTxRedDomain', 'https://keeptxred.com/news/']) {
    if (!source.includes(symbol)) errors.push(`${file} publication gate missing: ${symbol}`);
  }
}

if (errors.length) {
  console.error(`Publication writer validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
const gatedCount = knownWriters.size - temporarilyUngated.size;
console.log(`Publication writer audit passed (${knownWriters.size} writers: ${gatedCount} gated, ${temporarilyUngated.size} scheduled; ${deletionOnlyMaintenance.size} deletion-only maintenance path).`);

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (/\.(ts|tsx)$/.test(entry.name)) {
      const relative = path.relative(root, absolute).split(path.sep).join('/');
      const source = fs.readFileSync(absolute, 'utf8');
      if (source.includes('.from("daily_articles")') || source.includes(".from('daily_articles')")) articleAccessPaths.push(relative);
    }
  }
}

function dailyArticleChains(source) {
  return source.match(/\.from\(["']daily_articles["']\)[\s\S]{0,500}?\.(?:insert|upsert|update|delete)\s*\(/g) ?? [];
}
function hasDailyArticlesWrite(source) {
  return dailyArticleChains(source).some((chain) => /\.(?:insert|upsert|update)\s*\(/.test(chain));
}
function hasDailyArticlesDelete(source) {
  return dailyArticleChains(source).some((chain) => /\.delete\s*\(/.test(chain));
}
