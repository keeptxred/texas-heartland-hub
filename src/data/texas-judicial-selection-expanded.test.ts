import { describe, expect, it } from "vitest";
import {
  JUDICIAL_SELECTION_REFORM_FINDINGS,
  JUDICIAL_SELECTION_SOURCES,
  JUDICIAL_SELECTION_TIMELINE,
  JUDICIAL_SELECTION_VOTER_GUIDE,
  TEXAS_JUDICIAL_SELECTION_MATRIX,
} from "./texas-judicial-selection-expanded";

describe("Texas judicial selection expanded authority", () => {
  it("covers the major elected and appointed court models", () => {
    expect(TEXAS_JUDICIAL_SELECTION_MATRIX.length).toBeGreaterThanOrEqual(10);
    const courts = TEXAS_JUDICIAL_SELECTION_MATRIX.map((row) => row.court);
    expect(courts).toContain("Supreme Court of Texas");
    expect(courts).toContain("Court of Criminal Appeals");
    expect(courts).toContain("Courts of Appeals");
    expect(courts).toContain("District Courts");
    expect(courts).toContain("Texas Business Court");
    expect(courts).toContain("Municipal Courts");
  });

  it("separates regular election from vacancy appointment mechanics", () => {
    const supreme = TEXAS_JUDICIAL_SELECTION_MATRIX.find((row) => row.court === "Supreme Court of Texas");
    expect(supreme?.selection).toContain("Partisan statewide election");
    expect(supreme?.vacancy).toContain("Governor appoints");
    expect(supreme?.term).toBe("6 years");

    const business = TEXAS_JUDICIAL_SELECTION_MATRIX.find((row) => row.court === "Texas Business Court");
    expect(business?.selection).toContain("Governor appoints");
    expect(business?.term).toBe("2 years");
  });

  it("preserves the constitutional selection timeline through current rules", () => {
    expect(JUDICIAL_SELECTION_TIMELINE.length).toBeGreaterThanOrEqual(12);
    const years = JUDICIAL_SELECTION_TIMELINE.map((item) => item.year).join(" ");
    expect(years).toContain("1836");
    expect(years).toContain("1850");
    expect(years).toContain("1869");
    expect(years).toContain("1876");
    expect(years).toContain("2019");
    expect(years).toContain("2021");
    expect(years).toContain("2026");
  });

  it("records the actual 2020 judicial-selection commission outcomes", () => {
    expect(JUDICIAL_SELECTION_REFORM_FINDINGS).toHaveLength(6);
    const combined = JUDICIAL_SELECTION_REFORM_FINDINGS.map((finding) => `${finding.title} ${finding.result}`).join(" ");
    expect(combined).toContain("Partisan elections");
    expect(combined).toContain("Nonpartisan elections");
    expect(combined).toContain("7–7");
    expect(combined).toContain("qualifications");
    expect(combined).toContain("Term limits");
  });

  it("keeps the voter-facing interpretation layer substantial", () => {
    expect(JUDICIAL_SELECTION_VOTER_GUIDE.length).toBeGreaterThanOrEqual(6);
    expect(JUDICIAL_SELECTION_VOTER_GUIDE.some((item) => item.title.includes("appointment"))).toBe(true);
    expect(JUDICIAL_SELECTION_VOTER_GUIDE.some((item) => item.title.includes("Party labels"))).toBe(true);
  });

  it("anchors the guide in current official Texas sources", () => {
    expect(JUDICIAL_SELECTION_SOURCES.length).toBeGreaterThanOrEqual(10);
    const hosts = JUDICIAL_SELECTION_SOURCES.map((source) => new URL(source.href).hostname);
    expect(hosts).toContain("www.txcourts.gov");
    expect(hosts).toContain("www.sos.state.tx.us");
    expect(hosts).toContain("statutes.capitol.texas.gov");
    expect(hosts).toContain("lrl.texas.gov");
  });
});
