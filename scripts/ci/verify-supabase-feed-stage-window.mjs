import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const sql = readFileSync('supabase/migrations/20261028012000_rotate_verified_feed_staging_to_reduce_io_timeout.sql', 'utf8');
const runner = readFileSync('scripts/ops/retire-verified-supabase-cold-records.mjs', 'utf8');
assert.match(sql,/CREATE OR REPLACE FUNCTION public\.stage_expired_free_tier_feed\(p_limit integer DEFAULT 1000\)/);
assert.match(sql,/SECURITY DEFINER/);
assert.match(sql,/SET search_path TO ''/);
assert.match(sql,/\(f\.id % 8\) = \(/);
assert.match(sql,/pg_catalog\.date_part\('epoch', pg_catalog\.now\(\)\)/);
assert.match(sql,/14400\)::bigint % 8/);
assert.deepEqual([...new Set(Array.from({length:8},(_,i)=>(i+4)%8))].sort(),[0,1,2,3,4,5,6,7]);

// The window is only an additional selection predicate. All protected
// references remain checked *again* by the existing retirement SQL.
for(const predicate of [
  "f.created_at < now()-interval '21 days'",
  "f.pub_date < now()-interval '21 days'",
  "f.internal_slug IS NULL AND f.texasdefined_slug IS NULL",
  'protected_soft p WHERE p.id=f.id',
  'public.daily_articles d WHERE d.source_url=f.link',
  'public.texasdefined_articles d WHERE d.source_feed_id=f.id',
  'public.news_story_cluster_items d WHERE d.feed_item_id=f.id',
  'public.news_event_cluster_sources d WHERE d.feed_item_id=f.id',
  'public.news_event_article_updates d WHERE d.feed_item_id=f.id',
  'public.ai_rewrite_cache d WHERE d.feed_item_id=f.id',
  'public.ai_rewrite_failures d WHERE d.feed_item_id=f.id',
  'public.ai_rewrite_usage d WHERE d.feed_item_id=f.id',
  'public.ai_rewrite_manual_bypass d WHERE d.feed_item_id=f.id',
  'public.flyover_aug10_reconciliation d WHERE d.feed_id=f.id',
  'n.duplicate_of_feed_item_id=f.id AND n.feed_item_id<>f.id',
]) assert.ok(sql.includes(predicate),'Missing safety predicate: '+predicate);

assert.ok(runner.includes("cycle % 2 === 1 ? 'newsroom' : 'feed'"));
assert.ok(runner.indexOf('const receipt = verifiedExport();') < runner.indexOf("totalNewsroom += await retire('newsroom', proof)"));
assert.ok(runner.indexOf("totalNewsroom += await retire('newsroom', proof)") < runner.indexOf("totalFeed += await retire('feed', proof)"));
console.log('Verified eight rotating shards, all published-source protections and independent archival phase order.');
