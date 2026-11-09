import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const relay = read('supabase/functions/ktr-rss-relay/index.ts');
const priority = read('supabase/functions/ktr-rss-relay-priority/index.ts');
const migration = read('supabase/migrations/20261108145500_expand_nov8_flyover_independent_discovery.sql');
const directIngest = read('src/routes/api/public/hooks/ingest-feeds.ts');
const degraded = read('supabase/migrations/20261108160000_disable_blocked_google_benchmark_feeds.sql');


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
assert.match(backfill, /UPDATE public\.texas_news_feed f/);
assert.match(backfill, /SET target_site = desired\.site/);
assert.match(backfill, /f\.target_site IS DISTINCT FROM desired\.site/);
assert.match(backfill, /f\.internal_slug IS NULL/);
assert.match(backfill, /f\.texasdefined_slug IS NULL/);
assert.match(backfill, /routing_lock/);
for (const [name, feed] of [
  ['KTRE Lufkin — Direct Local Headlines', 'official-ktre-home'],
  ['KCBD Lubbock — Direct Local Headlines', 'official-kcbd-home'],
]) {
  assert.ok(directIngest.includes(`name: "${name}"`), `Missing first-party source: ${name}`);
  assert.ok(relay.includes(`"${feed}":`), `Missing fixed Gray relay allowlist: ${feed}`);
  assert.ok(directIngest.includes(`"${feed}"`), `Missing bounded Gray fallback: ${feed}`);
}
assert.ok(directIngest.includes('mode: "html-links"'), 'Gray should use dated first-party HTML parsing');
assert.ok(directIngest.includes('ageMs > 14 * 86_400_000'), 'Gray must refuse archive as fresh');
assert.ok(directIngest.includes('articleDate.toISOString()'), 'Gray must derive date from URL, not crawl time');

const extendedDirect = read('src/lib/newsroom-local-direct-html.ts');
const starshipRouting = read('supabase/migrations/20261109164000_route_15th_starship_flight_to_texasdefined.sql');
for (const [name, key] of [
  ['KLTV Tyler — Direct Local Headlines', 'official-kltv-home'],
  ['FOX 4 Midlothian — Direct Local Headlines', 'official-fox4-midlothian'],
  ['KRGV Rio Grande Valley — Direct Local Headlines', 'official-krgv-news'],
]) {
  assert.ok(directIngest.includes('name: "' + name + '"'), 'Missing first-party source: ' + name);
  assert.ok(relay.includes('"' + key + '":'), 'Missing original publisher allowlist: ' + key);
  assert.ok(directIngest.includes('"' + key + '"'), 'Missing fixed original-host fallback: ' + key);
}
assert.ok(directIngest.includes('parseFox4DatedLocalHtml(finalResult.text, source.name)'), 'FOX 4 must parse publisher dates');
assert.ok(directIngest.includes('parseKrgvDatedLocalHtml(finalResult.text, source.name)'), 'KRGV must parse publisher dates');
assert.ok(directIngest.includes('KLTV Tyler — Direct Local Headlines"'), 'KLTV must use dated Gray original permalinks');
assert.ok(extendedDirect.includes('age > 14 * DAY_MS'), 'First-party listing parser must refuse stale archive cards');
assert.ok(extendedDirect.includes('dt.toISOString().slice(0, 10) !== ymd'), 'First-party dates must be validated');
assert.ok(extendedDirect.includes('new URL(relativePath, origin)'), 'Never treat original source URLs as proxy article URLs');
assert.ok(starshipRouting.includes('15th starship'), 'Starship headline word-order coverage missing');
assert.ok(starshipRouting.includes('routing_lock'), 'Routing must respect manually locked articles');
assert.ok(starshipRouting.includes('internal_slug IS NULL'), 'Routing must leave published articles unchanged');
assert.doesNotMatch(starshipRouting, /SET ready_for_rewrite|SET internal_slug|SET texasdefined_slug/i, 'Do not bypass editorial publication gates');

assert.ok(degraded.includes('SET enabled = false'), 'Blocked Google News feeds must be disabled');
for (const [key, name] of sources.map(([key, name]) => [key, name])) {
  assert.ok(degraded.includes(name), `Blocked Google source not disabled: ${key}`);
}
assert.ok(degraded.includes('HTTP 503'), 'Proven blocker must be documented');
assert.ok(!degraded.includes('DELETE FROM public.content_sources'), 'Preserve source catalog history');
assert.doesNotMatch(backfill, /SET title = title/i);
assert.doesNotMatch(backfill, /SET ready_for_rewrite/i);
for (const term of ['lufkin','midlothian','mckinney','buda','holly hop','kilgore','schlitterbahn','meteorite','starship','baylor']) {
  assert.ok(migration.toLowerCase().includes(term), `Missing benchmark routing case: ${term}`);
}
for (const destination of ["new.target_site := 'keeptxred';", "new.target_site := 'texasdefined';"]) {
  assert.ok(migration.includes(destination), `Missing ownership destination: ${destination}`);
}

const scoringSource = read('src/routes/api/public/hooks/score-viral.ts');
const sensitivitySource = read('src/lib/newsroom-sensitive-story-review.ts');
assert.match(scoringSource, /requiresSensitiveNewsroomReview\(\{/);
assert.match(scoringSource, /postRewriteReviewRequired =[\s\S]*sensitiveReviewRequired;/);
assert.match(scoringSource, /result\.editorialLane === "AUTO_PUBLISH" &&\s*!postRewriteReviewRequired/);
assert.match(scoringSource, /post_rewrite_review_required: postRewriteReviewRequired/);
assert.match(sensitivitySource, /fbi\|federal/);
assert.match(sensitivitySource, /fraud/);
assert.match(sensitivitySource, /lawsuits\?/);

console.log(`Nov. 8 discovery benchmark contract passed: ${sources.length} fixed feeds, strict allowlist, safe routing and quality holds.`);
