import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assessPublicationTiming } from "@/lib/publication-lifecycle";
import type { StoryCluster } from "@/lib/story-clustering";
import type { FactVerificationDecision } from "@/lib/fact-verification-gate";

const migration = readFileSync(
  "supabase/migrations/20260816152500_add_news_event_publication_claims.sql",
  "utf8",
);
const recoveryMigration = readFileSync(
  "supabase/migrations/20260818003500_align_event_claim_with_rewrite_stale_window.sql",
  "utf8",
);
const lifecycle = readFileSync("src/lib/publication-lifecycle.ts", "utf8");
const publisher = readFileSync("src/lib/multi-source-publish.ts", "utf8");

function cluster(overrides: Partial<StoryCluster> = {}): StoryCluster {
  return {
    primary: {
      id: 1,
      title: "Texas officials release statewide education update",
      link: "https://example.com/a",
      source: "Outlet A",
      description: "Officials released a statewide education update.",
      pub_date: "2026-08-16T20:20:00Z",
      combinationScore: 100,
    },
    members: [
      {
        id: 2,
        title: "New statewide education results released in Texas",
        link: "https://example.net/b",
        source: "Outlet B",
        description: "A second outlet reports the same statewide update.",
        pub_date: "2026-08-16T20:21:00Z",
        combinationScore: 90,
        overlapTerms: ["statewide", "education", "update"],
      },
    ],
    score: 90,
    strongMerge: true,
    sourceCount: 2,
    ...overrides,
  } as StoryCluster;
}

const verified: FactVerificationDecision = {
  publish: true,
  mode: "verified",
  reason: "traceable factual backbone verified",
  traceableMajorFacts: 3,
  corroboratedMajorFacts: 1,
  primaryRecordMajorFacts: 0,
  materialConflictKeys: [],
  attributedClaimKeys: [],
};

describe("publication timing lifecycle", () => {
  it("briefly collects a fresh nonbreaking two-source event", () => {
    const decision = assessPublicationTiming(cluster(), verified, new Date("2026-08-16T20:25:00Z"));
    expect(decision.mode).toBe("collect_briefly");
    expect(decision.waitUntil).toBe("2026-08-16T20:32:00.000Z");
  });

  it("publishes immediately after the short collection window", () => {
    const decision = assessPublicationTiming(cluster(), verified, new Date("2026-08-16T20:40:00Z"));
    expect(decision.mode).toBe("publish_now");
    expect(decision.reason).toContain("elapsed");
  });

  it("never delays a verified breaking event for collection", () => {
    const breaking = cluster({
      primary: {
        ...cluster().primary,
        title: "Breaking: flash flood emergency declared in Central Texas",
        description: "Officials issued an evacuation order during a flash flood emergency.",
      },
    });
    const decision = assessPublicationTiming(breaking, verified, new Date("2026-08-16T20:22:00Z"));
    expect(decision.mode).toBe("publish_now");
    expect(decision.breaking).toBe(true);
  });

  it("publishes immediately when corroboration is already deep", () => {
    const decision = assessPublicationTiming(
      cluster({ sourceCount: 3 }),
      { ...verified, corroboratedMajorFacts: 2 },
      new Date("2026-08-16T20:23:00Z"),
    );
    expect(decision.mode).toBe("publish_now");
    expect(decision.reason).toContain("corroboration");
  });

  it("uses an atomic database claim with stale-claim recovery", () => {
    expect(migration).toContain("claim_news_event_cluster_publication");
    expect(migration).toContain("publish_claim_token IS NULL");
    expect(migration).toContain("publish_claimed_at < now() - make_interval");
    expect(migration).toContain("status <> 'published'");
    expect(migration).toContain("publish_attempt_count = publish_attempt_count + 1");
  });

  it("aligns the event claim lease with the 15-minute rewrite stale window", () => {
    expect(lifecycle).toContain("const CLAIM_TTL_SECONDS = 15 * 60");
    expect(recoveryMigration).toContain("p_claim_ttl_seconds integer DEFAULT 900");
    expect(recoveryMigration).toContain("publish_claimed_at <= now() - interval '15 minutes'");
  });

  it("treats a canonical published slug as terminal even if cluster status drifts", () => {
    expect(recoveryMigration).toContain("IF v_slug IS NOT NULL THEN");
    expect(recoveryMigration).toContain("AND published_slug IS NULL");
  });

  it("only releases a claim held by the same worker token", () => {
    expect(migration).toContain("release_news_event_cluster_publication_claim");
    expect(migration).toContain("publish_claim_token = p_claim_token");
  });

  it("runs timing and the atomic claim before the legacy synthesis publisher", () => {
    const lifecycleCall = publisher.indexOf("preparePublicationLifecycle(db, feedItemId");
    const legacyCall = publisher.indexOf("publishLegacySingleFeedItem(feedItemId)", lifecycleCall);
    expect(lifecycleCall).toBeGreaterThan(0);
    expect(legacyCall).toBeGreaterThan(lifecycleCall);
    expect(publisher).toContain("releasePublicationClaim(db, eventClusterId, lifecycle.claimToken)");
  });
});
