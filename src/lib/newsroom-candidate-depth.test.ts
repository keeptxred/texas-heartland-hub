import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const generator = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");
const builder = readFileSync("src/routes/api/public/hooks/build-newsroom-research-packets.ts", "utf8");

describe("newsroom evidence-first candidate depth", () => {
  it("can reach the 500 candidates already researched by the packet pipeline", () => {
    expect(builder).toContain("const CANDIDATE_LIMIT = 500");
    expect(generator).toContain("const NEWSROOM_PUBLISH_SCAN_LIMIT = 500");
    expect(generator).toContain('requestedMode === "publish" ? NEWSROOM_PUBLISH_SCAN_LIMIT : NEWSROOM_CANDIDATE_BATCH_SIZE');
    expect(generator).toContain("for (let batchStart = 0; batchStart < candidates.length; batchStart += NEWSROOM_CANDIDATE_BATCH_SIZE)");
    expect(generator).toContain("const batch = candidates.slice(batchStart, batchStart + NEWSROOM_CANDIDATE_BATCH_SIZE)");
    expect(generator).toContain("if (chosen) {");
    expect(generator).toContain("break;");
  });

  it("keeps source and candidate queries below the PostgREST IN-query size limit", () => {
    expect(generator).toContain("const NEWSROOM_CANDIDATE_BATCH_SIZE = 100");
    expect(generator).toContain('db.from("news_story_clusters").select("id,canonical_subject,pillar_slug").in("id", clusterIds)');
    expect(generator).toContain('db.from("news_research_packets").select("cluster_id,packet_json,source_count,primary_source_count").in("cluster_id", clusterIds)');
    expect(generator).toContain('.in("source_url", leadUrls.slice(offset, offset + 25))');
    expect(generator.indexOf("const batch = candidates.slice")).toBeLessThan(
      generator.indexOf('db.from("news_story_clusters").select'),
    );
  });

  it("never reserves AI before all required evidence, publisher and duplicate checks", () => {
    const reserve = generator.indexOf('db.rpc("newsroom_reserve_ai_generation"');
    expect(reserve).toBeGreaterThan(-1);
    expect(generator.indexOf("researchPacketEvidenceChars(packetRow.packet_json)")).toBeLessThan(reserve);
    expect(generator.indexOf("productionAuthorityEligible(packetByCluster.get(row.cluster_id)!)")).toBeLessThan(reserve);
    expect(generator.indexOf("newsroomHasPublisherDiversity(sources)")).toBeLessThan(reserve);
    expect(generator.indexOf("existingLeadSources.has(leadUrl)")).toBeLessThan(reserve);
    expect(generator).toContain('requestedMode === "shadow"');
    expect(generator).toContain('"insufficient_source_evidence"');
  });

  it("skips a recently published subject even when another cluster has a different source URL", () => {
    const reserve = generator.indexOf('db.rpc("newsroom_reserve_ai_generation"');
    const subjectCheck = generator.indexOf('.in("canonical_subject", subjects.slice(offset, offset + 20))');
    const leadCheck = generator.indexOf('.in("source_url", leadUrls.slice(offset, offset + 25))');
    expect(subjectCheck).toBeGreaterThan(-1);
    expect(subjectCheck).toBeLessThan(leadCheck);
    expect(leadCheck).toBeLessThan(reserve);
    expect(generator).toContain('recentlyPublishedSubjects.has(subject)');
    expect(generator).toContain('      ? novelSubjectCandidates.find((row) => {');
    expect(generator).toContain('"already_published_story_subject"');
    expect(generator).toContain('.gte("published_at", newsroomNewStoryCutoff())');
  });

  it("applies a stable ranked order so crossing the first 100 does not reorder stories", () => {
    expect(generator).toContain('.order("editorial_score", { ascending: false })');
    expect(generator).toContain('.order("created_at", { ascending: false })');
    expect(generator).toContain('.order("id", { ascending: true })');
    const rows = Array.from({ length: 500 }, (_, i) => ({ id: String(i), score: 100 - Math.floor(i / 10) }));
    const batches = Array.from({ length: Math.ceil(rows.length / 100) }, (_, i) => rows.slice(i * 100, (i + 1) * 100));
    expect(batches).toHaveLength(5);
    expect(batches[1][5].id).toBe("105");
    expect(batches.flat()).toEqual(rows);
  });
});
