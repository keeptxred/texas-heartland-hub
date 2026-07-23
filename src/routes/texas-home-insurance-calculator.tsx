import { createFileRoute } from "@tanstack/react-router";
import AdditionalCalculator from "@/components/calculators/AdditionalCalculator";

export const Route = createFileRoute("/texas-home-insurance-calculator")({
  component: () => <AdditionalCalculator calculatorKey="homeInsurance" />,
});
