import { describe, expect, it } from "vitest";
import { applyGeneratedNewsAuthority } from "@/lib/article-authority";
import { STATIC_AUTHORITY_ENTITIES } from "@/lib/authority-entity-registry";
import { authorityEntityPath } from "@/lib/authority-entity-paths";

describe("generated news authority enrichment", () => {
  it("makes a one-source rewrite transparent without claiming original reporting", () => {
    const result = applyGeneratedNewsAuthority({
      kind: "news",
      sourceName: "The Texan",
      sourceUrl: "https://thetexan.news/example",
      internalLinks: [{ label: "Texas Bills", href: "/bills" }],
      bodyJson: {
        intro: ["Texas update."],
        sections: [{ heading: "Texas relevance", paragraphs: ["Relevant to Texans."] }],
        sources: [{ label: "The Texan — original report", url: "https://thetexan.news/example" }],
        keyTakeaways: ["One"],
      },
    });
    const body = result.bodyJson as { sections: Array<{ heading?: string; paragraphs?: string[] }>; sources: Array<{ label?: string }>; authority: Record<string, unknown> };
    expect(result.flags).toContain("single_source_aggregation");
    expect(body.sources[0].label).toContain("reporting source");
    expect(body.sections.some((section) => section.heading === "How This Story Was Built")).toBe(true);
    expect(body.sections.flatMap((section) => section.paragraphs ?? []).join(" ")).toContain("not presented as original Keep TX Red reporting");
    expect(body.sections.flatMap((section) => section.paragraphs ?? []).join(" ")).toContain("/sources/the-texan");
    expect(body.sections.flatMap((section) => section.paragraphs ?? []).join(" ")).toContain("/bills");
    expect(body.authority.model).toBe("single-source-rewrite");
  });

  it("records primary-source presence without adding a single-source warning flag", () => {
    const result = applyGeneratedNewsAuthority({
      kind: "news",
      sourceName: "Texas Secretary of State",
      sourceUrl: "https://www.sos.state.tx.us/elections/",
      bodyJson: {
        sections: [],
        sources: [{ label: "Texas Secretary of State", url: "https://www.sos.state.tx.us/elections/" }],
      },
    });
    const body = result.bodyJson as { authority: Record<string, unknown>; sources: Array<{ label?: string }> };
    expect(result.flags).not.toContain("single_source_aggregation");
    expect(body.authority.primarySourceCount).toBe(1);
    expect(body.sources[0].label).toContain("primary / official source");
  });

  it("preserves an explicit primary-source verdict for an uncatalogued official record", () => {
    const result = applyGeneratedNewsAuthority({
      kind: "news",
      bodyJson: {
        sections: [],
        sources: [{
          label: "County Elections Office — primary / official source",
          url: "https://elections.example.gov/results/2026",
        }],
      },
    });
    const body = result.bodyJson as { authority: Record<string, unknown>; sources: Array<{ label?: string }> };
    expect(result.flags).not.toContain("single_source_aggregation");
    expect(body.authority.primarySourceCount).toBe(1);
    expect(body.sources[0].label).toBe("County Elections Office — primary / official source");
  });

  it("adds exact verified authority entities ahead of generic internal resources", () => {
    const entity = STATIC_AUTHORITY_ENTITIES.find(
      (candidate) => candidate.entityType === "legislator" && candidate.active && candidate.lastVerified && candidate.sourceOfTruth?.url,
    );
    expect(entity).toBeTruthy();
    if (!entity) return;

    const result = applyGeneratedNewsAuthority({
      kind: "news",
      internalLinks: [{ label: "Texas Bills", href: "/bills" }],
      bodyJson: {
        intro: [`${entity.name} discussed the proposal at the Capitol.`],
        sections: [],
        sources: [],
      },
    });
    const body = result.bodyJson as {
      sections: Array<{ heading?: string; paragraphs?: string[] }>;
      authority: Record<string, unknown>;
    };
    const related = body.sections.find((section) => section.heading === "Related Keep TX Red Resources");
    expect(related?.paragraphs?.[0]).toContain(authorityEntityPath(entity.entityType, entity.slug));
    expect(related?.paragraphs?.join(" ")).toContain("/bills");
    expect(body.authority.contextualAuthorityLinkCount).toBeGreaterThanOrEqual(1);
  });

  it("does not alter non-news content", () => {
    const bodyJson = { sections: [{ heading: "Guide", paragraphs: ["Evergreen content"] }] };
    const result = applyGeneratedNewsAuthority({ kind: "evergreen", bodyJson });
    expect(result.bodyJson).toEqual(bodyJson);
    expect(result.flags).toEqual([]);
  });
});
