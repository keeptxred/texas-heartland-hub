import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  newsroomRewriteSystemPrompt,
  stripGenericExpertAttribution,
} from "./newsroom-rewrite-adapter";
import type { ResearchPacket } from "./newsroom-research-packet";

const route = fs.readFileSync(new URL("../routes/api/public/hooks/retest-newsroom-shadow.ts", import.meta.url), "utf8");
const workflow = fs.readFileSync(new URL("../../.github/workflows/newsroom-shadow-retest.yml", import.meta.url), "utf8");

describe("Phase 13 rejected shadow retest", () => {
  it("is shadow-only and refuses publish-enabled runtime", () => {
    expect(route).toContain('process.env.NEWSROOM_PUBLISH_ENABLED === "true"');
    expect(route).toContain('reason: "shadow_retest_requires_publish_disabled"');
    expect(route).toContain('mode: "shadow"');
    expect(route).toContain("published: false");
    expect(route).not.toContain('from("daily_articles")');
    expect(route).not.toContain('mode: "publish"');
  });

  it("only retests rejected candidates that do not already have a valid shadow draft", () => {
    expect(route).toContain('.eq("status", "REJECTED")');
    expect(route).toContain('.eq("status", "GENERATED")');
    expect(route).toContain("alreadyValid");
    expect(route).toContain("!alreadyValid.has(row.id)");
  });

  it("keeps source evidence and budget safeguards", () => {
    expect(route).toContain("STANDARD_MIN_SOURCE_EVIDENCE_CHARS = 5_000");
    expect(route).toContain("LONG_FORM_MIN_SOURCE_EVIDENCE_CHARS = 9_000");
    expect(route).toContain("researchPacketEvidenceChars(packet.packet_json)");
    expect(route.indexOf("researchPacketEvidenceChars(packet.packet_json)")).toBeLessThan(route.indexOf('db.rpc("newsroom_reserve_ai_generation"'));
    expect(route).toContain("maxAttempts: 1");
    expect(route).toContain('db.rpc("newsroom_finalize_ai_generation"');
  });

  it("runs exactly three distinct one-attempt retests with temporary-token cleanup", () => {
    expect(workflow).toContain("for i in 1 2 3");
    expect(workflow).toContain("/api/public/hooks/retest-newsroom-shadow$exclude_query");
    expect(workflow).toContain('exclude_query="?exclude=$candidate_id"');
    expect(workflow).toContain('exclude_query="$exclude_query&exclude=$candidate_id"');
    expect(route).toContain('requestUrl.searchParams.getAll("exclude")');
    expect(route).toContain("!excludedCandidateIds.has(row.id)");
    expect(workflow).toContain("NEWSROOM_HOOK_TOKEN");
    expect(workflow).toContain("trap cleanup EXIT");
    expect(workflow).toContain("published");
  });

  it("explicitly bans generic expert attribution in the current newsroom prompt", () => {
    const packet = {
      packetVersion: 1,
      clusterId: "cluster",
      subject: "Texas story",
      pillar: "sports",
      recommendedFormat: "SINGLE",
      editorialScore: 80,
      rules: [],
      sources: [],
    } as unknown as ResearchPacket;
    const prompt = newsroomRewriteSystemPrompt(packet);
    expect(prompt).toContain('Never write generic attribution phrases such as "experts say"');
    expect(prompt).toContain('"experts suggest"');
    expect(prompt).toContain('"experts believe"');
  });

  it("deletes generic expert-attribution sentences rather than rewriting them", () => {
    expect(stripGenericExpertAttribution("The agency released the report. Experts say the change will transform Texas. The filing takes effect Monday."))
      .toBe("The agency released the report. The filing takes effect Monday.");
    expect(stripGenericExpertAttribution("Experts suggest prices could rise. Verified figures remain unchanged."))
      .toBe("Verified figures remain unchanged.");
    expect(stripGenericExpertAttribution("The source states the official total is 42."))
      .toBe("The source states the official total is 42.");
  });
});
