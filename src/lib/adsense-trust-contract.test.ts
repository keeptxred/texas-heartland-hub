import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { AUTHORS, EDITORIAL_BYLINE_DISCLOSURE } from "@/data/authors";

const rootSource = fs.readFileSync(new URL("../routes/__root.tsx", import.meta.url), "utf8");
const authorsIndexSource = fs.readFileSync(new URL("../routes/authors.index.tsx", import.meta.url), "utf8");
const authorProfileSource = fs.readFileSync(new URL("../routes/authors.$slug.tsx", import.meta.url), "utf8");

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
});

describe("AdSense document integration", () => {
  it("loads the publisher script directly in the document head", () => {
    expect(rootSource).toContain('const ADSENSE_CLIENT = "ca-pub-1891256141359926"');
    expect(rootSource).toContain('<script async crossOrigin="anonymous" src={ADSENSE_SCRIPT} />');
  });

  it("does not delay or dynamically inject the AdSense script", () => {
    expect(rootSource).not.toContain("setTimeout(l,1500)");
    expect(rootSource).not.toContain("s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
  });
});
