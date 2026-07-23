import {lazy} from "react";
const TexasDownPaymentPage=lazy(()=>import("@/pages/downPayment/TexasDownPaymentPage"));
export const downPaymentRoutes=[{path:"/texas-down-payment-calculator",element:<TexasDownPaymentPage/>}];
