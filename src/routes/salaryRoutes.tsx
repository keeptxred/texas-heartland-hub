import {lazy} from "react";
const TexasSalaryPage=lazy(()=>import("@/pages/income/TexasSalaryPage"));
export const salaryRoutes=[{path:"/texas-salary-calculator",element:<TexasSalaryPage/>}];
