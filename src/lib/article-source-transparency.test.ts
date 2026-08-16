import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { buildArticleSourceTransparency, canonicalSourceUrl } from "@/lib/article-source-transparency";

describe("article source transparency", () => {
  it("prefers durable provenance and puts primary records first", () => {
    const result = buildArticleSourceTransparency({
      durableSourceCount: 3,
      durableIndependentSourceCount: 2,
      durableSources: [
        {
          source_name: "Local TV",
          source_family: "local-tv",
          source_url: "https://example.com/report?utm_source=x",
          headline: "Local report",
          relationship_type: "supporting",
          is_primary_record: false,
          is_independent_source: true,
        },
        {
          source_name: "Texas Secretary of State",
          source_family: "texas.gov",
          canonical_url: "https://www.sos.state.tx.us/official-record",
          headline: "Official filing",
          relationship_type: "primary",
          is_primary_record: true,
          is_independent_source: true,
        },
      ],
      fallbackSources: [{ label: "Fallback", url: "https://fallback.example/story" }],
    });

    expect(result.provenanceMode).toBe("durable_cluster");
    expect(result.sourceCount).toBe(3);
    expect(result.independentSourceCount).toBe(2);
    expect(result.primaryRecordCount).toBe(1);
    expect(result.singleSource).toBe(false);
    expect(result.sources[0]?.label).toBe("Texas Secretary of State");
    expect(result.sources.some((source) => source.label === "Fallback")).toBe(false);
  });

  it("deduplicates tracking variants of the same source URL", () => {
    const result = buildArticleSourceTransparency({
      fallbackSources: [
        { label: "Report A", url: "https://example.com/story?utm_source=facebook&fbclid=123" },
        { label: "Report A duplicate", url: "https://example.com/story" },
      ],
    });
    expect(result.sources).toHaveLength(1);
    expect(canonicalSourceUrl(result.sources[0]?.url)).toBe("https://example.com/story");
  });

  it("flags one independent source even when same-lineage copies are retained", () => {
    const result = buildArticleSourceTransparency({
      durableSourceCount: 2,
      durableIndependentSourceCount: 1,
      durableSources: [
        { source_name: "Wire", source_url: "https://wire.example/a", is_independent_source: true },
        { source_name: "Syndicated copy", source_url: "https://paper.example/a", is_independent_source: false },
      ],
    });
    expect(result.sourceCount).toBe(2);
    expect(result.independentSourceCount).toBe(1);
    expect(result.singleSource).toBe(true);
  });

  it("falls back to body_json sources when no durable cluster is available", () => {
    const result = buildArticleSourceTransparency({
      fallbackSources: [{ label: "Texas Tribune", url: "https://example.com/story" }],
    });
    expect(result.provenanceMode).toBe("body_json_fallback");
    expect(result.sourceCount).toBe(1);
    expect(result.sources[0]?.label).toBe("Texas Tribune");
  });

  it("keeps internal clustering diagnostics out of the public server selection", () => {
    const source = fs.readFileSync("src/lib/article-source-transparency.functions.ts", "utf8");
    const publicSelect = source.match(/news_event_cluster_sources[\s\S]*?\.select\("([^"]+)"\)/)?.[1] ?? "";
    expect(publicSelect).toContain("source_name");
    expect(publicSelect).toContain("is_primary_record");
    expect(publicSelect).not.toContain("raw_text");
    expect(publicSelect).not.toContain("normalized_text");
    expect(publicSelect).not.toContain("match_score");
    expect(publicSelect).not.toContain("match_reason");
  });
});
