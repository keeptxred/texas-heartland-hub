import { describe, expect, it } from "vitest";
import { hasHeroVisualReadinessProvenance } from "./article-hero-readiness";
import { getArticleImageAttribution } from "./article-image-attribution";
import { imageValidationDomainGuidance } from "./featured-image-cloudflare";
import type { SubjectExtract } from "./featured-image-core";

const protestUrl =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Crowd_at_the_Texas_State_Capitol_for_the_No_Kings_Day_Protest_on_June_14,_2025_(54604569560).jpg";
const iceUrl =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/U_S_Immigration_and_Customs_Enforcement_conducts_Operation_Secure_Streets_(50044962302).jpg";

function subject(title: string, domain: SubjectExtract["domain"]): SubjectExtract {
  return {
    title,
    firstParagraph: title,
    entities: [],
    locations: ["Austin", "Texas"],
    domain,
    concreteSubject: title,
  };
}

describe("strict incident and protest hero relevance", () => {
  it("rejects empty roadway imagery for an ICE shooting story", () => {
    const guidance = imageValidationDomainGuidance(
      subject("ICE officer shoots man in North Austin", "border"),
    );
    expect(guidance).toContain("empty roadway");
    expect(guidance).toContain("does NOT pass");
    expect(guidance).toContain("synthetic reenactment");
  });

  it("requires visible protest activity for protest stories", () => {
    const guidance = imageValidationDomainGuidance(
      subject("Protesters Gather at Texas Capitol a Day After Austin ICE Shooting", "politics"),
    );
    expect(guidance).toContain("visible protest activity");
    expect(guidance).toContain("capitol-only exterior");
    expect(guidance).toContain("not the reported event");
  });

  it("keeps only the exact manually reviewed archive replacements ready", () => {
    expect(hasHeroVisualReadinessProvenance(
      "authoritative-image-exempt: manually reviewed exact-activity archive photograph",
      protestUrl,
      "2026-09-22-protesters-gather-at-texas-capitol-a-day-after-austin-ice-shooting",
    )).toBe(true);
    expect(hasHeroVisualReadinessProvenance(
      "authoritative-image-exempt: manually reviewed ICE archive photograph",
      iceUrl,
      "2026-09-22-ice-officer-shoots-man-in-north-austin",
    )).toBe(true);
    expect(hasHeroVisualReadinessProvenance(
      "authoritative-image-exempt: manually reviewed Commons photo",
      protestUrl,
      "unrelated-story",
    )).toBe(false);
  });

  it("registers truthful visible license/source metadata for both replacements", () => {
    expect(getArticleImageAttribution(protestUrl)).toMatchObject({
      credit: "Andy Thrasher",
      licenseName: "CC0 1.0",
    });
    expect(getArticleImageAttribution(iceUrl)).toMatchObject({
      credit: "U.S. Immigration and Customs Enforcement / Ron Rogers",
      licenseName: "Public domain (U.S. Department of Homeland Security / ICE work)",
    });
  });
});
