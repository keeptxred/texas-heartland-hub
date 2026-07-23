import React, { lazy, Suspense } from "react";

const MortgageCalculator = lazy(() => import("@/pages/tools/MortgageCalculator"));
const PropertyTaxCalculator = lazy(() => import("@/pages/tools/PropertyTaxCalculator"));
const HomeInsuranceCalculator = lazy(() => import("@/pages/tools/HomeInsuranceCalculator"));
const HomeAffordabilityCalculator = lazy(() => import("@/pages/tools/HomeAffordabilityCalculator"));
const ClosingCostCalculator = lazy(() => import("@/pages/tools/ClosingCostCalculator"));
const TexasUtilitiesCalculator = lazy(() => import("@/pages/tools/TexasUtilitiesCalculator"));
const TexasRelocationBudgetPlanner = lazy(
  () => import("@/pages/tools/TexasRelocationBudgetPlanner")
);

function CalculatorLoader() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="text-gray-600">Loading calculator...</div>
    </div>
  );
}

const withLoader = (element: React.ReactNode) => (
  <Suspense fallback={<CalculatorLoader />}>{element}</Suspense>
);

export const calculatorRoutes = [
  {
    path: "/tools/mortgage-calculator",
    element: withLoader(<MortgageCalculator />),
  },
  {
    path: "/tools/property-tax-calculator",
    element: withLoader(<PropertyTaxCalculator />),
  },
  {
    path: "/tools/home-insurance-calculator",
    element: withLoader(<HomeInsuranceCalculator />),
  },
  {
    path: "/tools/home-affordability-calculator",
    element: withLoader(<HomeAffordabilityCalculator />),
  },
  {
    path: "/tools/closing-cost-calculator",
    element: withLoader(<ClosingCostCalculator />),
  },
  {
    path: "/tools/texas-utilities-calculator",
    element: withLoader(<TexasUtilitiesCalculator />),
  },
  {
    path: "/tools/texas-relocation-budget-planner",
    element: withLoader(<TexasRelocationBudgetPlanner />),
  },
];
