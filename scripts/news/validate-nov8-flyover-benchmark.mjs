import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const relay = read('supabase/functions/ktr-rss-relay/index.ts');
const priority = read('supabase/functions/ktr-rss-relay-priority/index.ts');
const migration = read('supabase/migrations/20261108145500_expand_nov8_flyover_independent_discovery.sql');

const sources = [
  ['google-local-giving', 'Texas Community Giving and Food Drives — Google News', 'turkey drive'],
  ['google-local-utility', 'Texas Local Utility Disruptions — Google News', 'water main break'],
  ['google-local-business-change', 'Texas Local Business Openings Closings — Google News', 'closing after'],
  ['google-local-investigations', 'Texas Local Federal Investigations — Google News', 'FBI search'],
  ['google-space-launches', 'Texas Space and Starbase Launches — Google News', 'Starship flight'],
  ['google-attraction-changes', 'Texas Attractions and Brand Changes — Google News', 'museum exhibit'],
  ['google-community-art', 'Texas Community Art and Naming — Google News', 'sculpture naming'],
];

for (const [key, name, term] of sources) {
  const line = relay.split(/\r?\n/).find((row) => row.trim().startsWith(`"${key}": `));
  assert.ok(line, `Relay feed ${key} is missing`);
  const encoded = line.split(': ').slice(1).join(': ').replace(/,\s*$/, '');
  const url = new URL(JSON.parse(encoded));
  assert.equal(url.hostname, 'news.google.com', `Unexpected upstream for ${key}`);
  assert.equal(url.pathname, '/rss/search', `Unexpected endpoint for ${key}`);
  assert.match(url.searchParams.get('q') ?? '', /when:\d+d/, `No date bound for ${key}`);
  assert.ok((url.searchParams.get('q') ?? '').toLowerCase().includes(term.toLowerCase()), `Missing query focus: ${term}`);
  assert.ok(priority.includes(`"${key}",`), `Priority relay does not allow ${key}`);
  assert.ok(migration.includes(name), `Database source catalog missing ${name}`);
}
assert.match(migration, /INSERT INTO public\.content_sources/i);
assert.match(migration, /NOT EXISTS\s*\(/i);
assert.match(migration, /new\.internal_slug IS NOT NULL OR new\.texasdefined_slug IS NOT NULL OR locked/i);
assert.doesNotMatch(migration, /new\.(ready_for_rewrite|internal_slug|texasdefined_slug|source_reputation_score|texas_relevance_score)\s*:=/i);
assert.match(migration, /zzx_route_nov8_texas_story_archetypes/);
const backfill = read('supabase/migrations/20261108152500_materialize_nov8_story_ownership_backfill.sql');
assert.match(backfill, /UPDATE public\\.texas_news_feed f/);
assert.match(backfill, /SET target_site = desired\\.site/);
assert.match(backfill, /f\\.target_site IS DISTINCT FROM desired\\.site/);
assert.match(backfill, /f\\.internal_slug IS NULL/);
assert.match(backfill, /f\\.texasdefined_slug IS NULL/);
assert.match(backfill, /routing_lock/);
assert.doesNotMatch(backfill, /SET title = title/i);
assert.doesNotMatch(backfill, /SET ready_for_rewrite/i);
for (const term of ['lufkin','midlothian','mckinney','buda','holly hop','kilgore','schlitterbahn','meteorite','starship','baylor']) {
  assert.ok(migration.toLowerCase().includes(term), `Missing benchmark routing case: ${term}`);
}
for (const destination of ["new.target_site := 'keeptxred';", "new.target_site := 'texasdefined';"]) {
  assert.ok(migration.includes(destination), `Missing ownership destination: ${destination}`);
}
console.log(`Nov. 8 discovery benchmark contract passed: ${sources.length} fixed feeds, strict allowlist, safe routing and quality holds.`);
