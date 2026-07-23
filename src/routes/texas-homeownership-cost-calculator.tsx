import { createFileRoute } from "@tanstack/react-router";
import TexasHomeOwnershipCostPage from "@/pages/home/TexasHomeOwnershipCostPage";

export const Route = createFileRoute("/texas-homeownership-cost-calculator")({ component: TexasHomeOwnershipCostPage });
