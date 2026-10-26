import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { isSyntheticNewsroomEvidence } from "./newsroom-evidence-integrity";

describe("original newsroom source evidence cannot be replaced by internally synthesized packets", () => {
  const writer = readFileSync("src/lib/ingest-feeds-legacy.ts", "utf8");
  const multisource = readFileSync("src/lib/multi-source-publish.ts", "utf8");
  const overdue = readFileSync("src/routes/api/public/hooks/publish-overdue-gap.ts", "utf8");

  it("rejects known internally synthesized source content", () => {
    expect(isSyntheticNewsroomEvidence("MULTI-SOURCE STORY PACKET.\nRAW SOURCE PACKET")).toBe(true);
    expect(isSyntheticNewsroomEvidence("STRUCTURED FACT LEDGER: verified fact")).toBe(true);
    expect(isSyntheticNewsroomEvidence("PRIMARY-RECORD-AUGMENTED SOURCE PACKET.\nSynthetic primary record synopsis")).toBe(true);
    expect(isSyntheticNewsroomEvidence("RELATED OFFICIAL RELEASE SERIES:\nAggregated editorial context")).toBe(true);
    expect(isSyntheticNewsroomEvidence("Official court record: a genuine published order.")).toBe(false);
  });

  it("keeps synthesis input ephemeral while preserving normal budget and preflight", () => {
    expect(writer).toContain("options: { sourceOverride?: string } = {}");
    expect(writer).toContain("isSyntheticNewsroomEvidence(storedBody) ? \"\" : storedBody");
    expect(writer).toContain("let extractedBody: string = sourceOverride ?? cachedBody");
    expect(writer).toContain("...(sourceOverride ? {} : { extracted_body: extractedBody || null })");
    expect(writer).toContain("assessRewritePreflight");
    expect(writer).toContain("claim_ai_rewrite_slot");
    expect(writer).toContain("assertRewriteableOrThrow");
    expect(multisource).toContain("sourceOverride: synthesisMaterial.slice(0, 26000)");
    expect(multisource).toContain("sourceOverride: augmentedSourceText.slice(0, 26000)");
    expect(multisource).not.toContain("update({ extracted_body: synthesisMaterial");
    expect(multisource).not.toContain("update({ extracted_body: augmentedSourceText");
  });

  it("never replaces original source text with a related-release-series narrative", () => {
    expect(overdue).toContain("async function prepareReleaseSeriesContext");
    expect(overdue).toContain("attachSeriesToPublishedArticle");
    expect(overdue).not.toContain("update({ extracted_body: combined })");
    expect(overdue).toContain("const result = await publishSingleFeedItem(gap.id)");
  });

  it("allows source-page hydration to recover already corrupted legacy rows", () => {
    const hydrator = readFileSync("src/lib/newsroom-source-page.server.ts", "utf8");
    const packets = readFileSync("src/routes/api/public/hooks/build-newsroom-research-packets.ts", "utf8");
    expect(hydrator).toContain("looksSyntheticNewsroomText(body)");
    expect(hydrator).toContain("PRIMARY-RECORD-AUGMENTED SOURCE PACKET");
    expect(hydrator).toContain("RELATED OFFICIAL RELEASE SERIES");
    const rss = readFileSync("src/lib/newsroom-firstparty-rss-body.ts", "utf8");
    expect(rss).toContain("PRIMARY-RECORD-AUGMENTED SOURCE PACKET");
    expect(rss).toContain("RELATED OFFICIAL RELEASE SERIES");
    expect(hydrator).toContain("extractReadableNewsroomHtml");
    expect(packets).toContain("shouldFetchNewsroomSourcePage");
    expect(packets).toContain('update({ extracted_body: result.body })');
  });
});
