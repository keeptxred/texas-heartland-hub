import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const generator = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");
const workflow = readFileSync(".github/workflows/run-daily-news-now.yml", "utf8");

describe("bounded automatic recovery of recently GENERATED but HELD newsroom drafts", () => {
  it("limits recovery to guarded publisher, recent held and un-rejected generated drafts", () => {
    expect(generator).toContain('url.searchParams.get("recover_held") === "1"');
    expect(generator).toContain('const recoverSavedDraft = recoverElectionDraft || recoverRecentHeldDraft');
    expect(generator).toContain('.eq("status", "HELD")');
    expect(generator).toContain('.is("rejection_reason", null)');
    expect(generator).toContain('recoverElectionDraft ? ELECTION_RECOVERY_START : newsroomNewStoryCutoff()');
    expect(generator).toContain('.eq("mode", "publish").eq("status", "GENERATED")');
    expect(generator).toContain('saved && (saved.validation_reasons ?? []).length === 0');
  });
  it("re-checks independent sources, complete evidence and editorial draft before publishing", () => {
    expect(generator).toContain("newsroomHasPublisherDiversity(sources)");
    expect(generator).toContain("researchPacketEvidenceChars(packetRow.packet_json)");
    expect(generator).toContain("validateNewsroomDraft(draft, packet)");
    expect(generator).toContain("already_published_story_subject");
    expect(generator).toContain("already_published_source_url");
    expect(generator).toContain('const { data: claimed, error: claimError } = await selectedQuery.eq("status", "HELD").select("id")');
    expect(generator).toContain("recovery_draft_failed_revalidation:");
  });
  it("does not consume new paid rewrite budget or publish rejected images to social", () => {
    expect(generator).toContain('if (!recoverSavedDraft) {\n    const { data: reservation, error: reserveError }');
    expect(generator).toContain("let aiCalls = recoverSavedDraft ? 0 : 1");
    expect(generator).toContain("const imageReady = Boolean(preparedImage.ok");
    expect(generator).toContain("webOnly: !imageReady");
    expect(workflow).toContain("generate-newsroom?mode=publish&recover_held=1");
    expect(workflow.indexOf("generate-newsroom?mode=publish&recover_held=1")).toBeLessThan(
      workflow.indexOf("generate-newsroom?mode=publish&recover_election=1"),
    );
    expect(workflow.indexOf("generate-newsroom?mode=publish&recover_election=1")).toBeLessThan(
      workflow.indexOf("generate-newsroom?mode=publish\" || echo 000"),
    );
    expect(workflow).toContain("social_image_ready=false");
    expect(workflow).not.toContain("skip_image_validation");
  });
});
