import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const review = readFileSync("scripts/laws/review-authority-guides.mjs", "utf8");
const workflow = readFileSync(".github/workflows/review-texas-law-authority.yml", "utf8");

describe("evergreen Texas law authority review maintenance", () => {
  it("passes the pure review queue, calendar and session tests", () => {
    expect(() => execFileSync("node", ["--test", "scripts/laws/test-review-authority-guides.mjs"], {
      encoding: "utf8", timeout: 15_000,
    })).not.toThrow();
  });

  it("reminds editors monthly without rewriting legal claims or timestamps", () => {
    expect(workflow).toContain('cron: "0 14 20 * *"');
    expect(workflow).toContain("issues: write");
    expect(workflow).toContain("node scripts/laws/review-authority-guides.mjs");
    expect(workflow).toContain("gh issue comment 2938");
    expect(workflow).toContain("already exists; not posting a duplicate");
    expect(workflow).toContain("gh api --method GET --paginate");
    expect(workflow).toContain("grep -Fq \"\${marker}\" /tmp/texas-law-review-comments.txt");
    expect(review).toContain("REVIEW_AGE_DAYS = 90");
    expect(review).toContain("isRegularSessionReviewMonth");
    expect(review).toContain("No legal text, source citations, published dates, or reviewed dates were changed automatically");
    expect(review).not.toContain("writeFileSync(");
  });
});
