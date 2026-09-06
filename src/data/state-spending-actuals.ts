export type StateSpendingActual = {
  category: string;
  fiscal2024: number;
  fiscal2025: number;
  percentChange: number;
};

export const STATE_SPENDING_ACTUALS_REVIEWED_AT = "2026-09-06";
export const STATE_SPENDING_ACTUALS_FISCAL_YEAR = 2025;
export const STATE_SPENDING_ACTUALS_SOURCE_URL = "https://comptroller.texas.gov/transparency/reports/cash-report/2025/96-368.pdf";
export const STATE_SPENDING_ACTUALS_XLSX_URL = "https://comptroller.texas.gov/transparency/reports/cash-report/2025/data/cash-balances-pages%208-114.xlsx";
export const STATE_SPENDING_ACTUALS_REPORT_URL = "https://comptroller.texas.gov/transparency/reports/cash-report/";

export const STATE_SPENDING_ACTUALS: StateSpendingActual[] = [
  { category: "Public assistance payments", fiscal2024: 63_101_148_553, fiscal2025: 68_699_003_911, percentChange: 8.9 },
  { category: "Foundation School Program grants", fiscal2024: 29_106_910_817, fiscal2025: 30_090_849_881, percentChange: 3.4 },
  { category: "Other public education grants", fiscal2024: 12_301_018_415, fiscal2025: 8_944_689_092, percentChange: -27.3 },
  { category: "Grants to higher education", fiscal2024: 1_642_659_279, fiscal2025: 1_720_637_205, percentChange: 4.7 },
  { category: "Other grants", fiscal2024: 4_725_071_520, fiscal2025: 4_740_669_340, percentChange: 0.3 },
  { category: "Highway construction and maintenance", fiscal2024: 12_258_375_413, fiscal2025: 13_170_345_748, percentChange: 7.4 },
  { category: "Capital outlay", fiscal2024: 2_379_346_967, fiscal2025: 3_325_974_190, percentChange: 39.8 },
  { category: "Cost of goods sold", fiscal2024: 592_878_326, fiscal2025: 617_795_932, percentChange: 4.2 },
  { category: "Salaries and wages", fiscal2024: 16_493_715_118, fiscal2025: 17_692_107_623, percentChange: 7.3 },
  { category: "Employee benefit payments", fiscal2024: 11_329_776_710, fiscal2025: 5_611_955_094, percentChange: -50.5 },
  { category: "Payroll-related costs", fiscal2024: 4_420_621_103, fiscal2025: 4_645_787_672, percentChange: 5.1 },
  { category: "Professional services and fees", fiscal2024: 5_962_225_163, fiscal2025: 6_174_439_501, percentChange: 3.6 },
  { category: "Travel", fiscal2024: 228_868_143, fiscal2025: 229_229_902, percentChange: 0.2 },
  { category: "Supplies and materials", fiscal2024: 1_243_058_608, fiscal2025: 1_301_440_117, percentChange: 4.7 },
  { category: "Communication and utilities", fiscal2024: 691_747_952, fiscal2025: 781_214_906, percentChange: 12.9 },
  { category: "Repairs and maintenance", fiscal2024: 1_583_944_881, fiscal2025: 1_766_456_738, percentChange: 11.5 },
  { category: "Rentals and leases", fiscal2024: 623_094_835, fiscal2025: 504_656_338, percentChange: -19.0 },
  { category: "Printing and reproduction", fiscal2024: 104_214_521, fiscal2025: 115_242_365, percentChange: 10.6 },
  { category: "Debt service — interest", fiscal2024: 1_203_193_734, fiscal2025: 1_218_927_898, percentChange: 1.3 },
  { category: "Lottery winnings paid", fiscal2024: 831_234_412, fiscal2025: 725_714_700, percentChange: -12.7 },
  { category: "Claims and judgments", fiscal2024: 127_271_306, fiscal2025: 123_308_491, percentChange: -3.1 },
  { category: "Other expenditures", fiscal2024: 4_861_503_827, fiscal2025: 9_832_657_816, percentChange: 102.3 },
];

export const STATE_SPENDING_TOTALS = {
  fiscal2024: 175_811_879_604,
  fiscal2025: 182_033_104_461,
  percentChange: 3.5,
} as const;

export function stateSpendingShare(amount: number): number {
  return (amount / STATE_SPENDING_TOTALS.fiscal2025) * 100;
}
