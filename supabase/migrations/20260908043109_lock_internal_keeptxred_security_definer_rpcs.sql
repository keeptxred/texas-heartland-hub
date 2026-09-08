-- Restore intended service-role-only access for internal KeepTXRed SECURITY DEFINER RPCs.
--
-- Supabase public-schema default function privileges explicitly grant EXECUTE to
-- anon and authenticated. Therefore REVOKE ... FROM PUBLIC alone is insufficient
-- for internal functions. Keep the internal trigger/cron/admin functions callable
-- by postgres/service_role while removing their PostgREST execution surface.

REVOKE ALL ON FUNCTION public.grant_manual_ai_rewrite_bypass(bigint) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.grant_manual_ai_rewrite_bypass(bigint) TO service_role;

REVOKE ALL ON FUNCTION public.claim_ai_rewrite_slot(text, bigint, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_ai_rewrite_slot(text, bigint, integer) TO service_role;

REVOKE ALL ON FUNCTION public.claim_automated_ai_rewrite_slot(text, bigint, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_automated_ai_rewrite_slot(text, bigint, integer) TO service_role;

REVOKE ALL ON FUNCTION public.claim_contextual_ai_rewrite_slot(text, bigint, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_contextual_ai_rewrite_slot(text, bigint, integer) TO service_role;

REVOKE ALL ON FUNCTION public.claim_manual_ai_rewrite_slot(text, bigint, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_manual_ai_rewrite_slot(text, bigint, integer) TO service_role;

REVOKE ALL ON FUNCTION public.sync_coverage_gap_alerts(integer, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_coverage_gap_alerts(integer, integer, integer) TO service_role;

REVOKE ALL ON FUNCTION public.sync_flyover_aug10_publishing_alerts() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_flyover_aug10_publishing_alerts() TO service_role;

-- Trigger-only functions do not need direct RPC execution. Trigger execution is
-- unaffected by removing anon/authenticated EXECUTE privileges.
REVOKE ALL ON FUNCTION public.clear_deleted_news_feed_article_link() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.clear_deleted_news_feed_article_link() TO service_role;

REVOKE ALL ON FUNCTION public.quarantine_cross_site_daily_article() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.quarantine_cross_site_daily_article() TO service_role;

REVOKE ALL ON FUNCTION public.queue_legislative_action_opportunity() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.queue_legislative_action_opportunity() TO service_role;

REVOKE ALL ON FUNCTION public.record_failed_ai_rewrite() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_failed_ai_rewrite() TO service_role;

REVOKE ALL ON FUNCTION public.retire_pending_ai_rewrite_claims_on_publication() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.retire_pending_ai_rewrite_claims_on_publication() TO service_role;

REVOKE ALL ON FUNCTION public.sync_bill_article_authority_relationship() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_bill_article_authority_relationship() TO service_role;

REVOKE ALL ON FUNCTION public.sync_bill_subject_authority_relationship() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_bill_subject_authority_relationship() TO service_role;

REVOKE ALL ON FUNCTION public.sync_news_feed_article_link() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sync_news_feed_article_link() TO service_role;

REVOKE ALL ON FUNCTION public.trigger_sync_flyover_aug10_publishing_alerts() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.trigger_sync_flyover_aug10_publishing_alerts() TO service_role;
