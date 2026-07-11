import React from "react";

import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from "@/lib/calculators/calculatorFormatting";


interface CalculatorResultCardProps {

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



export default function CalculatorResultCard({

  label,

  value,

  type = "currency",

  highlight = false,

  decimals = 0,

}: CalculatorResultCardProps) {



  function formatValue() {


    if (
      typeof value === "string"
    ) {

      return value;

    }



    switch(type) {


      case "percent":

        return formatPercent(
          value,
          decimals
        );



      case "number":

        return formatNumber(
          value,
          decimals
        );



      case "currency":

        return formatCurrency(
          value,
          decimals
        );



      default:

        return value.toString();

    }

  }




  return (

    <div

      className={

        `rounded-xl border p-5 ${
          highlight
            ? "bg-gray-900 text-white"
            : "bg-white"
        }`

      }

    >

      <p

        className={

          highlight
            ? "text-sm text-gray-300"
            : "text-sm text-gray-500"

        }

      >

        {label}

      </p>



      <p

        className={

          `mt-2 text-2xl font-bold ${
            highlight
              ? "text-white"
              : "text-gray-900"
          }`

        }

      >

        {formatValue()}

      </p>


    </div>

  );

}