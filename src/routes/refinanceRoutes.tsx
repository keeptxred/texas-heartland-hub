import {lazy} from "react";
const TexasRefinancePage=lazy(()=>import("@/pages/mortgage/TexasRefinancePage"));
export const refinanceRoutes=[{path:"/texas-refinance-calculator",element:<TexasRefinancePage/>}];
