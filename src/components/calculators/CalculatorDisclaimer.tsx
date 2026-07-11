import React from "react";


interface CalculatorDisclaimerProps {

  className?: string;

}



export default function CalculatorDisclaimer({

  className = "",

}: CalculatorDisclaimerProps) {


  return (

    <section

      className={`rounded-lg border bg-gray-50 p-5 text-sm text-gray-600 ${className}`}

    >

      <h3 className="font-semibold text-gray-900">

        Calculator Disclaimer

      </h3>


      <p className="mt-2 leading-relaxed">

        These calculators provide estimates for planning
        purposes only. Actual costs may vary based on
        your location, lender, insurance provider,
        taxing authority, utility provider, home
        characteristics, and other individual factors.

      </p>


      <p className="mt-3 leading-relaxed">

        Texas property taxes, insurance premiums,
        mortgage rates, and utility costs can change
        over time. Always verify final costs with
        qualified professionals and official sources
        before making financial decisions.

      </p>


      <p className="mt-3 leading-relaxed">

        KeepTXRed provides these tools as educational
        resources and does not provide financial,
        tax, mortgage, insurance, or legal advice.

      </p>


    </section>

  );

}