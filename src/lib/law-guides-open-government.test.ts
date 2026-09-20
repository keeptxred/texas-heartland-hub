import { describe, expect, it } from "vitest";
import { ALL_GUIDES } from "@/data/all-guides";
import { isLawGuideIndexable, lawGuidesForTopic, validateLawGuideMeta } from "@/lib/law-guides";

const EXPECTED = [
  "texas-public-information-act-request-guide",
  "texas-public-information-act-deadlines",
  "texas-public-information-act-costs",
  "texas-public-information-act-exceptions",
  "texas-public-information-act-complaint-enforcement",
  "texas-open-meetings-notice-law",
  "texas-open-meetings-public-comment-law",
  "texas-open-meetings-closed-session-law",
  "texas-open-meetings-recording-law",
  "texas-open-meetings-minutes-records-law",
];

describe("Open government evergreen guide registry", () => {
  it("registers exactly ten verified open-government guides", () => {
    const verified = lawGuidesForTopic("open-government").filter((guide) => guide.status === "verified");
    expect(verified.map((guide) => guide.slug).sort()).toEqual([...EXPECTED].sort());
    expect(verified).toHaveLength(10);

    for (const meta of verified) {
      expect(meta.canonicalPath).toBe(`/guides/${meta.slug}`);
      expect(meta.lastVerified).toBe("2026-08-15");
      expect(meta.statutes?.length).toBeGreaterThan(0);
      expect(meta.sources?.some((source) => source.primary)).toBe(true);
      expect(validateLawGuideMeta(meta)).toEqual([]);
      expect(isLawGuideIndexable(meta.slug)).toBe(true);
    }
  });

  it("keeps open-government registry and public guide content aligned", () => {
    for (const slug of EXPECTED) {
      const guide = ALL_GUIDES[slug];
      expect(guide).toBeDefined();
      expect(guide.slug).toBe(slug);
      expect(guide.updated).toBe("2026-08-15");
      expect(guide.pillarHref).toBe("/laws");
      expect(guide.keyTakeaways.length).toBeGreaterThanOrEqual(4);
      expect(guide.sections.length).toBeGreaterThanOrEqual(4);
      expect(guide.faq.length).toBeGreaterThanOrEqual(3);
      expect(guide.sources.length).toBeGreaterThanOrEqual(2);
      expect(guide.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
    }
  });

  it("locks core Public Information Act procedure", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-public-information-act-request-guide")).toContain("HB 4214");
    expect(text("texas-public-information-act-request-guide")).toContain("designated");
    expect(text("texas-public-information-act-deadlines")).toContain("10th business day");
    expect(text("texas-public-information-act-deadlines")).toContain("body-worn-camera");
    expect(text("texas-public-information-act-costs")).toContain("$40");
    expect(text("texas-public-information-act-costs")).toContain("50 or fewer pages");
    expect(text("texas-public-information-act-exceptions")).toContain("Section 552.101");
    expect(text("texas-public-information-act-complaint-enforcement")).toContain("Section 552.321");
  });

  it("locks core Open Meetings Act access rules", () => {
    const text = (slug: string) => {
      const guide = ALL_GUIDES[slug];
      return [...guide.keyTakeaways, ...guide.sections.flatMap((section) => section.paragraphs ?? [])].join(" ");
    };

    expect(text("texas-open-meetings-notice-law")).toContain("72 hours");
    expect(text("texas-open-meetings-public-comment-law")).toContain("before or during");
    expect(text("texas-open-meetings-public-comment-law")).toContain("public criticism");
    expect(text("texas-open-meetings-closed-session-law")).toContain("final action");
    expect(text("texas-open-meetings-closed-session-law")).toContain("open meeting");
    expect(text("texas-open-meetings-recording-law")).toContain("Section 551.023");
    expect(text("texas-open-meetings-minutes-records-law")).toContain("Section 551.022");
    expect(text("texas-open-meetings-minutes-records-law")).toContain("public records");
  });

  it("marks the HB 4214 request-address change with its 2025 effective date", () => {
    const metadata = Object.fromEntries(lawGuidesForTopic("open-government").map((guide) => [guide.slug, guide]));
    expect(metadata["texas-public-information-act-request-guide"]?.effectiveDate).toContain("June 20, 2025");
    expect(metadata["texas-public-information-act-request-guide"]?.effectiveDate).toContain("HB 4214");
  });
});
