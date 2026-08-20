import { describe, expect, it } from "vitest";
import { GOVERNMENT_ENTITIES } from "@/lib/texas-government";

function words(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

describe("AdSense government entity readiness inventory", () => {
  it("keeps every sitemap-advertised government entity substantive and structurally authoritative", () => {
    const violations = GOVERNMENT_ENTITIES.flatMap((entity) => {
      const count = words([
        entity.name,
        entity.overview,
        entity.constitutionalResponsibilities,
        entity.currentOfficeholder,
        entity.officeholderNote,
        ...entity.constitutionalBasis,
        ...entity.history,
        ...entity.powers,
        ...entity.limitations,
        ...entity.faqs.flatMap((faq) => [faq.question, faq.answer]),
      ].join(" "));
      const blockers = [
        count < 700 ? `words=${count}<700` : "",
        entity.constitutionalBasis.length < 2 ? `constitutionalBasis=${entity.constitutionalBasis.length}<2` : "",
        entity.history.length < 3 ? `history=${entity.history.length}<3` : "",
        entity.powers.length < 4 ? `powers=${entity.powers.length}<4` : "",
        entity.limitations.length < 3 ? `limitations=${entity.limitations.length}<3` : "",
        entity.faqs.length < 4 ? `faqs=${entity.faqs.length}<4` : "",
        !entity.officialUrl.startsWith("https://") ? "officialUrl=missing" : "",
      ].filter(Boolean);
      return blockers.length ? [`${entity.slug}: ${blockers.join(", ")}`] : [];
    });
    expect(violations, violations.join("\n")).toEqual([]);
  });
});
