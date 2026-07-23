import { createFileRoute } from "@tanstack/react-router";
import TexasBudgetPlannerPage from "@/pages/budget/TexasBudgetPlannerPage";

export const Route = createFileRoute("/texas-budget-planner")({ component: TexasBudgetPlannerPage });
