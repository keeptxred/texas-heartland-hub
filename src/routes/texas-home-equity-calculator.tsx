import { createFileRoute } from "@tanstack/react-router";
import TexasHomeEquityPage from "@/pages/home/TexasHomeEquityPage";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Home Equity Calculator";
const description = "Estimate current Texas home equity, loan-to-value ratio, and potential borrowing room using home value, mortgage balance, and a selected equity limit.";

export const Route = createFileRoute("/texas-home-equity-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-home-equity-calculator" }),
  component: TexasHomeEquityPage,
});
