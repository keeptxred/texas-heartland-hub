import { createFileRoute } from "@tanstack/react-router";
import TexasClosingCostCalculatorPage from "@/pages/closingCosts/TexasClosingCostCalculatorPage";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Closing Cost Calculator";
const description = "Estimate Texas buyer and seller closing costs, prepaid expenses, lender charges, title-related fees, cash to close, and net proceeds.";

export const Route = createFileRoute("/texas-closing-cost-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-closing-cost-calculator" }),
  component: TexasClosingCostCalculatorPage,
});
