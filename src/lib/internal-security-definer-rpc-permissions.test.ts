import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/20260908043109_lock_internal_keeptxred_security_definer_rpcs.sql",
  "utf8",
);

const INTERNAL_RPC_SIGNATURES = [
  "public.grant_manual_ai_rewrite_bypass(bigint)",
  "public.claim_ai_rewrite_slot(text, bigint, integer)",
  "public.claim_automated_ai_rewrite_slot(text, bigint, integer)",
  "public.claim_contextual_ai_rewrite_slot(text, bigint, integer)",
  "public.claim_manual_ai_rewrite_slot(text, bigint, integer)",
  "public.sync_coverage_gap_alerts(integer, integer, integer)",
  "public.sync_flyover_aug10_publishing_alerts()",
  "public.clear_deleted_news_feed_article_link()",
  "public.quarantine_cross_site_daily_article()",
  "public.queue_legislative_action_opportunity()",
  "public.record_failed_ai_rewrite()",
  "public.retire_pending_ai_rewrite_claims_on_publication()",
  "public.sync_bill_article_authority_relationship()",
  "public.sync_bill_subject_authority_relationship()",
  "public.sync_news_feed_article_link()",
  "public.trigger_sync_flyover_aug10_publishing_alerts()",
] as const;

describe("internal SECURITY DEFINER RPC permissions", () => {
  it("explicitly removes Supabase anon/authenticated default EXECUTE grants", () => {
    for (const signature of INTERNAL_RPC_SIGNATURES) {
      expect(migration).toContain(
        `REVOKE ALL ON FUNCTION ${signature} FROM PUBLIC, anon, authenticated;`,
      );
    }
  });

  it("keeps the internal functions executable by service_role", () => {
    for (const signature of INTERNAL_RPC_SIGNATURES) {
      expect(migration).toContain(
        `GRANT EXECUTE ON FUNCTION ${signature} TO service_role;`,
      );
    }
  });

  it("documents why REVOKE FROM PUBLIC by itself is insufficient", () => {
    expect(migration).toContain("default function privileges explicitly grant EXECUTE to");
    expect(migration).toContain("REVOKE ... FROM PUBLIC alone is insufficient");
  });
});
