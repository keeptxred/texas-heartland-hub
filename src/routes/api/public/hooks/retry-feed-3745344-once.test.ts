import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  new URL("./retry-feed-3745344-once.ts", import.meta.url),
  "utf8",
);

describe("one-time feed 3745344 retry hook", () => {
  it("is hard-coded to one feed item and requires the dedicated OIDC workflow", () => {
    expect(source).toContain("const FEED_ITEM_ID = 3745344");
    expect(source).toContain('const WORKFLOW_PATH = ".github/workflows/retry-feed-3745344-once.yml"');
    expect(source).toContain("verifyGitHubActionsOidc");
    expect(source).toContain('allowedEventNames: ["push"]');
    expect(source).toContain("publishSingleFeedItem(FEED_ITEM_ID)");
    expect(source).not.toContain("request.json()");
    expect(source).not.toContain("searchParams");
  });
});
