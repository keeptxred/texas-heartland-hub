import { createFileRoute } from "@tanstack/react-router";
import TexasRentVsBuyPage from "@/pages/home/TexasRentVsBuyPage";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Rent vs Buy Calculator";
const description = "Compare the long-term cost of renting versus buying a Texas home using rent growth, mortgage costs, taxes, insurance, maintenance, appreciation, and selling expenses.";

export const Route = createFileRoute("/texas-rent-vs-buy-calculator")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-rent-vs-buy-calculator" }),
  component: TexasRentVsBuyPage,
});
