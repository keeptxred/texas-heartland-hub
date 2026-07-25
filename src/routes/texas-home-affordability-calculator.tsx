import { createFileRoute } from "@tanstack/react-router";
import TexasHomeAffordabilityPage from "@/pages/homeAffordability/TexasHomeAffordabilityPage";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Home Affordability Calculator";
const description = "Estimate a comfortable Texas home-price range based on income, debts, down payment, mortgage rate, property taxes, insurance, and monthly housing limits.";

export const Route = createFileRoute("/texas-home-affordability-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-home-affordability-calculator" }),
  component: TexasHomeAffordabilityPage,
});
