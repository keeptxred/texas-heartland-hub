import { describe, expect, it } from "vitest";
import {
  TEXAS_APPEAL_PATHS,
  TEXAS_APPELLATE_TIMELINE,
  TEXAS_COURTS_FAQS,
  TEXAS_COURTS_OF_APPEALS,
  TEXAS_COURTS_QUICK_FACTS,
  TEXAS_COURTS_SOURCES,
} from "./texas-courts-authority";

describe("Texas courts authority hub", () => {
  it("keeps a complete directory of all 15 Courts of Appeals", () => {
    expect(TEXAS_COURTS_OF_APPEALS).toHaveLength(15);
    expect(TEXAS_COURTS_OF_APPEALS.map((court) => court.number)).toEqual(Array.from({ length: 15 }, (_, index) => index + 1));
    expect(new Set(TEXAS_COURTS_OF_APPEALS.map((court) => court.officialUrl)).size).toBe(15);
  });

  it("preserves the regional versus statewide-specialized distinction", () => {
    const regional = TEXAS_COURTS_OF_APPEALS.filter((court) => court.number <= 14);
    expect(regional).toHaveLength(14);
    expect(regional.every((court) => court.jurisdiction.includes("Regional"))).toBe(true);

    const fifteenth = TEXAS_COURTS_OF_APPEALS.find((court) => court.number === 15);
    expect(fifteenth?.location).toBe("Austin");
    expect(fifteenth?.jurisdiction).toContain("Statewide specialized civil");
    expect(fifteenth?.note).toContain("Business Court");
  });

  it("covers the major appeal paths without merging the two high courts", () => {
    expect(TEXAS_APPEAL_PATHS.length).toBeGreaterThanOrEqual(5);
    const combined = TEXAS_APPEAL_PATHS.map((path) => `${path.title} ${path.path} ${path.text}`).join(" ");
    expect(combined).toContain("Supreme Court of Texas");
    expect(combined).toContain("Court of Criminal Appeals");
    expect(combined).toContain("Death-penalty");
    expect(combined).toContain("Business Court");
    expect(combined).toContain("Fifteenth Court of Appeals");
  });

  it("tracks the appellate system from the 1891 reorganization through 2026", () => {
    expect(TEXAS_APPELLATE_TIMELINE.length).toBeGreaterThanOrEqual(10);
    const years = TEXAS_APPELLATE_TIMELINE.map((item) => item.year).join(" ");
    expect(years).toContain("1891");
    expect(years).toContain("1892");
    expect(years).toContain("1963");
    expect(years).toContain("1967");
    expect(years).toContain("1981");
    expect(years).toContain("2023");
    expect(years).toContain("2026");
  });

  it("retains current structural facts and voter-facing FAQs", () => {
    expect(TEXAS_COURTS_QUICK_FACTS.some((fact) => fact.value === "15")).toBe(true);
    expect(TEXAS_COURTS_QUICK_FACTS.some((fact) => fact.value === "83")).toBe(true);
    expect(TEXAS_COURTS_FAQS.length).toBeGreaterThanOrEqual(8);
    expect(TEXAS_COURTS_FAQS.some((faq) => faq.question.includes("Fifteenth"))).toBe(true);
  });

  it("anchors the hub in official Texas sources", () => {
    expect(TEXAS_COURTS_SOURCES.length).toBeGreaterThanOrEqual(12);
    const hosts = TEXAS_COURTS_SOURCES.map((source) => new URL(source.href).hostname);
    expect(hosts.filter((host) => host === "www.txcourts.gov").length).toBeGreaterThanOrEqual(8);
    expect(hosts).toContain("statutes.capitol.texas.gov");
    expect(hosts).toContain("capitol.texas.gov");
    expect(hosts).toContain("www.sos.state.tx.us");
  });
});
