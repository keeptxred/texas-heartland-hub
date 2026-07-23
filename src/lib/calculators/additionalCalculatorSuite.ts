import type {
  AdditionalCalculatorDefinition,
  AdditionalCalculatorResult,
} from "@/types/calculators/additionalCalculator";

const money = (label: string, value: number, highlight = false): AdditionalCalculatorResult => ({
  label,
  value: Math.max(0, value),
  type: "currency",
  highlight,
});
const percent = (label: string, value: number): AdditionalCalculatorResult => ({
  label,
  value,
  type: "percent",
});
const field = (
  key: string,
  label: string,
  defaultValue: number,
  prefix?: string,
  suffix?: string,
  helpText?: string,
) => ({ key, label, defaultValue, prefix, suffix, helpText });
const faq = (title: string) => [
  {
    question: `Is the ${title} an official quote?`,
    answer:
      "No. It is an educational estimate based on the values you enter and common Texas assumptions. Confirm costs with the appropriate provider, lender, taxing authority, employer, or program administrator.",
  },
  {
    question: "Does this calculator store my financial information?",
    answer: "No. The estimate runs in your browser and does not require an account.",
  },
];

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
    description:
      "Estimate an annual Texas homeowners insurance premium from home value, location risk, deductible, and coverage choices.",
    slug: "/texas-home-insurance-calculator",
    category: "Insurance",
    fields: [
      field("homeValue", "Home value", 400000, "$"),
      field("baseRate", "Base annual premium rate", 0.9, undefined, "%"),
      field("riskFactor", "Location risk factor", 1, undefined, "×", "Use 1.0 for average risk; increase for higher wind, hail, flood, or wildfire exposure."),
      field("deductibleCredit", "Deductible discount", 10, undefined, "%"),
    ],
    calculate: (input) => {
      const annual =
        Math.max(0, input.homeValue) *
        (Math.max(0, input.baseRate) / 100) *
        Math.max(0, input.riskFactor) *
        Math.max(0, 1 - input.deductibleCredit / 100);
      return [
        money("Estimated annual premium", annual, true),
        money("Estimated monthly premium", annual / 12),
        money("Coverage basis", input.homeValue),
        percent("Applied deductible discount", input.deductibleCredit),
      ];
    },
    faq: faq("Texas Home Insurance Calculator"),
  },
  {
    key: "utilityCost",
    title: "Texas Utility Cost Calculator",
    description:
      "Estimate monthly electricity, water, natural gas, internet, and trash costs for a Texas household.",
    slug: "/texas-utility-cost-calculator",
    category: "Utilities",
    fields: [
      field("homeSizeSqFt", "Home size", 2500, undefined, "sq ft"),
      field("occupants", "Household occupants", 3),
      field("electricityRate", "Electricity rate", 0.16, "$", "/kWh"),
      field("climateFactor", "Cooling and climate factor", 1, undefined, "×"),
      field("waterUsageFactor", "Water usage factor", 1, undefined, "×"),
      field("gasUsageFactor", "Natural gas usage factor", 1, undefined, "×"),
      field("internetCost", "Monthly internet", 70, "$"),
      field("trashCost", "Monthly trash", 25, "$"),
    ],
    calculate: (input) => {
      const electricity =
        (500 + input.homeSizeSqFt * 0.35 + input.occupants * 80) *
        input.electricityRate *
        input.climateFactor;
      const water = (35 + input.occupants * 18) * input.waterUsageFactor;
      const gas = (25 + input.homeSizeSqFt * 0.012) * input.gasUsageFactor;
      const total = electricity + water + gas + input.internetCost + input.trashCost;
      return [
        money("Estimated monthly utilities", total, true),
        money("Electricity", electricity),
        money("Water", water),
        money("Natural gas", gas),
        money("Internet", input.internetCost),
        money("Trash", input.trashCost),
        money("Estimated annual utilities", total * 12),
      ];
    },
    faq: faq("Texas Utility Cost Calculator"),
  },
  {
    key: "movingCost",
    title: "Texas Moving Cost Calculator",
    description:
      "Estimate transportation, labor, household travel, packing, and setup costs for a move to Texas.",
    slug: "/texas-moving-cost-calculator",
    category: "Relocation",
    fields: [
      field("distance", "Moving distance", 800, undefined, "miles"),
      field("homeSize", "Current home size", 2000, undefined, "sq ft"),
      field("ratePerMile", "Transportation rate", 2.5, "$", "/mile"),
      field("laborRate", "Labor rate", 1.1, "$", "/sq ft"),
      field("travel", "Household travel", 900, "$"),
      field("packing", "Packing and supplies", 750, "$"),
      field("setup", "Deposits and setup", 1200, "$"),
    ],
    calculate: (input) => {
      const transport = input.distance * input.ratePerMile;
      const labor = input.homeSize * input.laborRate;
      const total = transport + labor + input.travel + input.packing + input.setup;
      return [
        money("Estimated moving cost", total, true),
        money("Transportation", transport),
        money("Loading and labor", labor),
        money("Household travel", input.travel),
        money("Packing and supplies", input.packing),
        money("Texas setup costs", input.setup),
      ];
    },
    faq: faq("Texas Moving Cost Calculator"),
  },
  {
    key: "propertyTaxImpact",
    title: "Texas Property Tax Impact Calculator",
    description:
      "Compare how appraisal and combined tax-rate changes could affect a Texas property-tax bill.",
    slug: "/texas-property-tax-impact-calculator",
    category: "Taxes",
    fields: [
      field("currentValue", "Current taxable value", 350000, "$"),
      field("newValue", "New taxable value", 385000, "$"),
      field("currentRate", "Current combined tax rate", 2.1, undefined, "%"),
      field("newRate", "New combined tax rate", 2.05, undefined, "%"),
    ],
    calculate: (input) => {
      const current = input.currentValue * (input.currentRate / 100);
      const next = input.newValue * (input.newRate / 100);
      const change = next - current;
      return [
        money("Estimated new annual tax", next, true),
        money("Current annual tax", current),
        { label: "Annual change", value: change, type: "currency" },
        { label: "Monthly change", value: change / 12, type: "currency" },
        percent("Percent change", current ? (change / current) * 100 : 0),
      ];
    },
    faq: faq("Texas Property Tax Impact Calculator"),
  },
  {
    key: "mortgagePaymentImpact",
    title: "Texas Mortgage Payment Impact Calculator",
    description:
      "Measure how price, down payment, and interest-rate changes affect a Texas mortgage payment.",
    slug: "/texas-mortgage-payment-impact-calculator",
    category: "Housing",
    fields: [
      field("homePrice", "Home price", 400000, "$"),
      field("downPayment", "Down payment", 80000, "$"),
      field("interestRate", "Current interest rate", 6.5, undefined, "%"),
      field("comparisonRate", "Comparison interest rate", 5.75, undefined, "%"),
      field("loanTerm", "Loan term", 30, undefined, "years"),
    ],
    calculate: (input) => {
      const loan = Math.max(0, input.homePrice - input.downPayment);
      const current = monthlyPayment(loan, input.interestRate, input.loanTerm);
      const comparison = monthlyPayment(loan, input.comparisonRate, input.loanTerm);
      const difference = current - comparison;
      return [
        money("Payment at current rate", current, true),
        money("Payment at comparison rate", comparison),
        { label: "Monthly difference", value: difference, type: "currency" },
        { label: "Loan-term difference", value: difference * input.loanTerm * 12, type: "currency" },
        money("Loan amount", loan),
      ];
    },
    faq: faq("Texas Mortgage Payment Impact Calculator"),
  },
  {
    key: "downPaymentAssistance",
    title: "Texas Down Payment Assistance Calculator",
    description:
      "Estimate a potential assistance amount and the remaining cash requirement for a Texas home purchase.",
    slug: "/texas-down-payment-assistance-calculator",
    category: "Housing",
    fields: [
      field("homePrice", "Home price", 300000, "$"),
      field("requiredDownPercent", "Required down payment", 3.5, undefined, "%"),
      field("assistancePercent", "Potential assistance", 4, undefined, "%"),
      field("availableCash", "Available cash", 10000, "$"),
      field("closingCosts", "Estimated closing costs", 7500, "$"),
    ],
    calculate: (input) => {
      const required = input.homePrice * (input.requiredDownPercent / 100);
      const assistance = input.homePrice * (input.assistancePercent / 100);
      const totalNeed = required + input.closingCosts;
      const remaining = Math.max(0, totalNeed - assistance - input.availableCash);
      return [
        money("Potential assistance", assistance, true),
        money("Required down payment", required),
        money("Estimated closing costs", input.closingCosts),
        money("Available cash", input.availableCash),
        money("Remaining cash need", remaining),
      ];
    },
    faq: faq("Texas Down Payment Assistance Calculator"),
  },
  {
    key: "salaryComparison",
    title: "Texas Salary Comparison Calculator",
    description:
      "Estimate the salary needed to maintain purchasing power when moving to Texas.",
    slug: "/texas-salary-comparison-calculator",
    category: "Financial",
    fields: [
      field("currentSalary", "Current annual salary", 100000, "$"),
      field("currentIndex", "Current location cost index", 115),
      field("texasIndex", "Texas location cost index", 95),
      field("currentStateTaxRate", "Current state income-tax rate", 5, undefined, "%"),
    ],
    calculate: (input) => {
      const equivalent = input.currentIndex > 0
        ? input.currentSalary * (input.texasIndex / input.currentIndex)
        : 0;
      const stateTaxSavings = input.currentSalary * (input.currentStateTaxRate / 100);
      const purchasingPowerDifference = input.currentSalary - equivalent + stateTaxSavings;
      return [
        money("Cost-adjusted Texas salary", equivalent, true),
        money("Estimated state income-tax savings", stateTaxSavings),
        { label: "Estimated purchasing-power difference", value: purchasingPowerDifference, type: "currency" },
        percent("Cost-index difference", input.currentIndex ? (input.texasIndex / input.currentIndex - 1) * 100 : 0),
      ];
    },
    faq: faq("Texas Salary Comparison Calculator"),
  },
];

export const additionalCalculatorDefinitions = Object.fromEntries(
  definitions.map((definition) => [definition.key, definition]),
) as Record<string, AdditionalCalculatorDefinition>;

export function getAdditionalCalculatorDefinition(key: string) {
  const definition = additionalCalculatorDefinitions[key];
  if (!definition) throw new Error(`Unknown additional calculator: ${key}`);
  return definition;
}
