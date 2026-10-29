import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("editorially approved October 11-25 election newsroom recovery", () => {
  const generator = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");
  const workflow = readFileSync(".github/workflows/run-daily-news-now.yml", "utf8");

  it("bounds approval to factual election administration drafts and expires recovery", () => {
    expect(generator).toContain('const ELECTION_RECOVERY_START = "2026-10-11T00:00:00Z"');
    expect(generator).toContain('const ELECTION_RECOVERY_END = "2026-10-26T00:00:00Z"');
    expect(generator).toContain('const ELECTION_RECOVERY_EXPIRES = "2026-10-30T23:59:59Z"');
    expect(generator).toContain('record?.pillar_slug === "texas-elections"');
    expect(generator).toContain("isFactualVotingAdministrationSubject(record.canonical_subject)");
    expect(generator).toContain('const recoveryRequested = requestedMode === "publish"');
  });

  it("only reuses exact GENERATED publish-mode drafts without a new AI reservation", () => {
    expect(generator).toContain('.eq("status", "HELD")');
    expect(generator).toContain('.is("rejection_reason", null)');
    expect(generator).toContain('.eq("mode", "publish").eq("status", "GENERATED")');
    expect(generator).toContain('if (!recoverElectionDraft) {\n    const { data: reservation, error: reserveError }');
    expect(generator).toContain('aiCalls = recoverElectionDraft ? 0 : 1');
    expect(generator).toContain('savedGeneratedDraft!.id');
    expect(generator).toContain('const selectedQuery = db.from("news_publish_candidates").update(');
    expect(generator).toContain('.eq("status", "HELD").select("id")');
  });

  it("keeps independent publishing evidence, duplicate checks and full image validation", () => {
    expect(generator).toContain("researchPacketEvidenceChars(packetRow.packet_json) >= evidenceFloorForPillar");
    expect(generator).toContain("newsroomHasPublisherDiversity(sources)");
    expect(generator).toContain("duplicatesExistingElectionStory(subject, existingElectionTitles)");
    expect(generator).toContain("validateNewsroomDraft(draft, packet)");
    expect(generator).toContain("electionDraftHeadlineMatchesEvent(record.canonical_subject, saved?.draft_json?.title");
    expect(generator).toContain("ballot (?:errors?|issues?|discrepanc");
    expect(generator).toContain("voter registrations?|registered vote");
    expect(generator).toContain("Retrospective election report:");
    expect(generator).toContain("await prepareFeaturedImageForUnpublishedNewsroomArticle");
    expect(generator).toContain("const imageReady = Boolean(preparedImage.ok");
    expect(generator).toContain('image_generation_status: "ready"');
    expect(generator).toContain('image_generation_status: "failed"');
    expect(generator).toContain("newsroom_text_first_verified");
    expect(generator).toContain("reusedApprovedDraft: recoverElectionDraft");
  });

  it("uses the existing signed GitHub Actions publisher and existing full finalization, at most one per run", () => {
    expect(workflow).toContain("generate-newsroom?mode=publish&recover_election=1");
    expect(workflow).toContain("generate-newsroom?mode=publish\"");
    expect(workflow).toContain("Authorization: Bearer ${oidc_token}");
    expect(workflow).toContain('if [[ "$newsroom_status" != "200" ]] || ! jq -e');
    expect(workflow).toContain("finalize-newsroom-article");
    expect(workflow).toContain("DAILY_NEWS_PUBLISH_SUCCESS clustered_slug=");
    expect(workflow).not.toContain("skip_image_validation");
  });
});
