export type PropertyTaxOfficialFile = {
  label: string;
  url: string;
  year: number;
  scope: string;
  format: "XLSX";
};

export const PROPERTY_TAX_DATA_REVIEWED_AT = "2026-08-19";

export const PROPERTY_TAX_OFFICIAL_FILES: PropertyTaxOfficialFile[] = [
  {
    label: "2025 County Rates and Levies",
    url: "https://comptroller.texas.gov/taxes/property-tax/docs/2025-county-rates-levies.xlsx",
    year: 2025,
    scope: "County taxing-unit rates, reported taxable values, and calculated levies published by the Texas Comptroller.",
    format: "XLSX",
  },
  {
    label: "2025 School District Rates and Levies",
    url: "https://comptroller.texas.gov/taxes/property-tax/docs/2025-school-district-rates-levies.xlsx",
    year: 2025,
    scope: "School district tax rates, taxable values, and calculated levies used with the Comptroller's property-value reporting.",
    format: "XLSX",
  },
  {
    label: "2025 City Rates and Levies",
    url: "https://comptroller.texas.gov/taxes/property-tax/docs/2025-city-rates-levies.xlsx",
    year: 2025,
    scope: "Municipal tax rates, taxable values, and calculated levies reported through appraisal districts.",
    format: "XLSX",
  },
  {
    label: "2025 Special District Rates and Levies",
    url: "https://comptroller.texas.gov/taxes/property-tax/docs/2025-special-district-rates-levies.xlsx",
    year: 2025,
    scope: "Special-purpose taxing district rates, taxable values, and calculated levies.",
    format: "XLSX",
  },
  {
    label: "2025 All Taxing Units — Combined File",
    url: "https://comptroller.texas.gov/taxes/property-tax/docs/2025-total-rates-levies.xlsx",
    year: 2025,
    scope: "Combined cities, counties, school districts, and special districts in one statewide workbook.",
    format: "XLSX",
  },
];

export const PROPERTY_TAX_REFERENCE_LINKS = [
  {
    label: "Texas Comptroller Tax Rates and Levies",
    url: "https://comptroller.texas.gov/taxes/property-tax/rates/index.php",
    note: "Official publication page for current and historical statewide tax-rate and levy workbooks.",
  },
  {
    label: "Local Property Appraisal and Tax Information",
    url: "https://comptroller.texas.gov/taxes/property-tax/county-directory/",
    note: "County-by-county directory for appraisal districts, tax offices, and the taxing units they serve.",
  },
  {
    label: "Property Tax Data Reports and Surveys",
    url: "https://comptroller.texas.gov/taxes/property-tax/reports/index.php",
    note: "Biennial reports, appraisal-district operations data, and other statewide property-tax reports.",
  },
] as const;
