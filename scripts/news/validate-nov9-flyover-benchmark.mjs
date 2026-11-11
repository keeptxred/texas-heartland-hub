#!/usr/bin/env node
/**
 * Static regression contract for the November 9, 2026 Texas Flyover benchmark.
 * The newsletter is a gap-detection input, NEVER a rewrite/source feed.
 * Runtime SQL assertions live inside the additive migration itself.
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';

const migration = readFileSync(
  'supabase/migrations/20261109230000_route_nov9_flyover_independent_story_archetypes.sql',
  'utf8',
);
const mandatory = [
  'nov9_flyover_story_destination',
  "RETURN ARRAY['keeptxred','Politics']",
  "RETURN ARRAY['keeptxred','Texas News']",
  "RETURN ARRAY['texasdefined','Events']",
  "RETURN ARRAY['texasdefined','Explore']",
  "RETURN ARRAY['texasdefined','Sports']",
  "RETURN ARRAY['texasdefined','History']",
  'zzxy_route_nov9_flyover_story_destination',
  'new.internal_slug IS NOT NULL',
  'new.texasdefined_slug IS NOT NULL',
  "'routing_lock'",
  "f.created_at >= timestamptz '2026-11-01T00:00:00Z'",
  'f.internal_slug IS NULL',
  'f.texasdefined_slug IS NULL',
  'f.target_site IS DISTINCT FROM proposed.destination[1]',
  'f.target_section IS DISTINCT FROM proposed.destination[2]',
  'DO $assert$',
  'Hinojosa asks for pause on state park land sale to SpaceX',
  'Texas Veterans Day Parade in Arlington',
  'Canyon Ranch Austin Opens',
  'UTEP study finds mallard genetic diversity',
  'Archdiocese of San Antonio marks 100 years',
  'Texas Lutheran football honors teammates',
  'Texas Lutheran students killed',
  'National dog breed rankings',
  'Canyon Ranch faces tax subsidy investigation',
];
for (const expected of mandatory) {
  assert.ok(migration.includes(expected), `Missing Flyover protection: ${expected}`);
}
assert.doesNotMatch(migration, /UPDATE\s+public\.content_sources\s+SET\s+enabled\s*=\s*true/i,
  'Do not turn on previously blocked Google News feeds');
assert.doesNotMatch(migration, /SET\s+(?:ready_for_rewrite|classification_confidence|source_reputation_score|internal_slug|texasdefined_slug|viral_signals)\s*=/i,
  'Routing cannot elevate quality scores or publication');
assert.doesNotMatch(migration, /\bSECURITY\s+DEFINER\b/i,
  'Routing must not bypass permissions');
assert.doesNotMatch(migration, /\bINSERT\s+INTO\s+(?:public\.)?(?:daily_articles|texasdefined_articles)\b/i,
  'Route migration must not fabricate published articles');

const biomed = readFileSync('supabase/migrations/20261111173000_route_nonpolitical_texas_biomed_research.sql', 'utf8');
for (const required of [
  'nov9_flyover_story_destination',
  'Texas Biomed implements first-ever therapy development strategy',
  "RETURN ARRAY['texasdefined','Texas Life']",
  'Hinojosa asks for pause on state park land sale',
  'routing_lock',
  'internal_slug IS NULL',
  'texasdefined_slug IS NULL',
  'Government/legal negative control',
]) {
  assert.ok(biomed.includes(required), `Missing original biomedical owner guard: ${required}`);
}
assert.doesNotMatch(biomed, /SET\s+(?:ready_for_rewrite|auto_publish_eligible|classification_confidence|source_reputation_score)\s*=/i,
  'Science routing must never promote an article');
assert.doesNotMatch(biomed, /\bSECURITY\s+DEFINER\b/i, 'Do not bypass RLS');
const parade = readFileSync('supabase/migrations/20261111174500_route_veterans_parades_to_texasdefined_events.sql', 'utf8');
for (const required of [
  'Houston Veterans Day parade returns',
  'Annual Veterans Day parade returns to downtown Amarillo',
  'Honor all who served at Veterans Day parade',
  'Public-safety event negative control',
  'Biomed regression',
  'routing_lock',
  'f.internal_slug IS NULL',
  'f.texasdefined_slug IS NULL',
]) {
  assert.ok(parade.includes(required), `Missing official parade research owner guard: ${required}`);
}
assert.doesNotMatch(parade, /SET\s+(?:ready_for_rewrite|auto_publish_eligible|source_reputation_score|classification_confidence)\s*=/i,
  'Event owner-only migration cannot promote any story');
console.log('PASS: November 9 Flyover source-independent KTR/TD route contract, original editorial gates and SQL runtime assertions retained.');


const arlingtonCommunity = readFileSync('supabase/migrations/20261111203500_route_arlington_original_community_notices_to_td.sql', 'utf8');
for (const needle of [
  'route_arlington_official_lifestyle_post_guard',
  "'City of Arlington — Original News'",
  "new.link ~ '^https://www\\.arlingtontx\\.gov/News-Articles/",
  'board game earns two awards',
  'digital media friendly texas certification',
  'donate children.s coats, hats and gloves at arlington fire stations',
  'new.internal_slug IS NULL',
  'new.texasdefined_slug IS NULL',
  "new.viral_signals->>'routing_lock'",
  "new.target_site:='texasdefined'",
  "new.target_section:='Texas Life'",
  "length(coalesce(new.extracted_body,'')) < 2200",
  'new.ready_for_rewrite:=false',
  'WHERE id IN (6940681,6940682,6940683)',
  'AND internal_slug IS NULL AND texasdefined_slug IS NULL',
  "ready_for_rewrite=false",
  'Arlington original sports article route changed unexpectedly',
  'Governor-elect regulatory park-sale news route changed unexpectedly',
]) {
  assert.ok(arlingtonCommunity.includes(needle), 'Missing official Arlington first-party source/review guard: ' + needle);
}
assert.doesNotMatch(arlingtonCommunity, /\bSECURITY\s+DEFINER\b/i,
  'Official original-source review trigger may not acquire definer permissions');
assert.doesNotMatch(arlingtonCommunity, /(?:CREATE|INSERT\s+INTO)\s+(?:public\.)?(?:daily_articles|texasdefined_articles)\b/i,
  'Source routing does not create or fabricate articles');
assert.doesNotMatch(arlingtonCommunity, /(?:SET\s+enabled\s*=\s*true|Google News.*enable)/i,
  'Do not unblock Google discovery relays');
console.log('PASS: original Arlington local community source routing is TD-only, evidence-limited and publication guarded.');
