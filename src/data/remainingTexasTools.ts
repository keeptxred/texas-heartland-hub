export type RemainingToolMode = "savings" | "budget" | "score" | "comparison" | "planner";

export interface RemainingTexasTool {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: "Housing" | "Taxes" | "Insurance" | "Utilities" | "Relocation" | "Financial";
  mode: RemainingToolMode;
  labels: [string, string, string];
  defaults: [number, number, number];
  unit: "currency" | "score" | "index" | "years";
  formulaVersion: string;
  sourceStatus: "planning-assumptions" | "official-data";
  reviewedOn: string;
}

const tool = (id: string, title: string, category: RemainingTexasTool["category"], mode: RemainingToolMode, labels: [string,string,string], defaults: [number,number,number], unit: RemainingTexasTool["unit"] = "currency"): RemainingTexasTool => ({
  id, title, slug: `/tools/${id}`, category, mode, labels, defaults, unit,
  description: `Use adjustable assumptions to estimate ${title.toLowerCase()} results. Calculations run locally in your browser and do not use AI credits.`,
  formulaVersion: "1.1",
  sourceStatus: "planning-assumptions",
  reviewedOn: "2026-07-22",
});

export const remainingTexasTools: RemainingTexasTool[] = [
  tool("texas-cost-of-living-by-zip-code", "Texas Cost of Living by ZIP Code", "Relocation", "comparison", ["Current monthly cost", "Texas ZIP index", "Current area index"], [5000,95,105]),
  tool("texas-homeownership-readiness-score", "Texas Homeownership Readiness Score", "Housing", "score", ["Monthly income", "Monthly debt", "Down payment savings"], [8000,1200,40000], "score"),
  tool("texas-homestead-exemption-savings-calculator", "Texas Homestead Exemption Savings Calculator", "Taxes", "savings", ["Home value", "Exemption amount", "Tax rate %"], [350000,140000,2.2]),
  tool("texas-property-tax-appeal-savings-estimator", "Texas Property Tax Appeal Savings Estimator", "Taxes", "savings", ["Current appraised value", "Target value", "Tax rate %"], [400000,360000,2.3]),
  tool("texas-school-district-comparison", "Texas School District Comparison Tool", "Relocation", "comparison", ["District A score", "District B score", "Priority weight"], [82,76,100], "index"),
  tool("texas-home-builder-cost-comparison", "Texas Home Builder Cost Comparison", "Housing", "comparison", ["Builder A price", "Builder B price", "Upgrade allowance"], [420000,400000,25000]),
  tool("texas-rent-affordability-calculator", "Texas Rent Affordability Calculator", "Housing", "score", ["Monthly income", "Monthly debt", "Proposed rent"], [7000,800,1800], "score"),
  tool("texas-new-construction-vs-existing-home", "Texas New Construction vs Existing Home Calculator", "Housing", "comparison", ["New construction price", "Existing home price", "First-year repairs"], [450000,400000,20000]),
  tool("texas-retirement-affordability-calculator", "Texas Retirement Affordability Calculator", "Financial", "budget", ["Monthly retirement income", "Monthly housing", "Other monthly costs"], [6500,2200,2600]),
  tool("texas-emergency-fund-calculator", "Texas Emergency Fund Calculator", "Financial", "budget", ["Essential monthly expenses", "Target months", "Current savings"], [4500,6,12000]),
  tool("texas-climate-utility-cost-estimator", "Texas Climate & Utility Cost Estimator", "Utilities", "budget", ["Summer monthly kWh", "Electric rate cents/kWh", "Other utilities"], [1800,15,180]),
  tool("texas-flood-risk-awareness-tool", "Texas Flood Risk Awareness Tool", "Insurance", "score", ["FEMA zone score", "Drainage score", "Insurance readiness"], [60,70,80], "score"),
  tool("should-i-move-to-texas", "Should I Move to Texas?", "Relocation", "score", ["Financial fit", "Lifestyle fit", "Climate fit"], [75,80,65], "score"),
  tool("which-texas-metro-fits-me-best", "Which Texas Metro Fits Me Best?", "Relocation", "comparison", ["Affordability priority", "Jobs priority", "Lifestyle priority"], [90,80,70], "index"),
  tool("can-i-afford-major-texas-metros", "Can I Afford Austin, Dallas, Houston, San Antonio, or Fort Worth?", "Relocation", "score", ["Monthly take-home pay", "Target housing", "Other expenses"], [7500,2200,3200], "score"),
  tool("texas-lifestyle-match-quiz", "Texas Lifestyle Match Quiz", "Relocation", "score", ["Urban preference", "Outdoor preference", "Family preference"], [70,75,85], "score"),
  tool("texas-family-relocation-planner", "Texas Family Relocation Planner", "Relocation", "planner", ["Moving budget", "Monthly housing", "Childcare/school setup"], [18000,2400,3000]),
  tool("remote-worker-texas-savings-calculator", "Remote Worker Texas Savings Calculator", "Financial", "savings", ["Current annual costs", "Texas annual costs", "Moving cost"], [72000,60000,8000]),
  tool("military-pcs-to-texas-planner", "Military PCS to Texas Planner", "Relocation", "planner", ["Reimbursed amount", "Estimated move cost", "Setup costs"], [9000,11000,4500]),
  tool("retire-in-texas-planner", "Retire in Texas Planner", "Relocation", "planner", ["Annual retirement income", "Annual Texas costs", "Healthcare reserve"], [90000,68000,12000]),
  tool("texas-no-state-income-tax-savings-calculator", "No State Income Tax Savings Calculator", "Taxes", "savings", ["Annual taxable income", "Current state tax rate %", "Texas added costs"], [120000,5,1500]),
  tool("texas-sales-tax-calculator", "Texas Sales Tax Calculator", "Taxes", "budget", ["Purchase amount", "State/local tax rate %", "Taxable share %"], [1000,8.25,100]),
  tool("texas-toll-cost-calculator", "Texas Toll Cost Calculator", "Financial", "budget", ["Toll per trip", "Trips per week", "Weeks per year"], [6,10,48]),
  tool("texas-hoa-cost-estimator", "Texas HOA Cost Estimator", "Housing", "budget", ["Monthly HOA", "Annual special assessment", "Years"], [120,500,5]),
  tool("texas-pool-ownership-cost-calculator", "Texas Pool Ownership Cost Calculator", "Housing", "budget", ["Monthly electricity", "Monthly chemicals/service", "Annual repairs"], [120,180,1200]),
  tool("texas-solar-payback-calculator", "Texas Solar Payback Calculator", "Utilities", "savings", ["Net system cost", "Annual electric savings", "Annual maintenance"], [24000,2400,200], "years"),
  tool("texas-hurricane-preparedness-budget", "Texas Hurricane Preparedness Budget Calculator", "Financial", "budget", ["Supplies", "Home protection", "Evacuation reserve"], [600,2500,1500]),
  tool("texas-generator-sizing-cost-calculator", "Texas Generator Sizing & Cost Calculator", "Utilities", "budget", ["Essential watts", "Generator dollars per kW", "Installation"], [12000,700,5500]),
  tool("texas-water-bill-estimator", "Texas Water Bill Estimator", "Utilities", "budget", ["Monthly gallons", "Rate per 1,000 gallons", "Base fees"], [9000,7,45]),
  tool("texas-internet-cost-comparison", "Texas Internet Cost Comparison", "Utilities", "comparison", ["Provider A monthly", "Provider B monthly", "Switching costs"], [80,55,100]),
  tool("compare-texas-counties", "Compare Texas Counties", "Relocation", "comparison", ["County A index", "County B index", "Priority weight"], [78,72,100], "index"),
  tool("compare-texas-isds", "Compare Texas ISDs", "Relocation", "comparison", ["ISD A index", "ISD B index", "Priority weight"], [84,79,100], "index"),
  tool("compare-texas-property-tax-rates", "Compare Property Tax Rates by County", "Taxes", "comparison", ["Home value", "County A rate %", "County B rate %"], [350000,2.1,2.6]),
  tool("compare-texas-median-home-prices", "Compare Texas Median Home Prices", "Housing", "comparison", ["Metro A median", "Metro B median", "Down payment %"], [380000,460000,10]),
  tool("compare-texas-crime-safety", "Compare Crime and Safety Information", "Relocation", "comparison", ["Area A safety index", "Area B safety index", "Priority weight"], [72,81,100], "index"),
  tool("compare-texas-population-growth", "Compare Population Growth", "Relocation", "comparison", ["Area A growth %", "Area B growth %", "Years"], [3.2,1.8,5], "index"),
  tool("compare-texas-commute-times", "Compare Average Commute Times", "Relocation", "comparison", ["Area A minutes", "Area B minutes", "Work days/year"], [34,26,240], "index"),
  tool("compare-texas-utility-costs", "Compare Utility Costs", "Utilities", "comparison", ["Area A monthly", "Area B monthly", "Months"], [360,290,12]),
  tool("unified-texas-relocation-planner", "Unified Texas Relocation Planner", "Relocation", "planner", ["Moving/setup costs", "Annual Texas living costs", "Emergency reserve"], [18000,72000,18000]),
];

