import { describe, expect, it } from "vitest";
import { calculateTexasMortgage } from "../../mortgage/texasMortgageEngine";
import { analyzeTexasDownPayment } from "../../downPayment/texasDownPaymentEngine";
import { analyzeTexasHomeAffordability } from "../../homeAffordability/texasHomeAffordabilityEngine";
import { analyzeTexasRefinance } from "../../mortgage/texasRefinanceEngine";
import { analyzeTexasMortgagePayoff } from "../../mortgage/texasMortgagePayoffEngine";
import { analyzeTexasRentVsBuy } from "../../home/texasRentVsBuyEngine";
import { getAdditionalCalculatorDefinition } from "../additionalCalculatorSuite";

describe("Texas financial calculator known-answer checks", () => {
  it("calculates a standard 30-year mortgage payment", () => {
    const result = calculateTexasMortgage({
      homePrice: 400000,
      downPayment: 80000,
      annualInterestRate: 6.5,
      termYears: 30,
      annualPropertyTax: 7200,
      annualHomeInsurance: 2400,
      monthlyHoa: 0,
      monthlyPmi: 0,
    });

    expect(result.loanAmount).toBe(320000);
    expect(result.principalAndInterest).toBeCloseTo(2022.62, 1);
    expect(result.totalMonthlyPayment).toBeCloseTo(2822.62, 1);
  });

  it("uses percentage-form interest rates in the down-payment engine", () => {
    const result = analyzeTexasDownPayment({
      homePrice: 400000,
      loanProgram: "conventional",
      downPaymentPercent: 0.1,
      closingCostPercent: 0.03,
      currentSavings: 60000,
      monthlySavings: 1000,
      interestRate: 6.5,
      loanTermYears: 30,
    });

    expect(result.program.loanAmount).toBe(360000);
    expect(result.payment.monthlyPayment).toBeCloseTo(2275.44, 1);
    expect(Number.isFinite(result.payment.monthlyPayment)).toBe(true);
  });

  it("returns a realistic affordability result at 6.5 percent", () => {
    const result = analyzeTexasHomeAffordability({
      buyer: {
        annualIncome: 120000,
        monthlyDebtPayments: 750,
        downPayment: 60000,
        interestRate: 6.5,
        loanTermYears: 30,
      },
    } as never);

    expect(result.homePriceAnalysis.maximumHomePrice).toBeGreaterThan(300000);
    expect(result.homePriceAnalysis.maximumHomePrice).toBeLessThan(700000);
  });

  it("calculates refinance payments using annual percentage rates", () => {
    const result = analyzeTexasRefinance({
      currentLoanBalance: 300000,
      currentInterestRate: 7,
      currentLoanTermYears: 30,
      currentYearsRemaining: 30,
      newInterestRate: 5.5,
      newLoanTermYears: 30,
      closingCosts: 6000,
      cashOutAmount: 0,
    });

    expect(result.currentMortgage.monthlyPayment).toBeCloseTo(1995.91, 1);
    expect(result.newMortgage.monthlyPayment).toBeCloseTo(1703.37, 1);
    expect(result.savings.monthlySavings).toBeGreaterThan(250);
  });

  it("produces a normal payoff timeline instead of an immediate negative-amortization stop", () => {
    const result = analyzeTexasMortgagePayoff({
      currentBalance: 300000,
      interestRate: 6.5,
      currentMonthlyPayment: 1896.2,
      strategy: "monthly_extra",
      extraMonthlyPayment: 300,
      annualExtraPayment: 0,
    });

    expect(result.baseline.remainingMonths).toBeGreaterThan(350);
    expect(result.baseline.remainingMonths).toBeLessThanOrEqual(362);
    expect(result.accelerated.newPayoffMonths).toBeLessThan(result.baseline.remainingMonths);
    expect(result.accelerated.interestSaved).toBeGreaterThan(0);
  });

  it("calculates a realistic mortgage inside rent-versus-buy", () => {
    const result = analyzeTexasRentVsBuy({
      rent: {
        monthlyRent: 2200,
        annualRentIncrease: 0.035,
        yearsAnalyzed: 10,
      },
      buy: {
        homePrice: 400000,
        downPayment: 80000,
        interestRate: 6.5,
        loanTermYears: 30,
        propertyTaxRate: 0.018,
        homeInsurance: 0.003,
        maintenanceRate: 0.01,
        annualAppreciation: 0.03,
      },
      investmentReturn: 0.07,
    });

    expect(result.buyAnalysis.monthlyMortgage).toBeCloseTo(2022.62, 1);
    expect(Number.isFinite(result.comparison.wealthDifference)).toBe(true);
  });

  it("calculates home insurance from rate, risk, and deductible assumptions", () => {
    const results = getAdditionalCalculatorDefinition("homeInsurance").calculate({
      homeValue: 400000,
      baseRate: 0.9,
      riskFactor: 1,
      deductibleCredit: 10,
    });
    expect(results[0].value).toBeCloseTo(3240, 1);
    expect(results[1].value).toBeCloseTo(270, 1);
  });

  it("calculates utility and moving costs without duplicate housing formulas", () => {
    const utilities = getAdditionalCalculatorDefinition("utilityCost").calculate({
      homeSizeSqFt: 2500,
      occupants: 3,
      electricityRate: 0.16,
      climateFactor: 1,
      waterUsageFactor: 1,
      gasUsageFactor: 1,
      internetCost: 70,
      trashCost: 25,
    });
    const moving = getAdditionalCalculatorDefinition("movingCost").calculate({
      distance: 800,
      homeSize: 2000,
      ratePerMile: 2.5,
      laborRate: 1.1,
      travel: 900,
      packing: 750,
      setup: 1200,
    });
    expect(utilities[0].value).toBeCloseTo(497.4, 1);
    expect(moving[0].value).toBe(7050);
  });

  it("calculates property-tax and mortgage-rate impacts", () => {
    const taxes = getAdditionalCalculatorDefinition("propertyTaxImpact").calculate({
      currentValue: 350000,
      newValue: 385000,
      currentRate: 2.1,
      newRate: 2.05,
    });
    const mortgage = getAdditionalCalculatorDefinition("mortgagePaymentImpact").calculate({
      homePrice: 400000,
      downPayment: 80000,
      interestRate: 6.5,
      comparisonRate: 5.75,
      loanTerm: 30,
    });
    expect(taxes[2].value).toBeCloseTo(542.5, 1);
    expect(mortgage[0].value).toBeCloseTo(2022.62, 1);
    expect(mortgage[1].value).toBeCloseTo(1867.43, 1);
  });

  it("calculates assistance and Texas salary purchasing-power comparisons", () => {
    const assistance = getAdditionalCalculatorDefinition("downPaymentAssistance").calculate({
      homePrice: 300000,
      requiredDownPercent: 3.5,
      assistancePercent: 4,
      availableCash: 10000,
      closingCosts: 7500,
    });
    const salary = getAdditionalCalculatorDefinition("salaryComparison").calculate({
      currentSalary: 100000,
      currentIndex: 115,
      texasIndex: 95,
      currentStateTaxRate: 5,
    });
    expect(assistance[4].value).toBe(0);
    expect(salary[0].value).toBeCloseTo(82608.7, 1);
    expect(salary[1].value).toBe(5000);
  });
});
