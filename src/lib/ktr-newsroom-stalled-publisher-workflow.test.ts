import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const workflow = readFileSync(".github/workflows/run-daily-news-now.yml", "utf8");

describe("guarded publisher reports genuine normal newsroom stalls", () => {
  it("fails an actual 24-hour normal-article stall even when a reserve was published", () => {
    const start = workflow.indexOf('reserve_published=$(jq -r');
    const reserveBranch = workflow.indexOf('if [[ -n "$reserve_published" ]]; then', start);
    const normalStall = workflow.indexOf("if jq -e '.automation_stalled == true'", reserveBranch);

    expect(start).toBeGreaterThan(0);
    expect(reserveBranch).toBeGreaterThan(start);
    expect(normalStall).toBeGreaterThan(reserveBranch);
    const between = workflow.slice(reserveBranch, normalStall);
    // The branch is closed before this check. Otherwise the reserve-success
    // path could avoid reporting that normal publication is still stalled.
    expect(between).toContain("\n          fi\n\n          # Reserve guides preserve site continuity");
    expect(workflow.slice(normalStall)).toContain("DAILY_NEWS_NORMAL_PUBLISHING_STALLED");
    expect(workflow.slice(normalStall)).toContain("exit 1");
    expect(workflow).toContain("DAILY_NEWS_WEB_ONLY_SUCCESS");
    expect(workflow).toContain("DAILY_NEWS_PUBLISH_SUCCESS reserve_published=");
  });

  it("reads normal publisher stall separately from the latest any-article gap", () => {
    expect(workflow).toContain("if jq -e '.publication_gap == true'");
    expect(workflow).toContain("if jq -e '.automation_stalled == true'");
    expect(workflow).not.toContain('if jq -e \'(.publication_gap or .automation_stalled) == false\'');
  });
});
