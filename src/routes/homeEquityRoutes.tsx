import {lazy} from "react";
const TexasHomeEquityPage=lazy(()=>import("@/pages/home/TexasHomeEquityPage"));
export const homeEquityRoutes=[{path:"/texas-home-equity-calculator",element:<TexasHomeEquityPage/>}];
