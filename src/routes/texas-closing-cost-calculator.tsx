import { createFileRoute } from "@tanstack/react-router";
import TexasClosingCostCalculatorPage from "@/pages/closingCosts/TexasClosingCostCalculatorPage";

export const Route = createFileRoute("/texas-closing-cost-calculator")({ component: TexasClosingCostCalculatorPage });
