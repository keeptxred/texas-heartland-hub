import React, { useState } from "react";

import CalculatorLayout from "@/components/calculators/CalculatorLayout";

import {
  CalculatorInput,
} from "@/components/calculators/CalculatorInputs";

import CalculatorResults from "@/components/calculators/CalculatorResults";

import BreakdownTable from "@/components/calculators/BreakdownTable";

import ShareResults from "@/components/calculators/ShareResults";

import {
  calculateHomeInsurance,
} from "@/lib/calculators/insurance";


export default function HomeInsuranceCalculator() {

  const [inputs, setInputs] = useState({

    homeValue: 400000,

    coveragePercent: 100,

    deductible: 2500,

    riskMultiplier: 1,

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
    calculateHomeInsurance({

      homeValue:
        inputs.homeValue,

      coveragePercent:
        inputs.coveragePercent,

      deductible:
        inputs.deductible,

      riskMultiplier:
        inputs.riskMultiplier,

    });


  return (

    <CalculatorLayout

      title="Texas Homeowners Insurance Calculator"

      description="Estimate your Texas homeowners insurance costs based on home value, coverage level, deductible, and risk factors."

      canonicalUrl="https://keeptxred.com/tools/home-insurance-calculator"

      lastUpdated="July 2026"

      schema={{

        "@context":
          "https://schema.org",

        "@type":
          "WebApplication",

        name:
          "Texas Homeowners Insurance Calculator",

        applicationCategory:
          "FinanceApplication",

      }}

    >

      <div className="space-y-8">


        <div className="grid gap-5 md:grid-cols-2">


          <CalculatorInput

            id="homeValue"

            label="Home Value"

            value={
              inputs.homeValue
            }

            prefix="$"

            onChange={(v) =>
              updateInput(
                "homeValue",
                v
              )
            }

          />



          <CalculatorInput

            id="coveragePercent"

            label="Coverage Percentage"

            value={
              inputs.coveragePercent
            }

            suffix="%"

            helpText="Percentage of home value used for dwelling coverage."

            onChange={(v) =>
              updateInput(
                "coveragePercent",
                v
              )
            }

          />



          <CalculatorInput

            id="deductible"

            label="Insurance Deductible"

            value={
              inputs.deductible
            }

            prefix="$"

            helpText="Higher deductibles generally reduce premiums."

            onChange={(v) =>
              updateInput(
                "deductible",
                v
              )
            }

          />



          <CalculatorInput

            id="riskMultiplier"

            label="Texas Risk Factor"

            value={
              inputs.riskMultiplier
            }

            step={0.05}

            helpText="Increase for coastal, hail, wind, or higher-risk areas."

            onChange={(v) =>
              updateInput(
                "riskMultiplier",
                v
              )
            }

          />


        </div>



        <CalculatorResults

          title="Estimated Insurance Cost"

          results={[

            {

              label:
                "Monthly Premium",

              value:
                results.monthlyPremium,

              type:
                "currency",

              highlight:
                true,

            },

            {

              label:
                "Annual Premium",

              value:
                results.annualPremium,

              type:
                "currency",

            },

            {

              label:
                "Dwelling Coverage",

              value:
                results.dwellingCoverage,

              type:
                "currency",

            },

            {

              label:
                "Base Premium",

              value:
                results.baseAnnualPremium,

              type:
                "currency",

            },

          ]}

        />



        <BreakdownTable

          title="Insurance Calculation Breakdown"

          rows={[

            {

              label:
                "Base Annual Premium",

              value:
                results.baseAnnualPremium,

            },

            {

              label:
                "Deductible Adjustment",

              value:
                results.deductibleAdjustment,

              type:
                "number",

            },

            {

              label:
                "Risk Adjustment",

              value:
                results.riskAdjustment,

              type:
                "number",

            },

            {

              label:
                "Final Annual Premium",

              value:
                results.annualPremium,

              emphasize:
                true,

            },

          ]}

        />



        <ShareResults

          title="Texas Homeowners Insurance Calculator"

          summary={`Estimated annual insurance premium: ${results.annualPremium.toLocaleString(
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
