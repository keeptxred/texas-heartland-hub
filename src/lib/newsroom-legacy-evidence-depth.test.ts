import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assessLegacyNewsroomEvidenceDepth } from "./newsroom-legacy-evidence-depth";
import type { ClusterableFeedItem, StoryCluster } from "./story-clustering";

const detailedBody = (start: number, count: number) =>
  Array.from({ length: count }, (_, index) =>
    `The public record for district ${start + index} documented a separate hearing, an agency decision, and the official date of its next procedural step.`
  ).join(" ");

function source(
  id: number,
  body: string,
  url = `https://independent${id}.example.com/state-news/report-${id}`,
): ClusterableFeedItem {
  return {
    id, link: url, source: `Publisher ${id}`,
    title: "State officials publish the detailed verified public hearing record for residents",
    description: "The published original record describes several specific state agency decisions.",
    extracted_body: body,
    pub_date: "2026-11-07T12:00:00Z",
  };
}

function cluster(primary: ClusterableFeedItem, more: ClusterableFeedItem[] = []): StoryCluster {
  return {
    primary,
    members: more.map((item, i) => ({ ...item, combinationScore: 90, overlapTerms: [`event-${i}`] })),
    score: 90, sourceCount: 1 + more.length, strongMerge: more.length > 0,
  };
}

describe("legacy newsroom publisher original-evidence preflight", () => {
  it("holds a thin RSS-only item before paid AI, rather than counting synthesized packet headers", () => {
    const item = source(1, "");
    item.description = "One short summary provided in an RSS item.";
    const result = assessLegacyNewsroomEvidenceDepth(cluster(item));
    expect(result.eligible).toBe(false);
    expect(result.evidenceChars).toBeLessThan(5000);
    expect(result.requiredChars).toBe(5000);
  });

  it("admits a genuine long original source through to the unchanged strict publication validator", () => {
    const result = assessLegacyNewsroomEvidenceDepth(cluster(source(1, detailedBody(1, 85))));
    expect(result.evidenceChars).toBeGreaterThanOrEqual(5000);
    expect(result.eligible).toBe(true);
  });

  it("does not double-count the same long story republished under another hostname", () => {
    const identicalCopy = detailedBody(1, 34);
    const a = assessLegacyNewsroomEvidenceDepth(cluster(source(1, identicalCopy)));
    const mirrored = assessLegacyNewsroomEvidenceDepth(cluster(
      source(1, identicalCopy), [source(2, identicalCopy)],
    ));
    expect(a.eligible).toBe(false);
    expect(mirrored.evidenceChars).toBe(a.evidenceChars);
    expect(mirrored.eligible).toBe(false);
  });

  it("excludes Google News discovery items even when attached text is long", () => {
    const discovery = source(2, detailedBody(1, 100), "https://news.google.com/rss/articles/CBMiABC");
    const result = assessLegacyNewsroomEvidenceDepth(cluster(source(1, ""), [discovery]));
    expect(result.sourceUrls).toBe(1);
    expect(result.eligible).toBe(false);
  });

  it("gates both single-source and multi-source AI entry points without modifying the quality floor", () => {
    const writer = readFileSync("src/lib/multi-source-publish.ts", "utf8");
    expect(writer.match(/assessLegacyNewsroomEvidenceDepth\(cluster\)/g)).toHaveLength(2);
    expect(writer.indexOf("assessLegacyNewsroomEvidenceDepth(cluster)")).toBeLessThan(
      writer.indexOf("const singleResult = await publishSingleSourceWithPrimaryRecord"),
    );
    expect(writer.lastIndexOf("assessLegacyNewsroomEvidenceDepth(cluster)")).toBeLessThan(
      writer.lastIndexOf("const result = await publishLegacySingleFeedItem"),
    );
    expect(writer).toContain("insufficient original publisher evidence");
    const legacy = readFileSync("src/lib/ingest-feeds-legacy.ts", "utf8");
    expect(legacy).toContain("runEditorialRewrite<Rewrite>");
    expect(legacy).toContain("if (words < target)");
    const newsroom = readFileSync("src/routes/api/public/hooks/generate-newsroom.ts", "utf8");
    expect(newsroom).toContain("const STANDARD_MIN_SOURCE_EVIDENCE_CHARS = 5_000");
    expect(newsroom).toContain("const LONG_FORM_MIN_SOURCE_EVIDENCE_CHARS = 9_000");
  });
});
