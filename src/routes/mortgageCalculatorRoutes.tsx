import { lazy } from "react";
const TexasMortgageCalculatorPage = lazy(() => import("@/pages/mortgage/TexasMortgageCalculatorPage"));
export const mortgageCalculatorRoutes = [{ path: "/texas-mortgage-calculator", element: <TexasMortgageCalculatorPage /> }];
