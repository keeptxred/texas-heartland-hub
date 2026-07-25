import { createFileRoute } from "@tanstack/react-router";
import TexasHomeOwnershipCostPage from "@/pages/home/TexasHomeOwnershipCostPage";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Homeownership Cost Calculator";
const description = "Estimate the full monthly and annual cost of owning a Texas home, including mortgage, property taxes, insurance, utilities, maintenance, HOA fees, and reserves.";

export const Route = createFileRoute("/texas-homeownership-cost-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-homeownership-cost-calculator" }),
  component: TexasHomeOwnershipCostPage,
});
