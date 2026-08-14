import { describe, expect, it } from "vitest";
import { getTexasDefinedLinks } from "@/lib/texas-defined-crosslinks";

describe("getTexasDefinedLinks", () => {
  it("does not cross-promote hard-politics stories without a nonpolitical reason", () => {
    expect(getTexasDefinedLinks("/news/2026-08-13-harris-county-election-candidate-poll")).toEqual([]);
  });

  it("links a county and outdoor guide when both are central to the story", () => {
    const links = getTexasDefinedLinks("/news/2026-08-13-brewster-county-big-bend-park-update");
    expect(links.map((link) => link.href)).toEqual([
      "https://texasdefined.com/county/brewster",
      "https://texasdefined.com/explore",
    ]);
  });

  it("links event coverage to TexasDefined events without generic keyword stuffing", () => {
    const links = getTexasDefinedLinks("/news/2026-08-09-pickle-festival-helotes");
    expect(links.map((link) => link.href)).toEqual(["https://texasdefined.com/events"]);
  });

  it("supports Texas history companion resources", () => {
    const links = getTexasDefinedLinks("/news/2026-08-13-historic-texas-alamo-anniversary");
    expect(links.map((link) => link.href)).toContain("https://texasdefined.com/texas-history");
  });

  it("never adds the module outside the newsroom", () => {
    expect(getTexasDefinedLinks("/elections/2026")).toEqual([]);
    expect(getTexasDefinedLinks("/bills/texas/89/sb/37")).toEqual([]);
    expect(getTexasDefinedLinks("/shop")).toEqual([]);
  });

  it("caps cross-site recommendations at three", () => {
    const links = getTexasDefinedLinks(
      "/news/2026-08-13-brewster-county-historic-big-bend-park-festival-hurricane-guide",
    );
    expect(links).toHaveLength(3);
  });
});
