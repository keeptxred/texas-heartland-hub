export type RelocationCity = {
  slug: string;
  name: string;
  parentCountySlug: string;
  metro: string;
  officialCityUrl: string;
  calculatorPaths: string[];
  sourceStatus: "official-links-and-planning-context";
};

export const CITY_RELOCATION_PATH = "/texas-relocation/cities";
export const CITY_COMPARISON_PATH = "/texas-relocation/compare-cities";

export const RELOCATION_CITIES: RelocationCity[] = [
  { slug: "houston", name: "Houston", parentCountySlug: "harris", metro: "Houston", officialCityUrl: "https://www.houstontx.gov/", calculatorPaths: ["/tools/texas-cost-of-living-comparison", "/tools/mortgage-calculator", "/tools/texas-commute-cost-calculator"], sourceStatus: "official-links-and-planning-context" },
  { slug: "dallas", name: "Dallas", parentCountySlug: "dallas", metro: "Dallas–Fort Worth", officialCityUrl: "https://dallascityhall.com/", calculatorPaths: ["/tools/texas-cost-of-living-comparison", "/tools/mortgage-calculator", "/tools/texas-commute-cost-calculator"], sourceStatus: "official-links-and-planning-context" },
  { slug: "fort-worth", name: "Fort Worth", parentCountySlug: "tarrant", metro: "Dallas–Fort Worth", officialCityUrl: "https://www.fortworthtexas.gov/", calculatorPaths: ["/tools/texas-cost-of-living-comparison", "/tools/mortgage-calculator", "/tools/texas-commute-cost-calculator"], sourceStatus: "official-links-and-planning-context" },
  { slug: "san-antonio", name: "San Antonio", parentCountySlug: "bexar", metro: "San Antonio", officialCityUrl: "https://www.sa.gov/", calculatorPaths: ["/tools/texas-cost-of-living-comparison", "/tools/mortgage-calculator", "/tools/texas-commute-cost-calculator"], sourceStatus: "official-links-and-planning-context" },
  { slug: "austin", name: "Austin", parentCountySlug: "travis", metro: "Austin", officialCityUrl: "https://www.austintexas.gov/", calculatorPaths: ["/tools/texas-cost-of-living-comparison", "/tools/mortgage-calculator", "/tools/texas-commute-cost-calculator"], sourceStatus: "official-links-and-planning-context" },
  { slug: "el-paso", name: "El Paso", parentCountySlug: "el-paso", metro: "El Paso", officialCityUrl: "https://www.elpasotexas.gov/", calculatorPaths: ["/tools/texas-cost-of-living-comparison", "/tools/mortgage-calculator", "/tools/texas-commute-cost-calculator"], sourceStatus: "official-links-and-planning-context" },
  { slug: "plano", name: "Plano", parentCountySlug: "collin", metro: "Dallas–Fort Worth", officialCityUrl: "https://www.plano.gov/", calculatorPaths: ["/tools/texas-cost-of-living-comparison", "/tools/mortgage-calculator", "/tools/texas-commute-cost-calculator"], sourceStatus: "official-links-and-planning-context" },
  { slug: "frisco", name: "Frisco", parentCountySlug: "collin", metro: "Dallas–Fort Worth", officialCityUrl: "https://www.friscotexas.gov/", calculatorPaths: ["/tools/texas-cost-of-living-comparison", "/tools/mortgage-calculator", "/tools/texas-commute-cost-calculator"], sourceStatus: "official-links-and-planning-context" },
  { slug: "katy", name: "Katy", parentCountySlug: "harris", metro: "Houston", officialCityUrl: "https://www.cityofkaty.com/", calculatorPaths: ["/tools/texas-cost-of-living-comparison", "/tools/mortgage-calculator", "/tools/texas-commute-cost-calculator"], sourceStatus: "official-links-and-planning-context" },
  { slug: "georgetown", name: "Georgetown", parentCountySlug: "williamson", metro: "Austin", officialCityUrl: "https://georgetown.org/", calculatorPaths: ["/tools/texas-cost-of-living-comparison", "/tools/mortgage-calculator", "/tools/texas-commute-cost-calculator"], sourceStatus: "official-links-and-planning-context" },
];

export const getRelocationCityBySlug = (slug: string) =>
  RELOCATION_CITIES.find((city) => city.slug === slug);
