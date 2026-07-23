import {lazy} from "react";
const TexasHomeAffordabilityPage=lazy(()=>import("@/pages/homeAffordability/TexasHomeAffordabilityPage"));
export const homeAffordabilityRoutes=[{path:"/texas-home-affordability-calculator",element:<TexasHomeAffordabilityPage/>}];
