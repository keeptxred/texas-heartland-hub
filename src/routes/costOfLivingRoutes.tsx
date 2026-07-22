import { lazy } from "react";
const TexasCostOfLivingPage=lazy(()=>import("@/pages/cost/TexasCostOfLivingPage"));
export const costOfLivingRoutes=[{path:"/texas-cost-of-living-calculator",element:<TexasCostOfLivingPage/>}];
