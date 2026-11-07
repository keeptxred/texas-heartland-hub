import { describe, expect, it } from "vitest";
import { sourceAuthorityLabel, sourceUrlSupportsPrimaryRecord } from "@/data/source-authority";
import { applyGeneratedNewsAuthority } from "./article-authority";
import { newsroomHasPublisherDiversity } from "./newsroom-publication-preflight";
import type { ResearchPacketSource } from "./newsroom-research-packet";

function source(url: string, claimedPrimary = false): ResearchPacketSource {
  return {
    feedItemId: 1,
    title: "Local reporter documents a Texas House speaker announcement",
    source: "Community Impact — Texas Hyperlocal",
    url,
    publishedAt: "2026-11-07T12:00:00Z",
    description: "",
    extractedBody: "The reporter spoke with a state lawmaker about the leadership vote.",
    isPrimarySource: claimedPrimary,
    sourceReputationScore: 80,
  };
}

describe("newsroom primary source provenance correction", () => {
  it("does not promote Community Impact reporting to an official primary record from stale metadata", () => {
    const url = "https://communityimpact.com/lake-houston-humble-kingwood/texas-legislature/story";
    expect(sourceUrlSupportsPrimaryRecord(url, "Community Impact — Texas Hyperlocal")).toBe(false);
    expect(sourceAuthorityLabel({
      source: "Community Impact — Texas Hyperlocal", url, isPrimarySource: true,
    })).toBe("Community Impact — Texas Hyperlocal — published source");
    expect(newsroomHasPublisherDiversity([source(url, true)])).toBe(false);
  });

  it("honors genuine government records and profiled official non-government domains", () => {
    expect(sourceUrlSupportsPrimaryRecord("https://gov.texas.gov/news/post/verified-event", "Office of the Governor")).toBe(true);
    expect(sourceUrlSupportsPrimaryRecord("https://www.ercot.com/gridmktinfo/dashboards", "ERCOT")).toBe(true);
    expect(sourceUrlSupportsPrimaryRecord("https://example.gov/record", "Verified agency record")).toBe(true);
    expect(sourceUrlSupportsPrimaryRecord("https://example.com/story", "ERCOT")).toBe(false);
  });

  it("recomputes authority claims from the source URL instead of an old label", () => {
    const url = "https://communityimpact.com/central-austin/election/example";
    const result = applyGeneratedNewsAuthority({
      kind: "news",
      bodyJson: {
        intro: ["Source-backed article text about the outcome."],
        sections: [],
        sources: [
          { label: "Community Impact — Texas Hyperlocal — primary / official source", url },
          { label: "Dallas Observer — News — published source", url: "https://www.dallasobserver.com/news/example" },
        ],
      },
    });
    const body = result.bodyJson as { authority: { primarySourceCount: number; sourceCount: number }; sources: Array<{label: string}> };
    expect(body.authority.sourceCount).toBe(2);
    expect(body.authority.primarySourceCount).toBe(0);
    expect(body.sources[0].label).not.toContain("primary / official");
    const secondPass = applyGeneratedNewsAuthority({ kind: "news", bodyJson: result.bodyJson });
    expect((secondPass.bodyJson as { authority: { primarySourceCount: number } }).authority.primarySourceCount).toBe(0);
  });
});
