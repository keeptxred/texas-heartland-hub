import {lazy} from "react";
const TexasBudgetPlannerPage=lazy(()=>import("@/pages/budget/TexasBudgetPlannerPage"));
export const budgetRoutes=[{path:"/texas-budget-planner",element:<TexasBudgetPlannerPage/>}];
