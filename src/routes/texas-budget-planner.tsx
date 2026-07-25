import { createFileRoute } from "@tanstack/react-router";
import TexasBudgetPlannerPage from "@/pages/budget/TexasBudgetPlannerPage";
import { calculatorRouteSeo } from "@/lib/calculator-route-seo";

const title = "Texas Budget Planner";
const description = "Build a practical monthly Texas household budget for housing, utilities, transportation, food, insurance, debt, savings, childcare, and discretionary spending.";

export const Route = createFileRoute("/texas-budget-planner")({
  head: () => calculatorRouteSeo({ title, description, path: "/texas-budget-planner" }),
  component: TexasBudgetPlannerPage,
});
