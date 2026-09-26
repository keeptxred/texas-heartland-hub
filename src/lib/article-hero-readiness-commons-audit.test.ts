import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("stored hero Wikimedia audit derivatives", () => {
  const route = fs.readFileSync(
    new URL("../routes/api/public/hooks/article-hero-readiness-audit.ts", import.meta.url),
    "utf8",
  );
  const readiness = fs.readFileSync(new URL("./article-hero-readiness.ts", import.meta.url), "utf8");

  it("asks Commons for a bounded derivative plus source identity metadata", () => {
    expect(route).toContain("const COMMONS_AUDIT_WIDTH = 1600;");
    expect(route).toContain('endpoint.searchParams.set("iiprop", "extmetadata|url|size|mime")');
    expect(route).toContain('endpoint.searchParams.set("iiurlwidth", String(COMMONS_AUDIT_WIDTH))');
    expect(route).toContain("thumburl?: string;");
    expect(route).toContain("auditImageUrl: imageInfo?.thumburl?.trim() || null");
    expect(route).toContain("originalByteSize");
  });

  it("validates derivative pixels but keeps the canonical source URL when accepted", () => {
    expect(route).toContain("const auditImageUrl = commonsAudit.auditImageUrl || candidate;");
    expect(route).toContain("fetchHeroBytes(auditImageUrl, request.url)");
    expect(route).toContain("candidateUrl: candidate");
    expect(route).toContain("sourceMetadata: commonsAudit.sourceMetadata");
    expect(route).toContain("acceptValidatedHero(db, row, candidate, verdict.reason)");
    expect(route).toContain("auditDerivativeUsed");
  });

  it("keeps the existing byte and host safety gates instead of trusting arbitrary thumbnail URLs", () => {
    expect(route).toContain("const MAX_IMAGE_BYTES = 15 * 1024 * 1024;");
    expect(route).toContain("resolveAuditableHeroUrl(value, requestUrl)");
    expect(route).toContain("Hero redirect left the guarded automatic-audit host policy");
    expect(readiness).toContain('"upload.wikimedia.org"');
    expect(readiness).toContain('"commons.wikimedia.org"');
  });

  it("audits historical failed rows that still expose an ungoverned canonical hero", () => {
    expect(route).toContain('return (status === "ready" || status === "failed")');
    expect(route).toContain("!hasHeroVisualReadinessProvenance(row.image_validation_note, targetUrl(row), row.slug)");
    expect(route).toContain("Historical rows can still carry a canonical hero");
  });

  it("does not let Commons metadata weaken the strict data-center visual rule", () => {
    expect(readiness).toContain("A plain brick, office-like, residential-looking, warehouse-like, or windowless building exterior with no visible data-center infrastructure does not qualify");
    expect(readiness).toContain("filename, caption, source page, or metadata identifies it as a data center");
  });
});
