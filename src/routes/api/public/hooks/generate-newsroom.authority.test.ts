import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getSourceAuthorityProfile, sourceAuthorityLabel } from "@/data/source-authority";

const sourcePath = fileURLToPath(new URL("./generate-newsroom.ts", import.meta.url));
const source = readFileSync(sourcePath, "utf8");

describe("newsroom authority contract", () => {
  it("publishes multi-source provenance and source-role labels", () => {
    expect(source).toContain("uniquePacketSources");
    expect(source).toContain("sourceAuthorityLabel(source)");
    expect(source).toContain('heading: "How This Story Was Built"');
    expect(source).toContain('heading: "Source Attribution"');
    expect(source).toContain("Source links are preserved below");
    expect(source).toContain("Inclusion of a source does not imply endorsement");
  });

  it("creates a what-we-know section and dated coverage timeline when evidence supports it", () => {
    expect(source).toContain('heading: "What We Know — Key Takeaways"');
    expect(source).toContain("coverageTimeline(packetSources)");
    expect(source).toContain('heading: "Coverage Timeline"');
    expect(source).toContain("timeline.length >= 2");
  });

  it("keeps weak single-source aggregation out of the index", () => {
    expect(source).toContain("sourceCount < 2 && primarySourceCount === 0");
    expect(source).toContain('"seo_noindex"');
    expect(source).toContain('"single_source_aggregation"');
  });
});

describe("source authority catalog", () => {
  it("recognizes primary Texas sources by name or domain", () => {
    expect(getSourceAuthorityProfile("Texas Legislature Online")?.slug).toBe("texas-legislature-online");
    expect(getSourceAuthorityProfile("https://capitol.texas.gov/BillLookup/History.aspx")?.slug).toBe("texas-legislature-online");
    expect(getSourceAuthorityProfile("Texas Secretary of State")?.kind).toBe("government");
  });

  it("does not overstate an unknown publisher as a primary source", () => {
    expect(sourceAuthorityLabel({ source: "Local News Outlet", url: "https://example.com/story" })).toBe("Local News Outlet — published source");
  });

  it("honors packet-level primary-source verification", () => {
    expect(sourceAuthorityLabel({ source: "Official record", url: "https://example.gov/record", isPrimarySource: true })).toBe("Official record — primary / official source");
  });
});
