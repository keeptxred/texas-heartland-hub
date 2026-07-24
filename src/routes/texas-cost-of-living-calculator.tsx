import { createFileRoute } from "@tanstack/react-router";
import TexasCostOfLivingPage from "@/pages/cost/TexasCostOfLivingPage";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Cost of Living Calculator";
const description = "Compare housing, utilities, transportation, groceries, healthcare, taxes, and household costs across Texas cities before relocating.";

export const Route = createFileRoute("/texas-cost-of-living-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-cost-of-living-calculator" }),
  component: TexasCostOfLivingPage,
});
