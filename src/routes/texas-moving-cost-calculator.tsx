import { createFileRoute } from "@tanstack/react-router";
import AdditionalCalculator from "@/components/calculators/AdditionalCalculator";

export const Route = createFileRoute("/texas-moving-cost-calculator")({
  component: () => <AdditionalCalculator calculatorKey="movingCost" />,
});
