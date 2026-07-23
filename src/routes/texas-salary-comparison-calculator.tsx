import { createFileRoute } from "@tanstack/react-router";
import AdditionalCalculator from "@/components/calculators/AdditionalCalculator";

export const Route = createFileRoute("/texas-salary-comparison-calculator")({
  component: () => <AdditionalCalculator calculatorKey="salaryComparison" />,
});
