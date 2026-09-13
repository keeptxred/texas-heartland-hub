import { describe, expect, it } from "vitest";
import {
  buildHeroReadinessSubject,
  hasHeroVisualReadinessProvenance,
  isAuthoritativeOfficialGraphic,
  isHeroReadinessQuarantined,
  resolveAuditableHeroUrl,
} from "./article-hero-readiness";

describe("article hero visual readiness", () => {
  it("does not treat editorial remediation metadata as visual validation", () => {
    expect(hasHeroVisualReadinessProvenance(
      "Primary-subject remediation: replaced a CERN image with Henson Data Center Dallas.jpg",
    )).toBe(false);
  });

  it("accepts only actual visual-validation provenance or the narrow official-graphic exemption", () => {
    expect(hasHeroVisualReadinessProvenance("cloudflare-vision ok: direct story match")).toBe(true);
    expect(hasHeroVisualReadinessProvenance("stored-cloudflare-vision ok: direct story match")).toBe(true);
    expect(hasHeroVisualReadinessProvenance("authoritative-image-exempt: official NHC forecast graphic")).toBe(true);
    expect(hasHeroVisualReadinessProvenance("verified-shared-hero: reused validated infrastructure hero")).toBe(false);
    expect(hasHeroVisualReadinessProvenance("verified-shared-hero: cloudflare-vision ok: reused validated infrastructure hero")).toBe(true);
  });

  it("recognizes rejected heroes already handed off to image recovery", () => {
    expect(isHeroReadinessQuarantined({
      image_candidate_url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/example.jpg",
      image_generation_status: "failed",
      image_validation_note: "stored-cloudflare-vision rejected: Hero fetch HTTP 403",
      quality_flags: ["image_requires_visual_validation"],
    })).toBe(true);

    expect(isHeroReadinessQuarantined({
      image_candidate_url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/example.jpg",
      image_generation_status: "ready",
      image_validation_note: "Primary-subject remediation: awaiting first governed audit",
      quality_flags: [],
    })).toBe(false);
  });

  it("exempts only tightly scoped authoritative NOAA graphics", () => {
    expect(isAuthoritativeOfficialGraphic("https://www.nhc.noaa.gov/storm_graphics/AT05/AL052026_3day_cone.png")).toBe(true);
    expect(isAuthoritativeOfficialGraphic("https://www.aoml.noaa.gov/wp-content/uploads/2026/06/2026-Atlantic-Hurricane-Outlook-PIE-CHART-ENGLISH-1024x576.jpg")).toBe(true);
    expect(isAuthoritativeOfficialGraphic("https://commons.wikimedia.org/wiki/Special:Redirect/file/Henson_Data_Center_Dallas.jpg")).toBe(false);
  });

  it("requires data-center infrastructure to be visually recognizable without metadata", () => {
    const subject = buildHeroReadinessSubject({
      slug: "2026-08-27-gov-abbott-orders-pause-on-data-center-approvals",
      title: "Gov. Abbott orders pause on data center approvals",
      dek: "Texas pauses approvals while regulators review energy and water use.",
      affected_regions: ["Texas"],
      body_json: { intro: ["The pause applies to large data-center projects seeking grid connections."] },
    });

    expect(subject.title).toBe("Texas data-center and electrical infrastructure");
    expect(subject.concreteSubject).toContain("industrial cooling equipment");
    expect(subject.concreteSubject).toContain("visible image content alone");
    expect(subject.concreteSubject).toContain("plain brick");
    expect(subject.concreteSubject).toContain("does not qualify");
  });

  it("requires ordinary story subjects to read from the pixels rather than hidden metadata", () => {
    const subject = buildHeroReadinessSubject({
      slug: "2026-09-10-example",
      title: "Texas agency opens new Austin office",
      dek: "The agency opened a new public-facing office in Austin.",
      affected_regions: ["Austin"],
      body_json: { intro: ["The office will handle public services and records requests."] },
    });
    expect(subject.concreteSubject).toContain("recognizable from visible image content alone");
    expect(subject.concreteSubject).toContain("filename");
    expect(subject.concreteSubject).toContain("source metadata");
  });

  it("limits automated stored-hero fetching to the site and governed reusable-image hosts", () => {
    const requestUrl = "https://keeptxred-site.freddy-coppola.workers.dev/api/public/hooks/article-hero-readiness-audit";
    expect(resolveAuditableHeroUrl("/api/public/article-image/example.jpg", requestUrl)?.hostname).toContain("workers.dev");
    expect(resolveAuditableHeroUrl("https://commons.wikimedia.org/wiki/Special:Redirect/file/example.jpg", requestUrl)?.hostname).toBe("commons.wikimedia.org");
    expect(resolveAuditableHeroUrl("https://example.com/hotlinked.jpg", requestUrl)).toBeNull();
    expect(resolveAuditableHeroUrl("http://commons.wikimedia.org/example.jpg", requestUrl)).toBeNull();
  });
});