const clamp = (value: number, min = 0, max = Number.POSITIVE_INFINITY) => Math.min(max, Math.max(min, value));

export function calculateRemainingTool(tool: RemainingTexasTool, a: number, b: number, c: number) {
  const [x,y,z] = [a,b,c].map((value) => Number.isFinite(value) ? Math.max(0, value) : 0);
  switch (tool.id) {
    case "texas-cost-of-living-by-zip-code": return x * (y / Math.max(1, z));
    case "texas-homeownership-readiness-score": return clamp((clamp(1 - y / Math.max(1, x), 0, 1) * 55) + (clamp(z / Math.max(1, x * 6), 0, 1) * 45), 0, 100);
    case "texas-homestead-exemption-savings-calculator": return Math.min(x, y) * (z / 100);
    case "texas-property-tax-appeal-savings-estimator": return Math.max(0, x - y) * (z / 100);
    case "texas-school-district-comparison":
    case "compare-texas-counties":
    case "compare-texas-isds":
    case "compare-texas-crime-safety": return (x - y) * (z / 100);
    case "texas-home-builder-cost-comparison": return x - (y + z);
    case "texas-rent-affordability-calculator": return clamp(100 - (((y + z) / Math.max(1, x)) * 100), 0, 100);
    case "texas-new-construction-vs-existing-home": return x - (y + z);
    case "texas-retirement-affordability-calculator": return (x - y - z) * 12;
    case "texas-emergency-fund-calculator": return Math.max(0, x * y - z);
    case "texas-climate-utility-cost-estimator": return x * (y / 100) + z;
    case "texas-flood-risk-awareness-tool": return clamp((x + y + z) / 3, 0, 100);
    case "should-i-move-to-texas":
    case "texas-lifestyle-match-quiz": return clamp((x + y + z) / 3, 0, 100);
    case "which-texas-metro-fits-me-best": return (x + y + z) / 3;
    case "can-i-afford-major-texas-metros": return clamp(((x - y - z) / Math.max(1, x)) * 100, 0, 100);
    case "texas-family-relocation-planner": return x + (y * 3) + z;
    case "remote-worker-texas-savings-calculator": return x - y - z;
    case "military-pcs-to-texas-planner": return y + z - x;
    case "retire-in-texas-planner": return x - y - z;
    case "texas-no-state-income-tax-savings-calculator": return x * (y / 100) - z;
    case "texas-sales-tax-calculator": return x * (y / 100) * (z / 100);
    case "texas-toll-cost-calculator": return x * y * z;
    case "texas-hoa-cost-estimator": return (x * 12 + y) * z;
    case "texas-pool-ownership-cost-calculator": return (x + y) * 12 + z;
    case "texas-solar-payback-calculator": return y <= z ? 0 : x / (y - z);
    case "texas-hurricane-preparedness-budget": return x + y + z;
    case "texas-generator-sizing-cost-calculator": return (x / 1000) * y + z;
    case "texas-water-bill-estimator": return (x / 1000) * y + z;
    case "texas-internet-cost-comparison": return (x - y) * 12 - z;
    case "compare-texas-property-tax-rates": return x * ((z - y) / 100);
    case "compare-texas-median-home-prices": return (y - x) * (z / 100);
    case "compare-texas-population-growth": return (x - y) * z;
    case "compare-texas-commute-times": return (x - y) * z;
    case "compare-texas-utility-costs": return (x - y) * z;
    case "unified-texas-relocation-planner": return x + y + z;
    default: return x + y + z;
  }
}
