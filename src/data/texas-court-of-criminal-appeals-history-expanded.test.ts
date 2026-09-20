import { describe, expect, it } from "vitest";
import {
  CCA_HISTORIC_FIRSTS,
  CCA_LANDMARK_CASES,
  CCA_PRESIDING_JUDGES,
  CCA_SOURCES,
  CCA_TIMELINE,
  CURRENT_CCA_JUDGES,
} from "./texas-court-of-criminal-appeals-history-expanded";

describe("Texas Court of Criminal Appeals expanded history authority", () => {
  it("keeps the current constitutional nine-member court complete", () => {
    expect(CURRENT_CCA_JUDGES).toHaveLength(9);
    expect(new Set(CURRENT_CCA_JUDGES.map((judge) => judge.name)).size).toBe(9);
    expect(CURRENT_CCA_JUDGES[0]?.name).toBe("David J. Schenck");
    expect(CURRENT_CCA_JUDGES.map((judge) => judge.service).join(" ")).toContain("Place 9");
  });

  it("preserves the institutional timeline from the 1876 predecessor through the modern court", () => {
    expect(CCA_TIMELINE.length).toBeGreaterThanOrEqual(10);
    const years = CCA_TIMELINE.map((item) => item.year).join(" ");
    expect(years).toContain("1876");
    expect(years).toContain("1891");
    expect(years).toContain("1977");
    expect(years).toContain("1980");
    expect(years).toContain("2025");
  });

  it("maintains a substantial presiding-judge leadership lineage", () => {
    expect(CCA_PRESIDING_JUDGES.length).toBeGreaterThanOrEqual(18);
    expect(CCA_PRESIDING_JUDGES[0]?.name).toBe("Mat D. Ector");
    expect(CCA_PRESIDING_JUDGES.at(-1)?.name).toBe("David J. Schenck");
    expect(CCA_PRESIDING_JUDGES.some((judge) => judge.name === "Sharon Keller")).toBe(true);
    expect(CCA_PRESIDING_JUDGES.some((judge) => judge.name === "John F. Onion Jr.")).toBe(true);
  });

  it("retains landmark decisions and documented historical firsts", () => {
    expect(CCA_LANDMARK_CASES.length).toBeGreaterThanOrEqual(5);
    expect(CCA_HISTORIC_FIRSTS.length).toBeGreaterThanOrEqual(6);
    expect(CCA_LANDMARK_CASES.some((item) => item.name === "Ex parte Elizondo")).toBe(true);
    expect(CCA_HISTORIC_FIRSTS.some((item) => item.title === "Morris L. Overstreet")).toBe(true);
    expect(CCA_HISTORIC_FIRSTS.some((item) => item.title === "Sharon Keller")).toBe(true);
  });

  it("anchors the guide in official and Texas historical sources", () => {
    expect(CCA_SOURCES.length).toBeGreaterThanOrEqual(8);
    const hosts = CCA_SOURCES.map((source) => new URL(source.href).hostname);
    expect(hosts).toContain("www.txcourts.gov");
    expect(hosts).toContain("tcss.legis.texas.gov");
    expect(hosts).toContain("www.tshaonline.org");
    expect(hosts).toContain("www.texasbar.com");
  });
});
