import { describe, expect, it } from "vitest";
import { getTexasDataSet } from "@/data/texas-data-catalog";
import {
  DPS_2025_OFFENSES,
  DPS_2025_SUMMARY,
  DPS_CRIME_IN_TEXAS_2025_URL,
  DPS_CRIME_IN_TEXAS_SUPPLEMENTAL_URL,
  DPS_STATEWIDE_CRIME_TREND,
  OCA_FY2025_FELONY_ACTIVITY,
  TDCJ_FY2025_CUSTODY,
  TDCJ_FY2025_RELEASES,
  TDCJ_FY2025_STATISTICAL_REPORT_URL,
  TEXAS_COURTS_FELONY_FY2025_URL,
  dpsPercentChange,
  dpsStatewideTrendCsv,
} from "@/data/crime-public-safety-metrics";
import { dataDetailWordCount, isDataDetailIndexable, MIN_DATA_DETAIL_WORDS } from "@/lib/data-detail-indexability";

describe("Texas crime and public safety Data Center metrics", () => {
  it("preserves the DPS five-year statewide crime trend", () => {
    expect(DPS_STATEWIDE_CRIME_TREND).toHaveLength(5);
    expect(DPS_STATEWIDE_CRIME_TREND[0]).toMatchObject({ year: 2021, violentVolume: 134_735, propertyVolume: 648_433 });
    expect(DPS_STATEWIDE_CRIME_TREND.at(-1)).toMatchObject({ year: 2025, violentVolume: 110_113, violentRate: 348.77, propertyVolume: 577_447, propertyRate: 1_828.98 });
  });

  it("reconciles DPS 2024-to-2025 statewide changes", () => {
    const current = DPS_STATEWIDE_CRIME_TREND.at(-1)!;
    const prior = DPS_STATEWIDE_CRIME_TREND.at(-2)!;
    expect(dpsPercentChange(current.violentVolume, prior.violentVolume)).toBeCloseTo(DPS_2025_SUMMARY.violentVolumeChangePercent, 2);
    expect(dpsPercentChange(current.violentRate, prior.violentRate)).toBeCloseTo(DPS_2025_SUMMARY.violentRateChangePercent, 2);
    expect(dpsPercentChange(current.propertyVolume, prior.propertyVolume)).toBeCloseTo(DPS_2025_SUMMARY.propertyVolumeChangePercent, 2);
    expect(dpsPercentChange(current.propertyRate, prior.propertyRate)).toBeCloseTo(DPS_2025_SUMMARY.propertyRateChangePercent, 2);
  });

  it("preserves core 2025 offense volumes and rates", () => {
    const byOffense = new Map(DPS_2025_OFFENSES.map((row) => [row.offense, row]));
    expect(byOffense.get("Murder & nonnegligent manslaughter")).toMatchObject({ volume2025: 1_458, rate2025: 4.62 });
    expect(byOffense.get("Motor vehicle theft")).toMatchObject({ volume2025: 79_936, rate2025: 253.19 });
  });

  it("keeps TDCJ custody and release counts internally consistent", () => {
    expect(TDCJ_FY2025_CUSTODY.prisonOnHand + TDCJ_FY2025_CUSTODY.stateJailOnHand + TDCJ_FY2025_CUSTODY.safpOnHand).toBe(TDCJ_FY2025_CUSTODY.totalOnHand);
    expect(TDCJ_FY2025_RELEASES.prisonReleases + TDCJ_FY2025_RELEASES.stateJailReleases + TDCJ_FY2025_RELEASES.safpReleases).toBe(TDCJ_FY2025_RELEASES.totalReleases);
    expect(TDCJ_FY2025_RELEASES.totalReleases + TDCJ_FY2025_RELEASES.departures).toBe(TDCJ_FY2025_RELEASES.releasesAndDepartures);
  });

  it("keeps court case activity distinct from reported crime and incarceration", () => {
    expect(OCA_FY2025_FELONY_ACTIVITY.totalCasesOnDocket).toBe(650_040);
    expect(OCA_FY2025_FELONY_ACTIVITY.totalCasesDisposed).toBe(314_970);
    expect(OCA_FY2025_FELONY_ACTIVITY.totalConvictions).toBe(111_794);
    expect(OCA_FY2025_FELONY_ACTIVITY.note).toContain("court case activity");
    expect(OCA_FY2025_FELONY_ACTIVITY.note).toContain("not a count of crimes");
  });

  it("exports only the DPS statewide crime trend as its own CSV", () => {
    const csv = dpsStatewideTrendCsv();
    expect(csv.split("\n")).toHaveLength(6);
    expect(csv).toContain("2025,110113,348.77,577447,1828.98");
    expect(csv).not.toContain("650040");
    expect(csv).not.toContain("138901");
  });

  it("keeps primary records on official Texas government domains", () => {
    expect(DPS_CRIME_IN_TEXAS_2025_URL).toMatch(/^https:\/\/www\.dps\.texas\.gov\//);
    expect(DPS_CRIME_IN_TEXAS_SUPPLEMENTAL_URL).toMatch(/^https:\/\/www\.dps\.texas\.gov\//);
    expect(TDCJ_FY2025_STATISTICAL_REPORT_URL).toMatch(/^https:\/\/tdcj\.texas\.gov\//);
    expect(TEXAS_COURTS_FELONY_FY2025_URL).toMatch(/^https:\/\/www\.txcourts\.gov\//);
  });

  it("requires the crime Data Center record to genuinely clear readiness", () => {
    const dataset = getTexasDataSet("crime-public-safety");
    expect(dataset).toBeDefined();
    expect(MIN_DATA_DETAIL_WORDS).toBe(700);
    expect(dataDetailWordCount(dataset!)).toBeGreaterThanOrEqual(MIN_DATA_DETAIL_WORDS);
    expect(isDataDetailIndexable(dataset)).toBe(true);
  });
});
