export type LaunchCounty = {
  slug: string;
  name: string;
  metro: string;
  countySeat: string;
  appraisalDistrictUrl: string;
  officialCountyUrl: string;
  calculatorPaths: string[];
};

export type LaunchGuide = {
  slug: string;
  title: string;
  description: string;
  relatedCalculatorPaths: string[];
};

export const RELOCATION_LAUNCH_PATH = "/texas-relocation";

export const LAUNCH_CALCULATOR_PATHS = [
  "/tax-calculator",
  "/tools/mortgage-calculator",
  "/tools/texas-cost-of-living-comparison",
  "/tools/unified-texas-relocation-planner",
] as const;

export const LAUNCH_COUNTIES: LaunchCounty[] = [
  {
    slug: "harris",
    name: "Harris County",
    metro: "Houston",
    countySeat: "Houston",
    appraisalDistrictUrl: "https://hcad.org/",
    officialCountyUrl: "https://www.harriscountytx.gov/",
    calculatorPaths: ["/tax-calculator", "/tools/mortgage-calculator", "/tools/texas-cost-of-living-comparison"],
  },
  {
    slug: "dallas",
    name: "Dallas County",
    metro: "Dallas–Fort Worth",
    countySeat: "Dallas",
    appraisalDistrictUrl: "https://www.dallascad.org/",
    officialCountyUrl: "https://www.dallascounty.org/",
    calculatorPaths: ["/tax-calculator", "/tools/mortgage-calculator", "/tools/texas-cost-of-living-comparison"],
  },
  {
    slug: "tarrant",
    name: "Tarrant County",
    metro: "Dallas–Fort Worth",
    countySeat: "Fort Worth",
    appraisalDistrictUrl: "https://www.tad.org/",
    officialCountyUrl: "https://www.tarrantcountytx.gov/",
    calculatorPaths: ["/tax-calculator", "/tools/mortgage-calculator", "/tools/texas-cost-of-living-comparison"],
  },
  {
    slug: "bexar",
    name: "Bexar County",
    metro: "San Antonio",
    countySeat: "San Antonio",
    appraisalDistrictUrl: "https://www.bcad.org/",
    officialCountyUrl: "https://www.bexar.org/",
    calculatorPaths: ["/tax-calculator", "/tools/mortgage-calculator", "/tools/texas-cost-of-living-comparison"],
  },
  {
    slug: "travis",
    name: "Travis County",
    metro: "Austin",
    countySeat: "Austin",
    appraisalDistrictUrl: "https://traviscad.org/",
    officialCountyUrl: "https://www.traviscountytx.gov/",
    calculatorPaths: ["/tax-calculator", "/tools/mortgage-calculator", "/tools/texas-cost-of-living-comparison"],
  },
  {
    slug: "collin",
    name: "Collin County",
    metro: "Dallas–Fort Worth",
    countySeat: "McKinney",
    appraisalDistrictUrl: "https://www.collincad.org/",
    officialCountyUrl: "https://www.collincountytx.gov/",
    calculatorPaths: ["/tax-calculator", "/tools/mortgage-calculator", "/tools/texas-cost-of-living-comparison"],
  },
  {
    slug: "denton",
    name: "Denton County",
    metro: "Dallas–Fort Worth",
    countySeat: "Denton",
    appraisalDistrictUrl: "https://www.dentoncad.com/",
    officialCountyUrl: "https://www.dentoncounty.gov/",
    calculatorPaths: ["/tax-calculator", "/tools/mortgage-calculator", "/tools/texas-cost-of-living-comparison"],
  },
  {
    slug: "williamson",
    name: "Williamson County",
    metro: "Austin",
    countySeat: "Georgetown",
    appraisalDistrictUrl: "https://www.wcad.org/",
    officialCountyUrl: "https://www.wilcotx.gov/",
    calculatorPaths: ["/tax-calculator", "/tools/mortgage-calculator", "/tools/texas-cost-of-living-comparison"],
  },
  {
    slug: "fort-bend",
    name: "Fort Bend County",
    metro: "Houston",
    countySeat: "Richmond",
    appraisalDistrictUrl: "https://www.fbcad.org/",
    officialCountyUrl: "https://www.fortbendcountytx.gov/",
    calculatorPaths: ["/tax-calculator", "/tools/mortgage-calculator", "/tools/texas-cost-of-living-comparison"],
  },
  {
    slug: "el-paso",
    name: "El Paso County",
    metro: "El Paso",
    countySeat: "El Paso",
    appraisalDistrictUrl: "https://epcad.org/",
    officialCountyUrl: "https://www.epcounty.com/",
    calculatorPaths: ["/tax-calculator", "/tools/mortgage-calculator", "/tools/texas-cost-of-living-comparison"],
  },
];

export const LAUNCH_GUIDES: LaunchGuide[] = [
  {
    slug: "texas-property-tax-guide",
    title: "Texas Property Tax Guide",
    description: "Understand taxable value, local taxing units, homestead exemptions, appraisal notices, and protest basics.",
    relatedCalculatorPaths: ["/tax-calculator", "/tools/mortgage-calculator"],
  },
  {
    slug: "moving-to-texas-guide",
    title: "Moving to Texas Guide",
    description: "Plan housing, utilities, vehicles, schools, insurance, and first-month relocation costs.",
    relatedCalculatorPaths: ["/tools/unified-texas-relocation-planner", "/tools/texas-relocation-budget-planner"],
  },
  {
    slug: "texas-cost-of-living-guide",
    title: "Texas Cost of Living Guide",
    description: "Compare housing, transportation, utilities, taxes, insurance, and household spending across Texas metros.",
    relatedCalculatorPaths: ["/tools/texas-cost-of-living-comparison", "/tools/texas-monthly-living-cost-calculator"],
  },
  {
    slug: "choosing-a-texas-county",
    title: "How to Choose a Texas County",
    description: "Evaluate commute, housing, school districts, taxes, flood exposure, utilities, and local services before moving.",
    relatedCalculatorPaths: ["/tools/best-texas-city-finder", "/tax-calculator", "/tools/texas-commute-cost-calculator"],
  },
];

export const getLaunchCountyBySlug = (slug: string) =>
  LAUNCH_COUNTIES.find((county) => county.slug === slug);

export const getLaunchGuideBySlug = (slug: string) =>
  LAUNCH_GUIDES.find((guide) => guide.slug === slug);
