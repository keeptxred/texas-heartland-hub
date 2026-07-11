import React, { useState } from "react";

import CalculatorLayout from "@/components/calculators/CalculatorLayout";

import {
  CalculatorInput,
} from "@/components/calculators/CalculatorInputs";

import CalculatorResults from "@/components/calculators/CalculatorResults";

import BreakdownTable from "@/components/calculators/BreakdownTable";

import ShareResults from "@/components/calculators/ShareResults";

import {
  calculateAffordability,
} from "@/lib/calculators/affordability";


export default function HomeAffordabilityCalculator() {

  const [inputs, setInputs] = useState({

    annualIncome: 100000,

    monthlyDebts: 500,

    downPaymentPercent: 20,

    interestRate: 6.5,

    propertyTaxRate: 2,

    insuranceAnnual: 2400,

  });


  function updateInput(
    key: keyof typeof inputs,
    value: string
  ) {

    setInputs({

      ...inputs,

      [key]:
        Number(value),

    });

  }


  const results =
    calculateAffordability({

      annualIncome:
        inputs.annualIncome,

      monthlyDebts:
        inputs.monthlyDebts,

      downPaymentPercent:
        inputs.downPaymentPercent,

      interestRate:
        inputs.interestRate,

      propertyTaxRate:
        inputs.propertyTaxRate,

      insuranceAnnual:
        inputs.insuranceAnnual,

    });



  return (

    <CalculatorLayout

      title="Texas Home Affordability Calculator"

      description="Find out how much house you can afford in Texas based on income, debts, mortgage rates, property taxes, and insurance costs."

      canonicalUrl="https://keeptxred.com/tools/home-affordability-calculator"

      lastUpdated="July 2026"

      schema={{

        "@context":
          "https://schema.org",

        "@type":
          "WebApplication",

        name:
          "Texas Home Affordability Calculator",

        applicationCategory:
          "FinanceApplication",

      }}

    >

      <div className="space-y-8">


        <div className="grid gap-5 md:grid-cols-2">


          <CalculatorInput

            id="income"

            label="Annual Household Income"

            value={
              inputs.annualIncome
            }

            prefix="$"

            onChange={(v) =>
              updateInput(
                "annualIncome",
                v
              )
            }

          />



          <CalculatorInput

            id="debts"

            label="Monthly Debt Payments"

            value={
              inputs.monthlyDebts
            }

            prefix="$"

            helpText="Include car loans, student loans, credit cards, and other recurring debt."

            onChange={(v) =>
              updateInput(
                "monthlyDebts",
                v
              )
            }

          />



          <CalculatorInput

            id="downPayment"

            label="Down Payment"

            value={
              inputs.downPaymentPercent
            }

            suffix="%"

            onChange={(v) =>
              updateInput(
                "downPaymentPercent",
                v
              )
            }

          />



          <CalculatorInput

            id="interestRate"

            label="Mortgage Interest Rate"

            value={
              inputs.interestRate
            }

            suffix="%"

            step={0.01}

            onChange={(v) =>
              updateInput(
                "interestRate",
                v
              )
            }

          />



          <CalculatorInput

            id="propertyTax"

            label="Texas Property Tax Rate"

            value={
              inputs.propertyTaxRate
            }

            suffix="%"

            step={0.01}

            onChange={(v) =>
              updateInput(
                "propertyTaxRate",
                v
              )
            }

          />



          <CalculatorInput

            id="insurance"

            label="Annual Home Insurance"

            value={
              inputs.insuranceAnnual
            }

            prefix="$"

            onChange={(v) =>
              updateInput(
                "insuranceAnnual",
                v
              )
            }

          />


        </div>



        <CalculatorResults

          title="Affordability Estimate"

          results={[

            {

              label:
                "Estimated Maximum Home Price",

              value:
                results.estimatedHomePrice,

              type:
                "currency",

              highlight:
                true,

            },

            {

              label:
                "Estimated Loan Amount",

              value:
                results.estimatedLoanAmount,

              type:
                "currency",

            },

            {

              label:
                "Monthly Housing Budget",

              value:
                results.maxMonthlyHousingPayment,

              type:
                "currency",

            },

            {

              label:
                "Debt-to-Income Ratio",

              value:
                results.debtToIncomeRatio,

              type:
                "percent",

              decimals:
                1,

            },

          ]}

        />



        <BreakdownTable

          title="Monthly Housing Cost Estimate"

          rows={[

            {

              label:
                "Mortgage Payment",

              value:
                results.monthlyMortgagePayment,

            },

            {

              label:
                "Property Taxes",

              value:
                results.monthlyPropertyTax,

            },

            {

              label:
                "Insurance",

              value:
                results.monthlyInsurance,

            },

            {

              label:
                "Total Housing Cost",

              value:
                results.totalMonthlyHousingCost,

              emphasize:
                true,

            },

          ]}

        />



        <ShareResults

          title="Texas Home Affordability Calculator"

          summary={`Estimated affordable home price: ${results.estimatedHomePrice.toLocaleString(
            "en-US",
            {
              style:
                "currency",

              currency:
                "USD",
            }
          )}`}

        />


      </div>

    </CalculatorLayout>

  );

}