import { describe, expect, it } from "vitest";
import {
  buildExhaustedHeroRecoveryNote,
  buildHeroReadinessSubject,
  governedExactEntityGraphicUrl,
  hasHeroVisualReadinessProvenance,
  isAuthoritativeOfficialGraphic,
  isGovernedExactEntityGraphic,
  isHeroReadinessQuarantined,
  resolveAuditableHeroUrl,
} from "./article-hero-readiness";

describe("article hero visual readiness", () => {
  it("does not treat editorial remediation metadata as visual validation", () => {
    expect(hasHeroVisualReadinessProvenance(
      "Primary-subject remediation: replaced a CERN image with Henson Data Center Dallas.jpg",
    )).toBe(false);
  });

  it("accepts actual visual-validation provenance across stored-photo policy versions", () => {
    expect(hasHeroVisualReadinessProvenance("cloudflare-vision ok: direct story match")).toBe(true);
    expect(hasHeroVisualReadinessProvenance("stored-cloudflare-vision ok: direct story match")).toBe(true);
    expect(hasHeroVisualReadinessProvenance("stored-cloudflare-vision-v2 ok: representative archive photo passed")).toBe(true);
    expect(hasHeroVisualReadinessProvenance("stored-cloudflare-vision-v3 ok: entity-aware archive photo passed")).toBe(true);
    expect(hasHeroVisualReadinessProvenance("stored-cloudflare-vision-v4 ok: source-grounded archive photo passed")).toBe(true);
    expect(hasHeroVisualReadinessProvenance("stored-cloudflare-vision-v19 ok: future version passed")).toBe(true);
    expect(hasHeroVisualReadinessProvenance(
      "authoritative-image-exempt: official NHC forecast graphic",
      "https://www.nhc.noaa.gov/storm_graphics/AT05/AL052026_3day_cone.png",
    )).toBe(true);
    expect(hasHeroVisualReadinessProvenance(
      "authoritative-image-exempt: Wikimedia Commons metadata manually verified",
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/TexasStateCapitolBuilding.jpg",
    )).toBe(false);
    expect(hasHeroVisualReadinessProvenance(
      "authoritative-image-exempt: official NHC forecast graphic",
    )).toBe(false);
    expect(hasHeroVisualReadinessProvenance("verified-shared-hero: reused validated infrastructure hero")).toBe(false);
    expect(hasHeroVisualReadinessProvenance("verified-shared-hero: cloudflare-vision ok: reused validated infrastructure hero")).toBe(true);
  });

  it("rechecks older rejects under v4 and quarantines only v4 rejects", () => {
    for (const note of [
      "stored-cloudflare-vision rejected: exact-action rule rejected the archive photo",
      "stored-cloudflare-vision-v2 rejected: data-center override rejected the central entity",
      "stored-cloudflare-vision-v3 rejected: source identity was not available",
    ]) {
      expect(isHeroReadinessQuarantined({
        slug: "test-story",
        image_candidate_url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/example.jpg",
        image_generation_status: "failed",
        image_validation_note: note,
        quality_flags: ["image_requires_visual_validation"],
      })).toBe(false);
    }

    expect(isHeroReadinessQuarantined({
      slug: "test-story",
      image_candidate_url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/example.jpg",
      image_generation_status: "failed",
      image_validation_note: "stored-cloudflare-vision-v4 rejected: source-grounded rule still failed",
      quality_flags: ["image_requires_visual_validation"],
    })).toBe(true);

    expect(isHeroReadinessQuarantined({
      slug: "test-story",
      image_candidate_url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/example.jpg",
      image_generation_status: "ready",
      image_validation_note: "Primary-subject remediation: awaiting first governed audit",
      quality_flags: [],
    })).toBe(false);
  });

  it("requeues a previously rejected candidate when it is now the governed exact-entity graphic", () => {
    const lupeSlug = "2026-09-17-more-young-people-are-getting-involved-with-south-texas-civil-rights-group-amid-";
    const lupeUrl = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lupe_logo_jpeg.jpg";

    expect(isHeroReadinessQuarantined({
      slug: lupeSlug,
      image_candidate_url: lupeUrl,
      image_generation_status: "failed",
      image_validation_note: "stored-cloudflare-vision-v4 rejected: older policy treated the identity graphic as too generic",
      quality_flags: ["image_requires_visual_validation"],
    })).toBe(false);

    expect(isHeroReadinessQuarantined({
      slug: txseSlug,
      image_candidate_url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Trading_Floor_in_the_Chicago_Board_of_Trade_Building.png",
      image_generation_status: "failed",
      image_validation_note: "stored-cloudflare-vision-v4 rejected: stale pre-allowlist candidate",
      quality_flags: ["image_requires_visual_validation"],
    })).toBe(false);

    expect(isHeroReadinessQuarantined({
      slug: "unrelated-story",
      image_candidate_url: lupeUrl,
      image_generation_status: "failed",
      image_validation_note: "stored-cloudflare-vision-v4 rejected: ordinary failed candidate",
      quality_flags: ["image_requires_visual_validation"],
    })).toBe(true);
  });

  it("keeps an exhausted one-shot generated repair quarantined", () => {
    const note = buildExhaustedHeroRecoveryNote(
      "v4",
      "stored candidate omitted the defining named subject",
      "Generated image failed Cloudflare story-match validation",
    );

    expect(note).toContain("stored-cloudflare-vision-v4 rejected:");
    expect(note).toContain("generated recovery failed:");
    expect(isHeroReadinessQuarantined({
      slug: "test-story",
      image_candidate_url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/example.jpg",
      image_generation_status: "failed",
      image_validation_note: note,
      quality_flags: ["image_requires_visual_validation"],
    })).toBe(true);
  });

  it("allows exact-entity graphics only for the matching governed article and URL", () => {
    const lupeSlug = "2026-09-17-more-young-people-are-getting-involved-with-south-texas-civil-rights-group-amid-";
    const lupeUrl = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Lupe_logo_jpeg.jpg";
    const txseSlug = "2026-09-10-texas-stock-exchange-first-primary-listings";
    const txseUrl = "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/TXSE_logo_Sep_2024.svg/1280px-TXSE_logo_Sep_2024.svg.png";

    expect(governedExactEntityGraphicUrl(lupeSlug)).toBe(lupeUrl);
    expect(governedExactEntityGraphicUrl(txseSlug)).toBe(txseUrl);
    expect(governedExactEntityGraphicUrl("unrelated-story")).toBeNull();
    expect(isGovernedExactEntityGraphic(lupeSlug, lupeUrl)).toBe(true);
    expect(isGovernedExactEntityGraphic(txseSlug, txseUrl)).toBe(true);
    expect(isGovernedExactEntityGraphic("unrelated-story", lupeUrl)).toBe(false);
    expect(isGovernedExactEntityGraphic(lupeSlug, txseUrl)).toBe(false);

    expect(hasHeroVisualReadinessProvenance(
      "exact-entity-graphic-v1 ok: governed identity graphic",
      lupeUrl,
      lupeSlug,
    )).toBe(true);
    expect(hasHeroVisualReadinessProvenance(
      "exact-entity-graphic-v1 ok: governed identity graphic",
      lupeUrl,
      "unrelated-story",
    )).toBe(false);
  });

  it("exempts only tightly scoped authoritative NOAA graphics", () => {
    expect(isAuthoritativeOfficialGraphic("https://www.nhc.noaa.gov/storm_graphics/AT05/AL052026_3day_cone.png")).toBe(true);
    expect(isAuthoritativeOfficialGraphic("https://www.aoml.noaa.gov/wp-content/uploads/2026/06/2026-Atlantic-Hurricane-Outlook-PIE-CHART-ENGLISH-1024x576.jpg")).toBe(true);
    expect(isAuthoritativeOfficialGraphic("https://commons.wikimedia.org/wiki/Special:Redirect/file/Henson_Data_Center_Dallas.jpg")).toBe(false);
  });

  it("keeps the actual headline while applying the data-center visual-readiness rule", () => {
    const subject = buildHeroReadinessSubject({
      slug: "2026-08-27-gov-abbott-orders-pause-on-data-center-approvals",
      title: "Gov. Abbott orders pause on data center approvals",
      category: "Politics",
      dek: "Texas pauses approvals while regulators review energy and water use.",
      affected_regions: ["Texas"],
      body_json: { intro: ["The pause applies to large data-center projects seeking grid connections."] },
    });

    expect(subject.title).toBe("Gov. Abbott orders pause on data center approvals");
    expect(subject.domain).toBe("politics");
    expect(subject.concreteSubject).toContain("central named person");
    expect(subject.concreteSubject).toContain("industrial cooling equipment");
    expect(subject.concreteSubject).toContain("plain brick");
    expect(subject.concreteSubject).toContain("does not qualify merely because");
  });

  it("does not erase a central named person just because the story mentions a data center", () => {
    const subject = buildHeroReadinessSubject({
      slug: "2026-08-07-charley-crockett-data-center-social-media-dispute",
      title: "Charley Crockett’s Texas Data-Center Post Sets Off a Social-Media Dispute",
      category: "Texas News",
      dek: "The singer's post triggered a debate over data centers.",
      affected_regions: ["Texas"],
      body_json: { intro: ["Charley Crockett became the central figure in the dispute after publishing the post."] },
    });

    expect(subject.title).toContain("Charley Crockett");
    expect(subject.concreteSubject).toContain("central named person");
    expect(subject.concreteSubject).toContain("data-center story");
  });

  it("uses explicit sports taxonomy over noisy text-domain inference", () => {
    const subject = buildHeroReadinessSubject({
      slug: "2026-09-06-texas-a-m-dominates-missouri-state-in-season-opener",
      title: "Texas A&M Dominates Missouri State in Season Opener",
      category: "Sports",
      dek: "Texas A&M opened the season with a football win.",
      body_json: { intro: ["The Aggies controlled the football game from the opening quarter."] },
    });
    expect(subject.domain).toBe("sports");
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
    expect(resolveAuditableHeroUrl("https://upload.wikimedia.org/wikipedia/commons/a/ab/example.jpg", requestUrl)?.hostname).toBe("upload.wikimedia.org");
    expect(resolveAuditableHeroUrl("https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/example.jpg/1600px-example.jpg", requestUrl)?.hostname).toBe("thumb.wikimedia.org");
    expect(resolveAuditableHeroUrl("https://meta.wikimedia.org/wiki/example", requestUrl)).toBeNull();
    expect(resolveAuditableHeroUrl("https://evil.thumb.wikimedia.org.example.com/example.jpg", requestUrl)).toBeNull();
    expect(resolveAuditableHeroUrl("https://example.com/hotlinked.jpg", requestUrl)).toBeNull();
    expect(resolveAuditableHeroUrl("http://commons.wikimedia.org/example.jpg", requestUrl)).toBeNull();
  });
});
