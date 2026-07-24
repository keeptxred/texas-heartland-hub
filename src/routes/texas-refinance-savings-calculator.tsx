import { createFileRoute } from "@tanstack/react-router";
import TexasRefinancePage from "@/pages/mortgage/TexasRefinancePage";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Refinance Savings Calculator";
const description = "Compare a current Texas mortgage with a refinance scenario, including payment savings, closing costs, interest differences, and estimated break-even timing.";

export const Route = createFileRoute("/texas-refinance-savings-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-refinance-savings-calculator" }),
  component: TexasRefinancePage,
});
