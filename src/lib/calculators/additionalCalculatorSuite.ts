import type { AdditionalCalculatorDefinition, AdditionalCalculatorResult } from "@/types/calculators/additionalCalculator";

const money = (label: string, value: number, highlight = false): AdditionalCalculatorResult => ({ label, value: Number.isFinite(value) ? value : 0, type: "currency", highlight });
const percent = (label: string, value: number): AdditionalCalculatorResult => ({ label, value: Number.isFinite(value) ? value : 0, type: "percent" });
const field = (key: string, label: string, defaultValue: number, prefix?: string, suffix?: string, helpText?: string, min = 0, max = 10000000, step = 1) => ({ key, label, defaultValue, prefix, suffix, helpText, min, max, step, required: true });
const faq = (title: string) => [
  { question: `Is the ${title} an official quote?`, answer: "No. It is an educational estimate. Confirm costs, eligibility, rates, coverage, taxes, and program terms with the appropriate official source." },
  { question: "Does this calculator store my financial information?", answer: "No. The calculation runs in your browser and does not require an account." },
];
const bounded = (input: Record<string, number>, fields: AdditionalCalculatorDefinition["fields"]) => Object.fromEntries(fields.flatMap((item) => {
  const value = input[item.key];
  if (!Number.isFinite(value)) return [[item.key, "Enter a valid number."]];
  if (item.min !== undefined && value < item.min) return [[item.key, `Enter at least ${item.min}.`]];
  if (item.max !== undefined && value > item.max) return [[item.key, `Enter no more than ${item.max}.`]];
  return [];
}));
const monthlyPayment = (principal: number, annualRatePercent: number, years: number) => {
  const months = Math.max(1, years * 12);
  const rate = annualRatePercent / 100 / 12;
  if (rate === 0) return principal / months;
  const factor = Math.pow(1 + rate, months);
  return principal * (rate * factor) / (factor - 1);
};

