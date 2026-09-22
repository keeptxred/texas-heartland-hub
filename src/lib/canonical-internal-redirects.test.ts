import { describe, expect, it } from "vitest";
import { MIGRATED_PRACTICAL_GUIDE_CANONICALS } from "./migrated-practical-guide-canonical";
import { MIGRATED_TOOL_CANONICALS } from "./migrated-tool-canonical";
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
  ["/news/texas-constitutional-amendments-guide", "/laws/constitutional-amendments"],
  [
    "/texas-government/texas-court-of-criminal-appeals-history",
    "/texas-government/court-of-criminal-appeals-history",
  ],
  ["/find-my-dmv", "https://texasdefined.com/find-my-dmv"],
  ["/dmv", "https://texasdefined.com/texas-dmv"],
  ["/vehicles/registration", "https://texasdefined.com/texas-vehicle-registration"],
  ["/vehicles/renewal", "https://texasdefined.com/texas-vehicle-registration-renewal"],
  ["/vehicles/registration-fees-taxes", "https://texasdefined.com/texas-vehicle-registration-fees-taxes"],
  ["/texas-property-tax-protest-guide", "https://texasdefined.com/do/property-tax-protest"],
  ["/living-in-texas", "https://texasdefined.com/texas-living"],
  ["/moving-to-texas", "https://texasdefined.com/moving-to-texas"],
  ["/texas-living", "https://texasdefined.com/texas-living"],
  ["/texas-sports", "https://texasdefined.com/sports"],
  ["/explore", "https://texasdefined.com/explore"],
  ["/tax-calculator", "https://texasdefined.com/decide/property-taxes"],
] as const;

describe("canonical internal redirect links", () => {
  it.each(mappings)("maps %s directly to %s", (alias, canonical) => {
    expect(canonicalInternalRedirectHref(alias)).toBe(canonical);
  });

  it("maps every migrated practical guide directly to its TexasDefined owner", () => {
    for (const [alias, canonical] of Object.entries(MIGRATED_PRACTICAL_GUIDE_CANONICALS)) {
      expect(canonicalInternalRedirectHref(alias)).toBe(canonical);
    }
  });

  it("maps every migrated homeowner tool directly to its TexasDefined owner", () => {
    for (const [alias, canonical] of Object.entries(MIGRATED_TOOL_CANONICALS)) {
      expect(canonicalInternalRedirectHref(alias)).toBe(canonical);
    }
  });

  it("preserves query and hash state while removing the redirect hop", () => {
    expect(canonicalInternalRedirectHref("/elections/?cycle=2026#top")).toBe(
      "/elections/2026?cycle=2026#top",
    );
    expect(canonicalInternalRedirectHref("/news/texas-constitutional-amendments-guide?year=2026#process")).toBe(
      "/laws/constitutional-amendments?year=2026#process",
    );
    expect(canonicalInternalRedirectHref("/moving-to-texas?county=Travis#checklist")).toBe(
      "https://texasdefined.com/moving-to-texas?county=Travis#checklist",
    );
    expect(canonicalInternalRedirectHref("/find-my-dmv?county=Harris#offices")).toBe(
      "https://texasdefined.com/find-my-dmv?county=Harris#offices",
    );
    expect(canonicalInternalRedirectHref("/dmv?task=registration#start")).toBe(
      "https://texasdefined.com/texas-dmv?task=registration#start",
    );
    expect(canonicalInternalRedirectHref("/vehicles/registration?county=Harris#fees")).toBe(
      "https://texasdefined.com/texas-vehicle-registration?county=Harris#fees",
    );
    expect(canonicalInternalRedirectHref("/vehicles/renewal?county=Harris#online")).toBe(
      "https://texasdefined.com/texas-vehicle-registration-renewal?county=Harris#online",
    );
    expect(canonicalInternalRedirectHref("/vehicles/registration-fees-taxes?vehicle=ev#fees")).toBe(
      "https://texasdefined.com/texas-vehicle-registration-fees-taxes?vehicle=ev#fees",
    );
    expect(canonicalInternalRedirectHref("/texas-sports?league=nfl#teams")).toBe(
      "https://texasdefined.com/sports?league=nfl#teams",
    );
    expect(canonicalInternalRedirectHref("/news/moving-to-texas-guide?county=Travis#checklist")).toBe(
      "https://texasdefined.com/article/moving-to-texas-what-nobody-tells-you?county=Travis#checklist",
    );
    expect(canonicalInternalRedirectHref("/texas-mortgage-calculator?price=350000#payment")).toBe(
      "https://texasdefined.com/texas-mortgage-calculator?price=350000#payment",
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
        "Read [Election Central](/elections), [amendment process](/news/texas-constitutional-amendments-guide), [DMV guide](/dmv), [vehicle registration](/vehicles/registration), [registration renewal](/vehicles/renewal), [vehicle fees](/vehicles/registration-fees-taxes), [DMV offices](/find-my-dmv), [Texas sports](/texas-sports), and [Moving to Texas](/moving-to-texas).",
      ),
    ).toBe(
      "Read [Election Central](/elections/2026), [amendment process](/laws/constitutional-amendments), [DMV guide](https://texasdefined.com/texas-dmv), [vehicle registration](https://texasdefined.com/texas-vehicle-registration), [registration renewal](https://texasdefined.com/texas-vehicle-registration-renewal), [vehicle fees](https://texasdefined.com/texas-vehicle-registration-fees-taxes), [DMV offices](https://texasdefined.com/find-my-dmv), [Texas sports](https://texasdefined.com/sports), and [Moving to Texas](https://texasdefined.com/moving-to-texas).",
    );
  });
});
