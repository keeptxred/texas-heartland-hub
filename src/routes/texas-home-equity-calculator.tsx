import { createFileRoute } from "@tanstack/react-router";
import TexasHomeEquityPage from "@/pages/home/TexasHomeEquityPage";

export const Route = createFileRoute("/texas-home-equity-calculator")({ component: TexasHomeEquityPage });
