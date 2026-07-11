import React, {
  lazy,
  Suspense,
} from "react";


const MortgageCalculator =
  lazy(
    () =>
      import(
        "@/pages/tools/MortgageCalculator"
      )
  );


const PropertyTaxCalculator =
  lazy(
    () =>
      import(
        "@/pages/tools/PropertyTaxCalculator"
      )
  );


const HomeInsuranceCalculator =
  lazy(
    () =>
      import(
        "@/pages/tools/HomeInsuranceCalculator"
      )
  );


const HomeAffordabilityCalculator =
  lazy(
    () =>
      import(
        "@/pages/tools/HomeAffordabilityCalculator"
      )
  );


const ClosingCostCalculator =
  lazy(
    () =>
      import(
        "@/pages/tools/ClosingCostCalculator"
      )
  );


const TexasUtilitiesCalculator =
  lazy(
    () =>
      import(
        "@/pages/tools/TexasUtilitiesCalculator"
      )
  );



function CalculatorLoader() {

  return (

    <div className="flex min-h-[300px] items-center justify-center">

      <div className="text-gray-600">

        Loading calculator...

      </div>

    </div>

  );

}



export const calculatorRoutes = [

  {

    path:
      "/tools/mortgage-calculator",

    element:

      <Suspense fallback={<CalculatorLoader />}>

        <MortgageCalculator />

      </Suspense>,

  },


  {

    path:
      "/tools/property-tax-calculator",

    element:

      <Suspense fallback={<CalculatorLoader />}>

        <PropertyTaxCalculator />

      </Suspense>,

  },


  {

    path:
      "/tools/home-insurance-calculator",

    element:

      <Suspense fallback={<CalculatorLoader />}>

        <HomeInsuranceCalculator />

      </Suspense>,

  },


  {

    path:
      "/tools/home-affordability-calculator",

    element:

      <Suspense fallback={<CalculatorLoader />}>

        <HomeAffordabilityCalculator />

      </Suspense>,

  },


  {

    path:
      "/tools/closing-cost-calculator",

    element:

      <Suspense fallback={<CalculatorLoader />}>

        <ClosingCostCalculator />

      </Suspense>,

  },


  {

    path:
      "/tools/texas-utilities-calculator",

    element:

      <Suspense fallback={<CalculatorLoader />}>

        <TexasUtilitiesCalculator />

      </Suspense>,

  },

];