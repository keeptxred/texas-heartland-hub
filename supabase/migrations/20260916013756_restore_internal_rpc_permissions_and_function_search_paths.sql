-- Restore least-privilege execution on internal SECURITY DEFINER RPCs.
-- Several of these functions were explicitly introduced as service-role-only,
-- but later grants drifted authenticated access back onto them.

revoke all on function public.guard_ktr_facebook_article_image_readiness() from public, anon, authenticated;
grant execute on function public.guard_ktr_facebook_article_image_readiness() to service_role;

revoke all on function public.verify_repo_migrations(text[]) from public, anon, authenticated;
grant execute on function public.verify_repo_migrations(text[]) to service_role;

revoke all on function public.capture_pillar_authority_snapshot() from public, anon, authenticated;
grant execute on function public.capture_pillar_authority_snapshot() to service_role;

revoke all on function public.claim_explore_import_job() from public, anon, authenticated;
grant execute on function public.claim_explore_import_job() to service_role;

revoke all on function public.delete_email(text, bigint) from public, anon, authenticated;
grant execute on function public.delete_email(text, bigint) to service_role;

revoke all on function public.enqueue_email(text, jsonb) from public, anon, authenticated;
grant execute on function public.enqueue_email(text, jsonb) to service_role;

revoke all on function public.expire_texas_events() from public, anon, authenticated;
grant execute on function public.expire_texas_events() to service_role;

revoke all on function public.explore_merge_duplicate_candidate(uuid, uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.explore_merge_duplicate_candidate(uuid, uuid, uuid, text) to service_role;

revoke all on function public.explore_merge_entities(uuid, uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.explore_merge_entities(uuid, uuid, uuid, text) to service_role;

revoke all on function public.increment_variant_metric(text, text, text) from public, anon, authenticated;
grant execute on function public.increment_variant_metric(text, text, text) to service_role;

revoke all on function public.move_to_dlq(text, text, bigint, jsonb) from public, anon, authenticated;
grant execute on function public.move_to_dlq(text, text, bigint, jsonb) to service_role;

revoke all on function public.prune_platform_governance_events(integer) from public, anon, authenticated;
grant execute on function public.prune_platform_governance_events(integer) to service_role;

revoke all on function public.publish_texasdefined_queue_item(bigint, text, text, text, text, text, text, text, text, text[], jsonb, text[], text[]) from public, anon, authenticated;
grant execute on function public.publish_texasdefined_queue_item(bigint, text, text, text, text, text, text, text, text, text[], jsonb, text[], text[]) to service_role;

revoke all on function public.read_email_batch(text, integer, integer) from public, anon, authenticated;
grant execute on function public.read_email_batch(text, integer, integer) to service_role;

revoke all on function public.refresh_bill_committee_activity_edges(uuid) from public, anon, authenticated;
grant execute on function public.refresh_bill_committee_activity_edges(uuid) to service_role;

revoke all on function public.refresh_bill_document_latest_flags(uuid) from public, anon, authenticated;
grant execute on function public.refresh_bill_document_latest_flags(uuid) to service_role;

revoke all on function public.refresh_legislative_authority_graph() from public, anon, authenticated;
grant execute on function public.refresh_legislative_authority_graph() to service_role;

revoke all on function public.refresh_legislative_content_opportunities(integer) from public, anon, authenticated;
grant execute on function public.refresh_legislative_content_opportunities(integer) to service_role;

revoke all on function public.refresh_platform_governance_daily_summaries(integer) from public, anon, authenticated;
grant execute on function public.refresh_platform_governance_daily_summaries(integer) to service_role;

revoke all on function public.sync_historical_article_categories_from_pillars() from public, anon, authenticated;
grant execute on function public.sync_historical_article_categories_from_pillars() to service_role;

revoke all on function public.upsert_bidirectional_authority_relationship(text, text, text, text, text, integer, jsonb, boolean) from public, anon, authenticated;
grant execute on function public.upsert_bidirectional_authority_relationship(text, text, text, text, text, integer, jsonb, boolean) to service_role;

-- Pin search paths on trigger/helper functions flagged by the database linter.
alter function public.enforce_daily_article_site_boundary() set search_path = pg_catalog, public;
alter function public.legacy_article_category_for_pillar(text) set search_path = pg_catalog, public;
alter function public.normalize_sos_release_year() set search_path = pg_catalog, public;
alter function public.newsroom_set_updated_at() set search_path = pg_catalog, public;
alter function public.guard_pro_sports_duplicate_title() set search_path = pg_catalog, public;
