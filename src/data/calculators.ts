export interface CalculatorDirectoryItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category:
    | "Housing"
    | "Taxes"
    | "Insurance"
    | "Utilities"
    | "Relocation"
    | "Financial";
  icon?: string;
  keywords: string[];
  featured?: boolean;
}

export const calculators: CalculatorDirectoryItem[] = [
  {
    id: "mortgage-calculator",
    title: "Texas Mortgage Calculator",
    slug: "/tools/mortgage-calculator",
    description: "Estimate your Texas mortgage payment including principal, interest, property taxes, insurance, PMI, and HOA costs.",
    category: "Housing",
    icon: "Home",
    keywords: ["texas mortgage calculator", "home payment calculator", "monthly mortgage payment texas", "buying a house in texas"],
    featured: true,
  },
  {
    id: "property-tax-calculator",
    title: "Texas Property Tax Calculator",
    slug: "/tools/property-tax-calculator",
    description: "Estimate Texas property taxes using home value, tax rates, and homestead exemptions.",
    category: "Taxes",
    icon: "Landmark",
    keywords: ["texas property tax calculator", "texas property taxes", "homestead exemption texas", "property tax estimate"],
    featured: true,
  },
  {
    id: "home-insurance-calculator",
    title: "Texas Home Insurance Calculator",
    slug: "/tools/home-insurance-calculator",
    description: "Estimate homeowners insurance costs based on home value, coverage, deductibles, and Texas risk factors.",
    category: "Insurance",
    icon: "Shield",
    keywords: ["texas homeowners insurance calculator", "home insurance cost texas", "texas insurance rates"],
    featured: true,
  },
  {
    id: "home-affordability-calculator",
    title: "Texas Home Affordability Calculator",
    slug: "/tools/home-affordability-calculator",
    description: "Find out how much home you can afford in Texas based on income, debts, mortgage rates, taxes, and insurance.",
    category: "Housing",
    icon: "Calculator",
    keywords: ["how much house can i afford texas", "texas affordability calculator", "home buying calculator"],
    featured: true,
  },
  {
    id: "closing-cost-calculator",
    title: "Texas Closing Cost Calculator",
    slug: "/tools/closing-cost-calculator",
    description: "Estimate buyer closing costs in Texas including lender fees, title costs, prepaid taxes, and insurance.",
    category: "Housing",
    icon: "FileText",
    keywords: ["texas closing costs", "home buying costs texas", "cash needed to buy house"],
  },
  {
    id: "utilities-calculator",
    title: "Texas Utilities Cost Calculator",
    slug: "/tools/texas-utilities-calculator",
    description: "Estimate monthly Texas utility costs including electricity, water, gas, internet, trash, and pool expenses.",
    category: "Utilities",
    icon: "Zap",
    keywords: ["texas utility costs", "cost of living texas", "moving to texas expenses"],
  },
  {
    id: "texas-relocation-budget-planner",
    title: "Texas Relocation Budget Planner",
    slug: "/tools/texas-relocation-budget-planner",
    description: "Estimate moving costs, deposits, vehicle and license fees, travel, contingency funds, and the emergency savings needed for a move to Texas.",
    category: "Relocation",
    icon: "MapPinned",
    keywords: ["texas relocation budget planner", "cost to move to texas", "texas moving cost calculator", "moving to texas budget", "texas relocation expenses"],
    featured: true,
  },
  {
    id: "texas-monthly-living-cost-calculator",
    title: "Texas Monthly Living Cost Calculator",
    slug: "/tools/texas-monthly-living-cost-calculator",
    description: "Build a complete monthly Texas household budget including housing, utilities, groceries, transportation, healthcare, childcare, and savings.",
    category: "Relocation",
    icon: "Wallet",
    keywords: ["texas monthly living cost calculator", "texas household budget", "cost to live in texas", "monthly expenses texas"],
    featured: true,
  },
  {
    id: "texas-commute-cost-calculator",
    title: "Texas Commute Cost Calculator",
    slug: "/tools/texas-commute-cost-calculator",
    description: "Estimate fuel, tolls, parking, vehicle wear, and time costs for a Texas commute.",
    category: "Financial",
    icon: "Car",
    keywords: ["texas commute cost calculator", "texas toll cost", "commuting cost calculator", "gas cost to work"],
  },
  {
    id: "texas-vehicle-fees-estimator",
    title: "Texas Vehicle Registration & Fees Estimator",
    slug: "/tools/texas-vehicle-fees-estimator",
    description: "Estimate Texas vehicle registration, title-transfer, county, processing, and new-resident fees.",
    category: "Relocation",
    icon: "BadgeDollarSign",
    keywords: ["texas vehicle registration fees", "texas title transfer cost", "new resident vehicle fees texas", "texas car registration calculator"],
  },
  {
    id: "texas-relocation-checklist-generator",
    title: "Texas Relocation Checklist Generator",
    slug: "/tools/texas-relocation-checklist-generator",
    description: "Generate a personalized moving-to-Texas checklist for the weeks before your move and your first month in Texas.",
    category: "Relocation",
    icon: "ListChecks",
    keywords: ["texas relocation checklist", "moving to texas checklist", "texas new resident checklist", "texas move planner"],
  },
];

export function getFeaturedCalculators() {
  return calculators.filter((calculator) => calculator.featured);
}

export function getCalculatorsByCategory(category: CalculatorDirectoryItem["category"]) {
  return calculators.filter((calculator) => calculator.category === category);
}

export function getCalculatorBySlug(slug: string) {
  return calculators.find((calculator) => calculator.slug === slug);
}
