import React, { useState } from "react";

import CalculatorLayout from "@/components/calculators/CalculatorLayout";

import {
  CalculatorInput,
} from "@/components/calculators/CalculatorInputs";

import CalculatorResults from "@/components/calculators/CalculatorResults";

import BreakdownTable from "@/components/calculators/BreakdownTable";

import ShareResults from "@/components/calculators/ShareResults";

import {
  calculatePropertyTax,
} from "@/lib/calculators/taxes";


export default function PropertyTaxCalculator() {

  const [inputs, setInputs] = useState({

    homeValue: 400000,

    homesteadExemption: 140000,

    countyRate: 0.43,

    schoolRate: 1.05,

    cityRate: 0.39,

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
    calculatePropertyTax({

      homeValue:
        inputs.homeValue,

      homesteadExemption:
        inputs.homesteadExemption,

      entities: [

        {
          name:
            "School District",

          rate:
            inputs.schoolRate,
        },

        {
          name:
            "County",

          rate:
            inputs.countyRate,
        },

        {
          name:
            "City",

          rate:
            inputs.cityRate,
        },

      ],

    });


  return (

    <CalculatorLayout

      title="Texas Property Tax Calculator"

      description="Estimate your Texas property taxes by combining school district, county, city, and homestead exemption factors."

      canonicalUrl="https://keeptxred.com/tools/property-tax-calculator"

      lastUpdated="July 2026"

      schema={{

        "@context":
          "https://schema.org",

        "@type":
          "WebApplication",

        name:
          "Texas Property Tax Calculator",

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

            id="homestead"

            label="Homestead Exemption"

            value={
              inputs.homesteadExemption
            }

            prefix="$"

            helpText="Texas homeowners may qualify for exemptions that reduce taxable value."

            onChange={(v) =>
              updateInput(
                "homesteadExemption",
                v
              )
            }

          />


          <CalculatorInput

            id="schoolRate"

            label="School District Tax Rate"

            value={
              inputs.schoolRate
            }

            suffix="%"

            step={0.01}

            onChange={(v) =>
              updateInput(
                "schoolRate",
                v
              )
            }

          />


          <CalculatorInput

            id="countyRate"

            label="County Tax Rate"

            value={
              inputs.countyRate
            }

            suffix="%"

            step={0.01}

            onChange={(v) =>
              updateInput(
                "countyRate",
                v
              )
            }

          />


          <CalculatorInput

            id="cityRate"

            label="City Tax Rate"

            value={
              inputs.cityRate
            }

            suffix="%"

            step={0.01}

            onChange={(v) =>
              updateInput(
                "cityRate",
                v
              )
            }

          />

        </div>



        <CalculatorResults

          title="Estimated Property Taxes"

          results={[

            {

              label:
                "Monthly Property Tax",

              value:
                results.monthlyTax,

              type:
                "currency",

              highlight:
                true,

            },

            {

              label:
                "Annual Property Tax",

              value:
                results.annualTax,

              type:
                "currency",

            },

            {

              label:
                "Taxable Value",

              value:
                results.taxableValue,

              type:
                "currency",

            },

            {

              label:
                "Combined Tax Rate",

              value:
                results.combinedRate,

              type:
                "percent",

              decimals:
                2,

            },

          ]}

        />



        <BreakdownTable

          title="Taxing Authority Breakdown"

          rows={

            results.breakdown.map(
              (item) => ({

                label:
                  item.name,

                value:
                  item.annualTax,

                emphasize:
                  true,

              })

            )

          }

          showTotal

          totalLabel="Annual Property Tax"

        />



        <ShareResults

          title="Texas Property Tax Calculator"

          summary={`Estimated annual property taxes: ${results.annualTax.toLocaleString(
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