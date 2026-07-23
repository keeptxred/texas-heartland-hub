import { createFileRoute } from "@tanstack/react-router";
import AdditionalCalculator from "@/components/calculators/AdditionalCalculator";

export const Route = createFileRoute("/texas-property-tax-impact-calculator")({
  component: () => <AdditionalCalculator calculatorKey="propertyTaxImpact" />,
});
