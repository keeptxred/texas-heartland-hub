import { createFileRoute } from "@tanstack/react-router";
import AdditionalCalculator from "@/components/calculators/AdditionalCalculator";

export const Route = createFileRoute("/texas-utility-cost-calculator")({
  component: () => <AdditionalCalculator calculatorKey="utilityCost" />,
});
