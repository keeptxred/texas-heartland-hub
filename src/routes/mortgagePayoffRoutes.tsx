import {lazy} from "react";
const TexasMortgagePayoffPage=lazy(()=>import("@/pages/mortgage/TexasMortgagePayoffPage"));
export const mortgagePayoffRoutes=[{path:"/texas-mortgage-payoff-calculator",element:<TexasMortgagePayoffPage/>}];
