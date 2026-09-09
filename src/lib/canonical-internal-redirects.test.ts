import { describe, expect, it } from "vitest";
import {
  canonicalInternalRedirectHref,
  canonicalizeInternalRedirectMarkdownLinks,
} from "./canonical-internal-redirects";

const legacyWwwHost = ["www", "keeptxred", "com"].join(".");

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
  [
    "/texas-government/texas-court-of-criminal-appeals-history",
    "/texas-government/court-of-criminal-appeals-history",
  ],
  ["/find-my-dmv", "https://texasdefined.com/find-my-dmv"],
  ["/texas-property-tax-protest-guide", "https://texasdefined.com/do/property-tax-protest"],
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
    expect(canonicalInternalRedirectHref("/find-my-dmv?county=Harris#offices")).toBe(
      "https://texasdefined.com/find-my-dmv?county=Harris#offices",
    );
  });

  it("canonicalizes absolute KeepTXRed aliases and leaves unrelated URLs alone", () => {
    expect(canonicalInternalRedirectHref(`https://${legacyWwwHost}/texas-law-policy#guide`)).toBe(
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
        "Read [Election Central](/elections), [DMV offices](/find-my-dmv), and [Moving to Texas](/moving-to-texas).",
      ),
    ).toBe(
      "Read [Election Central](/elections/2026), [DMV offices](https://texasdefined.com/find-my-dmv), and [Moving to Texas](https://texasdefined.com/moving-to-texas).",
    );
  });
});
