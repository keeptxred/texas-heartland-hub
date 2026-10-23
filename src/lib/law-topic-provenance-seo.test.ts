import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getLawTopic } from "@/data/law-topics";

const page = readFileSync(new URL("../components/law-topic-page.tsx", import.meta.url), "utf8");
const hub = readFileSync(new URL("../routes/laws.index.tsx", import.meta.url), "utf8");

describe("law topic publication and SEO provenance", () => {
  it("does not mislabel a prior law review as the original publication date", () => {
    const older = getLawTopic("property-tax-law");
    expect(older).toBeDefined();
    expect(older?.published).toBeUndefined();
    expect(page).not.toContain("datePublished: topic.updated");
    expect(page).toContain("citation: topic.sources.map((source) => source.url)");
    expect(page).toContain('isPartOf: { "@type": "CollectionPage"');
    expect(page).toContain("topic.published ? { datePublished: topic.published }");
  });
  it("retains known publication dates and separate review dates for new guides", () => {
    for (const slug of [
      "driving-traffic-insurance-law",
      "landlord-tenant-rentals-law",
      "employment-wages-workplace-rights-law",
      "consumer-protection-deceptive-trade-law",
      "family-custody-child-support-law",
      "wills-probate-inheritance-law",
      "criminal-offenses-penalties-law",
    ]) {
      const topic = getLawTopic(slug);
      expect(topic?.published).toBe("2026-10-23");
      expect(topic?.updated).toBe("2026-10-23");
    }
  });
  it("keeps the laws hub SEO copy evergreen without claiming every 2026 law is covered", () => {
    expect(hub).not.toContain("every major 2026 law");
    expect(hub).not.toContain("major bills that took effect in 2026");
    expect(hub).toContain("Explore verified Texas law guides");
  });
});
