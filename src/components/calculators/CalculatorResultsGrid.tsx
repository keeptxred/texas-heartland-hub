import React from "react";

import CalculatorResultCard from "@/components/calculators/CalculatorResultCard";



interface CalculatorResult {

  label: string;

  value: number | string;

  type?:
    | "currency"
    | "number"
    | "percent"
    | "text";

  highlight?: boolean;

  decimals?: number;

}



interface CalculatorResultsGridProps {

  title?: string;

  results: CalculatorResult[];

}



export default function CalculatorResultsGrid({

  title = "Results",

  results,

}: CalculatorResultsGridProps) {


  return (

    <section className="mt-8">


      <h2 className="mb-5 text-2xl font-bold text-gray-900">

        {title}

      </h2>



      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


        {results.map(

          (result, index) => (

            <CalculatorResultCard

              key={index}

              label={
                result.label
              }

              value={
                result.value
              }

              type={
                result.type
              }

              highlight={
                result.highlight
              }

              decimals={
                result.decimals
              }

            />

          )

        )}


      </div>


    </section>

  );

}