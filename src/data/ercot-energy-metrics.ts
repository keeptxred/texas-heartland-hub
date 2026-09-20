export type ErcotPeakDemand = {
  year: number;
  demandMw: number;
  provisional?: boolean;
};

export type ErcotEnergyMix = {
  fuel: string;
  percent: number;
};

export type ErcotCapacitySnapshot = {
  resource: string;
  capacityMw: number;
  classification: "Thermal" | "Intermittent" | "Storage" | "Hydro";
};

export const ERCOT_METRICS_REVIEWED_AT = "2026-09-06";
export const ERCOT_YEARLY_PEAK_SOURCE_URL = "https://www.ercot.com/static-assets/data/news/content/a-peak-demand/records-yearly-archive.htm";
export const ERCOT_GENERATION_DATA_URL = "https://www.ercot.com/gridinfo/generation";
export const ERCOT_HELPFUL_RESOURCES_URL = "https://www.ercot.com/news/presentations";
export const ERCOT_2025_ANNUAL_REPORT_URL = "https://www.ercot.com/files/docs/2026/03/19/2025-ERCOT-Annual-Report-Final-Single-Pages-March-19-2026.pdf";

export const ERCOT_YEARLY_PEAK_DEMAND: ErcotPeakDemand[] = [
  { year: 2026, demandMw: 91_089, provisional: true },
  { year: 2025, demandMw: 80_560 },
  { year: 2024, demandMw: 85_425 },
  { year: 2023, demandMw: 85_508 },
  { year: 2022, demandMw: 80_148 },
  { year: 2021, demandMw: 73_687 },
  { year: 2020, demandMw: 74_376 },
  { year: 2019, demandMw: 74_820 },
  { year: 2018, demandMw: 73_473 },
  { year: 2017, demandMw: 69_512 },
  { year: 2016, demandMw: 71_110 },
  { year: 2015, demandMw: 69_877 },
  { year: 2014, demandMw: 66_454 },
  { year: 2013, demandMw: 67_245 },
  { year: 2012, demandMw: 66_548 },
  { year: 2011, demandMw: 68_379 },
  { year: 2010, demandMw: 65_776 },
  { year: 2009, demandMw: 63_400 },
  { year: 2008, demandMw: 62_174 },
  { year: 2007, demandMw: 62_188 },
  { year: 2006, demandMw: 62_334 },
  { year: 2005, demandMw: 60_274 },
  { year: 2004, demandMw: 58_531 },
  { year: 2003, demandMw: 60_095 },
  { year: 2002, demandMw: 56_248 },
  { year: 2001, demandMw: 54_862 },
  { year: 2000, demandMw: 57_606 },
];

export const ERCOT_2025_ENERGY_USE: ErcotEnergyMix[] = [
  { fuel: "Natural gas", percent: 41.1 },
  { fuel: "Wind", percent: 23.6 },
  { fuel: "Solar", percent: 13.9 },
  { fuel: "Coal", percent: 12.9 },
  { fuel: "Nuclear", percent: 8.6 },
  { fuel: "Other / net adjustments", percent: -0.1 },
];

export const ERCOT_2025_CAPACITY: ErcotCapacitySnapshot[] = [
  { resource: "Thermal", capacityMw: 89_507, classification: "Thermal" },
  { resource: "Wind", capacityMw: 40_719, classification: "Intermittent" },
  { resource: "Solar", capacityMw: 37_443, classification: "Intermittent" },
  { resource: "Storage", capacityMw: 16_656, classification: "Storage" },
  { resource: "Hydro", capacityMw: 579, classification: "Hydro" },
];

export const ERCOT_2025_TOTAL_CAPACITY_MW = 184_904;

export function peakDemandGrowthSince2000(): number {
  const current = ERCOT_YEARLY_PEAK_DEMAND[0].demandMw;
  const oldest = ERCOT_YEARLY_PEAK_DEMAND[ERCOT_YEARLY_PEAK_DEMAND.length - 1].demandMw;
  return ((current / oldest) - 1) * 100;
}

export function ercotPeakDemandCsv(rows: ErcotPeakDemand[] = ERCOT_YEARLY_PEAK_DEMAND): string {
  return ["year,peak_demand_mw,status", ...rows.map((row) => `${row.year},${row.demandMw},${row.provisional ? "provisional" : "historical"}`)].join("\n");
}
