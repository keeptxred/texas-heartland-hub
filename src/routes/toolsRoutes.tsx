import React, {
  lazy,
  Suspense,
} from "react";


const ToolsIndex =
  lazy(
    () =>
      import(
        "@/pages/tools/ToolsIndex"
      )
  );


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



function ToolLoading() {

  return (

    <div className="flex min-h-[300px] items-center justify-center">

      <p className="text-gray-600">

        Loading tool...

      </p>

    </div>

  );

}



function lazyPage(
  Component: React.LazyExoticComponent<React.ComponentType>
) {

  return (

    <Suspense fallback={<ToolLoading />}>

      <Component />

    </Suspense>

  );

}



export const toolsRoutes = [

  {
    path:
      "/tools",

    element:
      lazyPage(
        ToolsIndex
      ),

  },


  {
    path:
      "/tools/mortgage-calculator",

    element:
      lazyPage(
        MortgageCalculator
      ),

  },


  {
    path:
      "/tools/property-tax-calculator",

    element:
      lazyPage(
        PropertyTaxCalculator
      ),

  },


  {
    path:
      "/tools/home-insurance-calculator",

    element:
      lazyPage(
        HomeInsuranceCalculator
      ),

  },


  {
    path:
      "/tools/home-affordability-calculator",

    element:
      lazyPage(
        HomeAffordabilityCalculator
      ),

  },


  {
    path:
      "/tools/closing-cost-calculator",

    element:
      lazyPage(
        ClosingCostCalculator
      ),

  },


  {
    path:
      "/tools/texas-utilities-calculator",

    element:
      lazyPage(
        TexasUtilitiesCalculator
      ),

  },

];