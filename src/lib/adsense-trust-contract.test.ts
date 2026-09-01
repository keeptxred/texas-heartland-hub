import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { AUTHORS, EDITORIAL_BYLINE_DISCLOSURE } from "@/data/authors";

const rootSource = fs.readFileSync(new URL("../routes/__root.tsx", import.meta.url), "utf8");
const adSlotSource = fs.readFileSync(new URL("../components/ad-slot.tsx", import.meta.url), "utf8");
const siteNotFoundSource = fs.readFileSync(new URL("../components/site-not-found.tsx", import.meta.url), "utf8");
const authorsIndexSource = fs.readFileSync(new URL("../routes/authors.index.tsx", import.meta.url), "utf8");
const authorProfileSource = fs.readFileSync(new URL("../routes/authors.$slug.tsx", import.meta.url), "utf8");
const aboutSource = fs.readFileSync(new URL("../routes/about.tsx", import.meta.url), "utf8");

describe("publisher identity trust contract", () => {
  it("discloses that desk and bureau names are organizational editorial bylines", () => {
    expect(EDITORIAL_BYLINE_DISCLOSURE).toContain("editorial bylines");
    expect(EDITORIAL_BYLINE_DISCLOSURE).toContain("not a claim");
    expect(EDITORIAL_BYLINE_DISCLOSURE).toContain("physical bureau");
    expect(authorsIndexSource).toContain("EDITORIAL_BYLINE_DISCLOSURE");
    expect(authorProfileSource).toContain("Byline disclosure:");
  });

  it("does not represent Staff Reporter as a named person", () => {
    const staff = AUTHORS.find((author) => author.slug === "staff-reporter");
    expect(staff?.bio.join(" ")).toContain("rather than a named individual reporter");
  });

  it("keeps bureau labels explicitly non-physical", () => {
    for (const slug of ["border-bureau", "austin-bureau"]) {
      const author = AUTHORS.find((candidate) => candidate.slug === slug);
      expect(author?.bio.join(" ")).toMatch(/does not represent a claimed physical/i);
    }
  });

  it("does not claim automated validation is human editorial review", () => {
    expect(aboutSource).not.toContain("AI-assisted work is reviewed before publication");
    expect(aboutSource).toContain("Automated validation is not represented as human editorial review");
  });
});

describe("AdSense document integration", () => {
  it("keeps the publisher id and AdSense network URL in the document integration", () => {
    expect(rootSource).toContain('const ADSENSE_CLIENT = "ca-pub-1891256141359926"');
    expect(rootSource).toContain("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
  });

  it("does not unconditionally fetch AdSense on every rendered route", () => {
    expect(rootSource).not.toContain('<script async crossOrigin="anonymous" src={ADSENSE_SCRIPT} />');
    expect(rootSource).toContain("ADSENSE_BOOTSTRAP");
    expect(rootSource).toContain("document.querySelectorAll('meta[name=\"robots\"]')");
    expect(rootSource).toContain("noindex");
  });

  it("excludes administrative, transactional, authentication, trust, publisher-directory, and newsroom paths", () => {
    for (const path of [
      "/admin",
      "/api",
      "/auth",
      "/shop/checkout",
      "/privacy",
      "/terms-of-service",
      "/return-refund-policy",
      "/shipping-policy",
      "/contact",
      "/about",
      "/editorial-standards",
      "/authors",
      "/sources",
      "/news",
    ]) {
      expect(rootSource).toContain(`\"${path}\"`);
    }
  });

  it("keeps thin election detail records ad-free while preserving monetizable election hubs", () => {
    expect(rootSource).toContain("ADSENSE_EXCLUDED_DETAIL_PATH_PREFIXES");
    for (const path of [
      "/elections/candidates/",
      "/elections/districts/",
      "/elections/races/",
    ]) {
      expect(rootSource).toContain(`\"${path}\"`);
    }
    expect(rootSource).toContain("d.some(function(prefix){return p.indexOf(prefix)===0;})");
  });

  it("keeps 404 and runtime-error recovery surfaces out of AdSense inventory", () => {
    expect(rootSource).toContain("data-adsense-ineligible");
    expect(rootSource).toContain("DOMContentLoaded");
    expect(siteNotFoundSource).toContain('data-adsense-ineligible="true"');
  });

  it("does not expose unfinished ad-placeholder copy to readers or reviewers", () => {
    expect(adSlotSource).not.toContain("Ad Placeholder");
    expect(adSlotSource).toContain("return null");
  });

  it("injects the AdSense network script only after eligibility checks pass", () => {
    expect(rootSource).toContain("if(excluded||noindex||ineligible)return");
    expect(rootSource).toContain("document.createElement('script')");
    expect(rootSource).toContain("s.src='${ADSENSE_SCRIPT}'");
    expect(rootSource).toContain("data-adsense-gated");
  });
});
