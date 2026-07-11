import React, { useState } from "react";

import CalculatorLayout from "@/components/calculators/CalculatorLayout";

import {
  CalculatorInput,
} from "@/components/calculators/CalculatorInputs";

import CalculatorResults from "@/components/calculators/CalculatorResults";

import BreakdownTable from "@/components/calculators/BreakdownTable";

import ShareResults from "@/components/calculators/ShareResults";

import {
  calculateUtilities,
} from "@/lib/calculators/utilities";


export default function TexasUtilitiesCalculator() {

  const [inputs, setInputs] = useState({

    homeSizeSqFt: 2500,

    residents: 4,

    hasPool: false,

  });


  function updateInput(
    key: keyof typeof inputs,
    value: string | boolean
  ) {

    setInputs({

      ...inputs,

      [key]:
        typeof value === "boolean"
          ? value
          : Number(value),

    });

  }


  const results =
    calculateUtilities({

      homeSizeSqFt:
        inputs.homeSizeSqFt,

      residents:
        inputs.residents,

      hasPool:
        inputs.hasPool,

    });



  return (

    <CalculatorLayout

      title="Texas Utilities Cost Calculator"

      description="Estimate monthly utility costs when moving to Texas, including electricity, water, gas, trash, internet, and pool ownership expenses."

      canonicalUrl="https://keeptxred.com/tools/texas-utilities-calculator"

      lastUpdated="July 2026"

      schema={{

        "@context":
          "https://schema.org",

        "@type":
          "WebApplication",

        name:
          "Texas Utilities Cost Calculator",

        applicationCategory:
          "FinanceApplication",

      }}

    >

      <div className="space-y-8">


        <div className="grid gap-5 md:grid-cols-2">


          <CalculatorInput

            id="homeSize"

            label="Home Size"

            value={
              inputs.homeSizeSqFt
            }

            suffix="sq ft"

            onChange={(v) =>
              updateInput(
                "homeSizeSqFt",
                v
              )
            }

          />



          <CalculatorInput

            id="residents"

            label="Number of Residents"

            value={
              inputs.residents
            }

            onChange={(v) =>
              updateInput(
                "residents",
                v
              )
            }

          />


        </div>



        <div className="rounded-xl border bg-gray-50 p-5">

          <label className="flex items-center gap-3">

            <input

              type="checkbox"

              checked={
                inputs.hasPool
              }

              onChange={(e) =>
                updateInput(
                  "hasPool",
                  e.target.checked
                )
              }

              className="h-5 w-5"

            />

            <span className="font-medium text-gray-800">

              I have a swimming pool

            </span>

          </label>

        </div>




        <CalculatorResults

          title="Estimated Utility Costs"

          results={[

            {

              label:
                "Monthly Utility Cost",

              value:
                results.monthlyTotal,

              type:
                "currency",

              highlight:
                true,

            },

            {

              label:
                "Annual Utility Cost",

              value:
                results.annualTotal,

              type:
                "currency",

            },

          ]}

        />



        <BreakdownTable

          title="Monthly Utility Breakdown"

          rows={

            results.breakdown.map(
              (item) => ({

                label:
                  item.label,

                value:
                  item.monthlyCost,

              })

            )

          }

          showTotal

          totalLabel="Monthly Utilities"

        />



        <ShareResults

          title="Texas Utilities Cost Calculator"

          summary={`Estimated monthly utilities: ${results.monthlyTotal.toLocaleString(
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