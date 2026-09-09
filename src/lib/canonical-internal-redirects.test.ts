import { describe, expect, it } from "vitest";
import {
  canonicalInternalRedirectHref,
  canonicalizeInternalRedirectMarkdownLinks,
} from "./canonical-internal-redirects";

const mappings = [
  ["/about-keep-texas-red", "/about"],
  ["/candidate-guides", "/elections/2026"],
  ["/laws-to-know", "/laws"],
  ["/legislative-updates", "/bills"],
  ["/texas-laws", "/laws"],
  ["/texas-law-policy", "/laws"],
  ["/texas-news", "/news"],
  ["/elections", "/elections/2026"],
  ["/voting-locations", "/elections/voting"],
  ["/living-in-texas", "https://texasdefined.com/texas-living"],
  ["/moving-to-texas", "https://texasdefined.com/moving-to-texas"],
  ["/texas-living", "https://texasdefined.com/texas-living"],
  ["/explore", "https://texasdefined.com/explore"],
  ["/tax-calculator", "https://texasdefined.com/decide/property-taxes"],
] as const;

describe("canonical internal redirect links", () => {
  it.each(mappings)("maps %s directly to %s", (alias, canonical) => {
    expect(canonicalInternalRedirectHref(alias)).toBe(canonical);
  });

  it("preserves query and hash state while removing the redirect hop", () => {
    expect(canonicalInternalRedirectHref("/elections/?cycle=2026#top")).toBe(
      "/elections/2026?cycle=2026#top",
    );
    expect(canonicalInternalRedirectHref("/moving-to-texas?county=Travis#checklist")).toBe(
      "https://texasdefined.com/moving-to-texas?county=Travis#checklist",
    );
  });

  it("canonicalizes absolute KeepTXRed aliases and leaves unrelated URLs alone", () => {
    expect(canonicalInternalRedirectHref("https://www.keeptxred.com/texas-law-policy#guide")).toBe(
      "https://keeptxred.com/laws#guide",
    );
    expect(canonicalInternalRedirectHref("/elections/races")).toBe("/elections/races");
    expect(canonicalInternalRedirectHref("https://example.com/elections")).toBe(
      "https://example.com/elections",
    );
  });

  it("rewrites markdown destinations without changing anchor text", () => {
    expect(
      canonicalizeInternalRedirectMarkdownLinks(
        "Read [Election Central](/elections) and [Moving to Texas](/moving-to-texas).",
      ),
    ).toBe(
      "Read [Election Central](/elections/2026) and [Moving to Texas](https://texasdefined.com/moving-to-texas).",
    );
  });
});
