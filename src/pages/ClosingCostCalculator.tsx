import React, { useState } from "react";

import CalculatorLayout from "@/components/calculators/CalculatorLayout";

import {
  CalculatorInput,
} from "@/components/calculators/CalculatorInputs";

import CalculatorResults from "@/components/calculators/CalculatorResults";

import BreakdownTable from "@/components/calculators/BreakdownTable";

import ShareResults from "@/components/calculators/ShareResults";

import {
  calculateClosingCosts,
} from "@/lib/calculators/closingCosts";


export default function ClosingCostCalculator() {

  const [inputs, setInputs] = useState({

    purchasePrice: 400000,

    downPaymentPercent: 20,

    annualPropertyTaxRate: 2,

    annualInsurance: 2400,

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
    calculateClosingCosts({

      purchasePrice:
        inputs.purchasePrice,

      downPaymentPercent:
        inputs.downPaymentPercent,

      annualPropertyTaxRate:
        inputs.annualPropertyTaxRate,

      annualInsurance:
        inputs.annualInsurance,

    });



  return (

    <CalculatorLayout

      title="Texas Closing Cost Calculator"

      description="Estimate how much cash you need to buy a home in Texas, including down payment, lender fees, title costs, prepaid taxes, and insurance."

      canonicalUrl="https://keeptxred.com/tools/closing-cost-calculator"

      lastUpdated="July 2026"

      schema={{

        "@context":
          "https://schema.org",

        "@type":
          "WebApplication",

        name:
          "Texas Closing Cost Calculator",

        applicationCategory:
          "FinanceApplication",

      }}

    >

      <div className="space-y-8">


        <div className="grid gap-5 md:grid-cols-2">


          <CalculatorInput

            id="purchasePrice"

            label="Home Purchase Price"

            value={
              inputs.purchasePrice
            }

            prefix="$"

            onChange={(v) =>
              updateInput(
                "purchasePrice",
                v
              )
            }

          />



          <CalculatorInput

            id="downPaymentPercent"

            label="Down Payment Percentage"

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

            id="taxRate"

            label="Texas Property Tax Rate"

            value={
              inputs.annualPropertyTaxRate
            }

            suffix="%"

            step={0.01}

            onChange={(v) =>
              updateInput(
                "annualPropertyTaxRate",
                v
              )
            }

          />



          <CalculatorInput

            id="insurance"

            label="Annual Home Insurance"

            value={
              inputs.annualInsurance
            }

            prefix="$"

            onChange={(v) =>
              updateInput(
                "annualInsurance",
                v
              )
            }

          />


        </div>



        <CalculatorResults

          title="Estimated Cash Needed"

          results={[

            {

              label:
                "Total Cash Needed",

              value:
                results.totalCashNeeded,

              type:
                "currency",

              highlight:
                true,

            },

            {

              label:
                "Down Payment",

              value:
                results.downPayment,

              type:
                "currency",

            },

            {

              label:
                "Closing Costs",

              value:
                results.totalClosingCosts,

              type:
                "currency",

            },

            {

              label:
                "Loan Amount",

              value:
                results.loanAmount,

              type:
                "currency",

            },

          ]}

        />



        <BreakdownTable

          title="Closing Cost Breakdown"

          rows={

            results.breakdown.map(
              (item) => ({

                label:
                  item.label,

                value:
                  item.amount,

              })

            )

          }

          showTotal

          totalLabel="Estimated Closing Costs"

        />



        <ShareResults

          title="Texas Closing Cost Calculator"

          summary={`Estimated cash needed at closing: ${results.totalCashNeeded.toLocaleString(
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