export type DataRow = {
  label: string;
  slug?: string;
  value: number;
  previous?: number;
  note?: string;
};

export type TrendPoint = { year: number; value: number };

export type TexasDataset = {
  slug: string;
  title: string;
  description: string;
  category: string;
  unit: "percent" | "dollars" | "count";
  year: number;
  updated: string;
  sourceName: string;
  sourceUrl: string;
  methodology: string;
  rows: DataRow[];
  trend?: TrendPoint[];
  relatedRepresentatives: { label: string; href: string }[];
  relatedLegislation: { label: string; href: string }[];
};

export const TEXAS_DATASETS: TexasDataset[] = [
  {
    slug: "county-property-tax-rates",
    title: "Texas County Property-Tax Rate Rankings",
    description: "Compare adopted county property-tax rates for major Texas counties. Rankings use the county government rate only and do not include cities, school districts, or special districts.",
    category: "Property taxes",
    unit: "percent",
    year: 2024,
    updated: "2026-07-30",
    sourceName: "Texas Comptroller property-tax rate data",
    sourceUrl: "https://comptroller.texas.gov/taxes/property-tax/rates/",
    methodology: "KeepTXRed ranks the available adopted county rates from highest to lowest. A rate of 0.3769 is displayed as 0.3769%, matching Texas property-tax convention per $100 of taxable value. Missing counties are not treated as zero and are excluded.",
    rows: [
      { label: "El Paso County", slug: "el-paso", value: 0.45 },
      { label: "Fort Bend County", slug: "fort-bend", value: 0.4383 },
      { label: "Harris County", slug: "harris", value: 0.3769 },
      { label: "Williamson County", slug: "williamson", value: 0.3331 },
      { label: "Travis County", slug: "travis", value: 0.3047 },
      { label: "Bexar County", slug: "bexar", value: 0.2768 },
      { label: "Dallas County", slug: "dallas", value: 0.2179 },
      { label: "Tarrant County", slug: "tarrant", value: 0.1945 },
      { label: "Denton County", slug: "denton", value: 0.1898 },
      { label: "Collin County", slug: "collin", value: 0.1499 },
    ],
    relatedRepresentatives: [
      { label: "Find Texas representatives", href: "/representatives" },
      { label: "Texas Legislature", href: "/legislature" },
    ],
    relatedLegislation: [
      { label: "Texas property-tax laws", href: "/texas-property-tax-laws-explained" },
      { label: "Browse Texas bills", href: "/bills" },
    ],
  },
  {
    slug: "school-district-tax-rates",
    title: "Texas School-District Tax Rate Rankings",
    description: "Compare selected school-district property-tax rates reported in the statewide county tax dataset.",
    category: "Education",
    unit: "percent",
    year: 2024,
    updated: "2026-07-30",
    sourceName: "Texas Comptroller property-tax rate data",
    sourceUrl: "https://comptroller.texas.gov/taxes/property-tax/rates/",
    methodology: "KeepTXRed ranks selected school-district adopted rates from highest to lowest. The comparison is limited to districts currently verified in the project dataset and is not presented as a complete ranking of every Texas school district.",
    rows: [
      { label: "Judson ISD", value: 1.3022, note: "Bexar County" },
      { label: "Hutto ISD", value: 1.2925, note: "Williamson County" },
      { label: "Mesquite ISD", value: 1.2746, note: "Dallas County" },
      { label: "Argyle ISD", value: 1.2675, note: "Denton County" },
      { label: "Pflugerville ISD", value: 1.2546, note: "Travis County" },
      { label: "Socorro ISD", value: 1.2293, note: "El Paso County" },
      { label: "Ysleta ISD", value: 1.2237, note: "El Paso County" },
      { label: "McKinney ISD", value: 1.1675, note: "Collin County" },
      { label: "Denton ISD", value: 1.1592, note: "Denton County" },
      { label: "Garland ISD", value: 1.1546, note: "Dallas County" },
    ],
    relatedRepresentatives: [
      { label: "Find education committee members", href: "/representatives" },
      { label: "Texas Legislature", href: "/legislature" },
    ],
    relatedLegislation: [
      { label: "Browse education bills", href: "/bills" },
      { label: "Texas property-tax guide", href: "/texas-property-tax-laws-explained" },
    ],
  },
  {
    slug: "homestead-exemption-history",
    title: "Texas School Homestead Exemption History",
    description: "Track the statewide mandatory school-district homestead exemption and its major voter-approved increases.",
    category: "Historical trends",
    unit: "dollars",
    year: 2025,
    updated: "2026-07-30",
    sourceName: "Texas Constitution and Texas Comptroller guidance",
    sourceUrl: "https://comptroller.texas.gov/taxes/property-tax/exemptions/residence-faq.php",
    methodology: "The series records major statewide mandatory school-district residence-homestead exemption levels after voter approval. Local optional exemptions and special exemptions for older or disabled homeowners are not included.",
    rows: [
      { label: "2025", value: 140000, previous: 100000 },
      { label: "2023", value: 100000, previous: 40000 },
      { label: "2022", value: 40000, previous: 25000 },
      { label: "2015", value: 25000, previous: 15000 },
    ],
    trend: [
      { year: 2014, value: 15000 },
      { year: 2015, value: 25000 },
      { year: 2022, value: 40000 },
      { year: 2023, value: 100000 },
      { year: 2025, value: 140000 },
    ],
    relatedRepresentatives: [
      { label: "Find your Texas legislators", href: "/representatives" },
      { label: "Texas Legislature sessions", href: "/legislature" },
    ],
    relatedLegislation: [
      { label: "Texas property-tax laws", href: "/texas-property-tax-laws-explained" },
      { label: "Property-tax calculator", href: "/tax-calculator" },
      { label: "Browse Texas bills", href: "/bills" },
    ],
  },
];

export function getTexasDataset(slug: string) {
  return TEXAS_DATASETS.find((dataset) => dataset.slug === slug);
}

export function formatDatasetValue(value: number, unit: TexasDataset["unit"]) {
  if (unit === "dollars") return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  if (unit === "percent") return `${value.toFixed(4)}%`;
  return new Intl.NumberFormat("en-US").format(value);
}
