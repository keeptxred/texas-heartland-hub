import { createFileRoute } from "@tanstack/react-router";
import TexasEquityGrowthPage from "@/pages/equity/TexasEquityGrowthPage";

export const Route = createFileRoute("/texas-home-equity-growth-calculator")({ component: TexasEquityGrowthPage });