const definitions: AdditionalCalculatorDefinition[] = [
  {
    key: "homeInsurance",
    title: "Texas Home Insurance Calculator",
    description: "Estimate homeowners coverage using replacement cost, regional risk, roof age, construction, deductible, claims, and optional flood coverage.",
    slug: "/texas-home-insurance-calculator",
    category: "Insurance",
    fields: [
      field("homeValue", "Estimated replacement cost", 400000, "$", undefined, "Use rebuilding cost rather than market value when available.", 50000, 5000000, 1000),
      field("baseRate", "Base annual premium rate", 0.9, undefined, "%", undefined, 0.1, 5, 0.05),
      field("riskFactor", "Regional wind, hail, and wildfire factor", 1, undefined, "×", "Use 1.0 for average risk.", 0.5, 3, 0.05),
      field("roofAge", "Roof age", 8, undefined, "years", undefined, 0, 50, 1),
      field("constructionFactor", "Construction factor", 1, undefined, "×", "Use a higher factor for harder-to-replace construction.", 0.7, 2, 0.05),
      field("claimsFactor", "Claims-history factor", 1, undefined, "×", undefined, 0.8, 2, 0.05),
      field("deductibleCredit", "Deductible discount", 10, undefined, "%", undefined, 0, 40, 1),
      field("floodInsurance", "Optional annual flood insurance", 0, "$", undefined, "Standard homeowners policies generally exclude flood coverage.", 0, 20000, 50),
    ],
    calculate: (input) => {
      const roofFactor = 1 + Math.max(0, (input.roofAge ?? 0) - 10) * 0.0125;
      const annual = input.homeValue * (input.baseRate / 100) * input.riskFactor * (input.constructionFactor ?? 1) * (input.claimsFactor ?? 1) * roofFactor * (1 - input.deductibleCredit / 100) + (input.floodInsurance ?? 0);
      return [money("Estimated annual premium", annual, true), money("Estimated monthly premium", annual / 12), money("Optional flood coverage", input.floodInsurance ?? 0), percent("Applied deductible discount", input.deductibleCredit), percent("Roof-age adjustment", (roofFactor - 1) * 100)];
    },
    validate: (input) => bounded(input, definitions[0]?.fields ?? []),
    presets: [
      { label: "Inland newer home", description: "Lower-risk newer roof", values: { homeValue: 350000, riskFactor: 0.9, roofAge: 3, constructionFactor: 1, claimsFactor: 1, floodInsurance: 0 } },
      { label: "Gulf Coast home", description: "Higher wind exposure with flood coverage", values: { homeValue: 450000, riskFactor: 1.45, roofAge: 8, constructionFactor: 1.05, claimsFactor: 1, floodInsurance: 1800 } },
    ],
    assumptions: ["Replacement cost is more relevant than sale price.", "Roof, claims, construction, and regional factors are simplified multipliers.", "Flood coverage is separate and optional."],
    resultMeaning: "This range helps budget for coverage but is not a carrier quote. Deductibles, roof rules, wind exclusions, and underwriting can materially change the premium.",
    disclaimer: "Standard homeowners insurance generally does not cover flooding. Confirm wind, hail, named-storm, and flood coverage with licensed providers.",
    faq: faq("Texas Home Insurance Calculator"),
  },
  {
    key: "utilityCost",
    title: "Texas Utility Cost Calculator",
    description: "Estimate seasonal electricity, water, gas, internet, and trash costs with adjustments for home age, pool, electric vehicle, and household size.",
    slug: "/texas-utility-cost-calculator",
    category: "Utilities",
    fields: [
      field("homeSizeSqFt", "Home size", 2500, undefined, "sq ft", undefined, 300, 15000, 50),
      field("occupants", "Household occupants", 3, undefined, undefined, undefined, 1, 20, 1),
      field("electricityRate", "Effective electricity rate", 0.16, "$", "/kWh", undefined, 0.05, 0.5, 0.001),
      field("climateFactor", "Cooling and climate factor", 1, undefined, "×", undefined, 0.6, 2, 0.05),
      field("homeAgeFactor", "Home age and efficiency factor", 1, undefined, "×", undefined, 0.7, 1.6, 0.05),
      field("poolKwh", "Monthly pool electricity", 180, undefined, "kWh", undefined, 0, 1500, 10),
      field("evKwh", "Monthly EV charging", 0, undefined, "kWh", undefined, 0, 2500, 10),
      field("waterUsageFactor", "Water usage factor", 1, undefined, "×", undefined, 0.5, 3, 0.05),
      field("gasUsageFactor", "Natural gas usage factor", 1, undefined, "×", undefined, 0, 3, 0.05),
      field("internetCost", "Monthly internet", 70, "$", undefined, undefined, 0, 500, 1),
      field("trashCost", "Monthly trash", 25, "$", undefined, undefined, 0, 300, 1),
    ],
    calculate: (input) => {
      const baseKwh = 500 + input.homeSizeSqFt * 0.35 + input.occupants * 80 + (input.poolKwh ?? 0) + (input.evKwh ?? 0);
      const averageElectricity = baseKwh * input.electricityRate * input.climateFactor * (input.homeAgeFactor ?? 1);
      const summerElectricity = averageElectricity * 1.35;
      const winterElectricity = averageElectricity * 0.72;
      const water = (35 + input.occupants * 18 + ((input.poolKwh ?? 0) > 0 ? 35 : 0)) * input.waterUsageFactor;
      const gas = (25 + input.homeSizeSqFt * 0.012) * input.gasUsageFactor;
      const average = averageElectricity + water + gas + input.internetCost + input.trashCost;
      return [money("Average monthly utilities", average, true), money("Peak summer estimate", summerElectricity + water + gas + input.internetCost + input.trashCost), money("Mild winter estimate", winterElectricity + water + gas + input.internetCost + input.trashCost), money("Average electricity", averageElectricity), money("Water", water), money("Natural gas", gas), money("Estimated annual utilities", average * 12)];
    },
    validate: (input) => bounded(input, definitions[1]?.fields ?? []),
    presets: [
      { label: "Apartment", description: "Smaller efficient household", values: { homeSizeSqFt: 1000, occupants: 2, climateFactor: 0.85, homeAgeFactor: 0.9, poolKwh: 0, evKwh: 0 } },
      { label: "Pool and EV", description: "Larger home with pool and charging", values: { homeSizeSqFt: 3200, occupants: 4, climateFactor: 1.15, homeAgeFactor: 1, poolKwh: 250, evKwh: 350 } },
    ],
    assumptions: ["Summer electricity is modeled at 135% of the annual monthly average.", "Winter electricity is modeled at 72% of the average.", "Pool and EV use are entered as monthly kWh."],
    resultMeaning: "The seasonal figures show why a single annual average can understate summer cash needs in Texas.",
    disclaimer: "Actual bills depend on weather, provider fees, plan structure, appliance efficiency, irrigation, municipal rates, and behavior.",
    faq: faq("Texas Utility Cost Calculator"),
  },
  {
    key: "movingCost",
    title: "Texas Moving Cost Calculator",
    description: "Estimate a low, expected, and high moving budget including transportation, labor, packing, storage, travel, vehicle shipping, and setup costs.",
    slug: "/texas-moving-cost-calculator",
    category: "Relocation",
    fields: [
      field("distance", "Moving distance", 800, undefined, "miles", undefined, 0, 5000, 10),
      field("homeSize", "Current home size", 2000, undefined, "sq ft", undefined, 200, 10000, 50),
      field("ratePerMile", "Transportation rate", 2.5, "$", "/mile", undefined, 0, 20, 0.1),
      field("laborRate", "Labor rate", 1.1, "$", "/sq ft", undefined, 0, 10, 0.1),
      field("travel", "Household travel", 900, "$", undefined, undefined, 0, 30000, 50),
      field("packing", "Packing and supplies", 750, "$", undefined, undefined, 0, 30000, 50),
      field("storage", "Temporary storage", 0, "$", undefined, undefined, 0, 30000, 50),
      field("vehicleShipping", "Vehicle shipping", 0, "$", undefined, undefined, 0, 20000, 50),
      field("accessFees", "Stairs, elevator, or access fees", 0, "$", undefined, undefined, 0, 10000, 25),
      field("setup", "Deposits and setup", 1200, "$", undefined, undefined, 0, 30000, 50),
    ],
    calculate: (input) => {
      const expected = input.distance * input.ratePerMile + input.homeSize * input.laborRate + input.travel + input.packing + (input.storage ?? 0) + (input.vehicleShipping ?? 0) + (input.accessFees ?? 0) + input.setup;
      return [money("Expected moving budget", expected, true), money("Low estimate", expected * 0.8), money("High estimate", expected * 1.3), money("Transportation", input.distance * input.ratePerMile), money("Loading and labor", input.homeSize * input.laborRate), money("Packing, storage, and access", input.packing + (input.storage ?? 0) + (input.accessFees ?? 0)), money("Travel, vehicles, and setup", input.travel + (input.vehicleShipping ?? 0) + input.setup)];
    },
    validate: (input) => bounded(input, definitions[2]?.fields ?? []),
    presets: [
      { label: "Local apartment", description: "Short local move", values: { distance: 25, homeSize: 900, ratePerMile: 4, laborRate: 0.9, travel: 50, packing: 250, setup: 500 } },
      { label: "Long-distance family", description: "Interstate full household", values: { distance: 1200, homeSize: 2600, ratePerMile: 3.2, laborRate: 1.4, travel: 1400, packing: 1200, storage: 600, vehicleShipping: 1100, setup: 1800 } },
    ],
    assumptions: ["Low and high estimates are 80% and 130% of the expected budget.", "Access, storage, and vehicle charges are entered separately.", "Rates are user-adjustable rather than vendor quotes."],
    resultMeaning: "Use the range to create a contingency budget rather than treating a single estimate as a guaranteed price.",
    disclaimer: "Obtain written mover or truck-rental quotes and verify valuation coverage, cancellation terms, fuel, tolls, and prohibited items.",
    faq: faq("Texas Moving Cost Calculator"),
  },
  {
    key: "propertyTaxImpact",
    title: "Texas Property Tax Increase Calculator",
    description: "Separate appraisal growth, the homestead appraisal cap, exemptions, and tax-rate changes in a year-over-year Texas estimate.",
    slug: "/texas-property-tax-increase-calculator",
    category: "Taxes",
    fields: [
      field("currentValue", "Prior-year taxable value", 350000, "$", undefined, undefined, 0, 20000000, 1000),
      field("newValue", "New market or noticed value", 385000, "$", undefined, undefined, 0, 20000000, 1000),
      field("homestead", "Homestead status", 1, undefined, "1=yes, 0=no", undefined, 0, 1, 1),
      field("exemption", "Total exemptions", 100000, "$", undefined, undefined, 0, 5000000, 1000),
      field("currentRate", "Current combined tax rate", 2.1, undefined, "%", undefined, 0, 5, 0.01),
      field("newRate", "Proposed combined tax rate", 2.05, undefined, "%", undefined, 0, 5, 0.01),
    ],
    calculate: (input) => {
      const capValue = input.homestead >= 0.5 ? input.currentValue * 1.1 : input.newValue;
      const cappedAppraised = Math.min(input.newValue, capValue);
      const newTaxable = Math.max(0, cappedAppraised - (input.exemption ?? 0));
      const current = input.currentValue * (input.currentRate / 100);
      const appraisalOnly = newTaxable * (input.currentRate / 100);
      const next = newTaxable * (input.newRate / 100);
      return [money("Estimated new annual tax", next, true), money("Current annual tax", current), { label: "Annual change", value: next - current, type: "currency" }, { label: "Monthly change", value: (next - current) / 12, type: "currency" }, money("Capped appraised value", cappedAppraised), money("Estimated taxable value", newTaxable), { label: "Change from appraisal and exemptions", value: appraisalOnly - current, type: "currency" }, { label: "Additional change from rate", value: next - appraisalOnly, type: "currency" }];
    },
    validate: (input) => bounded(input, definitions[3]?.fields ?? []),
    presets: [
      { label: "Homestead capped", description: "Value increase above the illustrative cap", values: { currentValue: 350000, newValue: 430000, homestead: 1, exemption: 100000, currentRate: 2.1, newRate: 2.05 } },
      { label: "Non-homestead", description: "No appraisal-cap assumption", values: { currentValue: 350000, newValue: 430000, homestead: 0, exemption: 0, currentRate: 2.1, newRate: 2.05 } },
    ],
    assumptions: ["Homestead status uses an illustrative 10% appraisal-cap calculation.", "Exemptions are subtracted after the cap estimate.", "Market, appraised, and taxable values are distinct concepts."],
    resultMeaning: "The breakdown isolates how much of the change comes from value and exemptions versus the tax rate.",
    disclaimer: "This is not an official appraisal or tax bill. Texas appraisal-cap and exemption treatment can vary by property, ownership history, taxing unit, and law.",
    faq: faq("Texas Property Tax Increase Calculator"),
  },
  {
    key: "mortgagePaymentImpact",
    title: "Internal Mortgage Scenario Check",
    description: "Internal formula retained for regression compatibility; the public comparison is built into the main mortgage calculator.",
    slug: "/texas-mortgage-calculator",
    category: "Housing",
    fields: [field("homePrice", "Home price", 400000, "$"), field("downPayment", "Down payment", 80000, "$"), field("interestRate", "Current interest rate", 6.5, undefined, "%", undefined, 0, 25, 0.01), field("comparisonRate", "Comparison interest rate", 5.75, undefined, "%", undefined, 0, 25, 0.01), field("loanTerm", "Loan term", 30, undefined, "years", undefined, 1, 50, 1)],
    calculate: (input) => { const loan = Math.max(0, input.homePrice - input.downPayment); const current = monthlyPayment(loan, input.interestRate, input.loanTerm); const comparison = monthlyPayment(loan, input.comparisonRate, input.loanTerm); return [money("Payment at current rate", current, true), money("Payment at comparison rate", comparison), { label: "Monthly difference", value: current - comparison, type: "currency" }, { label: "Loan-term difference", value: (current - comparison) * input.loanTerm * 12, type: "currency" }, money("Loan amount", loan)]; },
    validate: (input) => ({ ...bounded(input, definitions[4]?.fields ?? []), ...(input.downPayment > input.homePrice ? { downPayment: "Down payment cannot exceed home price." } : {}) }),
    assumptions: ["Principal and interest only."], resultMeaning: "Used by automated regression checks.", disclaimer: "Public users should use the main Texas Mortgage Calculator.", faq: faq("Texas Mortgage Calculator"),
  },
  {
    key: "downPaymentAssistance",
    title: "Texas Down Payment Assistance Calculator",
    description: "Estimate illustrative assistance and remaining cash needs using household, purchase, credit, loan, and veteran inputs.",
    slug: "/texas-down-payment-assistance-calculator",
    category: "Housing",
    fields: [
      field("homePrice", "Home price", 300000, "$", undefined, undefined, 50000, 2000000, 1000),
      field("requiredDownPercent", "Required down payment", 3.5, undefined, "%", undefined, 0, 100, 0.1),
      field("assistancePercent", "Illustrative assistance", 4, undefined, "%", undefined, 0, 20, 0.1),
      field("householdIncome", "Household annual income", 85000, "$", undefined, undefined, 0, 1000000, 1000),
      field("householdSize", "Household size", 3, undefined, undefined, undefined, 1, 20, 1),
      field("creditScore", "Credit-score estimate", 680, undefined, undefined, undefined, 300, 850, 1),
      field("firstTimeBuyer", "First-time buyer", 1, undefined, "1=yes, 0=no", undefined, 0, 1, 1),
      field("veteran", "Veteran status", 0, undefined, "1=yes, 0=no", undefined, 0, 1, 1),
      field("availableCash", "Available cash", 10000, "$", undefined, undefined, 0, 1000000, 500),
      field("closingCosts", "Estimated closing costs", 7500, "$", undefined, undefined, 0, 200000, 500),
    ],
    calculate: (input) => {
      const required = input.homePrice * (input.requiredDownPercent / 100);
      const baseAssistance = input.homePrice * (input.assistancePercent / 100);
      const illustrativeAdjustment = (input.creditScore ?? 680) < 620 ? 0.5 : 1;
      const assistance = baseAssistance * illustrativeAdjustment;
      const totalNeed = required + input.closingCosts;
      return [money("Potential illustrative assistance", assistance, true), money("Required down payment", required), money("Estimated closing costs", input.closingCosts), money("Available cash", input.availableCash), money("Remaining cash need", Math.max(0, totalNeed - assistance - input.availableCash)), percent("Assistance share of price", input.assistancePercent)];
    },
    validate: (input) => ({ ...bounded(input, definitions[5]?.fields ?? []), ...(input.requiredDownPercent > 100 ? { requiredDownPercent: "Down payment cannot exceed 100%." } : {}) }),
    presets: [
      { label: "First-time buyer", description: "Illustrative low-down-payment scenario", values: { homePrice: 300000, requiredDownPercent: 3.5, assistancePercent: 4, householdIncome: 85000, householdSize: 3, creditScore: 680, firstTimeBuyer: 1, veteran: 0 } },
      { label: "Veteran household", description: "Illustrative veteran scenario", values: { homePrice: 350000, requiredDownPercent: 0, assistancePercent: 2, householdIncome: 95000, householdSize: 4, creditScore: 720, firstTimeBuyer: 0, veteran: 1 } },
    ],
    assumptions: ["The assistance percentage is illustrative and user-entered.", "Credit scores below 620 reduce the illustrative amount by half.", "Income, household size, first-time status, county limits, and program rules still require official review."],
    resultMeaning: "This is a cash-planning estimate, not an eligibility decision or promise of funds.",
    disclaimer: "Program availability, income limits, purchase-price limits, credit rules, repayment terms, and funding change. Verify every result with the official administrator or participating lender.",
    faq: faq("Texas Down Payment Assistance Calculator"),
  },
  {
    key: "salaryComparison",
    title: "Texas Salary Comparison by City",
    description: "Compare salary purchasing power using origin and Texas city cost components rather than a single unexplained index.",
    slug: "/texas-salary-comparison-by-city",
    category: "Financial",
    fields: [
      field("currentSalary", "Current annual salary", 100000, "$", undefined, undefined, 0, 5000000, 1000),
      field("currentIndex", "Origin overall cost index", 115, undefined, undefined, undefined, 20, 300, 1),
      field("texasIndex", "Texas city overall cost index", 95, undefined, undefined, "Use a maintained city value when available; otherwise enter your own estimate.", 20, 300, 1),
      field("originHousingIndex", "Origin housing index", 130, undefined, undefined, undefined, 20, 500, 1),
      field("texasHousingIndex", "Texas city housing index", 100, undefined, undefined, undefined, 20, 500, 1),
      field("originTransportIndex", "Origin transportation index", 105, undefined, undefined, undefined, 20, 300, 1),
      field("texasTransportIndex", "Texas city transportation index", 102, undefined, undefined, undefined, 20, 300, 1),
      field("originUtilityIndex", "Origin utility index", 100, undefined, undefined, undefined, 20, 300, 1),
      field("texasUtilityIndex", "Texas city utility index", 108, undefined, undefined, undefined, 20, 300, 1),
      field("currentStateTaxRate", "Origin state income-tax rate", 5, undefined, "%", undefined, 0, 20, 0.1),
    ],
    calculate: (input) => {
      const componentRatio = ((input.texasHousingIndex ?? input.texasIndex) / (input.originHousingIndex ?? input.currentIndex) * 0.5) + ((input.texasTransportIndex ?? input.texasIndex) / (input.originTransportIndex ?? input.currentIndex) * 0.25) + ((input.texasUtilityIndex ?? input.texasIndex) / (input.originUtilityIndex ?? input.currentIndex) * 0.25);
      const legacyRatio = input.currentIndex > 0 ? input.texasIndex / input.currentIndex : 0;
      const ratio = Number.isFinite(componentRatio) ? componentRatio : legacyRatio;
      const equivalent = input.currentSalary * ratio;
      const stateTaxSavings = input.currentSalary * (input.currentStateTaxRate / 100);
      return [money("Cost-adjusted Texas salary", equivalent, true), money("Estimated state income-tax savings", stateTaxSavings), { label: "Estimated purchasing-power difference", value: input.currentSalary - equivalent + stateTaxSavings, type: "currency" }, percent("Weighted cost difference", (ratio - 1) * 100), percent("Housing cost difference", ((input.texasHousingIndex ?? input.texasIndex) / (input.originHousingIndex ?? input.currentIndex) - 1) * 100)];
    },
    validate: (input) => bounded(input, definitions[6]?.fields ?? []),
    presets: [
      { label: "High-cost origin to Houston", description: "Illustrative high-cost move", values: { currentIndex: 135, texasIndex: 98, originHousingIndex: 170, texasHousingIndex: 105, originTransportIndex: 120, texasTransportIndex: 104, originUtilityIndex: 105, texasUtilityIndex: 112, currentStateTaxRate: 6 } },
      { label: "Similar-cost cities", description: "Locations with closer costs", values: { currentIndex: 102, texasIndex: 99, originHousingIndex: 105, texasHousingIndex: 103, originTransportIndex: 100, texasTransportIndex: 102, originUtilityIndex: 102, texasUtilityIndex: 108, currentStateTaxRate: 3 } },
    ],
    assumptions: ["Housing receives 50% weight; transportation and utilities receive 25% each.", "Indices are user-entered unless connected to maintained city data.", "Texas has no individual state income tax, but other taxes and costs still apply."],
    resultMeaning: "The equivalent salary estimates purchasing power, not a recommended offer or guaranteed household budget.",
    disclaimer: "Cost indices vary by source and date. Compare actual housing, commuting, insurance, childcare, healthcare, and tax costs before relocating.",
    faq: faq("Texas Salary Comparison by City"),
  },
];

export const additionalCalculatorDefinitions = Object.fromEntries(definitions.map((definition) => [definition.key, definition])) as Record<string, AdditionalCalculatorDefinition>;
export function getAdditionalCalculatorDefinition(key: string) { const definition = additionalCalculatorDefinitions[key]; if (!definition) throw new Error(`Unknown additional calculator: ${key}`); return definition; }
