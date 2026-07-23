import { lazy } from "react";

const TexasEquityGrowthPage = lazy(() => import("@/pages/equity/TexasEquityGrowthPage"));

export const equityGrowthRoutes = [
  { path: "/texas-home-equity-growth-calculator", element: <TexasEquityGrowthPage /> },
];
