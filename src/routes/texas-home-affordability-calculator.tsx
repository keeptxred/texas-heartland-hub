import { createFileRoute } from "@tanstack/react-router";
import TexasHomeAffordabilityPage from "@/pages/homeAffordability/TexasHomeAffordabilityPage";

export const Route = createFileRoute("/texas-home-affordability-calculator")({
  component: TexasHomeAffordabilityPage,
});
