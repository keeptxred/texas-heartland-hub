import { createFileRoute } from "@tanstack/react-router";
import TexasMortgageCalculatorPage from "@/pages/mortgage/TexasMortgageCalculatorPage";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Mortgage Calculator";
const description = "Estimate a Texas mortgage payment with principal, interest, property taxes, homeowners insurance, HOA fees, and interest-rate comparisons.";

export const Route = createFileRoute("/texas-mortgage-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-mortgage-calculator" }),
  component: TexasMortgageCalculatorPage,
});
