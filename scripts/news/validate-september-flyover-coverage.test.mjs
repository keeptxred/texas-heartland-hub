import { expect, test } from 'vitest';
import fs from 'node:fs';

const ingest = fs.readFileSync('src/routes/api/public/hooks/ingest-feeds.ts', 'utf8');
const relay = fs.readFileSync('supabase/functions/ktr-rss-relay/index.ts', 'utf8');
const priority = fs.readFileSync('supabase/functions/ktr-rss-relay-priority/index.ts', 'utf8');
const scorer = fs.readFileSync('src/lib/viral-score.ts', 'utf8');
const longTailRouting = fs.readFileSync('supabase/migrations/20260924151000_route_flyover_longtail_followup.sql', 'utf8');

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
    'texas parks (?:&|and) wildlife',
    'kwtx',
    'kvue',
    'kcen(?: 6)?',
    'kbtx(?: news 3)?',
    'san angelo live',
  ]) {
    expect(scorer).toContain(sourcePattern);
  }
  expect(scorer).toContain('SOURCE_REPUTATION_FLOOR = 55');
});


test('September Flyover business query covers the observed missed business beats', () => {
  for (const term of [
    'Texas+Trucking+Association',
    'diesel+prices',
    'Santa+Teresa',
    'Texas+wine+grape',
    'tourism+impact',
    'Goodfellow+Air+Force+Base',
    'Christoval+Road',
    'Project+Crystal+Sun',
  ]) {
    expect(relay).toContain(term);
  }
  expect(relay).toContain('when%3A7d');
  for (const term of ['nuclear+fuel+salt', 'National+Math+Stars', 'Jordan+Shipley']) {
    expect(relay).toContain(term);
  }
});

test('September Flyover recurring community and campus stories escape generic review safely', () => {
  for (const term of [
    'see you at the pole',
    'community tradition',
    'student recognition',
    'homecoming mum',
    'university ranking',
    'nuclear reactor',
  ]) {
    expect(longTailRouting).toContain(term);
  }
  expect(longTailRouting).toContain('zz_route_flyover_longtail_followup');
  expect(longTailRouting).toContain('before final newsroom quality guards run');
});
