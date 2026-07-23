import { describe, expect, it } from "vitest";
import { calculateTexasMortgage } from "../../mortgage/texasMortgageEngine";
import { analyzeTexasDownPayment } from "../../downPayment/texasDownPaymentEngine";
import { analyzeTexasHomeAffordability } from "../../homeAffordability/texasHomeAffordabilityEngine";
import { analyzeTexasRefinance } from "../../mortgage/texasRefinanceEngine";
import { analyzeTexasMortgagePayoff } from "../../mortgage/texasMortgagePayoffEngine";
import { analyzeTexasRentVsBuy } from "../../home/texasRentVsBuyEngine";

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
    expect(result.baseline.remainingMonths).toBeLessThanOrEqual(360);
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
});
