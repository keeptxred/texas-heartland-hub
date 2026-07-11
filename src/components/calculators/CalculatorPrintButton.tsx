import React from "react";


interface CalculatorPrintButtonProps {

  label?: string;

}



export default function CalculatorPrintButton({

  label = "Print Results",

}: CalculatorPrintButtonProps) {


  function handlePrint() {

    window.print();

  }



  return (

    <button

      type="button"

      onClick={handlePrint}

      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"

    >

      {label}

    </button>

  );

}