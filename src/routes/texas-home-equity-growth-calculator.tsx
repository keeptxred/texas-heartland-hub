import { createFileRoute } from "@tanstack/react-router";
import TexasEquityGrowthPage from "@/pages/equity/TexasEquityGrowthPage";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Home Equity Growth Calculator";
const description = "Project Texas home equity growth from appreciation, mortgage principal reduction, extra payments, and future property value over time.";

export const Route = createFileRoute("/texas-home-equity-growth-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-home-equity-growth-calculator" }),
  component: TexasEquityGrowthPage,
});
