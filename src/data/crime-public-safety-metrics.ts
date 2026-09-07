export type DpsStatewideCrimeYear = {
  year: number;
  violentVolume: number;
  violentRate: number;
  propertyVolume: number;
  propertyRate: number;
};

export type DpsCrimeOffense = {
  offense: string;
  volume2024: number;
  volume2025: number;
  rate2024: number;
  rate2025: number;
};

export const CRIME_PUBLIC_SAFETY_REVIEWED_AT = "2026-09-06";

export const DPS_CRIME_IN_TEXAS_2025_URL = "https://www.dps.texas.gov/sites/default/files/documents/crimereports/25/2025cit.pdf";
export const DPS_CRIME_IN_TEXAS_SUPPLEMENTAL_URL = "https://www.dps.texas.gov/section/crime-records/2025-crime-texas-supplemental-reports";
export const TDCJ_FY2025_STATISTICAL_REPORT_URL = "https://tdcj.texas.gov/documents/Statistical_Report_FY2025.pdf";
export const TDCJ_STATISTICAL_REPORTS_URL = "https://tdcj.texas.gov/publications/statistical_reports.html";
export const TEXAS_COURTS_FY2025_URL = "https://www.txcourts.gov/statistics/annual-statistical-reports/2025/";
export const TEXAS_COURTS_FELONY_FY2025_URL = "https://www.txcourts.gov/media/1461812/felony_activity_detail-2025.pdf";

export const DPS_STATEWIDE_CRIME_TREND: DpsStatewideCrimeYear[] = [
  { year: 2021, violentVolume: 134_735, violentRate: 465.76, propertyVolume: 648_433, propertyRate: 2_241.55 },
  { year: 2022, violentVolume: 132_951, violentRate: 448.43, propertyVolume: 706_130, propertyRate: 2_381.71 },
  { year: 2023, violentVolume: 127_383, violentRate: 421.03, propertyVolume: 700_804, propertyRate: 2_316.32 },
  { year: 2024, violentVolume: 124_970, violentRate: 401.74, propertyVolume: 656_300, propertyRate: 2_109.80 },
  { year: 2025, violentVolume: 110_113, violentRate: 348.77, propertyVolume: 577_447, propertyRate: 1_828.98 },
];

export const DPS_2025_OFFENSES: DpsCrimeOffense[] = [
  { offense: "Aggravated assault", volume2024: 85_872, volume2025: 76_580, rate2024: 276.05, rate2025: 242.56 },
  { offense: "Robbery", volume2024: 19_994, volume2025: 16_546, rate2024: 64.27, rate2025: 52.41 },
  { offense: "Rape", volume2024: 16_878, volume2025: 15_163, rate2024: 54.26, rate2025: 48.03 },
  { offense: "Murder & nonnegligent manslaughter", volume2024: 1_645, volume2025: 1_458, rate2024: 5.29, rate2025: 4.62 },
  { offense: "Larceny/theft", volume2024: 458_080, volume2025: 416_069, rate2024: 1_472.59, rate2025: 1_317.84 },
  { offense: "Motor vehicle theft", volume2024: 105_093, volume2025: 79_936, rate2024: 337.84, rate2025: 253.19 },
  { offense: "Burglary/breaking and entering", volume2024: 90_334, volume2025: 78_945, rate2024: 290.40, rate2025: 250.05 },
  { offense: "Arson", volume2024: 2_793, volume2025: 2_497, rate2024: 8.98, rate2025: 7.91 },
];

export const DPS_2025_SUMMARY = {
  violentVolumeChangePercent: -11.89,
  violentRateChangePercent: -13.19,
  propertyVolumeChangePercent: -12.01,
  propertyRateChangePercent: -13.31,
  reportingCutoff: "2026-03-20",
  note: "DPS describes the annual publication as a static snapshot of local-agency NIBRS submissions received by the report cutoff. The UCR portal can change later as agencies submit or revise records.",
} as const;

export const TDCJ_FY2025_CUSTODY = {
  asOf: "2025-08-31",
  prisonOnHand: 132_350,
  stateJailOnHand: 3_568,
  safpOnHand: 2_983,
  totalOnHand: 138_901,
} as const;

export const TDCJ_FY2025_RELEASES = {
  prisonReleases: 37_587,
  stateJailReleases: 8_212,
  safpReleases: 4_813,
  totalReleases: 50_612,
  departures: 2_138,
  releasesAndDepartures: 52_750,
} as const;

export const OCA_FY2025_FELONY_ACTIVITY = {
  period: "2024-09-01 through 2025-08-31",
  totalCasesOnDocket: 650_040,
  filedByIndictmentOrInformation: 236_233,
  totalConvictions: 111_794,
  deferredAdjudication: 61_208,
  acquittals: 689,
  dismissals: 83_874,
  totalCasesDisposed: 314_970,
  activeCasesPendingAtYearEnd: 177_971,
  defendantFailedToAppearCases: 71_294,
  releaseConditionViolationCases: 14_003,
  offenseWhileOnBailOrSupervisionCases: 9_909,
  note: "OCA's statewide felony activity is court case activity, not a count of crimes, arrests, unique defendants, convictions alone, or incarcerated people. Bail-related values are reported as cases rather than unique defendants.",
} as const;

export function dpsPercentChange(current: number, prior: number): number {
  return ((current / prior) - 1) * 100;
}

export function dpsStatewideTrendCsv(rows: DpsStatewideCrimeYear[] = DPS_STATEWIDE_CRIME_TREND): string {
  return [
    "year,violent_crime_volume,violent_crime_rate_per_100k,property_crime_volume,property_crime_rate_per_100k",
    ...rows.map((row) => `${row.year},${row.violentVolume},${row.violentRate.toFixed(2)},${row.propertyVolume},${row.propertyRate.toFixed(2)}`),
  ].join("\n");
}
