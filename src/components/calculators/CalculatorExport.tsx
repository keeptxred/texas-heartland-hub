import React, {
  useState,
} from "react";


interface CalculatorExportProps {

  title: string;

  results: Record<string, string | number>;

}



export default function CalculatorExport({

  title,

  results,

}: CalculatorExportProps) {


  const [copied, setCopied] =
    useState(false);



  function generateReport() {


    const lines = Object.entries(

      results

    ).map(

      ([key, value]) =>

        `${key}: ${value}`

    );



    return (

      `${title}\n\n` +

      lines.join("\n") +

      "\n\nGenerated with KeepTXRed Texas Financial Tools."

    );

  }



  async function copyReport() {


    try {


      await navigator.clipboard.writeText(

        generateReport()

      );


      setCopied(true);



      setTimeout(

        () =>

          setCopied(false),

        2000

      );


    } catch {

      setCopied(false);

    }

  }



  return (

    <section className="rounded-xl border bg-white p-5 shadow-sm">


      <h2 className="text-xl font-bold text-gray-900">

        Save Your Results

      </h2>



      <p className="mt-2 text-sm text-gray-600">

        Copy your estimate so you can save it,
        compare options, or share it with others.

      </p>



      <button

        onClick={copyReport}

        className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white"

      >

        {copied
          ? "Copied Report"
          : "Copy Report"}

      </button>


    </section>

  );

}