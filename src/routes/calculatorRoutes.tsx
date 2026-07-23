import React, { lazy, Suspense } from "react";

const MortgageCalculator = lazy(() => import("@/pages/tools/MortgageCalculator"));
const PropertyTaxCalculator = lazy(() => import("@/pages/tools/PropertyTaxCalculator"));
const HomeInsuranceCalculator = lazy(() => import("@/pages/tools/HomeInsuranceCalculator"));
const HomeAffordabilityCalculator = lazy(() => import("@/pages/tools/HomeAffordabilityCalculator"));
const ClosingCostCalculator = lazy(() => import("@/pages/tools/ClosingCostCalculator"));
const TexasUtilitiesCalculator = lazy(() => import("@/pages/tools/TexasUtilitiesCalculator"));
const TexasRelocationBudgetPlanner = lazy(() => import("@/pages/tools/TexasRelocationBudgetPlanner"));
const TexasMonthlyLivingCostCalculator = lazy(() => import("@/pages/tools/TexasMonthlyLivingCostCalculator"));
const TexasCommuteCostCalculator = lazy(() => import("@/pages/tools/TexasCommuteCostCalculator"));
const TexasVehicleFeesEstimator = lazy(() => import("@/pages/tools/TexasVehicleFeesEstimator"));
const TexasRelocationChecklistGenerator = lazy(() => import("@/pages/tools/TexasRelocationChecklistGenerator"));

function CalculatorLoader() {
  return <div className="flex min-h-[300px] items-center justify-center"><div className="text-gray-600">Loading calculator...</div></div>;
}

const withLoader = (element: React.ReactNode) => <Suspense fallback={<CalculatorLoader />}>{element}</Suspense>;

export const calculatorRoutes = [
  { path: "/tools/mortgage-calculator", element: withLoader(<MortgageCalculator />) },
  { path: "/tools/property-tax-calculator", element: withLoader(<PropertyTaxCalculator />) },
  { path: "/tools/home-insurance-calculator", element: withLoader(<HomeInsuranceCalculator />) },
  { path: "/tools/home-affordability-calculator", element: withLoader(<HomeAffordabilityCalculator />) },
  { path: "/tools/closing-cost-calculator", element: withLoader(<ClosingCostCalculator />) },
  { path: "/tools/texas-utilities-calculator", element: withLoader(<TexasUtilitiesCalculator />) },
  { path: "/tools/texas-relocation-budget-planner", element: withLoader(<TexasRelocationBudgetPlanner />) },
  { path: "/tools/texas-monthly-living-cost-calculator", element: withLoader(<TexasMonthlyLivingCostCalculator />) },
  { path: "/tools/texas-commute-cost-calculator", element: withLoader(<TexasCommuteCostCalculator />) },
  { path: "/tools/texas-vehicle-fees-estimator", element: withLoader(<TexasVehicleFeesEstimator />) },
  { path: "/tools/texas-relocation-checklist-generator", element: withLoader(<TexasRelocationChecklistGenerator />) },
];
