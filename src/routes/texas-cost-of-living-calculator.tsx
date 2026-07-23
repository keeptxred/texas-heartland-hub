import { createFileRoute } from "@tanstack/react-router";
import TexasCostOfLivingPage from "@/pages/cost/TexasCostOfLivingPage";

export const Route = createFileRoute("/texas-cost-of-living-calculator")({ component: TexasCostOfLivingPage });
