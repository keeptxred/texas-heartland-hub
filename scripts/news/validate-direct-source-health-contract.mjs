import fs from 'node:fs';

const path = 'src/routes/api/public/hooks/ingest-feeds.ts';
const text = fs.readFileSync(path, 'utf8');
for (const forbidden of ['https://texaslonghorns.com/news/','https://texastech.com/news/']) {
  if (text.includes(forbidden)) throw new Error(`Dead hard-coded athletics source still present: ${forbidden}`);
}
for (const required of ['quietSources:', 'failedSources:', 'successfulResults']) {
  if (!text.includes(required)) throw new Error(`Direct-source health contract missing: ${required}`);
}
if (!text.includes('https://12thman.com/news/')) throw new Error('Texas A&M direct source was accidentally removed');
console.log('Direct-source health contract valid: dead athletics fallbacks removed and quiet sources separated from failures.');
