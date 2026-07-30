import { createFileRoute } from "@tanstack/react-router";
import AdditionalCalculator from "@/components/calculators/AdditionalCalculator";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Utility Cost Calculator";
const description =
  "Estimate monthly and annual Texas electricity, water, natural gas, internet, and trash costs, including seasonal cooling, pool, EV, household-size, and home-efficiency adjustments.";

export const Route = createFileRoute("/texas-utility-cost-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-utility-cost-calculator" }),
  component: () => <AdditionalCalculator calculatorKey="utilityCost" />,
});
