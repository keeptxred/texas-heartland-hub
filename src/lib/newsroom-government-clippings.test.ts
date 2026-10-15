import { describe, expect, it } from "vitest";
import { isGovernmentNewsClippingUrl } from "./newsroom-discovery-sources";
import { isPrimaryNewsSource } from "./newsroom-editorial-scoring";
import { isPrimaryRecordSource, independentPublisherFamilyCount } from "./publication-quality-gate";
import {
  newsroomHasPublisherDiversity,
  newsroomIndependentPublisherFamilyFromUrl,
  newsroomLeadSourceUrl,
  uniquePacketSources,
} from "./newsroom-publication-preflight";
import { sourceAuthorityLabel } from "@/data/source-authority";
import { applyGeneratedNewsAuthority } from "./article-authority";

const clip = "http://www.lrl.state.tx.us/cl.cfm?id=454959";
const publisher = "https://texasstandard.org/stories/texas-appeals-order-requiring-prison-air-conditioning-saying-it-puts-operations-at-risk/";

function packet(url: string, primary: boolean, score: number) {
  return {
    feedItemId: primary ? 5 : 6,
    title: "Texas prison air-conditioning appeal",
    source: primary ? "Texas Legislative Reference Library — Daily News Clips" : "Texas Standard",
    url,
    publishedAt: "2026-10-14T12:00:00Z",
    description: "",
    extractedBody: "Verified source reporting about a court appeal.",
    isPrimarySource: primary,
    sourceReputationScore: score,
  };
}

describe("legislative newspaper clipping provenance", () => {
  it("classifies ONLY newspaper-clipping pages as discovery, not genuine legislative records", () => {
    expect(isGovernmentNewsClippingUrl(clip)).toBe(true);
    expect(isGovernmentNewsClippingUrl("https://lrl.texas.gov/currentIssues/clips/lrlhome.cfm")).toBe(true);
    expect(isGovernmentNewsClippingUrl("https://www.lrl.state.tx.us/cl.cfm?id=1")).toBe(true);
    expect(isGovernmentNewsClippingUrl("https://lrl.texas.gov/legis/bill.cfm?id=12")).toBe(false);
    expect(isGovernmentNewsClippingUrl("https://capitol.texas.gov/BillLookup/History.aspx?LegSess=891&Bill=HB1")).toBe(false);
  });

  it("does not award government-primary or independent publisher credit for official clipping indexes", () => {
    expect(isPrimaryNewsSource("Texas Legislative Reference Library — Daily News Clips", clip)).toBe(false);
    expect(isPrimaryRecordSource({
      id: 1, title: "Texas appeals prison AC order", source: "Texas Legislative Reference Library",
      link: clip, description: "Government clipping references newspaper article",
      pub_date: "2026-10-14T12:00:00Z", extracted_body: "News reprint",
      internal_slug: null,
    } as never)).toBe(false);
    expect(newsroomIndependentPublisherFamilyFromUrl(clip)).toBeNull();
    expect(newsroomHasPublisherDiversity([packet(clip, true, 100), packet(publisher, false, 90)])).toBe(false);
    expect(newsroomLeadSourceUrl([packet(clip, true, 100), packet(publisher, false, 90)])).toBe(publisher);
    expect(uniquePacketSources([packet(clip, true, 100), packet(publisher, false, 90)])).toHaveLength(1);
  });

  it("excludes clipping indexes from primary-record publication and corroborating publisher count", () => {
    const entry = {
      id: 1, title: "Texas appeals prison AC order", source: "Texas Legislative Reference Library",
      link: clip, description: "A government-hosted digest of reporting",
      pub_date: "2026-10-14T12:00:00Z", extracted_body: "Clipped newspaper article", internal_slug: null,
    };
    expect(independentPublisherFamilyCount({ primary: entry, members: [] } as never)).toBe(0);
  });

  it("normalizes an erroneously primary-labeled clipping to secondary in authority citations", () => {
    expect(sourceAuthorityLabel({
      source: "Texas Legislative Reference Library — Daily News Clips",
      url: clip, isPrimarySource: true,
    })).toContain("newspaper clipping index (secondary discovery)");
    const result = applyGeneratedNewsAuthority({
      kind: "news",
      bodyJson: {
        intro: ["Published newspaper reporting about a Texas appeal"],
        sections: [],
        sources: [
          { label: "Texas Legislative Reference Library — Daily News Clips — primary / official source", url: clip },
          { label: "Texas Standard — reporting source", url: publisher },
        ],
      },
    });
    const body = result.bodyJson as {
      sources: Array<{ label: string; url: string }>;
      authority: { primarySourceCount: number; sourceCount: number };
    };
    expect(body.sources[0].label).toContain("secondary discovery");
    expect(body.sources[0].label).not.toContain("primary / official source");
    expect(body.authority.primarySourceCount).toBe(0);
    expect(body.authority.sourceCount).toBe(2);
  });
});
