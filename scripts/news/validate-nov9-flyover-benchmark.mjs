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

console.log('PASS: November 9 Flyover source-independent KTR/TD route contract, original editorial gates and SQL runtime assertions retained.');
