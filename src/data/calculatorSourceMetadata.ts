export interface CalculatorSourceMetadata {
  agency: string;
  title: string;
  url: string;
  effectiveOn?: string;
  reviewedOn: string;
  reviewAfter: string;
  scopeNote: string;
}

const sources: Record<string, CalculatorSourceMetadata[]> = {
  "texas-homestead-exemption-savings-calculator": [
    {
      agency: "Texas Comptroller of Public Accounts",
      title: "Property Tax Exemptions — Residence Homestead",
      url: "https://comptroller.texas.gov/taxes/property-tax/exemptions/index.php",
      effectiveOn: "2026-01-01",
      reviewedOn: "2026-07-22",
      reviewAfter: "2027-01-15",
      scopeNote: "The statewide school-district residence homestead exemption is an official baseline; local optional exemptions and taxing-unit rates vary.",
    },
  ],
  "texas-property-tax-appeal-savings-estimator": [
    {
      agency: "Texas Comptroller of Public Accounts",
      title: "Valuing Property and Appraisal Protests",
      url: "https://comptroller.texas.gov/taxes/property-tax/valuing-property.php",
      reviewedOn: "2026-07-22",
      reviewAfter: "2027-01-15",
      scopeNote: "Protest rights and appraisal limits are statewide; the entered appraised value, target value, and local tax rate must come from current local records.",
    },
  ],
  "texas-sales-tax-calculator": [
    {
      agency: "Texas Comptroller of Public Accounts",
      title: "Texas Use Tax Rates",
      url: "https://comptroller.texas.gov/taxes/sales/use-tax.php",
      effectiveOn: "2026-07-01",
      reviewedOn: "2026-07-22",
      reviewAfter: "2026-10-15",
      scopeNote: "Texas imposes a 6.25% state rate; local rates can add up to 2%. Use the Comptroller locator for the exact address rate.",
    },
  ],
  "texas-toll-cost-calculator": [
    {
      agency: "Texas Department of Transportation",
      title: "Toll Roads in Texas and Current Rate Tables",
      url: "https://www.txdot.gov/discover/toll-roads-managed-lanes/txdot-toll-roads.html",
      effectiveOn: "2026-01-01",
      reviewedOn: "2026-07-22",
      reviewAfter: "2027-01-15",
      scopeNote: "Rates vary by road, entry and exit, time, vehicle class, and tag status. Enter the current route-specific toll rather than a statewide average.",
    },
  ],
  "texas-flood-risk-awareness-tool": [
    {
      agency: "Federal Emergency Management Agency",
      title: "National Flood Hazard Layer",
      url: "https://www.fema.gov/flood-maps/national-flood-hazard-layer",
      reviewedOn: "2026-07-22",
      reviewAfter: "2027-01-15",
      scopeNote: "Flood maps and local drainage information are address-specific. This tool is only an awareness aid and not a flood-zone determination.",
    },
  ],
  "texas-electricity-plan-savings-calculator": [
    {
      agency: "Public Utility Commission of Texas",
      title: "Electricity Consumer Information",
      url: "https://www.puc.texas.gov/consumer/electricity/",
      reviewedOn: "2026-07-22",
      reviewAfter: "2026-10-15",
      scopeNote: "Retail offers, delivery charges, usage tiers, and service territories change frequently. Compare the current Electricity Facts Labels for the exact address and usage level.",
    },
  ],
  "compare-texas-population-growth": [
    {
      agency: "U.S. Census Bureau",
      title: "American Community Survey Data",
      url: "https://www.census.gov/programs-surveys/acs/data.html",
      reviewedOn: "2026-07-22",
      reviewAfter: "2027-01-15",
      scopeNote: "Use matching ACS vintages and geographic levels when comparing growth rates.",
    },
  ],
  "compare-texas-commute-times": [
    {
      agency: "U.S. Census Bureau",
      title: "American Community Survey Data",
      url: "https://www.census.gov/programs-surveys/acs/data.html",
      reviewedOn: "2026-07-22",
      reviewAfter: "2027-01-15",
      scopeNote: "Average commute estimates should use the same ACS vintage and geography for both areas.",
    },
  ],
  "compare-texas-median-home-prices": [
    {
      agency: "U.S. Census Bureau",
      title: "American Community Survey Data",
      url: "https://www.census.gov/programs-surveys/acs/data.html",
      reviewedOn: "2026-07-22",
      reviewAfter: "2027-01-15",
      scopeNote: "ACS home-value measures are survey estimates and are not live listing prices or appraisals.",
    },
  ],
  "compare-texas-crime-safety": [
    {
      agency: "Federal Bureau of Investigation",
      title: "Crime Data Explorer",
      url: "https://cde.ucr.cjis.gov/",
      reviewedOn: "2026-07-22",
      reviewAfter: "2027-01-15",
      scopeNote: "Reporting coverage and agency participation vary. Compare the same period and reporting basis and do not treat an index as a prediction of personal safety.",
    },
  ],
};

export function getCalculatorSources(calculatorId: string) {
  return sources[calculatorId] ?? [];
}

export function isSourceStale(source: CalculatorSourceMetadata, now = new Date()) {
  const reviewDate = new Date(`${source.reviewAfter}T23:59:59Z`);
  return Number.isNaN(reviewDate.getTime()) || now.getTime() > reviewDate.getTime();
}
