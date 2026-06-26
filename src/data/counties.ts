// Approximate Texas property tax rates per $100 of assessed value.
// Sources: county appraisal district published rates, TX Comptroller summaries (2023-2024).
// These are illustrative averages — actual bills vary by city, ISD, and special district.

export type SchoolDistrict = {
  name: string;
  rate: number; // per $100 assessed value
};

export type County = {
  slug: string;
  name: string;
  region: string;
  countyRate: number;
  cityAvgRate: number;
  specialDistrictRate: number;
  homesteadExemption: number; // applied against school taxable value
  schoolDistricts: SchoolDistrict[];
};

export const COUNTIES: County[] = [
  {
    slug: "harris",
    name: "Harris County",
    region: "Houston Metro",
    countyRate: 0.3769,
    cityAvgRate: 0.5198,
    specialDistrictRate: 0.1850,
    homesteadExemption: 100000,
    schoolDistricts: [
      { name: "Houston ISD", rate: 0.8683 },
      { name: "Cypress-Fairbanks ISD", rate: 1.1146 },
      { name: "Katy ISD", rate: 1.1175 },
      { name: "Spring Branch ISD", rate: 1.0934 },
    ],
  },
  {
    slug: "dallas",
    name: "Dallas County",
    region: "DFW Metroplex",
    countyRate: 0.2179,
    cityAvgRate: 0.7458,
    specialDistrictRate: 0.2435,
    homesteadExemption: 100000,
    schoolDistricts: [
      { name: "Dallas ISD", rate: 1.0828 },
      { name: "Richardson ISD", rate: 1.0316 },
      { name: "Garland ISD", rate: 1.1546 },
      { name: "Mesquite ISD", rate: 1.2746 },
    ],
  },
  {
    slug: "tarrant",
    name: "Tarrant County",
    region: "DFW Metroplex",
    countyRate: 0.1945,
    cityAvgRate: 0.6725,
    specialDistrictRate: 0.2244,
    homesteadExemption: 100000,
    schoolDistricts: [
      { name: "Fort Worth ISD", rate: 1.0664 },
      { name: "Arlington ISD", rate: 1.0892 },
      { name: "Keller ISD", rate: 1.0867 },
      { name: "Northwest ISD", rate: 1.0900 },
    ],
  },
  {
    slug: "bexar",
    name: "Bexar County",
    region: "San Antonio",
    countyRate: 0.2768,
    cityAvgRate: 0.5418,
    specialDistrictRate: 0.2762,
    homesteadExemption: 100000,
    schoolDistricts: [
      { name: "Northside ISD", rate: 1.0408 },
      { name: "North East ISD", rate: 1.0334 },
      { name: "San Antonio ISD", rate: 1.1408 },
      { name: "Judson ISD", rate: 1.3022 },
    ],
  },
  {
    slug: "travis",
    name: "Travis County",
    region: "Austin",
    countyRate: 0.3047,
    cityAvgRate: 0.4458,
    specialDistrictRate: 0.0998,
    homesteadExemption: 100000,
    schoolDistricts: [
      { name: "Austin ISD", rate: 0.8649 },
      { name: "Round Rock ISD", rate: 0.9046 },
      { name: "Leander ISD", rate: 1.1075 },
      { name: "Pflugerville ISD", rate: 1.2546 },
    ],
  },
  {
    slug: "collin",
    name: "Collin County",
    region: "North DFW",
    countyRate: 0.1499,
    cityAvgRate: 0.4322,
    specialDistrictRate: 0.0828,
    homesteadExemption: 100000,
    schoolDistricts: [
      { name: "Plano ISD", rate: 1.0779 },
      { name: "Frisco ISD", rate: 1.0727 },
      { name: "McKinney ISD", rate: 1.1675 },
      { name: "Allen ISD", rate: 1.1294 },
    ],
  },
  {
    slug: "denton",
    name: "Denton County",
    region: "North DFW",
    countyRate: 0.1898,
    cityAvgRate: 0.5535,
    specialDistrictRate: 0.1233,
    homesteadExemption: 100000,
    schoolDistricts: [
      { name: "Denton ISD", rate: 1.1592 },
      { name: "Lewisville ISD", rate: 1.0867 },
      { name: "Argyle ISD", rate: 1.2675 },
    ],
  },
  {
    slug: "williamson",
    name: "Williamson County",
    region: "Greater Austin",
    countyRate: 0.3331,
    cityAvgRate: 0.4012,
    specialDistrictRate: 0.1097,
    homesteadExemption: 100000,
    schoolDistricts: [
      { name: "Round Rock ISD", rate: 0.9046 },
      { name: "Leander ISD", rate: 1.1075 },
      { name: "Georgetown ISD", rate: 1.0816 },
      { name: "Hutto ISD", rate: 1.2925 },
    ],
  },
  {
    slug: "fort-bend",
    name: "Fort Bend County",
    region: "Greater Houston",
    countyRate: 0.4383,
    cityAvgRate: 0.4475,
    specialDistrictRate: 0.2987,
    homesteadExemption: 100000,
    schoolDistricts: [
      { name: "Fort Bend ISD", rate: 1.0793 },
      { name: "Katy ISD", rate: 1.1175 },
      { name: "Lamar CISD", rate: 1.1487 },
    ],
  },
  {
    slug: "el-paso",
    name: "El Paso County",
    region: "West Texas",
    countyRate: 0.4500,
    cityAvgRate: 0.8645,
    specialDistrictRate: 0.2031,
    homesteadExemption: 100000,
    schoolDistricts: [
      { name: "El Paso ISD", rate: 1.0746 },
      { name: "Socorro ISD", rate: 1.2293 },
      { name: "Ysleta ISD", rate: 1.2237 },
    ],
  },
];

export function getCountyBySlug(slug: string): County | undefined {
  return COUNTIES.find((c) => c.slug === slug);
}