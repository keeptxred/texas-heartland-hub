import React, { useState } from "react";

import CalculatorLayout from "@/components/calculators/CalculatorLayout";
import {
  CalculatorInput,
} from "@/components/calculators/CalculatorInputs";

import CalculatorResults from "@/components/calculators/CalculatorResults";

import BreakdownTable from "@/components/calculators/BreakdownTable";

import ShareResults from "@/components/calculators/ShareResults";

import {
  calculateMortgage,
} from "@/lib/calculators/mortgage";


export default function MortgageCalculator() {

  const [inputs, setInputs] = useState({
    homePrice: 400000,
    downPayment: 80000,
    interestRate: 6.5,
    loanTermYears: 30,
    propertyTaxRate: 2,
    insuranceAnnual: 2400,
    hoaMonthly: 0,
  });


  const updateInput = (
    key: keyof typeof inputs,
    value: string
  ) => {

    setInputs({
      ...inputs,
      [key]: Number(value),
    });

  };


  const results =
    calculateMortgage(inputs);


  return (

    <CalculatorLayout

      title="Texas Mortgage Calculator"

      description="Estimate your monthly mortgage payment, property taxes, insurance, and total housing costs when buying a home in Texas."

      canonicalUrl="https://keeptxred.com/tools/mortgage-calculator"

      lastUpdated="July 2026"

      schema={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Texas Mortgage Calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
      }}

    >

      <div className="space-y-6">


        <div className="grid gap-5 md:grid-cols-2">


          <CalculatorInput

            id="homePrice"

            label="Home Price"

            value={inputs.homePrice}

            prefix="$"

            onChange={(v) =>
              updateInput(
                "homePrice",
                v
              )
            }

          />


          <CalculatorInput

            id="downPayment"

            label="Down Payment"

            value={inputs.downPayment}

            prefix="$"

            onChange={(v) =>
              updateInput(
                "downPayment",
                v
              )
            }

          />


          <CalculatorInput

            id="interestRate"

            label="Interest Rate"

            value={inputs.interestRate}

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

            id="loanTerm"

            label="Loan Term"

            value={inputs.loanTermYears}

            suffix="years"

            onChange={(v) =>
              updateInput(
                "loanTermYears",
                v
              )
            }

          />


          <CalculatorInput

            id="propertyTaxRate"

            label="Texas Property Tax Rate"

            value={inputs.propertyTaxRate}

            suffix="%"

            step={0.01}

            helpText="Texas property taxes vary by county and school district."

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

            value={inputs.insuranceAnnual}

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

          title="Estimated Monthly Payment"

          results={[

            {
              label:
                "Total Monthly Housing Cost",

              value:
                results.totalMonthlyPayment,

              type:
                "currency",

              highlight:
                true,
            },

            {
              label:
                "Principal & Interest",

              value:
                results.monthlyPrincipalInterest,

              type:
                "currency",
            },

            {
              label:
                "Property Taxes",

              value:
                results.monthlyPropertyTax,

              type:
                "currency",
            },

            {
              label:
                "Insurance",

              value:
                results.monthlyInsurance,

              type:
                "currency",
            },

            {
              label:
                "PMI",

              value:
                results.monthlyPMI,

              type:
                "currency",
            },

          ]}

        />


        <BreakdownTable

          title="Mortgage Payment Breakdown"

          rows={[

            {
              label:
                "Principal & Interest",

              value:
                results.monthlyPrincipalInterest,
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
                "PMI",

              value:
                results.monthlyPMI,
            },

            {
              label:
                "HOA",

              value:
                results.monthlyHOA,
            },

          ]}

          showTotal

          totalLabel="Monthly Payment"

        />


        <ShareResults

          title="Texas Mortgage Calculator Results"

          summary={`Estimated monthly payment: ${results.totalMonthlyPayment.toLocaleString(
            "en-US",
            {
              style:"currency",
              currency:"USD",
            }
          )}`}

        />


      </div>


    </CalculatorLayout>

  );

}
