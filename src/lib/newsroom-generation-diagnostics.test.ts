import fs from "node:fs";
import { describe, expect, it } from "vitest";

const source = fs.readFileSync(
  new URL("../routes/api/public/hooks/newsroom-generation-diagnostics.ts", import.meta.url),
  "utf8",
);

describe("Phase 13 newsroom generation diagnostics", () => {
  it("is read-only and zero-AI", () => {
    expect(source).toContain("aiCalls: 0");
    expect(source).toContain("writes: 0");
    expect(source).toContain('.from("news_publish_candidates")');
    expect(source).toContain('.from("news_research_packets")');
    expect(source).toContain('.from("newsroom_generation_drafts")');
    expect(source).not.toContain("runCloudflareJson");
    expect(source).not.toContain("newsroom_reserve_ai_generation");
    expect(source).not.toContain(".insert(");
    expect(source).not.toContain(".update(");
    expect(source).not.toContain(".upsert(");
  });

  it("reports the same evidence floors and exclusion reasons as generation selection", () => {
    expect(source).toContain("STANDARD_MIN_SOURCE_EVIDENCE_CHARS = 5_000");
    expect(source).toContain("LONG_FORM_MIN_SOURCE_EVIDENCE_CHARS = 9_000");
    expect(source).toContain('exclusionReason = "already_shadowed"');
    expect(source).toContain('exclusionReason = "missing_cluster"');
    expect(source).toContain('exclusionReason = "missing_packet"');
    expect(source).toContain('exclusionReason = "empty_packet"');
    expect(source).toContain('exclusionReason = "below_evidence_floor"');
    expect(source).toContain("researchPacketEvidenceChars(packet.packet_json)");
    expect(source).toContain("closestBelowFloor");
  });
});
