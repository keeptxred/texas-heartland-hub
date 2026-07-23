import {lazy} from "react";
const TexasRentVsBuyPage=lazy(()=>import("@/pages/home/TexasRentVsBuyPage"));
export const rentVsBuyRoutes=[{path:"/texas-rent-vs-buy-calculator",element:<TexasRentVsBuyPage/>}];
