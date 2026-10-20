-- October 30, 2026 Data API default-grant readiness for the shared database.
-- Application privileges captured from production on 2026-10-20; RLS policies
-- remain the row-authorization boundary. No automatic default grants are added.
-- Identical in both repositories; apply once to the shared project.
-- A repository may recreate only its own subset of the shared schema. Explicit
-- existence checks skip objects absent from that subset, without creating them.
DO $readiness$
BEGIN
  IF to_regclass('public.ai_rewrite_failures_id_seq') IS NOT NULL THEN
    GRANT SELECT, USAGE ON SEQUENCE public.ai_rewrite_failures_id_seq TO service_role;
  END IF;
  IF to_regclass('public.ai_rewrite_usage_id_seq') IS NOT NULL THEN
    GRANT SELECT, USAGE ON SEQUENCE public.ai_rewrite_usage_id_seq TO service_role;
  END IF;
  IF to_regclass('public.flyover_email_execution_ledger_id_seq') IS NOT NULL THEN
    GRANT SELECT, USAGE ON SEQUENCE public.flyover_email_execution_ledger_id_seq TO service_role;
  END IF;
  IF to_regclass('public.ktr_evergreen_verification_events_id_seq') IS NOT NULL THEN
    GRANT SELECT, USAGE ON SEQUENCE public.ktr_evergreen_verification_events_id_seq TO service_role;
  END IF;
  IF to_regclass('public.td_ai_question_signals_id_seq') IS NOT NULL THEN
    GRANT SELECT, USAGE ON SEQUENCE public.td_ai_question_signals_id_seq TO service_role;
  END IF;
  IF to_regclass('public.td_authority_sitemap_requests_id_seq') IS NOT NULL THEN
    GRANT SELECT, USAGE ON SEQUENCE public.td_authority_sitemap_requests_id_seq TO service_role;
  END IF;
  IF to_regclass('public.td_authority_verification_checks_id_seq') IS NOT NULL THEN
    GRANT SELECT, USAGE ON SEQUENCE public.td_authority_verification_checks_id_seq TO service_role;
  END IF;
  IF to_regclass('public.texas_news_feed_id_seq') IS NOT NULL THEN
    GRANT SELECT, USAGE ON SEQUENCE public.texas_news_feed_id_seq TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_articles_id_seq') IS NOT NULL THEN
    GRANT SELECT, USAGE ON SEQUENCE public.texasdefined_articles_id_seq TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_bing_webmaster_snapshots_id_seq') IS NOT NULL THEN
    GRANT SELECT, USAGE ON SEQUENCE public.texasdefined_bing_webmaster_snapshots_id_seq TO service_role;
  END IF;
  IF to_regclass('public.ai_generation_budget') IS NOT NULL THEN
    ALTER TABLE public.ai_generation_budget ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.ai_generation_budget TO service_role;
  END IF;
  IF to_regclass('public.ai_rewrite_cache') IS NOT NULL THEN
    ALTER TABLE public.ai_rewrite_cache ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.ai_rewrite_cache TO service_role;
  END IF;
  IF to_regclass('public.ai_rewrite_failures') IS NOT NULL THEN
    ALTER TABLE public.ai_rewrite_failures ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.ai_rewrite_failures TO service_role;
  END IF;
  IF to_regclass('public.ai_rewrite_manual_bypass') IS NOT NULL THEN
    ALTER TABLE public.ai_rewrite_manual_bypass ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.ai_rewrite_manual_bypass TO service_role;
  END IF;
  IF to_regclass('public.ai_rewrite_usage') IS NOT NULL THEN
    ALTER TABLE public.ai_rewrite_usage ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.ai_rewrite_usage TO service_role;
  END IF;
  IF to_regclass('public.article_category_reclassification_log') IS NOT NULL THEN
    ALTER TABLE public.article_category_reclassification_log ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.article_category_reclassification_log TO service_role;
  END IF;
  IF to_regclass('public.article_pillar_assignments') IS NOT NULL THEN
    ALTER TABLE public.article_pillar_assignments ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON TABLE public.article_pillar_assignments TO anon;
    GRANT SELECT ON TABLE public.article_pillar_assignments TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.article_pillar_assignments TO service_role;
  END IF;
  IF to_regclass('public.article_search_metrics') IS NOT NULL THEN
    ALTER TABLE public.article_search_metrics ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON TABLE public.article_search_metrics TO anon;
    GRANT SELECT ON TABLE public.article_search_metrics TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.article_search_metrics TO service_role;
  END IF;
  IF to_regclass('public.article_slug_redirects') IS NOT NULL THEN
    ALTER TABLE public.article_slug_redirects ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON TABLE public.article_slug_redirects TO anon;
    GRANT SELECT ON TABLE public.article_slug_redirects TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.article_slug_redirects TO service_role;
  END IF;
  IF to_regclass('public.article_url_registry') IS NOT NULL THEN
    ALTER TABLE public.article_url_registry ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.article_url_registry TO service_role;
  END IF;
  IF to_regclass('public.authority_relationships') IS NOT NULL THEN
    ALTER TABLE public.authority_relationships ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.authority_relationships TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.authority_relationships TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.authority_relationships TO service_role;
  END IF;
  IF to_regclass('public.bill_actions') IS NOT NULL THEN
    ALTER TABLE public.bill_actions ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_actions TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_actions TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_actions TO service_role;
  END IF;
  IF to_regclass('public.bill_article_relationships') IS NOT NULL THEN
    ALTER TABLE public.bill_article_relationships ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_article_relationships TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_article_relationships TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_article_relationships TO service_role;
  END IF;
  IF to_regclass('public.bill_committee_history') IS NOT NULL THEN
    ALTER TABLE public.bill_committee_history ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_committee_history TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_committee_history TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_committee_history TO service_role;
  END IF;
  IF to_regclass('public.bill_documents') IS NOT NULL THEN
    ALTER TABLE public.bill_documents ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_documents TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_documents TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_documents TO service_role;
  END IF;
  IF to_regclass('public.bill_editorial_enrichments') IS NOT NULL THEN
    ALTER TABLE public.bill_editorial_enrichments ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_editorial_enrichments TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_editorial_enrichments TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_editorial_enrichments TO service_role;
  END IF;
  IF to_regclass('public.bill_effective_date_provisions') IS NOT NULL THEN
    ALTER TABLE public.bill_effective_date_provisions ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON TABLE public.bill_effective_date_provisions TO anon;
    GRANT SELECT ON TABLE public.bill_effective_date_provisions TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_effective_date_provisions TO service_role;
  END IF;
  IF to_regclass('public.bill_schedule_events') IS NOT NULL THEN
    ALTER TABLE public.bill_schedule_events ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON TABLE public.bill_schedule_events TO anon;
    GRANT SELECT ON TABLE public.bill_schedule_events TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_schedule_events TO service_role;
  END IF;
  IF to_regclass('public.bill_sponsors') IS NOT NULL THEN
    ALTER TABLE public.bill_sponsors ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_sponsors TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_sponsors TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_sponsors TO service_role;
  END IF;
  IF to_regclass('public.bill_subject_relationships') IS NOT NULL THEN
    ALTER TABLE public.bill_subject_relationships ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_subject_relationships TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_subject_relationships TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_subject_relationships TO service_role;
  END IF;
  IF to_regclass('public.bill_subjects') IS NOT NULL THEN
    ALTER TABLE public.bill_subjects ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_subjects TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_subjects TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bill_subjects TO service_role;
  END IF;
  IF to_regclass('public.bills') IS NOT NULL THEN
    ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bills TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bills TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.bills TO service_role;
  END IF;
  IF to_regclass('public.content_packages') IS NOT NULL THEN
    ALTER TABLE public.content_packages ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.content_packages TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.content_packages TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.content_packages TO service_role;
  END IF;
  IF to_regclass('public.content_sources') IS NOT NULL THEN
    ALTER TABLE public.content_sources ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.content_sources TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.content_sources TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.content_sources TO service_role;
  END IF;
  IF to_regclass('public.daily_article_archive') IS NOT NULL THEN
    ALTER TABLE public.daily_article_archive ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.daily_article_archive TO service_role;
  END IF;
  IF to_regclass('public.daily_articles') IS NOT NULL THEN
    ALTER TABLE public.daily_articles ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.daily_articles TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.daily_articles TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.daily_articles TO service_role;
  END IF;
  IF to_regclass('public.election_poll_questions') IS NOT NULL THEN
    ALTER TABLE public.election_poll_questions ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.election_poll_questions TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.election_poll_questions TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.election_poll_questions TO service_role;
  END IF;
  IF to_regclass('public.election_poll_responses') IS NOT NULL THEN
    ALTER TABLE public.election_poll_responses ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.election_poll_responses TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.election_poll_responses TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.election_poll_responses TO service_role;
  END IF;
  IF to_regclass('public.election_polls') IS NOT NULL THEN
    ALTER TABLE public.election_polls ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.election_polls TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.election_polls TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.election_polls TO service_role;
  END IF;
  IF to_regclass('public.email_send_log') IS NOT NULL THEN
    ALTER TABLE public.email_send_log ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.email_send_log TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.email_send_log TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.email_send_log TO service_role;
  END IF;
  IF to_regclass('public.email_send_state') IS NOT NULL THEN
    ALTER TABLE public.email_send_state ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.email_send_state TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.email_send_state TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.email_send_state TO service_role;
  END IF;
  IF to_regclass('public.email_unsubscribe_tokens') IS NOT NULL THEN
    ALTER TABLE public.email_unsubscribe_tokens ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.email_unsubscribe_tokens TO service_role;
  END IF;
  IF to_regclass('public.explore_activities') IS NOT NULL THEN
    ALTER TABLE public.explore_activities ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_activities TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_activities TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_activities TO service_role;
  END IF;
  IF to_regclass('public.explore_amenities') IS NOT NULL THEN
    ALTER TABLE public.explore_amenities ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_amenities TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_amenities TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_amenities TO service_role;
  END IF;
  IF to_regclass('public.explore_business_profiles') IS NOT NULL THEN
    ALTER TABLE public.explore_business_profiles ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_business_profiles TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_business_profiles TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_business_profiles TO service_role;
  END IF;
  IF to_regclass('public.explore_campground_profiles') IS NOT NULL THEN
    ALTER TABLE public.explore_campground_profiles ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_campground_profiles TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_campground_profiles TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_campground_profiles TO service_role;
  END IF;
  IF to_regclass('public.explore_categories') IS NOT NULL THEN
    ALTER TABLE public.explore_categories ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_categories TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_categories TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_categories TO service_role;
  END IF;
  IF to_regclass('public.explore_duplicate_candidates') IS NOT NULL THEN
    ALTER TABLE public.explore_duplicate_candidates ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_duplicate_candidates TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_duplicate_candidates TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_duplicate_candidates TO service_role;
  END IF;
  IF to_regclass('public.explore_entities') IS NOT NULL THEN
    ALTER TABLE public.explore_entities ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entities TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entities TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entities TO service_role;
  END IF;
  IF to_regclass('public.explore_entity_activities') IS NOT NULL THEN
    ALTER TABLE public.explore_entity_activities ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_activities TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_activities TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_activities TO service_role;
  END IF;
  IF to_regclass('public.explore_entity_amenities') IS NOT NULL THEN
    ALTER TABLE public.explore_entity_amenities ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_amenities TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_amenities TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_amenities TO service_role;
  END IF;
  IF to_regclass('public.explore_entity_categories') IS NOT NULL THEN
    ALTER TABLE public.explore_entity_categories ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_categories TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_categories TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_categories TO service_role;
  END IF;
  IF to_regclass('public.explore_entity_media') IS NOT NULL THEN
    ALTER TABLE public.explore_entity_media ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_media TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_media TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_media TO service_role;
  END IF;
  IF to_regclass('public.explore_entity_relationships') IS NOT NULL THEN
    ALTER TABLE public.explore_entity_relationships ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_relationships TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_relationships TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_relationships TO service_role;
  END IF;
  IF to_regclass('public.explore_entity_reviews') IS NOT NULL THEN
    ALTER TABLE public.explore_entity_reviews ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_reviews TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_reviews TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_reviews TO service_role;
  END IF;
  IF to_regclass('public.explore_entity_slug_history') IS NOT NULL THEN
    ALTER TABLE public.explore_entity_slug_history ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_slug_history TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_slug_history TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_slug_history TO service_role;
  END IF;
  IF to_regclass('public.explore_entity_sources') IS NOT NULL THEN
    ALTER TABLE public.explore_entity_sources ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_sources TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_sources TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_sources TO service_role;
  END IF;
  IF to_regclass('public.explore_entity_tags') IS NOT NULL THEN
    ALTER TABLE public.explore_entity_tags ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_tags TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_tags TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_tags TO service_role;
  END IF;
  IF to_regclass('public.explore_entity_types') IS NOT NULL THEN
    ALTER TABLE public.explore_entity_types ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_types TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_types TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_types TO service_role;
  END IF;
  IF to_regclass('public.explore_entity_versions') IS NOT NULL THEN
    ALTER TABLE public.explore_entity_versions ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_versions TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_versions TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_entity_versions TO service_role;
  END IF;
  IF to_regclass('public.explore_import_jobs') IS NOT NULL THEN
    ALTER TABLE public.explore_import_jobs ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_import_jobs TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_import_jobs TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_import_jobs TO service_role;
  END IF;
  IF to_regclass('public.explore_import_records') IS NOT NULL THEN
    ALTER TABLE public.explore_import_records ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_import_records TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_import_records TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_import_records TO service_role;
  END IF;
  IF to_regclass('public.explore_import_revisions') IS NOT NULL THEN
    ALTER TABLE public.explore_import_revisions ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_import_revisions TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_import_revisions TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_import_revisions TO service_role;
  END IF;
  IF to_regclass('public.explore_import_rollbacks') IS NOT NULL THEN
    ALTER TABLE public.explore_import_rollbacks ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_import_rollbacks TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_import_rollbacks TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_import_rollbacks TO service_role;
  END IF;
  IF to_regclass('public.explore_import_sources') IS NOT NULL THEN
    ALTER TABLE public.explore_import_sources ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_import_sources TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_import_sources TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_import_sources TO service_role;
  END IF;
  IF to_regclass('public.explore_lake_profiles') IS NOT NULL THEN
    ALTER TABLE public.explore_lake_profiles ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_lake_profiles TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_lake_profiles TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_lake_profiles TO service_role;
  END IF;
  IF to_regclass('public.explore_locations') IS NOT NULL THEN
    ALTER TABLE public.explore_locations ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_locations TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_locations TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_locations TO service_role;
  END IF;
  IF to_regclass('public.explore_media') IS NOT NULL THEN
    ALTER TABLE public.explore_media ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_media TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_media TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_media TO service_role;
  END IF;
  IF to_regclass('public.explore_observations') IS NOT NULL THEN
    ALTER TABLE public.explore_observations ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_observations TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_observations TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_observations TO service_role;
  END IF;
  IF to_regclass('public.explore_park_profiles') IS NOT NULL THEN
    ALTER TABLE public.explore_park_profiles ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_park_profiles TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_park_profiles TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_park_profiles TO service_role;
  END IF;
  IF to_regclass('public.explore_relationship_types') IS NOT NULL THEN
    ALTER TABLE public.explore_relationship_types ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_relationship_types TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_relationship_types TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_relationship_types TO service_role;
  END IF;
  IF to_regclass('public.explore_saved_searches') IS NOT NULL THEN
    ALTER TABLE public.explore_saved_searches ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_saved_searches TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_saved_searches TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_saved_searches TO service_role;
  END IF;
  IF to_regclass('public.explore_search_index') IS NOT NULL THEN
    ALTER TABLE public.explore_search_index ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_search_index TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_search_index TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_search_index TO service_role;
  END IF;
  IF to_regclass('public.explore_search_synonyms') IS NOT NULL THEN
    ALTER TABLE public.explore_search_synonyms ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_search_synonyms TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_search_synonyms TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_search_synonyms TO service_role;
  END IF;
  IF to_regclass('public.explore_sources') IS NOT NULL THEN
    ALTER TABLE public.explore_sources ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_sources TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_sources TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_sources TO service_role;
  END IF;
  IF to_regclass('public.explore_species_profiles') IS NOT NULL THEN
    ALTER TABLE public.explore_species_profiles ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_species_profiles TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_species_profiles TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_species_profiles TO service_role;
  END IF;
  IF to_regclass('public.explore_tags') IS NOT NULL THEN
    ALTER TABLE public.explore_tags ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_tags TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_tags TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_tags TO service_role;
  END IF;
  IF to_regclass('public.explore_trips') IS NOT NULL THEN
    ALTER TABLE public.explore_trips ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_trips TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_trips TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.explore_trips TO service_role;
  END IF;
  IF to_regclass('public.flyover_aug10_reconciliation') IS NOT NULL THEN
    ALTER TABLE public.flyover_aug10_reconciliation ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.flyover_aug10_reconciliation TO service_role;
  END IF;
  IF to_regclass('public.flyover_email_execution_ledger') IS NOT NULL THEN
    ALTER TABLE public.flyover_email_execution_ledger ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.flyover_email_execution_ledger TO service_role;
  END IF;
  IF to_regclass('public.gsc_page_daily_metrics') IS NOT NULL THEN
    ALTER TABLE public.gsc_page_daily_metrics ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.gsc_page_daily_metrics TO service_role;
  END IF;
  IF to_regclass('public.gsc_url_inspection') IS NOT NULL THEN
    ALTER TABLE public.gsc_url_inspection ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.gsc_url_inspection TO service_role;
  END IF;
  IF to_regclass('public.ktr_evergreen_reviewers') IS NOT NULL THEN
    ALTER TABLE public.ktr_evergreen_reviewers ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.ktr_evergreen_reviewers TO service_role;
  END IF;
  IF to_regclass('public.ktr_evergreen_verification_events') IS NOT NULL THEN
    ALTER TABLE public.ktr_evergreen_verification_events ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.ktr_evergreen_verification_events TO service_role;
  END IF;
  IF to_regclass('public.ktr_evergreen_verifications') IS NOT NULL THEN
    ALTER TABLE public.ktr_evergreen_verifications ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.ktr_evergreen_verifications TO service_role;
  END IF;
  IF to_regclass('public.legislative_committees') IS NOT NULL THEN
    ALTER TABLE public.legislative_committees ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.legislative_committees TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.legislative_committees TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.legislative_committees TO service_role;
  END IF;
  IF to_regclass('public.legislative_content_opportunities') IS NOT NULL THEN
    ALTER TABLE public.legislative_content_opportunities ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.legislative_content_opportunities TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.legislative_content_opportunities TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.legislative_content_opportunities TO service_role;
  END IF;
  IF to_regclass('public.legislative_report_indexes') IS NOT NULL THEN
    ALTER TABLE public.legislative_report_indexes ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.legislative_report_indexes TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.legislative_report_indexes TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.legislative_report_indexes TO service_role;
  END IF;
  IF to_regclass('public.legislative_sessions') IS NOT NULL THEN
    ALTER TABLE public.legislative_sessions ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.legislative_sessions TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.legislative_sessions TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.legislative_sessions TO service_role;
  END IF;
  IF to_regclass('public.legislative_source_records') IS NOT NULL THEN
    ALTER TABLE public.legislative_source_records ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.legislative_source_records TO service_role;
  END IF;
  IF to_regclass('public.legislative_sync_runs') IS NOT NULL THEN
    ALTER TABLE public.legislative_sync_runs ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.legislative_sync_runs TO service_role;
  END IF;
  IF to_regclass('public.news_event_article_updates') IS NOT NULL THEN
    ALTER TABLE public.news_event_article_updates ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.news_event_article_updates TO service_role;
  END IF;
  IF to_regclass('public.news_event_cluster_admin_actions') IS NOT NULL THEN
    ALTER TABLE public.news_event_cluster_admin_actions ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.news_event_cluster_admin_actions TO service_role;
  END IF;
  IF to_regclass('public.news_event_cluster_sources') IS NOT NULL THEN
    ALTER TABLE public.news_event_cluster_sources ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.news_event_cluster_sources TO service_role;
  END IF;
  IF to_regclass('public.news_event_clusters') IS NOT NULL THEN
    ALTER TABLE public.news_event_clusters ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.news_event_clusters TO service_role;
  END IF;
  IF to_regclass('public.news_event_facts') IS NOT NULL THEN
    ALTER TABLE public.news_event_facts ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.news_event_facts TO service_role;
  END IF;
  IF to_regclass('public.news_event_reconciliation_holds') IS NOT NULL THEN
    ALTER TABLE public.news_event_reconciliation_holds ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.news_event_reconciliation_holds TO service_role;
  END IF;
  IF to_regclass('public.news_feed_normalization') IS NOT NULL THEN
    ALTER TABLE public.news_feed_normalization ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.news_feed_normalization TO service_role;
  END IF;
  IF to_regclass('public.news_publish_candidates') IS NOT NULL THEN
    ALTER TABLE public.news_publish_candidates ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON TABLE public.news_publish_candidates TO anon;
    GRANT SELECT ON TABLE public.news_publish_candidates TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.news_publish_candidates TO service_role;
  END IF;
  IF to_regclass('public.news_research_packets') IS NOT NULL THEN
    ALTER TABLE public.news_research_packets ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON TABLE public.news_research_packets TO anon;
    GRANT SELECT ON TABLE public.news_research_packets TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.news_research_packets TO service_role;
  END IF;
  IF to_regclass('public.news_source_fetch_state') IS NOT NULL THEN
    ALTER TABLE public.news_source_fetch_state ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.news_source_fetch_state TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.news_source_fetch_state TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.news_source_fetch_state TO service_role;
  END IF;
  IF to_regclass('public.news_story_cluster_items') IS NOT NULL THEN
    ALTER TABLE public.news_story_cluster_items ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON TABLE public.news_story_cluster_items TO anon;
    GRANT SELECT ON TABLE public.news_story_cluster_items TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.news_story_cluster_items TO service_role;
  END IF;
  IF to_regclass('public.news_story_clusters') IS NOT NULL THEN
    ALTER TABLE public.news_story_clusters ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.news_story_clusters TO service_role;
  END IF;
  IF to_regclass('public.newsletter_signups') IS NOT NULL THEN
    ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;
    GRANT INSERT ON TABLE public.newsletter_signups TO anon;
    GRANT INSERT ON TABLE public.newsletter_signups TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.newsletter_signups TO service_role;
  END IF;
  IF to_regclass('public.newsroom_daily_briefs') IS NOT NULL THEN
    ALTER TABLE public.newsroom_daily_briefs ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.newsroom_daily_briefs TO service_role;
  END IF;
  IF to_regclass('public.newsroom_editorial_actions') IS NOT NULL THEN
    ALTER TABLE public.newsroom_editorial_actions ENABLE ROW LEVEL SECURITY;
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.newsroom_editorial_actions TO service_role;
  END IF;
  IF to_regclass('public.newsroom_generation_drafts') IS NOT NULL THEN
    ALTER TABLE public.newsroom_generation_drafts ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.newsroom_generation_drafts TO service_role;
  END IF;
  IF to_regclass('public.newsroom_queue_counters') IS NOT NULL THEN
    ALTER TABLE public.newsroom_queue_counters ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.newsroom_queue_counters TO service_role;
  END IF;
  IF to_regclass('public.newsroom_source_page_fetch_state') IS NOT NULL THEN
    ALTER TABLE public.newsroom_source_page_fetch_state ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.newsroom_source_page_fetch_state TO service_role;
  END IF;
  IF to_regclass('public.orders') IS NOT NULL THEN
    ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.orders TO service_role;
  END IF;
  IF to_regclass('public.pillar_authority_snapshots') IS NOT NULL THEN
    ALTER TABLE public.pillar_authority_snapshots ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON TABLE public.pillar_authority_snapshots TO anon;
    GRANT SELECT ON TABLE public.pillar_authority_snapshots TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.pillar_authority_snapshots TO service_role;
  END IF;
  IF to_regclass('public.platform_governance_daily_summaries') IS NOT NULL THEN
    ALTER TABLE public.platform_governance_daily_summaries ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.platform_governance_daily_summaries TO service_role;
  END IF;
  IF to_regclass('public.platform_governance_events') IS NOT NULL THEN
    ALTER TABLE public.platform_governance_events ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.platform_governance_events TO service_role;
  END IF;
  IF to_regclass('public.products') IS NOT NULL THEN
    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.products TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.products TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.products TO service_role;
  END IF;
  IF to_regclass('public.publishing_alerts') IS NOT NULL THEN
    ALTER TABLE public.publishing_alerts ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.publishing_alerts TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.publishing_alerts TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.publishing_alerts TO service_role;
  END IF;
  IF to_regclass('public.publishing_queue') IS NOT NULL THEN
    ALTER TABLE public.publishing_queue ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.publishing_queue TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.publishing_queue TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.publishing_queue TO service_role;
  END IF;
  IF to_regclass('public.reel_candidates') IS NOT NULL THEN
    ALTER TABLE public.reel_candidates ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.reel_candidates TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.reel_candidates TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.reel_candidates TO service_role;
  END IF;
  IF to_regclass('public.repo_migration_equivalences') IS NOT NULL THEN
    ALTER TABLE public.repo_migration_equivalences ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.repo_migration_equivalences TO service_role;
  END IF;
  IF to_regclass('public.repo_migration_public_ledger') IS NOT NULL THEN
    ALTER TABLE public.repo_migration_public_ledger ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON TABLE public.repo_migration_public_ledger TO anon;
    GRANT SELECT ON TABLE public.repo_migration_public_ledger TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.repo_migration_public_ledger TO service_role;
  END IF;
  IF to_regclass('public.reserve_article_publications') IS NOT NULL THEN
    ALTER TABLE public.reserve_article_publications ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.reserve_article_publications TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.reserve_article_publications TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.reserve_article_publications TO service_role;
  END IF;
  IF to_regclass('public.social_connections') IS NOT NULL THEN
    ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.social_connections TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.social_connections TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.social_connections TO service_role;
  END IF;
  IF to_regclass('public.suppressed_emails') IS NOT NULL THEN
    ALTER TABLE public.suppressed_emails ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.suppressed_emails TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.suppressed_emails TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.suppressed_emails TO service_role;
  END IF;
  IF to_regclass('public.td_ai_coverage_gaps') IS NOT NULL THEN
    ALTER TABLE public.td_ai_coverage_gaps ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.td_ai_coverage_gaps TO service_role;
  END IF;
  IF to_regclass('public.td_ai_eval_cases') IS NOT NULL THEN
    ALTER TABLE public.td_ai_eval_cases ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.td_ai_eval_cases TO service_role;
  END IF;
  IF to_regclass('public.td_ai_eval_runs') IS NOT NULL THEN
    ALTER TABLE public.td_ai_eval_runs ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.td_ai_eval_runs TO service_role;
  END IF;
  IF to_regclass('public.td_ai_question_signals') IS NOT NULL THEN
    ALTER TABLE public.td_ai_question_signals ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.td_ai_question_signals TO service_role;
  END IF;
  IF to_regclass('public.td_ai_search_demand') IS NOT NULL THEN
    ALTER TABLE public.td_ai_search_demand ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.td_ai_search_demand TO service_role;
  END IF;
  IF to_regclass('public.td_authority_page_acceptance') IS NOT NULL THEN
    ALTER TABLE public.td_authority_page_acceptance ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.td_authority_page_acceptance TO service_role;
  END IF;
  IF to_regclass('public.td_authority_sitemap_requests') IS NOT NULL THEN
    ALTER TABLE public.td_authority_sitemap_requests ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.td_authority_sitemap_requests TO service_role;
  END IF;
  IF to_regclass('public.td_authority_verification_checks') IS NOT NULL THEN
    ALTER TABLE public.td_authority_verification_checks ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.td_authority_verification_checks TO service_role;
  END IF;
  IF to_regclass('public.td_authority_verification_registry') IS NOT NULL THEN
    ALTER TABLE public.td_authority_verification_registry ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.td_authority_verification_registry TO service_role;
  END IF;
  IF to_regclass('public.td_authority_verification_sources') IS NOT NULL THEN
    ALTER TABLE public.td_authority_verification_sources ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.td_authority_verification_sources TO service_role;
  END IF;
  IF to_regclass('public.texas_events') IS NOT NULL THEN
    ALTER TABLE public.texas_events ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texas_events TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texas_events TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texas_events TO service_role;
  END IF;
  IF to_regclass('public.texas_news_feed') IS NOT NULL THEN
    ALTER TABLE public.texas_news_feed ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texas_news_feed TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texas_news_feed TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texas_news_feed TO service_role;
  END IF;
  IF to_regclass('public.texas_property_tax_rates') IS NOT NULL THEN
    ALTER TABLE public.texas_property_tax_rates ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON TABLE public.texas_property_tax_rates TO anon;
    GRANT SELECT ON TABLE public.texas_property_tax_rates TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texas_property_tax_rates TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_admin_access_keys') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_admin_access_keys ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_admin_access_keys TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_advertiser_agreement_offers') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_advertiser_agreement_offers ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_advertiser_agreement_offers TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_advertiser_agreements') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_advertiser_agreements ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_advertiser_agreements TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_articles') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_articles ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_articles TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_articles TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_articles TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_backlink_prospects') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_backlink_prospects ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_backlink_prospects TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_billing_accounts') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_billing_accounts ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_billing_accounts TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_billing_invoice_items') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_billing_invoice_items ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_billing_invoice_items TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_billing_invoices') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_billing_invoices ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_billing_invoices TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_billing_stripe_events') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_billing_stripe_events ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_billing_stripe_events TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_bing_webmaster_snapshots') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_bing_webmaster_snapshots ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_bing_webmaster_snapshots TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_brand_locations') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_brand_locations ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON TABLE public.texasdefined_brand_locations TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_event_offers') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_event_offers ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_event_offers TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_event_offers TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_event_offers TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_fishing_sponsor_daily_metrics') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_fishing_sponsor_daily_metrics ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_fishing_sponsor_daily_metrics TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_fishing_sponsor_placements') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_fishing_sponsor_placements ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_fishing_sponsor_placements TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_fishing_sponsors') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_fishing_sponsors ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_fishing_sponsors TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_network_applications') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_network_applications ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_network_applications TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_network_business_accounts') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_network_business_accounts ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON TABLE public.texasdefined_network_business_accounts TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_network_business_accounts TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_network_checkout_acceptances') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_network_checkout_acceptances ENABLE ROW LEVEL SECURITY;
    GRANT INSERT, SELECT ON TABLE public.texasdefined_network_checkout_acceptances TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_network_checkout_attempts') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_network_checkout_attempts ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_network_checkout_attempts TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_network_email_outbox') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_network_email_outbox ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_network_email_outbox TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_network_owner_verifications') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_network_owner_verifications ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_network_owner_verifications TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_network_profile_revisions') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_network_profile_revisions ENABLE ROW LEVEL SECURITY;
    GRANT INSERT, SELECT ON TABLE public.texasdefined_network_profile_revisions TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_network_profile_revisions TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_network_public_listings') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_network_public_listings ENABLE ROW LEVEL SECURITY;
    GRANT SELECT ON TABLE public.texasdefined_network_public_listings TO anon;
    GRANT SELECT ON TABLE public.texasdefined_network_public_listings TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_network_public_listings TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_network_stripe_events') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_network_stripe_events ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_network_stripe_events TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_newsletter_deliveries') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_newsletter_deliveries ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_newsletter_deliveries TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_newsletter_events') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_newsletter_events ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_newsletter_events TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_newsletter_issues') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_newsletter_issues ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_newsletter_issues TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_newsletter_subscribers') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_newsletter_subscribers ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_newsletter_subscribers TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_offer_sources') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_offer_sources ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_offer_sources TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_offer_sources TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_offer_sources TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_partner_inquiries') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_partner_inquiries ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_partner_inquiries TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_partner_referral_daily') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_partner_referral_daily ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_partner_referral_daily TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_shop_funnel_daily') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_shop_funnel_daily ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_shop_funnel_daily TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_sports_sponsor_daily_metrics') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_sports_sponsor_daily_metrics ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_sports_sponsor_daily_metrics TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_sports_sponsor_placements') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_sports_sponsor_placements ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_sports_sponsor_placements TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_sports_sponsors') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_sports_sponsors ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_sports_sponsors TO service_role;
  END IF;
  IF to_regclass('public.texasdefined_sports_venue_daily_traffic') IS NOT NULL THEN
    ALTER TABLE public.texasdefined_sports_venue_daily_traffic ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.texasdefined_sports_venue_daily_traffic TO service_role;
  END IF;
  IF to_regclass('public.user_roles') IS NOT NULL THEN
    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.user_roles TO anon;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.user_roles TO authenticated;
    GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public.user_roles TO service_role;
  END IF;
END
$readiness$;
