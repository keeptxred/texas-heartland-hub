import {lazy} from "react";
const TexasHomeOwnershipCostPage=lazy(()=>import("@/pages/home/TexasHomeOwnershipCostPage"));
export const homeOwnershipCostRoutes=[{path:"/texas-home-ownership-cost-calculator",element:<TexasHomeOwnershipCostPage/>}];
