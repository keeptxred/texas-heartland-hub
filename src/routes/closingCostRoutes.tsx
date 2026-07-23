import { lazy } from "react";
const TexasClosingCostCalculatorPage = lazy(() => import("@/pages/closingCosts/TexasClosingCostCalculatorPage"));
export const closingCostRoutes = [{ path: "/texas-closing-cost-calculator", element: <TexasClosingCostCalculatorPage /> }];
