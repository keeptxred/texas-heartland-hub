import type { County } from "@/data/counties";

export type PropertyTaxRateSummary = {
  countyCount: number;
  averageCountyRate: number;
  medianCountyRate: number;
  lowestCountyRate: number;
  highestCountyRate: number;
};

function finiteNonNegative(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function estimateTaxFromRate(taxableValue: number, ratePerHundred: number): number {
  const value = finiteNonNegative(taxableValue);
  const rate = finiteNonNegative(ratePerHundred);
  return (value * rate) / 100;
}

export function summarizeCountyRates(counties: County[]): PropertyTaxRateSummary {
  const rates = counties
    .map((county) => finiteNonNegative(county.countyRate))
    .filter((rate) => rate > 0)
    .sort((left, right) => left - right);

  if (rates.length === 0) {
    return {
      countyCount: counties.length,
      averageCountyRate: 0,
      medianCountyRate: 0,
      lowestCountyRate: 0,
      highestCountyRate: 0,
    };
  }

  const middle = Math.floor(rates.length / 2);
  const median = rates.length % 2 === 0 ? (rates[middle - 1] + rates[middle]) / 2 : rates[middle];

  return {
    countyCount: counties.length,
    averageCountyRate: rates.reduce((sum, rate) => sum + rate, 0) / rates.length,
    medianCountyRate: median,
    lowestCountyRate: rates[0],
    highestCountyRate: rates[rates.length - 1],
  };
}

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function buildCountyRateCsv(counties: County[]): string {
  const header = ["County", "Tax year", "County tax rate per $100", "Estimated county levy per $100,000 taxable value", "Source"];
  const rows = [...counties]
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((county) => [
      county.name,
      county.taxYear,
      county.countyRate.toFixed(6),
      estimateTaxFromRate(100_000, county.countyRate).toFixed(2),
      county.dataSource,
    ]);

  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}
