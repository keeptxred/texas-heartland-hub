import { describe, expect, it } from "vitest";
import { getAdditionalCalculatorDefinition } from "../additionalCalculatorSuite";

describe("Texas financial calculator known-answer checks", () => {
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
