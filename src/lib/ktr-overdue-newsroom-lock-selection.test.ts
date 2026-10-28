import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("overdue newsroom failover advances past unrelated event locks without retry loops", () => {
  const route = readFileSync("src/routes/api/public/hooks/publish-overdue-gap.ts", "utf8");
  const workflow = readFileSync(".github/workflows/run-daily-news-now.yml", "utf8");

  it("bounds the entire scan at 16 distinct candidates and paid/substantive work at eight attempts", () => {
    expect(route).toContain("const MAX_ATTEMPTS = 8");
    expect(route).toContain("const MAX_CANDIDATE_SCAN = 16");
    expect(route).toContain("for (const gap of ranked.slice(0, MAX_CANDIDATE_SCAN))");
    expect(route).toContain("if (substantiveAttempts >= MAX_ATTEMPTS) break");
    expect(route).toContain("const lockDeferred = !result.ok && isConcurrentPublicationDeferral(result.error)");
    expect(route).toContain("if (lockDeferred) lockDeferrals++");
    expect(route).toContain("else substantiveAttempts++");
    expect(route).toContain("if (published >= MAX_PUBLISHED) break");
    expect(route).toContain("const MAX_PUBLISHED = 1");
    expect(route).toContain("substantive_attempts: substantiveAttempts");
    expect(route).toContain("lock_deferrals: lockDeferrals");
  });

  it("does not retry the same feed item, bypass exact-event publication locks or omit image safety checks", () => {
    expect(route).toContain("const result = await publishSingleFeedItem(gap.id)");
    expect(route).toContain('result.error?.startsWith("newsroom_image_publication_hold:")');
    expect(route).toContain("break;\n    }\n\n    if (result.ok && result.slug)");
    expect(workflow).toContain("publish-overdue-gap");
    expect(workflow).toContain("publishing-safety-net");
    expect(workflow).toContain("DAILY_NEWS_NO_PUBLICATION");
    expect(route).not.toContain("while (");
  });
});
