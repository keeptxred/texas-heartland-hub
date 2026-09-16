-- Convert operational reporting views away from owner-privilege execution.
-- Admin-facing views retain signed-in access through narrowly scoped admin-only
-- SELECT policies on their otherwise server-only source tables.

-- News coverage admin view dependencies.
drop policy if exists "Admins can read news story cluster items" on public.news_story_cluster_items;
create policy "Admins can read news story cluster items"
  on public.news_story_cluster_items
  for select
  to authenticated
  using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));

drop policy if exists "Admins can read news publish candidates" on public.news_publish_candidates;
create policy "Admins can read news publish candidates"
  on public.news_publish_candidates
  for select
  to authenticated
  using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));

drop policy if exists "Admins can read news research packets" on public.news_research_packets;
create policy "Admins can read news research packets"
  on public.news_research_packets
  for select
  to authenticated
  using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));

-- Pillar authority admin view dependencies.
drop policy if exists "Admins can read article pillar assignments" on public.article_pillar_assignments;
create policy "Admins can read article pillar assignments"
  on public.article_pillar_assignments
  for select
  to authenticated
  using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));

drop policy if exists "Admins can read article search metrics" on public.article_search_metrics;
create policy "Admins can read article search metrics"
  on public.article_search_metrics
  for select
  to authenticated
  using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));

drop policy if exists "Admins can read pillar authority snapshots" on public.pillar_authority_snapshots;
create policy "Admins can read pillar authority snapshots"
  on public.pillar_authority_snapshots
  for select
  to authenticated
  using ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));

-- These source tables are read-only from the browser. Mutations remain server/service-role only.
revoke insert, update, delete, truncate, references, trigger on public.news_story_cluster_items from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.news_publish_candidates from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.news_research_packets from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.article_pillar_assignments from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.article_search_metrics from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.pillar_authority_snapshots from anon, authenticated;

grant select on public.news_story_cluster_items to authenticated, service_role;
grant select on public.news_publish_candidates to authenticated, service_role;
grant select on public.news_research_packets to authenticated, service_role;
grant select on public.article_pillar_assignments to authenticated, service_role;
grant select on public.article_search_metrics to authenticated, service_role;
grant select on public.pillar_authority_snapshots to authenticated, service_role;

-- Admin-facing views: enforce caller RLS instead of view-owner privileges.
alter view public.news_coverage_gaps set (security_invoker = true);
revoke all on public.news_coverage_gaps from public, anon;
revoke insert, update, delete, truncate, references, trigger on public.news_coverage_gaps from authenticated;
grant select on public.news_coverage_gaps to authenticated, service_role;

alter view public.pillar_authority_metrics set (security_invoker = true);
revoke all on public.pillar_authority_metrics from public, anon;
revoke insert, update, delete, truncate, references, trigger on public.pillar_authority_metrics from authenticated;
grant select on public.pillar_authority_metrics to authenticated, service_role;

alter view public.pillar_authority_trends set (security_invoker = true);
revoke all on public.pillar_authority_trends from public, anon;
revoke insert, update, delete, truncate, references, trigger on public.pillar_authority_trends from authenticated;
grant select on public.pillar_authority_trends to authenticated, service_role;

-- Internal operational views are not browser data surfaces.
alter view public.keeptxred_story_queue set (security_invoker = true);
revoke all on public.keeptxred_story_queue from public, anon, authenticated;
grant select on public.keeptxred_story_queue to service_role;

alter view public.texasdefined_story_queue set (security_invoker = true);
revoke all on public.texasdefined_story_queue from public, anon, authenticated;
grant select on public.texasdefined_story_queue to service_role;

alter view public.cross_site_publication_collisions set (security_invoker = true);
revoke all on public.cross_site_publication_collisions from public, anon, authenticated;
grant select on public.cross_site_publication_collisions to service_role;

alter view public.active_cross_site_publication_collisions set (security_invoker = true);
revoke all on public.active_cross_site_publication_collisions from public, anon, authenticated;
grant select on public.active_cross_site_publication_collisions to service_role;

alter view public.flyover_aug10_review_readiness set (security_invoker = true);
revoke all on public.flyover_aug10_review_readiness from public, anon, authenticated;
grant select on public.flyover_aug10_review_readiness to service_role;
