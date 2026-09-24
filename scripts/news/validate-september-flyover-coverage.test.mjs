import { expect, test } from 'vitest';
import fs from 'node:fs';

const ingest = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');
const relay = fs.readFileSync('supabase/functions/ktr-rss-relay/index.ts', 'utf8');
const priority = fs.readFileSync('supabase/functions/ktr-rss-relay-priority/index.ts', 'utf8');
const scorer = fs.readFileSync('src/lib/viral-score.ts', 'utf8');

const longTailKeys = [
  'google-texas-business-longtail',
  'google-texas-campus-longtail',
  'google-texas-community-longtail',
  'google-texas-sports-longtail',
];

test('September Flyover audit gaps have durable priority discovery', () => {
  for (const key of longTailKeys) {
    expect(ingest).toContain(`feed=${key}`);
    expect(relay).toContain(`"${key}"`);
    expect(priority).toContain(`"${key}"`);
  }
  expect(ingest).toContain('items: items.slice(0, 30)');
});

test('established Texas outlets do not fall to the unclassified reputation floor', () => {
  for (const sourcePattern of [
    'kens ?5',
    'kprc(?: 2)?',
    'kvia(?: abc-?7)?',
    'texas public radio',
    'texas legislative reference library',
    'dallas news',
    'borderreport',
    'newschannel ?10',
  ]) {
    expect(scorer).toContain(sourcePattern);
  }
  expect(scorer).toContain('SOURCE_REPUTATION_FLOOR = 55');
});
