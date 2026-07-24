import { createFileRoute } from "@tanstack/react-router";
import AdditionalCalculator from "@/components/calculators/AdditionalCalculator";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Moving Cost Calculator";
const description =
  "Estimate a Texas moving budget with transportation, labor, packing, storage, travel, vehicle shipping, deposits, setup costs, and a practical contingency range.";

export const Route = createFileRoute("/texas-moving-cost-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-moving-cost-calculator" }),
  component: () => <AdditionalCalculator calculatorKey="movingCost" />,
});
